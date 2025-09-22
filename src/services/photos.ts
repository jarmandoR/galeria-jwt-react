// src/services/photos.ts
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import api from './api';

export const PhotoService = {
  takePhoto: async () => {
    // 1. Abrir cámara
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // devuelve la URI
      source: CameraSource.Camera,      // abrir cámara directamente
      quality: 90,
    });

    // 2. Convertir a blob
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    // 3. Convertir a base64
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () =>
        resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 4. Guardar en Filesystem
    const filename = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Data,
    });

    // 5. Enviar metadata al backend
    await api.post('/photos', { filename });

    // 6. Retornar datos para mostrar en UI
    return { filepath: filename, webviewPath: photo.webPath };
  },
};