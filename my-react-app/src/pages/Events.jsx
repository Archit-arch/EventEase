import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import Footer from '../components/Footer/Footer.jsx';
import EventCard from "../components/EventCard";
import api from '../api/axios';
import "../styles/Events.css"; // Import the CSS file for this page
import { useAuth } from '../hooks/useAuth';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [eventType, setEventType] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading_auth, error } = useAuth();

  useEffect(() => {
      if (!loading) {
        if (!user) {
          console.log("User not authenticated, redirecting to login");
          navigate('/login');
        } else if (user.role !== 'student') {
          navigate('/unauthorized');
        }
      }
    }, [user, loading_auth, navigate]);
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/students/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
     if (!dateString) return "";
    const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
  };

  const isUpcoming = (event) => {
    if (!event.date || !event.start_time) return false;
    const [hours, minutes, seconds = "00"] = event.start_time.split(":");
    const eventDate = new Date(event.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    const now = new Date();
    return eventDate > now;
  };

  const isPast = (event) => {
    if (!event.date || !event.start_time) return false;
    const [hours, minutes, seconds = "00"] = event.start_time.split(":");
    const eventDate = new Date(event.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    const now = new Date();
    return eventDate <= now;
  };


  

  const relevantEvents = eventType === "upcoming"
    ? events.filter(isUpcoming)
    : events.filter(isPast);

  const dates = [...new Set(relevantEvents.map(e => e.date))];
  const clubs = [...new Set(relevantEvents.map(e => e.club_name))];
  const venueOptions = [
    ...new Map(
      relevantEvents.map(e => [
        `${e.venue_name}@@${e.venue_location}`,
        { venue_name: e.venue_name, venue_location: e.venue_location }
      ])
    ).values()
  ];

  const filteredEvents = relevantEvents.filter(event => {
    const venueValue = event.venue_name + "@@" + event.venue_location;
    return (selectedVenue ? venueValue === selectedVenue : true) &&
      (selectedDate ? event.date === selectedDate : true) &&
      (selectedClub ? event.club_name === selectedClub : true);
  });




  return (
    <div className="events-page">
      <StudentNavbar />
    <div className="browse-bar">
      <div className="browse-bar-left">
        <span className="browse-title">Browse Events:</span>
        <div className="browse-filters">
          <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
            <option value="">Date</option>
            {dates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>
          <select value={selectedVenue} onChange={e => setSelectedVenue(e.target.value)}>
            <option value="">Venue</option>
            {venueOptions.map(({ venue_name, venue_location }) => (
              <option
                key={venue_name + venue_location}
                value={venue_name + "@@" + venue_location}
              >
                {venue_location} {venue_name  && `- ${venue_name}`}
              </option>
            ))}
          </select>
          <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)}>
            <option value="">Club</option>
            {clubs.map(club => (
              <option key={club} value={club}>{club}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="browse-bar-right event-type-toggle">
        <button
          className={eventType === "upcoming" ? "active" : ""}
          onClick={() => setEventType("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={eventType === "past" ? "active" : ""}
          onClick={() => setEventType("past")}
        >
          Past
        </button>
      </div>
    </div>

    
      {/* Events List */}
      <div className="events-list">
        {loading ? (
          <div>Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events">No events found for selected filters.</div>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event.event_id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;

