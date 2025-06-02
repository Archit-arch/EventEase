import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/EventManager.css"; // Custom CSS for this page

const EventManager = () => {
  // We use the mockEvents array to simulate the created events by the club
  const [events, setEvents] = useState(mockEvents);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  // Filter events: upcoming if not completed, past if completed
  const filteredEvents = events.filter(event =>
    filter === "upcoming" ? !event.isCompleted : event.isCompleted
  );

  // A simple handler for the "Create New Event" button.
  // This might open a modal or redirect to a creation form.
  const handleCreateNewEvent = () => {
    // Replace with your navigation or modal trigger logic.
    navigate("/create-event"); // Example: navigate to a create event page
    console.log("Navigating to event creation page...");
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />

      <div className="dashboard-content">
        {/* Left: List of Created Events */}
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
            {/* Add additional club-specific controls here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
