import { Box, Typography, Container, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MenuBook as BookIcon,
  LocalLibrary as LoanIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const Home = () => {
  const { usuario, hasRole } = useAuth();
  const navigate = useNavigate();

  const QuickAccessCard = ({ title, description, icon, onClick, color }: any) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer', 
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}.main, ${color}.light)`,
        }
      }} 
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}.main, ${color}.light)`,
              borderRadius: 3,
              p: 1.5,
              color: 'white',
              mr: 2,
              boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3)`,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Bienvenido, {usuario?.nombre}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
          Sistema de Gestión de Biblioteca Universitaria
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Explora nuestro catálogo de libros, gestiona tus préstamos y mantente al día con tus devoluciones.
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
        Acceso Rápido
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <QuickAccessCard
          title="Catálogo de Libros"
          description="Explora y busca libros en nuestra colección"
          icon={<BookIcon fontSize="large" />}
          color="primary"
          onClick={() => navigate('/books')}
        />
        <QuickAccessCard
          title="Mis Préstamos"
          description="Revisa tus préstamos activos y historial"
          icon={<LoanIcon fontSize="large" />}
          color="success"
          onClick={() => navigate('/my-loans')}
        />
        {hasRole('admin') && (
          <QuickAccessCard
            title="Panel de Admin"
            description="Administra usuarios, libros y estadísticas"
            icon={<AdminIcon fontSize="large" />}
            color="error"
            onClick={() => navigate('/admin')}
          />
        )}
      </Stack>

      <Card 
        sx={{ 
          mt: 4, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>�</span> ¿Sabías que...?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Puedes tener hasta 3 libros prestados simultáneamente. El período de préstamo es de 15 días
            y puedes renovar tus préstamos si no hay reservas pendientes.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
