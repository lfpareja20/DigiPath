import axios from 'axios';

// 1. Obtenemos la URL base de nuestras variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Creamos una instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Este es el "interceptor": una pieza de código que se ejecuta
//    ANTES de que CADA petición sea enviada.
//    Su trabajo es buscar el token en localStorage y añadirlo a la cabecera.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;