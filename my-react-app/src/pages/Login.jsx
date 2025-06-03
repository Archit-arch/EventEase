import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
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
/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData); // update URL as needed

      if (response.status === 200) {
        setSuccess(response.data.message);

        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));

        const userRole = user.role;
        setTimeout(() => {
          if (userRole === 'student') {
            navigate('/studentDashboard');
          } else if (userRole === 'organizer') {
            navigate('/eventManager');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };
*/

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', formData); // Update URL as needed

    if (response.status === 200) {
      setSuccess(response.data.message);

      const { user, token } = response.data;

      // Store user info and JWT token
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      const userRole = user.role;


      setTimeout(() => {
        if (userRole === 'student') {
          navigate('/studentDashboard', {replace: true});
        } else if (userRole === 'organizer') {
          navigate('/eventManager', { replace: true });
        } else if (userRole === 'admin') {
          navigate('/adminDashboard', { replace: true });
        }
          else {
          navigate('/');
        }
      }, 500);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Login
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
