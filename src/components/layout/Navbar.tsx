import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const { usuario, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: 2,
            p: 1,
          }}
        >
          <MenuBookIcon sx={{ color: 'white' }} />
        </Box>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Biblioteca Universitaria
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
              } 
            }}
          >
            Inicio
          </Button>

          <Button 
            color="inherit" 
            onClick={() => navigate('/books')}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
              } 
            }}
          >
            Catálogo
          </Button>

          <Button 
            color="inherit" 
            onClick={() => navigate('/my-loans')}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
              } 
            }}
          >
            Mis Préstamos
          </Button>

          {hasRole('admin') && (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin')}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#818cf8',
                  } 
                }}
              >
                Administración
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin/reports')}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#818cf8',
                  } 
                }}
              >
                Reportes
              </Button>
            </>
          )}

          <Button 
            color="inherit" 
            onClick={() => navigate('/profile')}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
              },
              fontWeight: 600,
            }}
          >
            {usuario?.nombre}
          </Button>

          <Button 
            color="inherit" 
            onClick={handleLogout} 
            startIcon={<LogoutIcon />}
            sx={{ 
              ml: 1,
              '&:hover': { 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
              } 
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
