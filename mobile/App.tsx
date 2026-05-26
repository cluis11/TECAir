import React, { useState } from 'react';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';
import VuelosScreen from './src/screens/VuelosScreen';
import ReservasScreen from './src/screens/ReservasScreen';
//import PagoScreen from './src/screens/PagoScreen';
import DescuentosScreen from './src/screens/DescuentosScreen';

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [usuario, setUsuario] = useState<any>(null);
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState<any>(null);

  const volverInicio = () => setPantalla('inicio');

  if (pantalla === 'login') {
    return (
      <LoginScreen
        onRegister={() => setPantalla('registro')}
        onVolver={volverInicio}
        onLogin={(u: any) => {
          setUsuario(u);
          setPantalla('vuelos');
        }}
      />
    );
  }

  if (pantalla === 'registro') {
    return <RegistroUsuarioScreen onVolver={volverInicio} />;
  }

  if (pantalla === 'vuelos') {
    return (
      <VuelosScreen
        usuario={usuario}
        onVolver={volverInicio}
        onSeleccionarVuelo={(resultado: any) => {
          setResultadoSeleccionado(resultado);
          setPantalla('reserva');
        }}
        onVerDescuentos={() => setPantalla('descuentos')}
      />
    );
  }

  if (pantalla === 'descuentos') {
    return (
      <DescuentosScreen
        onVolver={() => setPantalla('vuelos')}
        onSeleccionarVuelo={() => setPantalla('vuelos')}
      />
    );
  }

  if (pantalla === 'reserva') {
    return (
      <ReservasScreen
        resultado={resultadoSeleccionado}
        usuario={usuario}
        onVolver={() => setPantalla('vuelos')}
        onFinalizar={volverInicio}
      />
    );
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