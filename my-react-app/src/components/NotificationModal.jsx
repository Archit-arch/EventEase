import React, { useState } from 'react';
import '../styles/NotificationModal.css';
import api from '../api/axios';

const NotificationModal = ({ id, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [studentIds, setStudentIds] = useState([]);

  const handleSend = async () => {
    try {
      const res = await api.post(`/events/${id}/notify`, { title, description });

      setMessage(res.data.message || 'Notification sent successfully.');
      setStudentIds(res.data.studentUserIds || []);
    } catch (err) {
      console.error("Failed to send notification:", err);
      setMessage('Failed to send notification.');
    }
  };

  return (
  <div className="notification-modal">
    <div className="modal-content"> {/* <-- Add this wrapper */}
      <h3>Send Notification</h3>
      <input
        type="text"
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Notification Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="modal-buttons">
        <button onClick={handleSend}>Send</button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>

      {message && <p className="status-message">{message}</p>}
      {studentIds.length > 0 && (
        <div className="student-list">
          <p><strong>Notified Student IDs:</strong></p>
          <ul>
            {studentIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

};

export default NotificationModal;
