import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Paper, TextField, Button, Typography, Box, Alert, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [allEmployees, setAllEmployees] = useState([]);
  const [memberDialog, setMemberDialog] = useState({ open: false, team: null, selectedIds: new Set(), originalIds: new Set() });

  const load = async () => {
    setLoading(true);
    try {
      const [teamsRes, empRes] = await Promise.all([
        api.get('/teams'),
        api.get('/employees')
      ]);
      setTeams(teamsRes.data);
      setAllEmployees(empRes.data);
    } catch (e) {
      setError('Failed to load teams');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/teams/${editing.id}`, form);
      } else {
        await api.post('/teams', form);
      }
      setForm({ name: '', description: '' });
      setEditing(null);
      await load();
    } catch (e) {
      setError('Save failed');
    }
  };

  const startEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name || '', description: t.description || '' });
  };

  const del = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      await api.delete(`/teams/${id}`);
      await load();
    } catch {
      setError('Delete failed');
    }
  };

  const openMembers = (team) => {
    const currentIds = new Set((team.Employees || []).map(e => e.id));
    setMemberDialog({ open: true, team, selectedIds: new Set(currentIds), originalIds: new Set(currentIds) });
  };

  const toggleMember = (empId) => {
    setMemberDialog(prev => {
      const next = new Set(prev.selectedIds);
      if (next.has(empId)) next.delete(empId); else next.add(empId);
      return { ...prev, selectedIds: next };
    });
  };

  const saveMembers = async () => {
    const teamId = memberDialog.team.id;
    const selected = Array.from(memberDialog.selectedIds);
    const original = Array.from(memberDialog.originalIds);
    const toAdd = selected.filter(id => !memberDialog.originalIds.has(id));
    const toRemove = original.filter(id => !memberDialog.selectedIds.has(id));
    try {
      if (toAdd.length) {
        await api.post(`/teams/${teamId}/assign`, { employeeIds: toAdd });
      }
      for (const id of toRemove) {
        await api.delete(`/teams/${teamId}/unassign`, { data: { employeeId: id } });
      }
      setMemberDialog({ open: false, team: null, selectedIds: new Set(), originalIds: new Set() });
      await load();
    } catch (e) {
      alert('Failed to save members');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Teams</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required fullWidth />
          <TextField label="Description" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} fullWidth />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">{editing ? 'Update' : 'Add'} Team</Button>
            {editing && <Button variant="text" type="button" onClick={()=>{ setEditing(null); setForm({ name:'', description:'' }); }}>Cancel</Button>}
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
                <TableCell>Description</TableCell>
                <TableCell>Members</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>
                    {t.Employees && t.Employees.length
                      ? t.Employees.map(e => [e.first_name, e.last_name].filter(Boolean).join(' ') || e.email).join(', ')
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="outlined" onClick={()=>openMembers(t)}>Edit Members</Button>
                      <IconButton size="small" onClick={()=>startEdit(t)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={()=>del(t.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={memberDialog.open} onClose={()=>setMemberDialog({ open:false, team:null, selectedIds:new Set(), originalIds:new Set() })} fullWidth maxWidth="sm">
        <DialogTitle>Edit Members {memberDialog.team ? `— ${memberDialog.team.name}` : ''}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            {allEmployees.map(emp => (
              <FormControlLabel
                key={emp.id}
                control={<Checkbox checked={memberDialog.selectedIds.has(emp.id)} onChange={()=>toggleMember(emp.id)} />}
                label={([emp.first_name, emp.last_name].filter(Boolean).join(' ') || emp.email) + ` (#${emp.id})`}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setMemberDialog({ open:false, team:null, selectedIds:new Set(), originalIds:new Set() })}>Cancel</Button>
          <Button variant="contained" onClick={saveMembers}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
