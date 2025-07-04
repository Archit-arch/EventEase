
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Axios is configured to send cookies
import AdminNavbar from "../components/AdminNavbar";
import ClubRequests from "./ClubRequests";
import ViewAdminLogs from "./ViewAdminLogs";
import "../styles/EventManager.css";
import { useAuth } from '../hooks/useAuth';
const AdminDashboard = () => {
const [loading, setLoading] = useState(true); // Add loading state
const [activeTab, setActiveTab] = useState("clubs");
const navigate = useNavigate();
const { user, loading_auth, error } = useAuth();

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
    <div className="container mt-5">
      <ViewAdminLogs />
    </div>
  );
};

export default AdminDashboard;
