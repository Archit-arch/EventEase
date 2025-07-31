import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.msg || 'OTP sent to your email');
        setTimeout(() => {
            navigate('/verify-reset-otp', { state: { email } });
        }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="text-center mb-4">Forgot Password</h3>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 mt-3">Send OTP</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
