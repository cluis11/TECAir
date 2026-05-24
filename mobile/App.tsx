import React, { useState } from 'react';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';
import VuelosScreen from './src/screens/VuelosScreen';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  if (pantalla === 'vuelos') {
    return <VuelosScreen />;
  }

  if (pantalla === 'login') {
    return <LoginScreen onRegister={() => setPantalla('registro')} />;
  }

  if (pantalla === 'registro') {
    return <RegistroUsuarioScreen />;
  }

  return (
    <InicioScreen
      onAnonimo={() => setPantalla('vuelos')}
      onLogin={() => setPantalla('login')}
      onRegistro={() => setPantalla('registro')}
    />
  );
}

export default App;