import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import * as authService from '@/services/authService';

interface IAuthContext {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // Renombrado de 'isAuthLoading' para consistencia
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { data: user, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!token,
    retry: 1,
    // No queremos que vuelva a intentar indefinidamente si el token es malo
    staleTime: Infinity, // No consideres los datos "viejos" hasta que se invaliden
    gcTime: Infinity,    // No limpies los datos de la caché
  });

  const isAuthenticated = !!user && isSuccess && !isError;

  const login = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    // Invalidamos y le damos la oportunidad de que la nueva query se complete
    // antes de navegar.
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    // Forzamos la limpieza de la caché del usuario al hacer logout
    queryClient.setQueryData(['currentUser'], null);
    // invalidamos para asegurar que cualquier componente se re-renderice
    queryClient.invalidateQueries({ queryKey: ['currentUser'] }); 
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
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
}