import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import * as authService from '@/services/authService';

// Definimos la forma del contexto
interface IAuthContext {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Creamos el contexto
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Creamos el proveedor del contexto, que envolverá nuestra aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Empezamos cargando

  // Hook de efecto: Se ejecuta UNA VEZ cuando la aplicación carga.
  // Su trabajo es verificar si ya existe un token en el navegador.
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Si hay token, llamamos al endpoint /me para obtener los datos del usuario
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Si el token es inválido o expiró, lo limpiamos
          console.error("Fallo al validar el token:", error);
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
      // Terminamos la carga inicial
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Función de Login: se llamará desde la página de Login
  const login = async (token: string) => {
    // Guardamos el token en el almacenamiento local del navegador
    localStorage.setItem('authToken', token);
    // Volvemos a llamar a /me para asegurar que tenemos los datos del usuario actualizados
    const userData = await authService.getCurrentUser();
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función de Logout: se llamará desde el botón de "Cerrar Sesión"
  const logout = () => {
    // Limpiamos todo
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto fácilmente en otros componentes
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};