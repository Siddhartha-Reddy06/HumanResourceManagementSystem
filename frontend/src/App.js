import './App.css';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterOrg from './pages/RegisterOrg';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };
  return (
    <AppBar position="static" elevation={0} color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Human Resource Management System (HRMS)</Typography>
        <Stack direction="row" spacing={1}>
          <Button color="inherit" component={Link} to="/employees">Employees</Button>
          <Button color="inherit" component={Link} to="/teams">Teams</Button>
          {token ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const token = localStorage.getItem('token');
  const theme = createTheme({
    palette: {
      primary: { main: '#1e88e5' },
      secondary: { main: '#673ab7' },
      background: { default: '#f7f9fc' }
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Nav />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterOrg />} />
            <Route path="/employees" element={token ? <Employees /> : <Navigate to="/login" />} />
            <Route path="/teams" element={token ? <Teams /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={token ? '/employees' : '/login'} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
