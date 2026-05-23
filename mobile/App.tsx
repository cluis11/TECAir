import React, { useState } from 'react';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';

function App() {
  const [pantalla, setPantalla] = useState('login');

  if (pantalla === 'registro') {
    return <RegistroUsuarioScreen />;
  }

  return <LoginScreen onRegister={() => setPantalla('registro')} />;
}

export default App;