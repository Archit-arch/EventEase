import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import api from '../api/axios';
import ClubRequests from './ClubRequests';
import VenueRequestsAdmin from "./VenueRequestsAdmin";
import EventRequestsAdmin from "./EventRequestsAdmin";
import { useAuth } from '../hooks/useAuth';

const ViewRequests = () => {
  const [activeTab, setActiveTab] = useState('clubs');
  const [loading, setLoading] = useState(true); // Add loading state
  const { user, loading_auth, error } = useAuth();
  const navigate = useNavigate();

  // Handle redirects based on auth state
    useEffect(() => {
      if (!loading) {
        if (!user) {
          console.log("User not authenticated, redirecting to login");
          navigate('/login');
        } else if (user.role !== 'admin') {
          navigate('/unauthorized');
        }
      }
    }, [user, loading_auth, navigate]);

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
      {activeTab === 'events' && <EventRequestsAdmin/>}
      {activeTab === 'venues' && <VenueRequestsAdmin />}
    </div>
    </>
  );
};

export default ViewRequests;