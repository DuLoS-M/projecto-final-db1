import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { loanService } from '../../services/loan.service';
import { formatDate, isPastDate } from '../../utils/dateUtils';
import type { Prestamo } from '../../types';

export default function MyLoans() {
  const [loans, setLoans] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await loanService.getMyLoans();
      setLoans(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar préstamos');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      await loanService.returnLoan(loanId);
      setSuccess('Libro devuelto exitosamente');
      loadLoans();
    } catch (err: any) {
      setError(err.message || 'Error al devolver libro');
    }
  };

  const getStatusChip = (loan: Prestamo) => {
    if (loan.estado === 'DEVUELTO') {
      return <Chip label="Devuelto" color="success" size="small" />;
    }
    if (isPastDate(loan.fecha_devolucion_prevista) && loan.estado === 'ACTIVO') {
      return <Chip label="Vencido" color="error" size="small" />;
    }
    return <Chip label="Activo" color="primary" size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

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
          📖 Mis Préstamos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra tus préstamos activos y revisa tu historial
        </Typography>
      </Box>

      {(!Array.isArray(loans) || loans.length === 0) ? (
        <Box 
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: 4,
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📚 No tienes préstamos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explora el catálogo y solicita tu primer libro
          </Typography>
        </Box>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha Préstamo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Devolución Prevista</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Devolución Real</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(loans) && loans.map((loan) => {
                const isLoanOverdue = isPastDate(loan.fecha_devolucion_prevista) && loan.estado === 'ACTIVO';
                return (
                <TableRow
                  key={loan.id_prestamo}
                  sx={{
                    backgroundColor: isLoanOverdue ? 'rgba(239, 68, 68, 0.1)' : 'inherit',
                    '&:hover': {
                      backgroundColor: isLoanOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.05)',
                    },
                  }}
                >
                  <TableCell>#{loan.id_prestamo}</TableCell>
                  <TableCell>{formatDate(loan.fecha_prestamo)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isLoanOverdue && <span>⚠️</span>}
                      {formatDate(loan.fecha_devolucion_prevista)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {loan.fecha_devolucion_real
                      ? formatDate(loan.fecha_devolucion_real)
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusChip(loan)}</TableCell>
                  <TableCell>
                    {loan.estado === 'ACTIVO' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleReturn(loan.id_prestamo)}
                        sx={{ py: 0.5 }}
                      >
                        Devolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
