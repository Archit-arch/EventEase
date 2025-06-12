import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaBuilding, FaAlignLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClubNavbar from '../components/ClubNavbar.jsx';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const RegisterClub = () => {
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect logic based on auth and role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'organizer') {
        navigate('/unauthorized');
      }
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (formData.name.trim().length === 0) {
      setFormError('Club name is required.');
      return;
    }
    if (formData.name.length > 100) {
      setFormError('Club name cannot exceed 100 characters.');
      return;
    }

    try {
      const response = await api.post('/club-requests', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        created_by: user?.id,
      });

      if (response.status === 201) {
        setSuccess('Club request submitted successfully! Redirecting...');
        setTimeout(() => navigate('/eventManager'), 2000);
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to submit club request');
    }
  };

  if (loading) return <p>Loading...</p>;

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

                {formError && <Alert variant="danger">{formError}</Alert>}
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
                    Submit Club Registration Request
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
