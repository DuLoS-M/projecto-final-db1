import api from './api';
import type { Prestamo } from '../types';

export const loanService = {
  async getMyLoans(): Promise<Prestamo[]> {
    const response = await api.get('/loans/my-loans');
    return response.data.data || response.data;
  },

  async getAllLoans(): Promise<Prestamo[]> {
    const response = await api.get('/admin/loans');
    return response.data.data || response.data;
  },

  async create(isbn: string): Promise<Prestamo> {
    const response = await api.post('/loans', { isbn });
    return response.data.data || response.data;
  },

  async returnLoan(loanId: number): Promise<void> {
    await api.put(`/loans/${loanId}/return`);
  },
};
