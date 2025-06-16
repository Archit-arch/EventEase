import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClubNavbar from "../components/ClubNavbar";
import "../styles/EventManager.css";
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Organizer_EventCard from "../components/Organizer_EventCard";
import Organizer_ClubCard from "../components/Organizer_ClubCard";
import Organizer_VenueCard from "../components/Organizer_VenueCard";
import OrganizerDetails from "../components/OrganizerDetails";
import OrganizerEventDetails from "../components/OrganizerEventDetails"; // ✅ New import

const EventManager = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [eventFilter, setEventFilter] = useState("upcoming");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null); // ✅ New state for modal
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate('/login');
      else if (user.role !== 'organizer') navigate('/unauthorized');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [eventRes, clubRes, venueRes] = await Promise.all([
          api.get('/organizers/events'),
          api.get('/organizers/clubs'),
          api.get('/organizers/venues'),
        ]);

        setEvents(eventRes.data);
        setClubs(clubRes.data);
        setVenues(venueRes.data);
      } catch (err) {
        console.error("Error fetching organizer data:", err);
      }
    };

    fetchAll();
  }, [user]);

  const isUpcoming = (evt) => {
    if (!evt.date || !evt.start_time) return false;
    const [hours, minutes, seconds = "00"] = evt.start_time.split(":");
    const eventDate = new Date(evt.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    return eventDate > new Date();
  };

  const isPast = (evt) => {
    if (!evt.date || !evt.start_time) return false;
    const [hours, minutes, seconds = "00"] = evt.start_time.split(":");
    const eventDate = new Date(evt.date);
    eventDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    return eventDate <= new Date();
  };

  const filterByStatus = (arr) => {
    if (statusFilter === "all") return arr;
    return arr.filter(item => item.status?.toLowerCase() === statusFilter);
  };

  const renderCards = () => {
    if (activeTab === "events") {
      const timeFiltered = events.filter(eventFilter === "upcoming" ? isUpcoming : isPast);
      const statusFiltered = filterByStatus(timeFiltered);
      const sortedEvents = [...statusFiltered].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.start_time || "00:00:00"}`);
        const dateTimeB = new Date(`${b.date}T${b.start_time || "00:00:00"}`);
        return eventFilter === "upcoming" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
      });

      return sortedEvents.map(event => (
  <Organizer_EventCard
    key={event.request_id}
    event={event}
    onManageClick={setSelectedEventId} // <-- This controls the modal
  />
));

    } else if (activeTab === "clubs") {
      const statusFiltered = filterByStatus(clubs);
      return statusFiltered.map(club => (
        <Organizer_ClubCard key={club.club_id} club={club} />
      ));
    } else if (activeTab === "venues") {
      const statusFiltered = filterByStatus(venues);
      return statusFiltered.map(venue => (
        <Organizer_VenueCard key={venue.venue_id} venue={venue} />
      ));
    }
  };

  return (
    <div className="dashboard-container">
      <ClubNavbar />
      <div className="dashboard-content">
        <div className="dashboard-left">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1 style={{ marginBottom: '12px' }}>Dashboard</h1>

              {activeTab === "events" && (
                <div className="filter-buttons" style={{ marginBottom: '8px' }}>
                  <button
                    className={eventFilter === "upcoming" ? "active" : ""}
                    onClick={() => setEventFilter("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    className={eventFilter === "past" ? "active" : ""}
                    onClick={() => setEventFilter("past")}
                  >
                    Past
                  </button>
                </div>
              )}

              <div className="status-filter">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <label htmlFor="statusFilter" style={{ fontWeight: 'bold' }}>Status:</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '6px', borderRadius: '6px', fontSize: '14px' }}
                  >
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-buttons" style={{ display: 'flex', gap: '8px', marginTop: '34px' }}>
              {["events", "clubs", "venues"].map(tab => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="event-grid">
            {renderCards()}
          </div>
        </div>

        <div className="dashboard-right">
          <OrganizerDetails user={user} />
        </div>
      </div>

      {/* ✅ Overlay Modal for Event Details */}
      {selectedEventId && (
        <div className="modal-overlay">
          <OrganizerEventDetails
            requestId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default EventManager;
