import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../utils/mockEvents"; // Assume you have a similar mockEvents file
import EventCard from "../components/EventCard";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/EventManager.css"; // Custom CSS for this page
import api from '../api/axios';
import ClubRequests from './ClubRequests';
import ViewAdminLogs from './ViewAdminLogs'; 

const adminDashboard = () => {
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
    <div className="container mt-5">

      
      <ViewAdminLogs /> 
    </div>
  );
};

export default adminDashboard;
