import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ClubNavbar from '../components/ClubNavbar.jsx';
import { useAuth } from '../hooks/useAuth';

const EventRequestForm = () => {
  const { user, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    venue_id: '',
    club_id: ''
  });

  const [venues, setVenues] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // Redirect logic based on auth state and role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        navigate('/login');
      } else if (user.role !== 'organizer') {
        navigate('/unauthorized');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return; // Wait for user before fetching

    const fetchVenues = async () => {
      try {
        const response = await api.get('/get-venues');
        setVenues(response.data);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setLoadingVenues(false);
      }
    };

    const fetchUserClubs = async () => {
      try {
        const response = await api.get(`/user-clubs/${user.id}`);
        setUserClubs(response.data);
      } catch (err) {
        console.error('Error fetching user clubs:', err);
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchVenues();
    fetchUserClubs();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedVenue = venues.find(v => v.venue_id.toString() === formData.venue_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.date || !formData.start_time || !formData.end_time || !formData.venue_id || !formData.club_id) {
      setError('Please fill all required fields.');
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setError('End time must be after start time.');
      return;
    }

    try {
      const response = await api.post('/event-requests', {
        ...formData,
        venue_id: Number(formData.venue_id),
        club_id: Number(formData.club_id),
        created_by: user.id,
      });

      if (response.status === 201) {
        setSuccess('Event request submitted successfully!');
        setTimeout(() => navigate('/eventManager'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed.');
    }
  };

  return (
    <Container className="mt-5">
      <ClubNavbar />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <h3 className="mb-4 text-center">Request New Event</h3>
            {(error || authError) && <Alert variant="danger">{error || authError}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time *</Form.Label>
                    <Form.Control
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time *</Form.Label>
                    <Form.Control
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Venue *</Form.Label>
                <Form.Select
                  name="venue_id"
                  value={formData.venue_id}
                  onChange={handleChange}
                  required
                  disabled={loadingVenues}
                >
                  <option value="">Select Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {selectedVenue && (
                <div className="mb-3 p-3 border rounded bg-light">
                  <h5>Venue Details:</h5>
                  <p><strong>Name:</strong> {selectedVenue.name}</p>
                  <p><strong>Location:</strong> {selectedVenue.location || 'N/A'}</p>
                  <p><strong>Capacity:</strong> {selectedVenue.capacity || 'N/A'}</p>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Club *</Form.Label>
                <Form.Select
                  name="club_id"
                  value={formData.club_id}
                  onChange={handleChange}
                  required
                  disabled={loadingClubs}
                >
                  <option value="">Select Club</option>
                  {userClubs.map((club) => (
                    <option key={club.club_id} value={club.club_id}>
                      {club.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={
                  loadingVenues || loadingClubs ||
                  !formData.title ||
                  !formData.date ||
                  !formData.start_time ||
                  !formData.end_time ||
                  !formData.venue_id ||
                  !formData.club_id
                }
              >
                Submit Event Request
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EventRequestForm;
