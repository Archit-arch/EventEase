import React from "react";
import "./EventCard.css"; // Reusing the same styles

const formatDateTime = (timestampString) => {
  if (!timestampString) return { formattedDate: "N/A", formattedTime: "N/A" };

  // Convert "2025-06-03 08:46:14.383738" → "2025-06-03T08:46:14"
  const isoCompatible = timestampString.replace(" ", "T").split(".")[0];

  const date = new Date(isoCompatible);
  if (isNaN(date.getTime())) {
    return { formattedDate: "Invalid Date", formattedTime: "Invalid Time" };
  }

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return { formattedDate, formattedTime };
};



const Organizer_VenueCard = ({ venue }) => {
  const {
    name = "Untitled Venue",
    location = "Unknown",
    capacity = "N/A",
    status = "Pending",
    created_at
  } = venue;


  const { formattedDate, formattedTime } = formatDateTime(created_at);

  return (
    <div className="event-card">
      <img
        className="event-poster"
        src='/images/defaultposter.png'
        alt={`${name} Poster`}
      />
      <div className="event-details">
        <h3 className="event-title">{name}</h3>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Capacity:</strong> {capacity}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Time:</strong> {formattedTime}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>
    </div>
  );
};

export default Organizer_VenueCard;