import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  MenuBook as BookIcon,
  LocalLibrary as LoanIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatDate } from '../../utils/dateUtils';

interface Statistics {
  usuarios: {
    total: number;
    estudiantes: number;
    profesores: number;
    personal: number;
  };
  libros: {
    total: number;
    ejemplares: number;
  };
  prestamos: {
    activos: number;
    devueltos: number;
    vencidos: number;
  };
}

interface BitacoraEntry {
  idbitacora: number;
  accion: string;
  fechahora: string;
  detalle: string;
  entidad: string;
  usuario_idusuario: number;
}

interface User {
  idusuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: number;
  fecharegistro: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [bitacora, setBitacora] = useState<BitacoraEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      if (tabValue === 0) {
        // Cargar estadísticas
        const response = await api.get('/admin/statistics');
        setStatistics(response.data.data);
      } else if (tabValue === 1) {
        // Cargar usuarios
        const response = await api.get('/admin/users');
        setUsers(response.data.data);
      } else if (tabValue === 2) {
        // Cargar bitácora
        const response = await api.get('/admin/bitacora?limit=50');
        setBitacora(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            🔧 Panel de Administración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona usuarios, libros y monitorea el sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate('/admin/books')}
          sx={{ py: 1.5, px: 3 }}
        >
          Gestionar Libros
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Estadísticas" />
        <Tab label="Usuarios" />
        <Tab label="Bitácora" />
      </Tabs>

      {/* Tab 0: Estadísticas */}
      {tabValue === 0 && statistics && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Usuarios
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <StatCard
              title="Total Usuarios"
              value={statistics.usuarios.total}
              icon={<PeopleIcon fontSize="large" />}
              color="primary"
            />
            <StatCard
              title="Estudiantes"
              value={statistics.usuarios.estudiantes}
              icon={<PeopleIcon fontSize="large" />}
              color="info"
            />
            <StatCard
              title="Profesores"
              value={statistics.usuarios.profesores}
              icon={<PeopleIcon fontSize="large" />}
              color="success"
            />
            <StatCard
              title="Personal"
              value={statistics.usuarios.personal}
              icon={<PeopleIcon fontSize="large" />}
              color="warning"
            />
          </Stack>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Biblioteca
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <StatCard
              title="Total Libros"
              value={statistics.libros.total}
              icon={<BookIcon fontSize="large" />}
              color="secondary"
            />
            <StatCard
              title="Total Ejemplares"
              value={statistics.libros.ejemplares}
              icon={<BookIcon fontSize="large" />}
              color="primary"
            />
          </Stack>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Préstamos
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <StatCard
              title="Activos"
              value={statistics.prestamos.activos}
              icon={<LoanIcon fontSize="large" />}
              color="info"
            />
            <StatCard
              title="Devueltos"
              value={statistics.prestamos.devueltos}
              icon={<LoanIcon fontSize="large" />}
              color="success"
            />
            <StatCard
              title="Vencidos"
              value={statistics.prestamos.vencidos}
              icon={<WarningIcon fontSize="large" />}
              color="error"
            />
          </Stack>
        </Box>
      )}

      {/* Tab 1: Usuarios */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Registro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.idusuario}>
                  <TableCell>{user.idusuario}</TableCell>
                  <TableCell>
                    {user.nombre} {user.apellido}
                  </TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell>{formatDate(user.fecharegistro)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab 2: Bitácora */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bitacora.map((entry) => (
                <TableRow key={entry.idbitacora}>
                  <TableCell>{formatDate(entry.fechahora)}</TableCell>
                  <TableCell>{entry.usuario_idusuario}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.accion}
                      size="small"
                      color={
                        entry.accion === 'CREATE'
                          ? 'success'
                          : entry.accion === 'UPDATE'
                          ? 'info'
                          : entry.accion === 'DELETE'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{entry.entidad}</TableCell>
                  <TableCell>{entry.detalle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
