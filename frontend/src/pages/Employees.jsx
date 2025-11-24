import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Paper, TextField, Button, Typography, Box, Alert, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (e) {
      setError('Failed to load employees');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/employees/${editing.id}`, form);
      } else {
        await api.post('/employees', form);
      }
      setForm({ first_name: '', last_name: '', email: '', phone: '' });
      setEditing(null);
      await load();
    } catch (e) {
      setError('Save failed');
    }
  };

  const startEdit = (emp) => {
    setEditing(emp);
    setForm({ first_name: emp.first_name || '', last_name: emp.last_name || '', email: emp.email || '', phone: emp.phone || '' });
  };

  const del = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      await load();
    } catch {
      setError('Delete failed');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Employees</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="First Name" value={form.first_name} onChange={(e)=>setForm({ ...form, first_name: e.target.value })} fullWidth />
            <TextField label="Last Name" value={form.last_name} onChange={(e)=>setForm({ ...form, last_name: e.target.value })} fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Email" type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={(e)=>setForm({ ...form, phone: e.target.value })} fullWidth />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">{editing ? 'Update' : 'Add'} Employee</Button>
            {editing && <Button variant="text" type="button" onClick={()=>{ setEditing(null); setForm({ first_name:'', last_name:'', email:'', phone:'' }); }}>Cancel</Button>}
          </Stack>
        </Box>
      </Paper>

      {loading ? (
        <Stack alignItems="center" sx={{ py: 4 }}><CircularProgress /></Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Teams</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{[e.first_name, e.last_name].filter(Boolean).join(' ')}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>{(e.Teams && e.Teams.length) ? e.Teams.map(t => t.name).join(', ') : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={()=>startEdit(e)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={()=>del(e.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
