import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { bookService } from '../../services/book.service';
import { loanService } from '../../services/loan.service';

interface Book {
  isbn: string;
  titulo: string;
  anio_publicacion: number;
  cantidad: number;
  editorial_nombre?: string;
  autores?: string[];
  disponible: boolean;
}

export default function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      console.log({data})
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadBooks();
      return;
    }

    try {
      setLoading(true);
      const data = await bookService.search(searchTerm);
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Error al buscar libros');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLoan = async (isbn: string, titulo: string) => {
    try {
      await loanService.create(isbn);
      setSuccess(`Préstamo solicitado exitosamente: ${titulo}`);
      loadBooks(); // Recargar para actualizar disponibilidad
    } catch (err: any) {
      setError(err.message || 'Error al solicitar préstamo');
    }
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
          📚 Catálogo de Libros
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora nuestra colección y solicita préstamos
        </Typography>
      </Box>

      <Box 
        display="flex" 
        gap={2} 
        mb={4}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          fullWidth
          label="Buscar por título o autor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{ minWidth: 120 }}
        >
          Buscar
        </Button>
        <Button 
          variant="outlined" 
          onClick={loadBooks}
          sx={{ minWidth: 120 }}
        >
          Ver Todos
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(books) && books.map((book) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.isbn}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: book.disponible 
                    ? 'linear-gradient(90deg, #10b981, #34d399)' 
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  {book.titulo}
                </Typography>
                
                {book.autores && book.autores.length > 0 && (
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', gap: 1 }}>
                    <strong>✍️ Autor(es):</strong> {book.autores.join(', ')}
                  </Typography>
                )}
                
                {book.editorial_nombre && (
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', gap: 1 }}>
                    <strong>🏢 Editorial:</strong> {book.editorial_nombre}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', gap: 1 }}>
                  <strong>📅 Año:</strong> {book.anio_publicacion}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', gap: 1, fontSize: '0.85rem' }}>
                  <strong>📖 ISBN:</strong> {book.isbn}
                </Typography>

                <Box mt={2}>
                  <Chip
                    label={book.disponible ? '✓ Disponible' : '✗ No Disponible'}
                    color={book.disponible ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="medium"
                  variant="contained"
                  disabled={!book.disponible}
                  onClick={() => handleRequestLoan(book.isbn, book.titulo)}
                  fullWidth
                  sx={{ py: 1 }}
                >
                  {book.disponible ? 'Solicitar Préstamo' : 'No Disponible'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(!Array.isArray(books) || books.length === 0) && !loading && (
        <Box 
          textAlign="center" 
          mt={8}
          sx={{
            p: 6,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: 4,
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📭 No se encontraron libros
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros términos de búsqueda
          </Typography>
        </Box>
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
