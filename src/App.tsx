import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import Gallery from './pages/Gallery';

import Home from './pages/Home';
import Login from './pages/Login';

/* CSS de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const { value: token } = await Preferences.get({ key: 'token' });
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) {
    // Mientras carga el estado de sesión
    return <div>Cargando...</div>;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {isLoggedIn ? (
            <>
              <Route exact path="/home">
                <Home />
              </Route>
                {/* 👇 Nueva ruta */}
              <Route exact path="/gallery">
                <Gallery />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/login">
                <Login onLogin={() => setIsLoggedIn(true)} />
              </Route>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;