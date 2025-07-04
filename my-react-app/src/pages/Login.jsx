import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import api from '../api/axios'; // axios instance with withCredentials:true
import axios from 'axios'; 

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    // Step 0: Force logout to clear any previous session
    // await api.get('/auth/logout');  // <-- Add this line

    // Step 1: Login request
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      formData,
      { withCredentials: true },
    );

    // Step 2: Verify token using cookie
    const verifyRes = await api.get('/auth/verify');
    const user = verifyRes.data.user;
    console.log('User from verify:', user);

    setSuccess(response.data.message || 'Login is successful, Proceed');

    setTimeout(() => {
      if (user?.role === 'student') {
        navigate('/studentDashboard', { replace: true });
      } else if (user?.role === 'organizer') {
        navigate('/eventManager', { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/adminDashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 1000);

  } catch (err) {
    console.error('Login error:', err);
    setError(err.response?.data?.error || 'Login Failed. Please Try Again');
  }
};



  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundImage: 'url("/images/event-1.jpg")',
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
                <Card.Title className="text-center mb-4">Login</Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formPassword">
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
                        type="button"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Log in
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-100 mt-3"
                    onClick={() => {
                      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
                    }}
                  >
                    Sign in with Google
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

export default Login;
//