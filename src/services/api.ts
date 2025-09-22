// src/services/api.ts
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Android emulador -> 10.0.2.2
  // Si pruebas en navegador, cambia a http://localhost:3000/api
});

// Interceptor para adjuntar el token JWT a cada request
api.interceptors.request.use(async (config) => {
  const { value: token } = await Preferences.get({ key: 'token' });

  if (token) {
    // 👇 forma correcta en Axios v1+
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default api;