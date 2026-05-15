import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Cliente = () => {
    const navigate = useNavigate();

    // ITENARIO PRUEBA
    const [listItenario] = useState([
    {
      id: 1,
      origen: "San José",
      destino: "Madrid",
      fecha: "15 Mayo 2026",
      hora: "08:00 AM",
      precio: "$450"
    },
    {

      id: 2,
      origen: "San José",
      destino: "México",
      fecha: "18 Mayo 2026",
      hora: "02:30 PM",
      precio: "$320"
    }
  ]);

  return (
    <div className="vuelos-container">
      <main className="contenido">
        <h2>Selecciona un Vuelo</h2>
      </main>
      {/* Dibujar la lista de viajes */}
      <main className="main-content">
          {listItenario.map((vuelo) => (
            <div className="vuelo-card" key={vuelo.id}>
              <div className="vuelo-info">
                <h3>
                    {vuelo.origen} ✈️ {vuelo.destino}
                </h3>
                <p><strong>Fecha:</strong> {vuelo.fecha}</p>
                <p><strong>Hora:</strong> {vuelo.hora}</p>
                <p><strong>Precio:</strong> {vuelo.precio}</p>
                <div className="overlay-card">
                <button 
                    className="btn-comprar"
                    onClick={() => navigate(`/reservar/${vuelo.id}`)}
                >
                    COMPRAR BOLETOS
                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Cliente;