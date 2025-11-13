import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import authService from '../services/auth.service';

interface AuthContextType {
  usuario: Usuario | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, usuario: Usuario, roles: string[]) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const token = authService.getToken();
    if (token) {
      // Aquí podrías validar el token con el backend
      // Por ahora, solo verificamos que exista
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, usuario: Usuario, roles: string[]) => {
    authService.setToken(token);
    setUsuario(usuario);
    setRoles(roles);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setRoles([]);
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role) || roles.includes('admin');
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        roles,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
