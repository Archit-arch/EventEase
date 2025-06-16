import React from "react";
import "./EventCard.css"; // Reuse same CSS
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
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Organizer_EventCard = ({ event, onManageClick }) => {
  const navigate = useNavigate();

  if (!event) return <div className="event-card">No event data</div>;

  const {
    request_id,
    title = "Untitled Event",
    date,
    start_time,
    end_time,
    venue_name = "TBA",
    venue_location = "",
    club_name = "TBA",
    status = "pending",
    description = "",
    student_count = 0,
    rejection_reason = ""
  } = event;

  const handleManageClick = () => {
    if (onManageClick) {
      onManageClick(request_id); // Call parent function
    }
  };


  return (
    <div className="event-card">
      <img
        className="event-poster"
        src="/images/defaultposter.png"
        alt={`${title} Poster`}
      />
      <div className="event-details">
        <h3 className="event-title">{title}</h3>
        <div className="event-info">

          <p><strong>Description:</strong> {description || "No description provided."}</p>
          <p><strong>Date:</strong> {formatDate(date)}</p>
          <p><strong>Time:</strong> {formatTime(start_time)} – {formatTime(end_time)}</p>
          <p><strong>Location:</strong> {venue_location} {venue_name}</p>
          <p><strong>Club:</strong> {club_name}</p>
          <p><strong>Registered Students:</strong> {student_count || 0}</p>
          <p><strong>Status:</strong> {status}</p>

          {status.toLowerCase() === "rejected" && rejection_reason  && (
            <p><strong>Reason:</strong> {rejection_reason}</p>
          )}
        </div>
      </div>
      <div className="event-actions">
        <button className="event-button" onClick={handleManageClick}>Manage</button>
      </div>
    </div>
  );
};

export default Organizer_EventCard;
