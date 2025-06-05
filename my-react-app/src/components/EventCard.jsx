import React from "react";
import "./EventCard.css"; // Import the custom CSS file
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  // Assumes timeString is "HH:MM:SS" or "HH:MM"
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  if (!event) {
    return <div className="event-card">No event data available</div>;
  }
  const {
    title = "Untitled Event",
    date,
    start_time,
    end_time,
    venue_name = "TBA",
    venue_location = "",
    club_name = "TBA",
    description = ""
  } = event;

  const handleViewDetails = () => {
    navigate(`/events/${event.event_id}`);
  }

  return (
    <div className="event-card">
      <img
        className="event-poster"
        src='/images/defaultposter.png'
        alt={`${title} Poster`}
      />
      <div className="event-details">
        <h3 className="event-title">{title}</h3>
        <div className="event-info">
          <p><strong>Date:</strong> {formatDate(date)}</p>
          <p><strong>Time:</strong> {formatTime(start_time)} – {formatTime(end_time)}</p>
          <p><strong>Location:</strong> {venue_location} {venue_name}</p>
          <p><strong>Club:</strong> {club_name}</p>
        </div>
      </div>
      <div className="event-actions">
        <button className="event-button" onClick={handleViewDetails}>View Details</button>
      </div>
    </div>
  );
};

export default EventCard;
