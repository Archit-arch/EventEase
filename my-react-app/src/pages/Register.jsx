import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');
    const { email, name, password, role } = formData;

    if (!email || !name || !password || !role) {
      setError('Please fill all required fields before sending OTP.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`, {
        email,
        name,
        password,
        role,
      });
      setOtpSent(true);
      setSuccess('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };



  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      setOtpVerified(true);
      setSuccess('Email verified successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpVerified) {
      setError('Please verify your email before submitting the registration form.');
      return;
    }

    if (!formData.name || !formData.password || !formData.role) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formData);
      if (response.status === 201 || response.status === 200) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
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
                <Card.Title className="text-center mb-4">Create Account</Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Button 
                        variant={otpSent ? "outline-primary" : "primary"}
                        onClick={handleSendOTP} 
                        disabled={!formData.email || loading || otpVerified}
                        className="ms-2"
                      >
                        {loading && !otpVerified ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {otpSent && !otpVerified && (
                    <Form.Group className="mb-3" controlId="formOTP">
                      <Form.Label>Enter OTP</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <Button 
                          variant="success" 
                          onClick={handleVerifyOTP} 
                          disabled={loading || !otp}
                          className="ms-2"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  )}

                  {otpVerified && <Alert variant="success">✅ Email verified</Alert>}

                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUser /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaLock /></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Password must be at least 8 characters and include:
                      <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.2rem' }}>
                        <li>One uppercase letter (A–Z)</li>
                        <li>One lowercase letter (a–z)</li>
                        <li>One number (0–9)</li>
                        <li>One special character (!@#$%^&amp;* etc.)</li>
                      </ul>
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formRole">
                    <Form.Label>Select Role</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUserTag /></InputGroup.Text>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="student">student</option>
                        <option value="organizer">organizer</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
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

export default Register;
