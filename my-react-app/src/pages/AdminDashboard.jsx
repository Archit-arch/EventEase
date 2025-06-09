import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Axios is configured to send cookies
import AdminNavbar from "../components/AdminNavbar";
import ClubRequests from "./ClubRequests";
import ViewAdminLogs from "./ViewAdminLogs";
import "../styles/EventManager.css";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("clubs");
  const navigate = useNavigate();

  useEffect(() => {
  let isMounted = true;

  api.get('/auth/verify')
    .then(res => {
      const user = res.data.user;
      if (isMounted) {
        if (user?.role !== 'admin') {
          navigate('/unauthorized');
        } else {
          setUser(user);
        }
      }
    })
    .catch(() => {
      if (isMounted) navigate('/login');
    });

  return () => {
    isMounted = false;
  };
}, [navigate]);

  return (
    <div className="container mt-5">
      <AdminNavbar user={user} />
      <ViewAdminLogs />
    </div>
  );
};
//
export default AdminDashboard;
