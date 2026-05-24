import React, { useState } from 'react';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';
import VuelosScreen from './src/screens/VuelosScreen';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  const volverInicio = () => {
  console.log('Cambiando a inicio');
  setPantalla('inicio');
  };

  if (pantalla === 'vuelos') {
    return <VuelosScreen onVolver={volverInicio} />;
  }

  if (pantalla === 'login') {
    return (
      <LoginScreen
        onVolver={volverInicio}
        onRegister={() => setPantalla('registro')}
      />
    );
  }

  if (pantalla === 'registro') {
    return <RegistroUsuarioScreen onVolver={volverInicio} />;
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