import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { login } from '../services/authService';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password); // 👈 usa tu función login()
      onLogin(); // avisa a App.tsx que ya está logueado
    } catch (error) {
      console.error(error);
      alert('Error en login');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          placeholder="Correo"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          type="password"
          placeholder="Contraseña"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleLogin}>
          Ingresar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;