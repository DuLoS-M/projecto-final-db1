import api from './api';

export interface Book {
  isbn: string;
  titulo: string;
  anio_publicacion: number;
  cantidad: number;
  editorial_id: number;
  editorial_nombre?: string;
  autores?: string[];
  disponible: boolean;
}

export const bookService = {
  async getAll(): Promise<Book[]> {
    const response = await api.get('/books');
    return response.data.data || response.data;
  },

  async getByISBN(isbn: string): Promise<Book> {
    const response = await api.get(`/books/${isbn}`);
    return response.data.data || response.data;
  },

  async search(term: string): Promise<Book[]> {
    const response = await api.get(`/books?q=${encodeURIComponent(term)}`);
    return response.data.data || response.data;
  },

  async create(book: Partial<Book>): Promise<Book> {
    const response = await api.post('/admin/books', book);
    return response.data.data || response.data;
  },

  async update(isbn: string, book: Partial<Book>): Promise<Book> {
    const response = await api.put(`/admin/books/${isbn}`, book);
    return response.data.data || response.data;
  },

  async delete(isbn: string): Promise<void> {
    await api.delete(`/admin/books/${isbn}`);
  },
};
