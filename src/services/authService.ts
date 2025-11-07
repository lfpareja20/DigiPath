import apiClient from '@/lib/axios';
import { User, AuthResponse, UserUpdatePayload } from '@/types';

// Para el login, usamos un tipo especial porque el backend espera form-data
type LoginCredentials = {
  username: string;
  password: string;
};

// Para el registro, definimos un tipo claro
type RegisterPayload = {
  nombre_empresa: string;
  ruc: string;
  correo_electronico: string;
  contrasena: string;
  acepta_terminos: boolean;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // El backend espera datos de formulario (x-www-form-urlencoded) para el login.
  // Creamos un objeto URLSearchParams para formatearlo correctamente.
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const { data } = await apiClient.post<AuthResponse>('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/register', payload);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
};

export const updateCurrentUser = async (payload: UserUpdatePayload): Promise<User> => {
  const { data } = await apiClient.put<User>('/auth/me', payload);
  return data;
};

export const forgotPassword = async (payload: { email: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/forgot-password', payload);
    return data;
};

export const resetPassword = async (payload: { token: string; new_password: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
};