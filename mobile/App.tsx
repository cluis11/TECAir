import React, { useState } from 'react';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';
import VuelosScreen from './src/screens/VuelosScreen';
import ReservasScreen from './src/screens/ReservasScreen';
import PagoScreen from './src/screens/PagoScreen';
import DescuentosScreen from './src/screens/DescuentosScreen';

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [usuario, setUsuario] = useState<any>({
    nombre: 'Ariel Saborío',
    correo: 'ariel@tecair.com',
    password: '1234',
  });

  const volverInicio = () => setPantalla('inicio');

  if (pantalla === 'vuelos') {
    return (
      <VuelosScreen
        usuario={usuario}
        onVolver={volverInicio}
        onSeleccionarVuelo={(vuelo: any) => {
          setVueloSeleccionado(vuelo);
          setPantalla('reserva');
        }}
        onVerDescuentos={() => setPantalla('descuentos')}
      />
    );
  }

  if (pantalla === 'descuentos') {
    return <DescuentosScreen onVolver={() => setPantalla('vuelos')} />;
  }

  if (pantalla === 'reserva') {
    return (
      <ReservasScreen
        vuelo={vueloSeleccionado}
        onVolver={() => setPantalla('vuelos')}
        onContinuarPago={(datosReserva: any) => {
          setReserva(datosReserva);
          setPantalla('pago');
        }}
      />
    );
  }

  if (pantalla === 'pago') {
    return (
      <PagoScreen
        reserva={reserva}
        onVolver={() => setPantalla('reserva')}
        onFinalizar={volverInicio}
      />
    );
  }

  if (pantalla === 'login') {
    return (
      <LoginScreen
        usuario={usuario}
        onVolver={volverInicio}
        onRegister={() => setPantalla('registro')}
        onLogin={(usuarioLogin: any) => {
          setUsuario(usuarioLogin);
          setPantalla('vuelos');
        }}
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