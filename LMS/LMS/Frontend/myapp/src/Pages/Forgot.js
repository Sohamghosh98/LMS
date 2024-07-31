import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { LockReset, Email } from '@mui/icons-material';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f5fd',
    },
  },
});

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/auth/verify-email', { email });
            if (response.data.success) {
                setEmailVerified(true);
                setMessage('');
            } else {
                setMessage('Email not found.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/auth/reset-password', { email, newPassword });
            setMessage(response.data.message);
            if (response.data.success)
                navigate("/login");
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                }}
            >
                <Container maxWidth="xs">
                    <Paper 
                        elevation={6} 
                        sx={{ 
                            padding: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        <Typography component="h1" variant="h4" gutterBottom color="primary" fontWeight="bold">
                            Forgot Password
                        </Typography>
                        {!emailVerified ? (
                            <Box component="form" onSubmit={handleEmailSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Email />}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </Button>
                            </Box>
                        ) : (
                            <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    id="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    variant="outlined"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LockReset />}
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </Box>
                        )}
                        {message && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Forgot;