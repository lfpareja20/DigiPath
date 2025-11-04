// Este servicio maneja todo lo relacionado con autenticación y usuarios.

import apiClient from '@/lib/axios';
import { User, AuthResponse } from '@/types';

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