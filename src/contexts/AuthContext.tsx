import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import * as authService from '@/services/authService';

interface IAuthContext {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Obtenemos el token directamente. Es síncrono.
  const token = localStorage.getItem('authToken');

  // Usamos useQuery para obtener y gestionar el estado del usuario.
  // TanStack Query se encargará de volver a llamar a esta función cuando se lo pidamos.
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'], // <--- Esta es la clave que invalidaremos
    queryFn: authService.getCurrentUser,
    enabled: !!token, // Solo ejecuta esta consulta SI hay un token.
    retry: 1, // Intentar solo una vez si falla
  });

  // El usuario está autenticado si no hay error y tenemos datos de usuario.
  const isAuthenticated = !isError && !!user;

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    // En lugar de llamar a la API aquí, le decimos a TanStack Query que la consulta 'currentUser'
    // está "sucia" y debe volver a ejecutarse.
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    // Limpiamos la caché de TanStack Query para el usuario.
    queryClient.setQueryData(['currentUser'], null);
    navigate('/login');
  };
  
  const value = { 
    isAuthenticated, 
    user: user || null, 
    isLoading, 
    login, 
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};