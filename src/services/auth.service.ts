import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData } from '../types';

const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
  },

  // Obtener token actual
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Guardar token
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
};

export default authService;