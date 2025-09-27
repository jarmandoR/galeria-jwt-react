// // src/services/authService.ts
// import api from './api';
// import { Preferences } from '@capacitor/preferences';

// // Login con email y password
// export async function login(email: string, password: string) {
//   const response = await api.post('/auth/login', { email, password });
//   const token = response.data.token;

//   // Guardamos el token en Preferences
//   await Preferences.set({
//     key: 'token',
//     value: token,
//   });

//   return token;
// }

// // Obtener perfil del usuario autenticado
// export async function getUserProfile() {
//   const response = await api.get('/user/profile');
//   return response.data;
// }

// // Logout (eliminar token)
// export async function logout() {
//   await Preferences.remove({ key: 'token' });
// }

// src/services/authService.ts
import { Preferences } from '@capacitor/preferences';
import api from './api';

const USE_FAKE_AUTH = true;

let login: (email: string, password: string) => Promise<string>;
let getUserProfile: () => Promise<any>;
let logout: () => Promise<void>;

if (!USE_FAKE_AUTH) {
  // funciones reales
  login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.token;
    await Preferences.set({ key: 'token', value: token });
    return token;
  };

  getUserProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
  };

  logout = async () => {
    await Preferences.remove({ key: 'token' });
  };
} else {
  // funciones falsas
  login = async (email: string, password: string) => {
    if (email === 'test@test.com' && password === '1234') {
      const fakeToken = 'fake-jwt-token-123456';
      await Preferences.set({ key: 'token', value: fakeToken });
      return fakeToken;
    }
    throw new Error('Credenciales inválidas (modo simulado)');
  };

  getUserProfile = async () => {
    return { id: 1, name: 'Usuario Prueba', email: 'test@test.com' };
  };

  logout = async () => {
    await Preferences.remove({ key: 'token' });
  };
}

// exportar siempre al final
export { login, getUserProfile, logout };