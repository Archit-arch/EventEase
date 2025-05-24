import React, { useState } from "react";
import { mockEvents } from "../utils/mockEvents";
import EventCard from "../components/EventCard";
import StudentDetails from "../components/StudentDetails";
import Navbar from "../components/Navbar";
import "../styles/StudentDashboard.css"; // Importing custom CSS
import Footer from '../components/Footer/Footer.jsx';

const StudentDashboard = () => {
  const [bookings] = useState(mockEvents);
  const [filter, setFilter] = useState("upcoming");

  const filteredBookings = bookings.filter(b =>
    filter === "upcoming" ? !b.isCompleted : b.isCompleted
  );

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        {/* Left: Events */}
        <div className="dashboard-left">
          <div className="dashboard-header">
            <h1>My Bookings</h1>
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
                <EventCard key={booking.id} event={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Student Details */}
        <div className="dashboard-right">
          <StudentDetails />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
