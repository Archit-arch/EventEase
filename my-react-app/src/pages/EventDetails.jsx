import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import StudentDetails from "../components/StudentDetails";
import FeedbackCarousel from "../components/FeedbackCarousel";
import BookingModal from "../components/BookingModal";
import FeedbackModal from "../components/FeedbackModal";
import api from '../api/axios';
import "../styles/EventDetails.css";
import { useAuth } from '../hooks/useAuth';

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const isEventOver = (event) => {
  if (!event?.date || !event?.end_time) return false;
  const [hours, minutes, seconds = "00"] = event.end_time.split(":");
  const eventEnd = new Date(event.date);
  eventEnd.setHours(Number(hours), Number(minutes), Number(seconds), 0);
  return new Date() > eventEnd;
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    success: false,
    message: "",
    redirect: ""
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);

  const navigate = useNavigate();
  const { user, loading_auth, error } = useAuth();
  //
    // Handle redirects based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        navigate('/login');
      } else if (user.role !== 'student' && user.role !== 'organizer') {
        navigate('/unauthorized');
      }
    }
  }, [user, loading_auth, navigate]);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/students/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get(`/students/events/${id}/feedback`);
        setFeedbacks(res.data);
      } catch (err) {
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, [id]);

  // Check if user has booked this event
  useEffect(() => {
    const checkBooking = async () => {
      if (!user) return;
      try {
        const res = await api.get('/students/bookings');
        const booked = res.data.some(
          b => String(b.event_id) === String(id) && b.status === "booked"
        );
        setHasBooked(booked);
      } catch (err) {
        setHasBooked(false);
      }
    };
    checkBooking();
  }, [user, id]);

  // Booking handler
  // In your handleBooking function
  const handleBooking = async () => {
    try {
      const res = await api.post('/students/bookings', { event_id: id });
      
      if (res.data.booking && res.data.booking.status === "rejected") {
        setModal({
          show: true,
          success: false,
          message: "Booking failed: Venue is not available or full.",
          redirect: "/events"
        });
      } else if (res.data.booking && res.data.booking.status === "booked") {
        setModal({
          show: true,
          success: true,
          message: "Booking successful!",
          redirect: "/studentdashboard"
        });
      } else if (res.data.error) {
        setModal({
          show: true,
          success: false,
          message: "Booking failed: " + res.data.error,
          redirect: "/events"
        });
      }
    } catch (err) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        setModal({
          show: true,
          success: false,
          message: "Too many booking attempts. Please wait a few minutes before trying again.",
          redirect: "/events"
        });
      } else {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Booking failed. Please try again.";
        setModal({
          show: true,
          success: false,
          message: errorMsg,
          redirect: "/events"
        });
      }
    }
  };


  // Feedback submit handler
  const handleSubmitFeedback = async (rating, comment) => {
    setFeedbackLoading(true);
    try {
      await api.post('/students/feedback', {
        event_id: id,
        ratings: rating,
        comments: comment
      });
      setShowFeedbackModal(false);
      // Refresh feedbacks
      const res = await api.get(`/students/events/${id}/feedback`);
      setFeedbacks(res.data);
      setModal({
        show: true,
        success: true,
        message: "Feedback submitted!",
        redirect: `/studentdashboard`
      });
    } catch (err) {
      setModal({
        show: true,
        success: false,
        message: err.response?.data?.error || "Failed to submit feedback.",
        redirect: `/events`
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleModalOk = () => {
    setModal({ ...modal, show: false });
    navigate(modal.redirect);
  };

  if (loading) return <div className="centered-message">Loading...</div>;
  if (!event) return <div className="centered-message">Event not found.</div>;

  return (
    <div className="event-details-bg">
      <StudentNavbar />
      <div className="event-details-container">
        <div className="event-details-card glass-card">
          <div className="event-poster-wrapper">
            <img
              className="event-details-poster"
              src="/images/defaultposter.png"
              alt={`${event.title} Poster`}
            />
          </div>
          <div className="event-details-content">
            <h2 className="event-details-title">{event.title}</h2>
            <div className="event-details-info">
              <div className="event-info-row">
                <span className="event-info-label">Date:</span>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="event-info-row">
                <span className="event-info-label">Time:</span>
                <span>{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
              </div>
              <div className="event-info-row">
                <span className="event-info-label">Location:</span>
                <span>{event.venue_location} {event.venue_name}</span>
              </div>
              <div className="event-info-row">
                <span className="event-info-label">Club:</span>
                <span>{event.club_name}</span>
              </div>
              <div className="event-info-row">
                <span className="event-info-label">Description:</span>
                <span>{event.description}</span>
              </div>
            </div>
            {!isEventOver(event) && user?.role === "student" && (
              <button className="event-details-book-btn" onClick={handleBooking}>
                Book This Event
              </button>
            )}
            {isEventOver(event) && user?.role === "student" && hasBooked && (
              <button className="event-details-book-btn" onClick={() => setShowFeedbackModal(true)}>
                Give Feedback
              </button>
            )}
          </div>
        </div>
        <div className="student-details-card glass-card">
          <StudentDetails user={user} />
        </div>
      </div>
      {/* Feedback Section - only show if event is over */}
      {isEventOver(event) && (
        
        <FeedbackCarousel feedbacks={feedbacks} />

      )}

      {/* Modals */}
      <BookingModal
        show={modal.show}
        success={modal.success}
        message={modal.message}
        onOk={handleModalOk}
      />
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleSubmitFeedback}
        loading={feedbackLoading}
      />
    </div>
  );
};

export default EventDetails;
