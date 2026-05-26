import React, { useState } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet,
  ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import * as api from '../database/api';

const API_BASE = 'http://192.168.0.49:5103';

const MILLAS_POR_DOLAR_GANAR    = 1;
const MILLAS_POR_DOLAR_REDIMIR  = 100;

export default function PagoScreen({ resultado, pasajeros, usuario, onVolver, onFinalizar }) {
  const [metodoPago,    setMetodoPago]    = useState('tarjeta');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [cvv,           setCvv]           = useState('');
  const [cargando,      setCargando]      = useState(false);

  // ── Cálculos de precio y millas  ──
  const cantidadPasajeros = pasajeros?.length || 1;
  const precioTotal       = (resultado?.ruta?.precio || 0) * cantidadPasajeros;
  const millasUsuario     = usuario?.estudiante?.millas || usuario?.millas || 0;
  const millasNecesarias  = precioTotal * MILLAS_POR_DOLAR_REDIMIR;
  const millasAGanar      = Math.floor(precioTotal * MILLAS_POR_DOLAR_GANAR);
  const puedeUsarMillas   = usuario?.esEstudiante && millasUsuario >= millasNecesarias;

  // ── Flujo de pago ────────────────────
  const procesarPago = async () => {
    if (metodoPago === 'tarjeta' && (!numeroTarjeta || !nombreTarjeta || !cvv)) {
      Alert.alert('Error', 'Debe completar los datos de la tarjeta.');
      return;
    }
    if (metodoPago === 'millas' && !puedeUsarMillas) {
      Alert.alert('Error', `Necesitás ${millasNecesarias} millas y tenés ${millasUsuario}.`);
      return;
    }
    if (!usuario) {
      Alert.alert('Error', 'Debes iniciar sesión para realizar una reserva.');
      return;
    }

    setCargando(true);
    try {
      // ── PASO 1: POST /reserva ──
      const idsPorTramo = resultado.vuelos.map(v => v.idItinerario);

      const bodyReserva = {
        id_usuario:       usuario.idUser,
        PasaporteTitular: pasajeros[0].pasaporte,
        Pasajeros: pasajeros.map(p => ({
          Pasaporte:       p.pasaporte,
          Nombre:          p.nombre,
          Ap1:             p.ap1,
          Ap2:             p.ap2 || null,
          Nacionalidad:    p.nacionalidad,
          FechaNacimiento: p.fechaNacimiento,
          Boletos: idsPorTramo.map(idItinerario => ({
            id_itinerario: idItinerario,
            id_asiento:    null
          }))
        }))
      };

      console.log('[TECAir] POST /reserva →', JSON.stringify(bodyReserva, null, 2));

      const resReserva = await fetch(`${API_BASE}/reserva`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(bodyReserva)
      });

      if (!resReserva.ok) {
        const errorTxt = await resReserva.text();
        console.error('[TECAir] Error POST /reserva:', resReserva.status, errorTxt);
        Alert.alert('Error', `No se pudo crear la reserva (${resReserva.status}).`);
        return;
      }

      const reserva = await resReserva.json();
      const idReserva = reserva.id_reserva ?? reserva.idReserva ?? reserva.id;
      console.log('[TECAir] Reserva creada, id:', idReserva);

      // ── PASO 2: PUT /reserva/{id}/pagar ──
      const resPago = await fetch(`${API_BASE}/reserva/${idReserva}/pagar`, {
        method: 'PUT'
      });

      if (!resPago.ok) {
        const errorTxt = await resPago.text();
        console.error('[TECAir] Error PUT /pagar:', resPago.status, errorTxt);
        Alert.alert('Error', `No se pudo procesar el pago (${resPago.status}).`);
        return;
      }

      console.log('[TECAir] Pago confirmado');

      // ── PASO 3: Millas ── 
      if (usuario.esEstudiante) {
        const deltaMillas = metodoPago === 'millas' ? -millasNecesarias : millasAGanar;
        await fetch(`${API_BASE}/usuario/${usuario.idUser}/millas`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ millas: deltaMillas })
        });
        console.log('[TECAir] Millas actualizadas:', deltaMillas);
      }

      // ── Éxito ──
      const mensajeMillas = metodoPago === 'tarjeta' && usuario.esEstudiante
        ? `\n✈️ ¡Ganaste ${millasAGanar} millas con esta compra!`
        : metodoPago === 'millas'
        ? `\n✈️ Pagaste con ${millasNecesarias} millas.`
        : '';

      Alert.alert(
        '¡Reserva confirmada!',
        `Código de reserva: #${idReserva}\n${resultado.ruta.ciudadOrigen} → ${resultado.ruta.ciudadDestino}${mensajeMillas}`,
        [{ text: 'OK', onPress: onFinalizar }]
      );

    } catch (error) {
      console.error('[TECAir] Error inesperado:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor. Intente de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Resumen y Pago</Text>

      {/* Resumen del vuelo */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          ✈️  {resultado?.ruta?.ciudadOrigen} → {resultado?.ruta?.ciudadDestino}
        </Text>
        {resultado?.vuelos?.map((v, i) => (
          <Text key={i} style={styles.tramoTexto}>
            Tramo {i + 1}: {v.ciudadOrigen} → {v.ciudadDestino}
            {v.salida ? `  ·  ${v.salida.substring(0, 5)}` : ''}
          </Text>
        ))}
        <View style={styles.separador} />
        <View style={styles.filaPrecio}>
          <Text style={styles.precioLabel}>{cantidadPasajeros} pasajero(s) × ${resultado?.ruta?.precio}</Text>
          <Text style={styles.precioTotal}>${precioTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Método de pago */}
      <Text style={styles.seccionTitulo}>Método de pago</Text>

      {/* Opción: Tarjeta */}
      <TouchableOpacity
        style={[styles.metodoCard, metodoPago === 'tarjeta' && styles.metodoActivo]}
        onPress={() => setMetodoPago('tarjeta')}
      >
        <Text style={styles.metodoIcon}>💳</Text>
        <View style={styles.metodoInfo}>
          <Text style={[styles.metodoNombre, metodoPago === 'tarjeta' && styles.metodoNombreActivo]}>
            Tarjeta de crédito
          </Text>
          {usuario?.esEstudiante && (
            <Text style={styles.metodoSubtexto}>Ganás {millasAGanar} millas con esta compra</Text>
          )}
        </View>
        <View style={[styles.radio, metodoPago === 'tarjeta' && styles.radioActivo]} />
      </TouchableOpacity>

      {/* Opción: Millas (solo estudiantes) */}
      {usuario?.esEstudiante && (
        <TouchableOpacity
          style={[
            styles.metodoCard,
            metodoPago === 'millas' && styles.metodoActivo,
            !puedeUsarMillas && styles.metodoDeshabilitado
          ]}
          onPress={() => puedeUsarMillas && setMetodoPago('millas')}
          activeOpacity={puedeUsarMillas ? 0.7 : 1}
        >
          <Text style={styles.metodoIcon}>✈️</Text>
          <View style={styles.metodoInfo}>
            <Text style={[styles.metodoNombre, metodoPago === 'millas' && styles.metodoNombreActivo]}>
              Pagar con millas
            </Text>
            <Text style={[styles.metodoSubtexto, puedeUsarMillas ? styles.textoVerde : styles.textoRojo]}>
              {puedeUsarMillas
                ? `Usás ${millasNecesarias} millas (tenés ${millasUsuario})`
                : `Necesitás ${millasNecesarias} — tenés ${millasUsuario}`}
            </Text>
          </View>
          <View style={[styles.radio, metodoPago === 'millas' && styles.radioActivo]} />
        </TouchableOpacity>
      )}

      {/* Formulario tarjeta */}
      {metodoPago === 'tarjeta' && (
        <View style={styles.formulario}>
          <Text style={styles.inputLabel}>Nombre en la tarjeta *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor="#94A3B8"
            value={nombreTarjeta}
            onChangeText={setNombreTarjeta}
          />
          <Text style={styles.inputLabel}>Número de tarjeta *</Text>
          <TextInput
            style={styles.input}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={numeroTarjeta}
            onChangeText={setNumeroTarjeta}
          />
          <Text style={styles.inputLabel}>CVV *</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      )}

      {/* Info millas */}
      {metodoPago === 'millas' && (
        <View style={[styles.formulario, styles.millasCard]}>
          <Text style={styles.millasTitulo}>Pago con Millas de Estudiante</Text>
          <Text style={styles.millasTexto}>Millas disponibles: <Text style={styles.negrita}>{millasUsuario}</Text></Text>
          <Text style={styles.millasTexto}>Millas requeridas: <Text style={[styles.negrita, { color: '#0066cc' }]}>{millasNecesarias}</Text></Text>
          <Text style={[styles.estadoMillas, puedeUsarMillas ? styles.textoVerde : styles.textoRojo]}>
            {puedeUsarMillas ? '✓ Millas suficientes' : '✗ Millas insuficientes'}
          </Text>
        </View>
      )}

      {/* Botones */}
      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" style={{ marginVertical: 24 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.botonPagar} onPress={procesarPago}>
            <Text style={styles.botonPagarTexto}>
              {metodoPago === 'tarjeta'
                ? `Confirmar y pagar $${precioTotal.toFixed(2)}`
                : `Canjear ${millasNecesarias} millas`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonVolver} onPress={onVolver}>
            <Text style={styles.botonVolverTexto}>Volver a pasajeros</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:          { padding: 20, backgroundColor: '#F1F5F9', flexGrow: 1 },
  titulo:             { fontSize: 24, fontWeight: '800', marginTop: 25, marginBottom: 20, textAlign: 'center', color: '#1E293B' },
  card:               { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  cardTitulo:         { fontSize: 16, fontWeight: '800', color: '#0066cc', marginBottom: 10 },
  tramoTexto:         { fontSize: 13, color: '#64748B', marginBottom: 3 },
  separador:          { borderTopWidth: 1, borderTopColor: '#E2E8F0', marginVertical: 10 },
  filaPrecio:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precioLabel:        { fontSize: 14, color: '#64748B' },
  precioTotal:        { fontSize: 20, fontWeight: '900', color: '#10B981' },
  seccionTitulo:      { fontSize: 15, fontWeight: '700', color: '#475569', marginBottom: 12 },
  metodoCard:         { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: '#CBD5E1', flexDirection: 'row', alignItems: 'center', gap: 12 },
  metodoActivo:       { borderColor: '#0066cc', backgroundColor: '#EFF6FF' },
  metodoDeshabilitado:{ opacity: 0.5 },
  metodoIcon:         { fontSize: 22 },
  metodoInfo:         { flex: 1 },
  metodoNombre:       { fontSize: 15, fontWeight: '700', color: '#334155' },
  metodoNombreActivo: { color: '#0066cc' },
  metodoSubtexto:     { fontSize: 12, color: '#64748B', marginTop: 2 },
  radio:              { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1' },
  radioActivo:        { borderColor: '#0066cc', backgroundColor: '#0066cc' },
  formulario:         { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#CBD5E1', marginTop: 4 },
  inputLabel:         { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 4, marginTop: 10 },
  input:              { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 11, backgroundColor: '#F8FAFC', color: '#1E293B', fontSize: 15 },
  millasCard:         { borderLeftWidth: 5, borderLeftColor: '#0066cc' },
  millasTitulo:       { fontSize: 15, fontWeight: '800', color: '#0066cc', marginBottom: 10 },
  millasTexto:        { fontSize: 14, color: '#334155', marginBottom: 4 },
  negrita:            { fontWeight: '700' },
  estadoMillas:       { fontSize: 13, fontWeight: '700', marginTop: 8 },
  textoVerde:         { color: '#10B981' },
  textoRojo:          { color: '#EF4444' },
  botonPagar:         { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  botonPagarTexto:    { color: '#FFF', fontSize: 16, fontWeight: '800' },
  botonVolver:        { backgroundColor: '#E2E8F0', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  botonVolverTexto:   { color: '#475569', fontSize: 15, fontWeight: '700' },
});