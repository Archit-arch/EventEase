import React from "react";
import "./EventCard.css"; // Import the custom CSS file

const EventCard = ({ event }) => {
  console.log("Rendering EventCard for:", event);
  return (
    <div className="event-card">
      <img
        className="event-poster"
        src={event.poster}
        alt={`${event.eventName} Poster`}
      />
      <div className="event-details">
        <h3 className="event-title">{event.eventName}</h3>
        <p className="event-datetime">
          {event.date} at {event.time}
        </p>
        <p className="event-venue">{event.venue}</p>
        
      </div>
      <div className="event-actions">
        <button className="event-button">View Details</button>
      </div>
    </div>
  );
};

export default EventCard;
