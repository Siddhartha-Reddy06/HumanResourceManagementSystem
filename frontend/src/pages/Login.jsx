import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack
} from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
          {/* Example email: admin@acme.test */}
          <TextField label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />
          {/* Example password: Password123! */}
          <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required fullWidth />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" type="submit">Login</Button>
            <Typography variant="body2">New org? <Link to="/register">Register</Link></Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Email: admin@acme.test || Password: Password123!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
