import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaBuilding, FaAlignLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClubNavbar from '../components/ClubNavbar.jsx';
import api from '../api/axios';

const RegisterClub = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get user from localStorage once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, redirect to login or handle accordingly
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
      setError('Club name is required.');
      return;
    }
    if (formData.name.length > 100) {
      setError('Club name cannot exceed 100 characters.');
      return;
    }

    try {
      const response = await api.post('/club-requests', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        created_by: user?.id,  // Use user from state
      });

      if (response.status === 201) {
        setSuccess('Club request submitted successfully! Redirecting...');
        setTimeout(() => navigate('/eventManager'), 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to submit club request';
      setError(errorMsg);
    }
  };

  return (
    <>
      <ClubNavbar />
      <div
        style={{
          backgroundImage: 'url("/images/login-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Row className="w-100">
            <Col md={{ span: 6, offset: 3 }}>
              <Card className="shadow-sm p-4">
                <Card.Title className="text-center mb-4">Create New Club</Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formClubName">
                    <Form.Label>Club Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaBuilding /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter club name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={100}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaAlignLeft /></InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter club description (optional)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Create Club
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RegisterClub;
// This code defines a RegisterClub component that allows users to create a new club.