import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/EventManager.css"; // Custom CSS for this page
import api from '../api/axios';
import ClubRequests from './ClubRequests';
import AdminLogs from "./AdminLogs";
import EventLogs from "./EventLogs";
import VenueLogs from "./VenueLogs";

const ViewAdminLogs = () => {
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
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Logs
          </button>
        ))}
      </div>

      {activeTab === 'clubs' && <AdminLogs />}
      {activeTab === 'events' && <EventLogs />}
      {activeTab === 'venues' && <VenueLogs />}
    </div>
    </>
  );
};

export default ViewAdminLogs;