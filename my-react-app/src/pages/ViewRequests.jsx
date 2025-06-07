import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import api from '../api/axios';
import ClubRequests from './ClubRequests';
import VenueRequestsAdmin from "./VenueRequestsAdmin";
import EventRequestsAdmin from "./EventRequestsAdmin";

const ViewRequests = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('clubs');

  const navigate = useNavigate();

  // Role and token verification
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
     
      
      console.log('Stored User:', storedUser);
      console.log('Stored Token:', token);
  
      if (!storedUser || !token) {
        console.log('Redirecting to login due to missing user/token');
        navigate('/login');
        return;
      }
  
      const parsedUser = JSON.parse(storedUser);
  
      if (parsedUser.role !== 'admin') {
        console.warn('Unauthorized role:', parsedUser.role);
        navigate('/unauthorized');
        return;
      }
  
      setUser(parsedUser); // Valid organizer user
  
      // Optional: Verify token with backend
      api.get('/auth/adminDashboard')
        .then(res => {
          console.log("✔️ Event Manager access OK:", res.data);
        })
        .catch(err => {
          console.error("❌ Token invalid or expired:", err.response?.data || err.message);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        });
    }, [navigate]);

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