import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { register } from '../services/authService';

const Register: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      onRegister();
    } catch (error) {
      console.error(error);
      alert('Error en registro');
    }
  };

  return (
    <IonPage>
      {/* Header */}
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">Crear Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="register-background">
        {/* Tarjeta del formulario */}
        <IonCard className="register-card">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">
              Bienvenido 🚀
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              clearInput
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
            >
              <IonIcon icon={personOutline} slot="start" />
            </IonInput>

            <IonInput
              label="Correo"
              labelPlacement="floating"
              fill="outline"
              clearInput
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              type="email"
              className="ion-margin-top"
            >
              <IonIcon icon={mailOutline} slot="start" />
            </IonInput>

            <IonInput
              label="Contraseña"
              labelPlacement="floating"
              fill="outline"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              type="password"
              className="ion-margin-top"
            >
              <IonIcon icon={lockClosedOutline} slot="start" />
            </IonInput>

            <IonButton
              expand="block"
              shape="round"
              className="ion-margin-top"
              onClick={handleRegister}
            >
              Registrarme
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <style>
        {`
          /* Fondo con gama de azules */
          .register-background {
            --background: linear-gradient(160deg, #1e3c72, #2a5298, #4facfe);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* Tarjeta centrada */
          .register-card {
            width: 100%;
            max-width: 400px;
            border-radius: 18px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            margin: 0 auto;
            background: #ffffff;
          }

          ion-input {
            margin-top: 12px;
          }

          ion-button {
            --background: #2a5298;
            --background-activated: #1e3c72;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Register;
