import React, { useState, useEffect } from "react";
import ClubNavbar from "../components/ClubNavbar";
import "../styles/EventCreation.css";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const VenueRequests = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.name.trim().length === 0) {
            setError('Venue name is required.');
            return;
        }
        if (formData.name.length > 100) {
            setError('Venue name cannot exceed 100 characters.');
            return;
        }

        try {
            const response = await api.post('/venue-requests', {
                name: formData.name.trim(),
                location: formData.location.trim(),
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                created_by: user?.id,
            });

            if (response.status === 201) {
                setSuccess('Venue request submitted successfully! Redirecting...');
                setTimeout(() => navigate('/eventManager'), 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to submit venue request';
            setError(errorMsg);
        }
    };

    return (
        <div className="event-creation-container">
            <ClubNavbar />
            <div className="event-creation-form">
                <h1>Request a Venue</h1>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Venue Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Location:
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Capacity:
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default VenueRequests;
