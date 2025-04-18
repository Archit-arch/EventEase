import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/EventCreation.css";

const EventCreation = ({ onSave }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        organizer: '',
        capacity: 0,
        poster: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = {
            ...formData,
            id: Date.now(),
            isCompleted: false,
            registrationCount: 0,
            capacity: parseInt(formData.capacity) || 0,
            poster: formData.poster || '/images/defaultposter.png', // Default poster if not provided
        };
        console.log("New Event Created:", newEvent);
        // Call the onSave function passed as a prop to save the event data
        onSave(formData);

        // Reset form after submission
        setFormData({
            eventName: '',
            date: '',
            time: '',
            venue: '',
            description: '',
            organizer: '',
            capacity: 0,
            poster: '',
        });
    };

    return (
        <div className="event-creation-container">
            <Navbar />
            <div className="event-creation-form">
                <h1>Create New Event</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Event Name:
                        <input
                            type="text"
                            value={formData.eventName}
                            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Time:
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Venue:
                        <input
                            type="text"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </label>
                    <label>
                        Organizer:
                        <input
                            type="text"
                            value={formData.organizer}
                            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Capacity:
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Poster URL:
                        <input
                            type="text"
                            value={formData.poster}
                            onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                        />
                    </label>
                    <button type="submit">Create Event</button>
                </form>
            </div>
        </div>
    );
};

export default EventCreation;