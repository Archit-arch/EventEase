"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap"
import { Calendar, Clock, MapPin, Users, FileText, Star } from "lucide-react"
import StudentNavbar from "../components/StudentNavbar"
import StudentDetails from "../components/StudentDetails"
import FeedbackCarousel from "../components/FeedbackCarousel"
import BookingModal from "../components/BookingModal"
import FeedbackModal from "../components/FeedbackModal"
import api from "../api/axios"
import { useAuth } from "../hooks/useAuth"

const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

const formatTime = (timeString) => {
  if (!timeString) return ""
  const [hour, minute] = timeString.split(":")
  const date = new Date()
  date.setHours(hour, minute)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const isEventOver = (event) => {
  if (!event?.date || !event?.end_time) return false
  const [hours, minutes, seconds = "00"] = event.end_time.split(":")
  const eventEnd = new Date(event.date)
  eventEnd.setHours(Number(hours), Number(minutes), Number(seconds), 0)
  return new Date() > eventEnd
}

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    show: false,
    success: false,
    message: "",
    redirect: "",
  })
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [hasBooked, setHasBooked] = useState(false)

  const navigate = useNavigate()
  const { user, loading_auth, error } = useAuth()

  // Handle redirects based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login")
        navigate("/login")
      } else if (user.role !== "student" && user.role !== "organizer") {
        navigate("/unauthorized")
      }
    }
  }, [user, loading_auth, navigate])

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/students/events/${id}`)
        setEvent(res.data)
      } catch (err) {
        console.error("Failed to fetch event details:")
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get(`/students/events/${id}/feedback`)
        setFeedbacks(res.data)
      } catch (err) {
        setFeedbacks([])
      }
    }
    fetchFeedbacks()
  }, [id])

  // Check if user has booked this event
  useEffect(() => {
    const checkBooking = async () => {
      if (!user) return
      try {
        const res = await api.get("/students/bookings")
        const booked = res.data.some((b) => String(b.event_id) === String(id) && b.status === "booked")
        setHasBooked(booked)
      } catch (err) {
        setHasBooked(false)
      }
    }
    checkBooking()
  }, [user, id])

  // Booking handler
  const handleBooking = async () => {
    try {
      const res = await api.post("/students/bookings", { event_id: id })

      if (res.data.booking && res.data.booking.status === "rejected") {
        setModal({
          show: true,
          success: false,
          message: "Booking failed: Venue is not available or full.",
          redirect: "/events",
        })
      } else if (res.data.booking && res.data.booking.status === "booked") {
        setModal({
          show: true,
          success: true,
          message: "Booking successful!",
          redirect: "/studentdashboard",
        })
      } else if (res.data.error) {
        setModal({
          show: true,
          success: false,
          message: "Booking failed: " + res.data.error,
          redirect: "/events",
        })
      }
    } catch (err) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        setModal({
          show: true,
          success: false,
          message: "Too many booking attempts. Please wait a few minutes before trying again.",
          redirect: "/events",
        })
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking failed. Please try again."
        setModal({
          show: true,
          success: false,
          message: errorMsg,
          redirect: "/events",
        })
      }
    }
  }

  // Feedback submit handler
  const handleSubmitFeedback = async (rating, comment) => {
    setFeedbackLoading(true)
    try {
      await api.post("/students/feedback", {
        event_id: id,
        ratings: rating,
        comments: comment,
      })
      setShowFeedbackModal(false)
      // Refresh feedbacks
      const res = await api.get(`/students/events/${id}/feedback`)
      setFeedbacks(res.data)
      setModal({
        show: true,
        success: true,
        message: "Feedback submitted!",
        redirect: `/studentdashboard`,
      })
    } catch (err) {
      setModal({
        show: true,
        success: false,
        message: err.response?.data?.error || "Failed to submit feedback.",
        redirect: `/events`,
      })
    } finally {
      setFeedbackLoading(false)
    }
  }

  const handleModalOk = () => {
    setModal({ ...modal, show: false })
    navigate(modal.redirect)
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <StudentNavbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="text-center text-white">
            <Spinner animation="border" size="lg" className="mb-3" />
            <h4>Loading event details...</h4>
          </div>
        </Container>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <StudentNavbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <Alert variant="warning" className="text-center">
            <h4>Event not found</h4>
            <p>The event you're looking for doesn't exist or has been removed.</p>
            <Button variant="primary" onClick={() => navigate("/events")}>
              Back to Events
            </Button>
          </Alert>
        </Container>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingBottom: "3rem",
      }}
    >
      <StudentNavbar />

      <Container className="py-4">
        <Row className="g-4">
          {/* Main Event Card */}
          <Col lg={8}>
            <Card className="shadow-lg border-0 h-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
              {/* Event Poster */}
              <div style={{ height: "300px", overflow: "hidden", position: "relative" }}>
                <Card.Img
                  variant="top"
                  src="/images/defaultposter.png"
                  alt={`${event.title} Poster`}
                  style={{
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.9)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                  }}
                >
                  <Badge
                    bg={isEventOver(event) ? "secondary" : "success"}
                    className="px-3 py-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {isEventOver(event) ? "Event Ended" : "Upcoming Event"}
                  </Badge>
                </div>
              </div>

              <Card.Body className="p-4">
                {/* Event Title */}
                <div className="mb-4">
                  <h1 className="display-5 fw-bold text-primary mb-2">{event.title}</h1>
                  <Badge bg="info" className="px-3 py-2">
                    <Users size={16} className="me-2" />
                    {event.club_name}
                  </Badge>
                </div>

                {/* Event Details Grid */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <Calendar size={24} className="text-primary me-3" />
                      <div>
                        <small className="text-muted d-block">Date</small>
                        <strong>{formatDate(event.date)}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <Clock size={24} className="text-primary me-3" />
                      <div>
                        <small className="text-muted d-block">Time</small>
                        <strong>
                          {formatTime(event.start_time)} – {formatTime(event.end_time)}
                        </strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <MapPin size={24} className="text-primary me-3" />
                      <div>
                        <small className="text-muted d-block">Location</small>
                        <strong>
                          {event.venue_location} {event.venue_name}
                        </strong>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Description */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FileText size={20} className="text-primary me-2" />
                    <h5 className="mb-0">About This Event</h5>
                  </div>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                        {event.description}
                      </p>
                    </Card.Body>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  {!isEventOver(event) && user?.role === "student" && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleBooking}
                      className="py-3"
                      style={{
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Book This Event
                    </Button>
                  )}
                  {isEventOver(event) && user?.role === "student" && hasBooked && (
                    <Button
                      variant="warning"
                      size="lg"
                      onClick={() => setShowFeedbackModal(true)}
                      className="py-3"
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      <Star size={20} className="me-2" />
                      Give Feedback
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Student Details Sidebar */}
          <Col lg={4}>
            <Card className="shadow-lg border-0 h-100" style={{ borderRadius: "20px" }}>
              <Card.Body className="p-4">
                <StudentDetails user={user} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Feedback Section */}
        {isEventOver(event) && (
          <Row className="mt-5">
            <Col>
              <Card className="shadow-lg border-0" style={{ borderRadius: "20px" }}>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h2 className="display-6 fw-bold text-primary mb-2">Event Feedback</h2>
                    <p className="text-muted">See what attendees thought about this event</p>
                  </div>
                  <FeedbackCarousel feedbacks={feedbacks} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modals */}
      <BookingModal show={modal.show} success={modal.success} message={modal.message} onOk={handleModalOk} />
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleSubmitFeedback}
        loading={feedbackLoading}
      />
    </div>
  )
}

export default EventDetails
