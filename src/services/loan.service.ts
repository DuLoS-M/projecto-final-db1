import api from './api';

export interface Loan {
  idprestamo: number;
  fechaprestamo: string;
  fechadevolucionprevista: string;
  fechadevolucionreal?: string;
  estado: string;
  usuario_idusuario: number;
}

export const loanService = {
  async getMyLoans(): Promise<Loan[]> {
    const response = await api.get('/prestamos/my-loans');
    return response.data;
  },

  async getAllLoans(): Promise<Loan[]> {
    const response = await api.get('/prestamos');
    return response.data;
  },

  async create(isbn: string): Promise<Loan> {
    const response = await api.post('/prestamos', { isbn });
    return response.data;
  },

  async returnLoan(loanId: number): Promise<void> {
    await api.put(`/prestamos/${loanId}/return`);
  },
};
