import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { bookService } from '../../services/book.service';
import type { Book } from '../../services/book.service';

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({
    isbn: '',
    titulo: '',
    anio_publicacion: new Date().getFullYear(),
    cantidad: 1,
    editorial_id: 1,
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditMode(true);
      setCurrentBook(book);
    } else {
      setEditMode(false);
      setCurrentBook({
        isbn: '',
        titulo: '',
        anio_publicacion: new Date().getFullYear(),
        cantidad: 1,
        editorial_id: 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBook({
      isbn: '',
      titulo: '',
      anio_publicacion: new Date().getFullYear(),
      cantidad: 1,
      editorial_id: 1,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentBook({
      ...currentBook,
      [name]: name === 'anio_publicacion' || name === 'cantidad' || name === 'editorial_id'
        ? parseInt(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editMode) {
        await bookService.update(currentBook.isbn!, currentBook);
        setSuccess('Libro actualizado exitosamente');
      } else {
        await bookService.create(currentBook);
        setSuccess('Libro creado exitosamente');
      }
      handleCloseDialog();
      loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar libro');
    }
  };

  const handleDelete = async (isbn: string, titulo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      return;
    }

    try {
      await bookService.delete(isbn);
      setSuccess('Libro eliminado exitosamente');
      loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar libro');
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
            📚 Gestión de Libros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra el catálogo de la biblioteca
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ py: 1.5, px: 3 }}
        >
          Agregar Libro
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
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  {book.titulo}
                </Typography>

                {book.autores && book.autores.length > 0 && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>✍️ Autor(es):</strong> {book.autores.join(', ')}
                  </Typography>
                )}

                {book.editorial_nombre && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>🏢 Editorial:</strong> {book.editorial_nombre}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>📅 Año:</strong> {book.anio_publicacion}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>📦 Cantidad:</strong> {book.cantidad}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: '0.85rem' }}
                >
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

              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(book)}
                  fullWidth
                >
                  Editar
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(book.isbn, book.titulo)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
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
            📭 No hay libros en el catálogo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando libros con el botón "Agregar Libro"
          </Typography>
        </Box>
      )}

      {/* Dialog para Crear/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Libro' : 'Agregar Nuevo Libro'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="ISBN"
              name="isbn"
              value={currentBook.isbn}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              disabled={editMode}
              helperText={editMode ? 'El ISBN no puede ser modificado' : ''}
            />
            <TextField
              label="Título"
              name="titulo"
              value={currentBook.titulo}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Año de Publicación"
              name="anio_publicacion"
              type="number"
              value={currentBook.anio_publicacion}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cantidad de Ejemplares"
              name="cantidad"
              type="number"
              value={currentBook.cantidad}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <TextField
              label="ID de Editorial"
              name="editorial_id"
              type="number"
              value={currentBook.editorial_id}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
