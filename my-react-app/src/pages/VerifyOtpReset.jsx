import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyOtpReset() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-reset-otp`, { email, otp });
      setMessage('OTP verified! Redirecting...');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid or expired OTP');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="text-center mb-4">Verify OTP</h3>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleVerify}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group controlId="otp" className="mt-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 mt-3">Verify OTP</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VerifyOtpReset;
