import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaArrowRight, FaRoute, FaSearch } from 'react-icons/fa';
import './check-in.css';

const API_BASE = process.env.REACT_APP_API_URL;

const CheckInPasajeros = () => {
  const navigate = useNavigate();
  const [codigoReserva, setCodigoReserva] = useState('');
  const [reservaEncontrada, setReservaEncontrada] = useState(null);
  const [listaPasajeros, setListaPasajeros] = useState([]);
  const [tramoSeleccionado, setTramoSeleccionado] = useState(0);

  const handleBuscarReserva = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/checkin/reserva/${codigoReserva.trim()}`);

      if (res.status === 404) {
        alert('Código de reserva inválido o no encontrado.');
        return;
      }
      if (!res.ok) {
        alert('Ocurrió un error inesperado. Intente de nuevo.');
        return;
      }

      const data = await res.json();

      if (!data.boletos || data.boletos.length === 0) {
        alert('Esta reserva no tiene boletos pendientes de check-in.');
        return;
      }

      // Agrupar boletos por pasajero
      const pasajerosMap = {};
      for (const boleto of data.boletos) {
        if (!pasajerosMap[boleto.pasaporte]) {
          pasajerosMap[boleto.pasaporte] = {
            pasaporte: boleto.pasaporte,
            nombreCompleto: boleto.nombrePasajero,
            boletos: []
          };
        }
        pasajerosMap[boleto.pasaporte].boletos.push(boleto);
      }
      const pasajeros = Object.values(pasajerosMap);

      // Construir info de ruta desde boletos del primer pasajero ordenados por salida
      const boletosOrdenados = [...pasajeros[0].boletos].sort(
        (a, b) => a.salida > b.salida ? 1 : -1
      );

      const origen = boletosOrdenados[0].ciudadOrigen;
      const destino = boletosOrdenados[boletosOrdenados.length - 1].ciudadDestino;
      const horaSalida = boletosOrdenados[0].salida?.toString().substring(0, 5);
      const puerta = boletosOrdenados[0].puertaEmbarque;

      // Escalas: destinos intermedios
      const escalas = boletosOrdenados.slice(0, -1).map(b => b.ciudadDestino);

      const infoReserva = {
        idReserva: data.idReserva,
        origen,
        destino,
        horaSalida,
        puerta,
        tieneEscala: escalas.length > 0,
        escalas: escalas.join(' · '),
        cantPasajerosComprados: pasajeros.length,
        boletosOriginales: data.boletos
      };

      setReservaEncontrada(infoReserva);
      setListaPasajeros(pasajeros);
      setTramoSeleccionado(0);

    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const handleNuevaReserva = () => {
    setCodigoReserva('');
    setReservaEncontrada(null);
    setListaPasajeros([]);
    setTramoSeleccionado(0);
  };

  const handleProcederAAsientos = (e) => {
    e.preventDefault();
    navigate('/check-in/asientos', {
      state: {
        reserva: {
          ...reservaEncontrada,
          pasajeros: listaPasajeros,
          tramoIndex: tramoSeleccionado
        }
      }
    });
  };

  // Tramos del primer pasajero ordenados por salida
  const tramos = listaPasajeros[0]?.boletos
    ?.sort((a, b) => a.salida > b.salida ? 1 : -1) || [];

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '650px', margin: 'auto' }}>
      <div className="form-container">
        <h2>Ingrese el Código de Reserva para el Registro de Pasajeros</h2>

        <form onSubmit={handleBuscarReserva} className="mb-4">
          <div className="input-field">
            <label>Código de Reserva (PNR)</label>
            <input
              type="text"
              placeholder="Ingrese el número de reserva (Ej: 12)"
              value={codigoReserva}
              onChange={(e) => setCodigoReserva(e.target.value)}
              disabled={reservaEncontrada !== null}
              required
            />
          </div>
          {!reservaEncontrada && (
            <button type="submit" className="btn-save mt-2">
              Verificar Itinerario
            </button>
          )}
        </form>

        {reservaEncontrada && (
          <div className="animate-fade-in">

            {/* Botón buscar otra reserva */}
            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                onClick={handleNuevaReserva}
              >
                <FaSearch /> Buscar otra reserva
              </button>
            </div>

            {/* Detalles de Reserva */}
            <div className="p-3 bg-white text-dark rounded mb-4 border border-primary">
              <h4 className="fs-6 text-uppercase text-primary fw-bold mb-2"><FaRoute /> Detalles de Ruta</h4>
              <p className="mb-1">
                <strong>Reserva #{reservaEncontrada.idReserva}</strong> | {reservaEncontrada.origen} → {reservaEncontrada.destino}
              </p>
              <p className="mb-1">
                <strong>Horario:</strong> Salida {reservaEncontrada.horaSalida} desde {reservaEncontrada.puerta}
              </p>
              <p className="mb-0">
                <strong>Escala:</strong> {reservaEncontrada.tieneEscala ? (
                  <span className="badge bg-warning text-dark"> {reservaEncontrada.escalas}</span>
                ) : (
                  <span className="badge bg-success">Directo (Sin Escalas)</span>
                )}
              </p>
            </div>

            <form onSubmit={handleProcederAAsientos}>

              {/* Selector de tramo — solo si hay más de uno */}
              {tramos.length > 1 && (
                <div className="mb-4">
                  <div className="input-field">
                    <label>Tramo a realizar Check-in</label>
                    <select
                      className="form-select border-primary fw-semibold"
                      value={tramoSeleccionado}
                      onChange={e => setTramoSeleccionado(Number(e.target.value))}
                    >
                      {tramos.map((t, i) => (
                        <option key={t.idItinerario} value={i}>
                          {t.ciudadOrigen} → {t.ciudadDestino} · Salida {t.salida?.toString().substring(0, 5)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Lista de pasajeros */}
              <h4 style={{ color: '#0d6efd' }} className="mb-3"><FaUserPlus /> Pasajeros:</h4>

              {listaPasajeros.map((pasajero, idx) => (
                <div key={idx} className="p-3 bg-light text-dark rounded mb-3 border">
                  <h5 className="fs-6 fw-bold text-secondary mb-2">Pasajero N° {idx + 1}</h5>
                  <div className="row g-2">
                    <div className="col-12 col-md-7">
                      <label className="small fw-semibold text-muted">Nombre Completo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pasajero.nombreCompleto}
                        readOnly
                        style={{ background: '#f1f5f9' }}
                      />
                    </div>
                    <div className="col-12 col-md-5">
                      <label className="small fw-semibold text-muted">Número de Pasaporte</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pasajero.pasaporte}
                        readOnly
                        style={{ background: '#f1f5f9' }}
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