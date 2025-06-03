// src/pages/Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css"; // Optional: style as you like

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>🚫 Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default Unauthorized;
