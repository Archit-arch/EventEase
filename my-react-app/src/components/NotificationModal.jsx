// components/NotificationModel.jsx
import React from 'react';
import '../styles/NotificationModal.css';

const NotificationModel = ({ title, description }) => {
  return (
    <div className="notification-model">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default NotificationModel;