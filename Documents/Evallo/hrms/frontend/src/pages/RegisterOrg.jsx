import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Stack } from '@mui/material';

export default function RegisterOrg() {
  const [orgName, setOrgName] = useState('Acme Inc');
  const [adminName, setAdminName] = useState('Admin');
  const [email, setEmail] = useState('admin@acme.test');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { orgName, adminName, email, password });
      localStorage.setItem('token', data.token);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Register Organisation</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Organisation Name" value={orgName} onChange={(e)=>setOrgName(e.target.value)} required fullWidth />
          <TextField label="Admin Name" value={adminName} onChange={(e)=>setAdminName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required fullWidth />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">Create</Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
