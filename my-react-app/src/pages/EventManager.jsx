import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import ClubNavbar from "../components/ClubNavbar";
import "../styles/EventManager.css"; // Custom CSS for this page
import api from '../api/axios';

const EventManager = () => {
  const [events, setEvents] = useState(mockEvents);
  const [filter, setFilter] = useState("upcoming");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Role and token verification
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    console.log('Stored User:', storedUser);
    console.log('Stored Token:', token);

    if (!storedUser || !token) {
      console.log('Redirecting to login due to missing user/token');
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== 'organizer') {
      console.warn('Unauthorized role:', parsedUser.role);
      navigate('/unauthorized');
      return;
    }

    setUser(parsedUser); // Valid organizer user

    // Optional: Verify token with backend
    api.get('/auth/eventManager')
      .then(res => {
        console.log("✔️ Event Manager access OK:", res.data);
      })
      .catch(err => {
        console.error("❌ Token invalid or expired:", err.response?.data || err.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  // Filter events based on status
  const filteredEvents = events.filter(event =>
    filter === "upcoming" ? !event.isCompleted : event.isCompleted
  );

  const handleCreateNewEvent = () => {
    navigate("/create-event");
    console.log("Navigating to event creation page...");
  };

  return (
    <div className="dashboard-container">
      <ClubNavbar />

      <div className="dashboard-content">
        {/* Left: Events List */}
        <div className="dashboard-left">
          <div className="dashboard-header">
            <h1>Manage Events</h1>
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

          {filteredEvents.length === 0 ? (
            <p>No {filter === "upcoming" ? "upcoming" : "past"} events found.</p>
          ) : (
            <div className="event-grid">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Club Controls */}
        <div className="dashboard-right">
          <div className="club-controls">
            <h2>Club Controls</h2>
            <button className="create-event-btn" onClick={handleCreateNewEvent}>
              Create New Event
            </button>
            {/* Add more organizer tools if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
