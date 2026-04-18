import { createContext, useContext, ReactNode, useState } from 'react';
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
  //Usamos un 'estado' de React para el token, 
  // para que React sepa al instante cuando me logueo o me deslogueo.
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // isQueryLoading nos dice si la petición a la red está activa
  const { data: user, isLoading: isQueryLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!token,
    retry: 1,
    // Para que no vuelva a intentar indefinidamente si el token es malo
    staleTime: Infinity, // No considera los datos "viejos" hasta que se invaliden
  });

  // Autenticado = Tiene un token en el estado Y el usuario cargó con éxito
  const isAuthenticated = !!token && !!user && isSuccess && !isError;

  // Lógica inteligente de carga para que el guardia de seguridad espere
  const isLoading = isQueryLoading || (!!token && !user && isFetching);

  const login = async (newToken: string) => {
    // 1. Guardamos en el navegador
    localStorage.setItem('authToken', newToken);
    // 2. Le avisamos a React inmediatamente (despierta a useQuery)
    setToken(newToken); 
    
    try {
      // 3. FORZAMOS a que busque y traiga al usuario AHORA MISMO
      // El código se detiene aquí hasta que la API responda.
      await queryClient.fetchQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
      });
      
      // 4. Ahora que ya tenemos los datos seguros en la mano, viajamos al dashboard.
      // El guardia de seguridad ya no nos rebotará.
      navigate('/dashboard');
    } catch (error) {
      console.error("Error crítico al cargar usuario post-login", error);
      logout();
    }
  };

  const logout = () => {
    // Limpiamos navegador
    localStorage.removeItem('authToken');
    // Limpiamos el estado de React (apaga el query)
    setToken(null); 
    // Limpieza profunda de la memoria caché
    queryClient.removeQueries({ queryKey: ['currentUser'] }); 
    
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