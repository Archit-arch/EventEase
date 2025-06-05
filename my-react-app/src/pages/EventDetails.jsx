import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import StudentDetails from "../components/StudentDetails";
import api from '../api/axios';
import "../styles/EventDetails.css";

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

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!storedUser || !token) {
        navigate('/login');
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'student') {
        navigate('/unauthorized');
        return;
      }
      setUser(parsedUser);
    }, [navigate]);

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

  const handleBooking = async () => {
    try {
      const res = await api.post('/students/bookings', { event_id: id});
      // If booking is rejected due to venue unavailability
      if (res.data.booking && res.data.booking.status === "rejected") {
        alert("Booking failed: Venue is not available or full.");
      } else if (res.data.booking && res.data.booking.status === "booked") {
        alert("Booking successful!");
      } else if (res.data.error) {
        alert("Booking failed: " + res.data.error);
      } else {
        alert("Booking status: " + (res.data.message || "Unknown response"));
      }
    } catch (err) {
      // Try to show a specific message from the backend if available
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Booking failed. Please try again.";
      alert(errorMsg);
    }
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
            {user?.role === "student" && (
              <button className="event-details-book-btn" onClick={handleBooking}>
                Book This Event
              </button>
            )}
          </div>
        </div>
        <div className="student-details-card glass-card">
          <StudentDetails user={user} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
