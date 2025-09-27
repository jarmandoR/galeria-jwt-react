// src/services/authService.ts
import api from './api';
import { Preferences } from '@capacitor/preferences';

// Login con email y password
export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const token = response.data.token;

  // Guardamos el token en Preferences
  await Preferences.set({
    key: 'token',
    value: token,
  });

  return token;
}

// Obtener perfil del usuario autenticado
export async function getUserProfile() {
  const response = await api.get('/user/profile');
  return response.data;
}

// Logout (eliminar token)
export async function logout() {
  await Preferences.remove({ key: 'token' });
}

// Registro de nuevo usuario
export async function register(name: string, email: string, password: string) {
  const response = await api.post('/auth/register', { name, email, password });
  const token = response.data.token;

  // Igual que login: guardamos el token para no pedir login de nuevo
  await Preferences.set({
    key: 'token',
    value: token,
  });

  return token;
}
