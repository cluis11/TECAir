import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaArrowRight, FaRoute } from 'react-icons/fa';
import './check-in.css';

const CheckInPasajeros = () => {
  const navigate = useNavigate();
  const [codigoReserva, setCodigoReserva] = useState('');
  const [reservaEncontrada, setReservaEncontrada] = useState(null);
  const [listaPasajeros, setListaPasajeros] = useState([]);

  const handleBuscarReserva = (e) => {
    e.preventDefault();
    
    // RESERVA PRUEBA
    if (codigoReserva.trim().toUpperCase() === "FLY123") {
      const infoReserva = {
        vuelo: 'AT-402',
        origen: 'San José (SJO)',
        destino: 'Madrid (MAD)',
        tieneEscala: true,
        escalas: 'Bogotá (BOG)', // NO ESTOY SEGURA DE COMO MANEJAR ESCALAS
        puerta: 'Gate 4B',
        horaSalida: '14:30',
        cantPasajerosComprados: 1 // CANTIDAD DE PASAJEROS COMPRADOS EN LA RESERVA
      };
      
      setReservaEncontrada(infoReserva);
      
      // Creamos los espacios para pasajeros
      const espaciosVacios = Array.from({ length: infoReserva.cantPasajerosComprados }, () => ({
        nombreCompleto: '',
        pasaporte: ''
      }));
      setListaPasajeros(espaciosVacios);
    } else {
      alert("Código de reserva inválido. ");
    }
  };

  // Manejar los cambios en los inputs dinámicos de los pasajeros
  const handlePasajeroChange = (index, campo, valor) => {
    const nuevosPasajeros = [...listaPasajeros];
    nuevosPasajeros[index][campo] = valor;
    setListaPasajeros(nuevosPasajeros);
  };

  const handleProcederAAsientos = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos de texto estén llenos
    const incompletos = listaPasajeros.some(p => !p.nombreCompleto.trim() || !p.pasaporte.trim());
    if (incompletos) {
      alert("Por favor complete los datos de identificación de todos los pasajeros.");
      return;
    }

    // Pasamos al seleccion de asientos con la reserva
    navigate('/check-in/asientos', { 
      state: { 
        reserva: {
          ...reservaEncontrada,
          pasajeros: listaPasajeros
        } 
      } 
    });
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '650px', margin: 'auto' }}>
      <div className="form-container">
        <h2>Ingrese el Código de Reserva para el Registro de Pasajeros</h2>
        
        <form onSubmit={handleBuscarReserva} className="mb-4">
          <div className="input-field">
            <label>Código de Reserva (PNR)</label>
            <input 
              type="text" 
              placeholder="Ingrese código (Ej: FLY123)" 
              value={codigoReserva}
              onChange={(e) => setCodigoReserva(e.target.value)}
              disabled={reservaEncontrada !== null}
              required 
            />
          </div>
          {!reservaEncontrada && <button type="submit" className="btn-save mt-2">Verificar Itinerario</button>}
        </form>

        {reservaEncontrada && (
          <div className="animate-fade-in">

            {/* Detalles de Reserva */}
            <div className="p-3 bg-white text-dark rounded mb-4 border border-primary">
              <h4 className="fs-6 text-uppercase text-primary fw-bold mb-2"><FaRoute /> Detalles de Ruta</h4>
              <p className="mb-1"><strong>Vuelo:</strong> {reservaEncontrada.vuelo} | {reservaEncontrada.origen} → {reservaEncontrada.destino}</p>
              <p className="mb-1"><strong>Horario:</strong> Salida {reservaEncontrada.horaSalida} desde {reservaEncontrada.puerta}</p>
              <p className="mb-0">
                <strong> Escala:</strong> {reservaEncontrada.tieneEscala ? (
                  <span className="badge bg-warning text-dark"> {reservaEncontrada.escalas}</span>
                ) : (
                  <span className="badge bg-success">Directo (Sin Escalas)</span>
                )}
              </p>
            </div>

            {/* Formulario para registrar pasajeros */}
            <form onSubmit={handleProcederAAsientos}>
              <h4 style={{ color: '#0d6efd' }} className="mb-3"><FaUserPlus /> Datos de Identificación:</h4>
              
              {listaPasajeros.map((pasajero, idx) => (
                <div key={idx} className="p-3 bg-light text-dark rounded mb-3 border">
                  <h5 className="fs-6 fw-bold text-secondary mb-2">Pasajero N° {idx + 1}</h5>
                  <div className="row g-2">
                    <div className="col-12 col-md-7">
                      <label className="small fw-semibold text-muted">Nombre Completo </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: Juan Pérez Mora"
                        value={pasajero.nombreCompleto}
                        onChange={(e) => handlePasajeroChange(idx, 'nombreCompleto', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-5">
                      <label className="small fw-semibold text-muted">Número de Pasaporte </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: EXP12345"
                        value={pasajero.pasaporte}
                        onChange={(e) => handlePasajeroChange(idx, 'pasaporte', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="submit" className="btn-save w-100 mt-2" style={{ backgroundColor: '#0d6efd' }}>
                Selección de Asientos <FaArrowRight />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInPasajeros;