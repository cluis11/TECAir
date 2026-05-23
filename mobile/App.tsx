import React, { useState } from 'react';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';

function App() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState(null);

  if (pantalla === 'registro') {
    return <RegistroUsuarioScreen onRegistroExitoso={() => setPantalla('login')} />;
  }

  return (
    <LoginScreen
      onRegister={() => setPantalla('registro')}
      onLoginExitoso={(u) => {
        setUsuario(u);
        setPantalla('home'); // cambiar esto por la pantalla principal cuando se tenga
      }}
    />
  );
}

export default App;