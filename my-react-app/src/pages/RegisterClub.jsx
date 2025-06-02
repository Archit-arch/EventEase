import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaBuilding, FaUser, FaAlignLeft } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer.jsx';
import ClubNavbar from '../components/ClubNavbar.jsx';

function CreateClub({ currentUserId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate club name length
    if (formData.name.trim().length === 0) {
      setError('Club name is required.');
      return;
    }
    if (formData.name.length > 100) {
      setError('Club name cannot exceed 100 characters.');
      return;
    }

    try {
      // POST to your backend API endpoint for club creation
      const response = await axios.post('http://localhost:5000/api/clubs', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        created_by: currentUserId,
      });

      if (response.status === 201) {
        setSuccess('Club created successfully! Redirecting...');
        setTimeout(() => navigate('/clubs'), 2000); // Redirect to clubs list or dashboard
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create club';
      setError(errorMsg);
    }
  };

  return (
    <>
       <ClubNavbar/>
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
}

export default CreateClub;
