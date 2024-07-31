import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Email, Lock, Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    login();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      if (response.data.success) {
        const role = response.data.role;
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify({ userId: response.data.userId }));
        localStorage.setItem('token', response.data.accessToken);
        if (role === 'user') {
          setUser({ userId: response.data.userId });
          console.log(user)
          navigate('/user-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card className="shadow-lg border-0 rounded-lg w-full max-w-md">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <LoginIcon className='mr-4' style={{ fontSize: 50, color: '#3a5ccc' }} />
            <h2 className="mt-3 font-weight-bold" style={{ color: '#3a5ccc' }}>Login</h2>
          </div>
          {error && <Alert variant="danger" className="text-center mb-4">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label className="d-flex align-items-center mb-2">
                <Email className="me-2" style={{ color: '#3a5ccc' }} />
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="d-flex align-items-center mb-2">
                <Lock className="me-2" style={{ color: '#3a5ccc' }} />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="py-2"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2 mb-4 text-uppercase font-weight-bold"
              style={{ background: '#3a5ccc', borderColor: '#3a5ccc' }}
            >
              Login
            </Button>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                Not a Member? <a href='/signup' style={{ color: '#3a5ccc' }} className='font-weight-bold text-decoration-none'>Sign Up</a>
              </span>
              <a href="/forgot" style={{ color: '#3a5ccc' }} className="font-weight-bold text-decoration-none">Forgot password?</a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;