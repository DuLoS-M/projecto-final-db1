import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import api from '../../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/statistics');
      const stats = response.data.data;

      // Convertir estadísticas a formato tabular
      const data = [
        { categoria: 'Total Usuarios', valor: stats.usuarios.total },
        { categoria: 'Estudiantes', valor: stats.usuarios.estudiantes },
        { categoria: 'Profesores', valor: stats.usuarios.profesores },
        { categoria: 'Personal', valor: stats.usuarios.personal },
        { categoria: 'Total Libros', valor: stats.libros.total },
        { categoria: 'Total Ejemplares', valor: stats.libros.ejemplares },
        { categoria: 'Préstamos Activos', valor: stats.prestamos.activos },
        { categoria: 'Préstamos Devueltos', valor: stats.prestamos.devueltos },
        { categoria: 'Préstamos Vencidos', valor: stats.prestamos.vencidos },
      ];

      exportToCSV(data, 'estadisticas_biblioteca');
      setSuccess('Estadísticas exportadas exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al exportar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/users');
      const users = response.data.data;

      const userData = users.map((user: any) => ({
        ID: user.idusuario,
        Nombre: user.nombre,
        Apellido: user.apellido,
        Correo: user.correo,
        Telefono: user.telefono,
        'Fecha Registro': new Date(user.fecharegistro).toLocaleDateString('es-GT'),
      }));

      exportToCSV(userData, 'usuarios_biblioteca');
      setSuccess('Usuarios exportados exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al exportar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/loans');
      const loans = response.data.data;

      const loanData = loans.map((loan: any) => ({
        ID: loan.idprestamo,
        'ID Usuario': loan.usuario_idusuario,
        'Fecha Préstamo': new Date(loan.fechaprestamo).toLocaleDateString('es-GT'),
        'Devolución Prevista': new Date(loan.fechadevolucionprevista).toLocaleDateString('es-GT'),
        'Devolución Real': loan.fechadevolucionreal
          ? new Date(loan.fechadevolucionreal).toLocaleDateString('es-GT')
          : 'N/A',
        Estado: loan.estado,
      }));

      exportToCSV(loanData, 'prestamos_biblioteca');
      setSuccess('Préstamos exportados exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al exportar préstamos');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBitacora = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/bitacora?limit=1000');
      const bitacora = response.data.data;

      const bitacoraData = bitacora.map((entry: any) => ({
        ID: entry.idbitacora,
        'Fecha/Hora': new Date(entry.fechahora).toLocaleString('es-GT'),
        'ID Usuario': entry.usuario_idusuario,
        Acción: entry.accion,
        Entidad: entry.entidad,
        Detalle: entry.detalle,
      }));

      exportToCSV(bitacoraData, 'bitacora_biblioteca');
      setSuccess('Bitácora exportada exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al exportar bitácora');
    } finally {
      setLoading(false);
    }
  };

  const ReportCard = ({ title, description, icon, onClick, color }: any) => (
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
          background: `linear-gradient(90deg, ${color}[0], ${color}[1])`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}[0], ${color}[1])`,
              borderRadius: 3,
              p: 1.5,
              color: 'white',
              mr: 2,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          startIcon={<DownloadIcon />}
          onClick={onClick}
          disabled={loading}
          sx={{ py: 1 }}
        >
          Exportar CSV
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
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
          📊 Reportes y Exportaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Exporta datos del sistema en formato CSV para análisis
        </Typography>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReportCard
            title="Estadísticas"
            description="Resumen general del sistema"
            icon={<AssessmentIcon fontSize="large" />}
            color={['#6366f1', '#8b5cf6']}
            onClick={handleExportStatistics}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReportCard
            title="Usuarios"
            description="Lista completa de usuarios registrados"
            icon={<TableIcon fontSize="large" />}
            color={['#10b981', '#34d399']}
            onClick={handleExportUsers}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReportCard
            title="Préstamos"
            description="Historial de todos los préstamos"
            icon={<TableIcon fontSize="large" />}
            color={['#3b82f6', '#60a5fa']}
            onClick={handleExportLoans}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReportCard
            title="Bitácora"
            description="Registro de auditoría del sistema"
            icon={<TableIcon fontSize="large" />}
            color={['#f59e0b', '#fbbf24']}
            onClick={handleExportBitacora}
          />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4, p: 3, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 Instrucciones
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            • Los archivos se descargarán en formato CSV compatible con Excel y Google Sheets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Puedes importar estos archivos en Power BI para crear dashboards personalizados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Los archivos incluyen la fecha de exportación en el nombre
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Para análisis avanzados, se recomienda usar Power BI o herramientas similares
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
