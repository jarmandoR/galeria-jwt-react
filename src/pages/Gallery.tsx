// src/pages/Gallery.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
} from '@ionic/react';
import { PhotoService } from '../services/photos';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);

  const takePhoto = async () => {
    try {
      const newPhoto = await PhotoService.takePhoto();
      setPhotos([newPhoto, ...photos]);
    } catch (err) {
      console.error('Error al tomar foto:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galería</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={takePhoto}>
          Tomar Foto
        </IonButton>
        {photos.map((p, idx) => (
          <IonImg key={idx} src={p.webviewPath} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Gallery;