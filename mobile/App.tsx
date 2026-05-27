import React, { useState } from 'react';
import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LogInScreen';
import RegistroUsuarioScreen from './src/screens/Userscreen';
import VuelosScreen from './src/screens/VuelosScreen';
import ReservaScreen from './src/screens/ReservasScreen';
import DescuentosScreen from './src/screens/DescuentosScreen';
import PagoScreen from './src/screens/PagoScreen';  // 🌟 Importamos Pago
import PerfilScreen from './src/screens/PerfilScreen'; // 🌟 Importamos Perfil

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [usuario, setUsuario] = useState<any>(null);
  const [resultadoVuelo, setResultadoVuelo] = useState<any>(null);
  const [pasajerosGuardados, setPasajerosGuardados] = useState<any>([]); // Para mover de reserva a pago
  const [promoSeleccionada, setPromoSeleccionada] = useState<any>(null);

  if (pantalla === 'login') {
    return (
      <LoginScreen
        onRegister={() => setPantalla('registro')}
        onLogin={(u) => { setUsuario(u); setPantalla('vuelos'); }}
      />
    );
  }

  if (pantalla === 'registro') {
    return (
      <RegistroUsuarioScreen
        onVolver={() => setPantalla('inicio')}
      />
    );
  }

  if (pantalla === 'vuelos') {
    return (
      <VuelosScreen
        usuario={usuario}
        promoPreRellenada={promoSeleccionada} 
        onVolver={() => {
          setPromoSeleccionada(null);
          setPantalla('inicio');
        }}
        onSeleccionarVuelo={(resultado) => {
          setResultadoVuelo(resultado);
          setPantalla('reserva'); 
        }}
        onVerDescuentos={() => setPantalla('descuentos')}
        // Permitir al usuario saltar a ver su perfil desde el buscador
        onVerPerfil={() => setPantalla('perfil')} 
      />
    );
  }

  if (pantalla === 'reserva') {
    return (
      <ReservaScreen
        resultado={resultadoVuelo}
        usuario={usuario}
        onVolver={() => setPantalla('vuelos')}
        // Modificado: Al confirmar los pasajeros, guardamos la lista y avanzamos al pago
        onFinalizar={(pasajerosRegistrados) => {
          setPasajerosGuardados(pasajerosRegistrados);
          setPantalla('pago');
        }}
      />
    );
  }

  // PAGO
  if (pantalla === 'pago') {
    return (
      <PagoScreen
        resultado={resultadoVuelo}
        pasajeros={pasajerosGuardados}
        usuario={usuario}
        onVolver={() => setPantalla('reserva')}
        onFinalizar={() => {
          setResultadoVuelo(null);
          setPasajerosGuardados([]);
          setPromoSeleccionada(null);
          setPantalla('vuelos'); // Reinicia el ciclo feliz
        }}
      />
    );
  }

  // PERFIL
  if (pantalla === 'perfil') {
    return (
      <PerfilScreen
        usuario={usuario}
        onActualizarUsuario={(usuarioActualizado) => setUsuario(usuarioActualizado)}
        onVolver={() => setPantalla('vuelos')}
      />
    );
  }

  if (pantalla === 'descuentos') {
    return (
      <DescuentosScreen
        onVolver={() => setPantalla('vuelos')}
        onSeleccionarVuelo={(promo) => {
          setPromoSeleccionada(promo);
          setPantalla('vuelos');
        }}
      />
    );
  }

  return (
    <InicioScreen
      onAnonimo={() => { setUsuario(null); setPantalla('vuelos'); }}
      onLogin={() => setPantalla('login')}
      onRegistro={() => setPantalla('registro')}
    />
  );
}

export default App;