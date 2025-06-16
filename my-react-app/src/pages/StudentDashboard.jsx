// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import StudentDetails from "../components/StudentDetails";
import StudentNavbar from "../components/StudentNavbar";
import "../styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // ✅ Safe redirect
  useEffect(() => {
    console.log("🟡 useEffect firing");
    console.log("👤 user:", user);
    console.log("⏳ loading:", loading);

    if (loading) return;

    if (!user) {
      console.log("❌ No user, redirecting to login");
      navigate('/login');
    } else if (!user.role || user.role.toLowerCase().trim() !== 'student') {
      console.log("🚫 Unauthorized role:", user.role);
      navigate('/unauthorized');
    } else {
      console.log("✅ User is authorized student");
    }
  }, [user, loading, navigate]);


  // ✅ Fetch bookings when authenticated
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get('/students/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, [user]);

  const isUpcoming = (booking) => {
    if (!booking.date || !booking.start_time) return false;
    const [hours, minutes, seconds = "00"] = booking.start_time.split(":");
    const eventDate = new Date(booking.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    const now = new Date();
    return eventDate > now && booking.status === 'booked';
  };

  const isPast = (booking) => {
    if (!booking.date || !booking.start_time) return false;
    const [hours, minutes, seconds = "00"] = booking.start_time.split(":");
    const eventDate = new Date(booking.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    const now = new Date();
    return eventDate <= now && booking.status === 'booked';
  };

  const filteredBookings = bookings.filter(
    filter === "upcoming" ? isUpcoming : isPast
  );

  if (loading) return <div>Loading Student Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <StudentNavbar />
      <div className="dashboard-content">
        {/* Left: Events */}
        <div className="dashboard-left">
          <div className="dashboard-header">
            <h1>My Bookings</h1>
            <p>{greeting}</p>
            <div className="filter-buttons">
              <button
                className={filter === "upcoming" ? "active" : ""}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming Events
              </button>
              <button
                className={filter === "past" ? "active" : ""}
                onClick={() => setFilter("past")}
              >
                Past Events
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <p>No {filter === "upcoming" ? "upcoming" : "past"} events found.</p>
          ) : (
            <div className="event-grid">
              {filteredBookings.map(booking => (
                <EventCard key={booking.event_id} event={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Student Details */}
        <div className="dashboard-right">
          <StudentDetails user={user} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
