// pages/EventEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NotificationModel from '../components/NotificationModal';

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/organizers/events/${id}`);
        setEventData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, eventData);
      await api.post(`/events/${id}/notify`, {
        type: 'update',
        title: 'Event Updated',
        description: `The event '${eventData.title}' has been updated.`
      });
      setNotification({ title: 'Success', description: 'Event updated and notification sent.' });
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;
    try {
      await api.post(`/events/${id}/cancel`, { reason });
      await api.post(`/events/${id}/notify`, {
        type: 'cancel',
        title: 'Event Cancelled',
        description: `The event '${eventData.title}' has been cancelled. Reason: ${reason}`
      });
      setNotification({ title: 'Cancelled', description: 'Event cancelled and notification sent.' });
      navigate('/organizer');
    } catch (err) {
      console.error("Error cancelling event:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="event-edit">
      <h2>Edit Event</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" name="title" value={eventData.title || ''} onChange={handleChange} required />
        <textarea name="description" value={eventData.description || ''} onChange={handleChange} />
        <input type="date" name="date" value={eventData.date || ''} onChange={handleChange} required />
        <input type="time" name="start_time" value={eventData.start_time || ''} onChange={handleChange} required />
        <input type="time" name="end_time" value={eventData.end_time || ''} onChange={handleChange} required />
        {/* Add venue/club dropdowns if needed */}
        <button type="submit">Update Event</button>
      </form>
      <button onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>Cancel Event</button>
      {(notification.title || notification.description) && <NotificationModel title={notification.title} description={notification.description} />}
    </div>
  );
};

export default EventEdit;