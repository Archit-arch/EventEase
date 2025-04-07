import React from "react";
import "./EventCard.css"; // Import the custom CSS file

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h3 className="event-title">{event.eventName}</h3>
      <p className="event-datetime">{event.date} at {event.time}</p>
      <p className="event-venue">{event.venue}</p>
      <button className="event-button">
        View Details
      </button>
    </div>
  );
};

export default EventCard;
