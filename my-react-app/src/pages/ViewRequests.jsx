import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import api from '../api/axios';
import ClubRequests from './ClubRequests';
import VenueRequestsAdmin from "./VenueRequestsAdmin";

const ViewRequests = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('clubs');

  const navigate = useNavigate();

  return (
    <>
    <AdminNavbar/>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="d-flex justify-content-center mb-3">
        {['clubs', 'events', 'venues'].map((tab) => (
          <button
            key={tab}
            className={`btn btn-${activeTab === tab ? 'primary' : 'outline-primary'} mx-2`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
          </button>
        ))}
      </div>

      {activeTab === 'clubs' && <ClubRequests />}
      {activeTab === 'events' && <EventRequests />}
      {activeTab === 'venues' && <VenueRequestsAdmin />}
    </div>
    </>
  );
};

export default ViewRequests;