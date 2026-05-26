import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ScrollView } from 'react-native';
import * as api from '../database/api';

export default function ReservaScreen({ resultado, usuario, onVolver, onFinalizar }) {
  const [cargando, setCargando] = useState(false);
 
  const actualizarPasajero = (index, campo, valor) => {
    const copia = [...pasajeros];
    copia[index][campo] = valor;
    setPasajeros(copia);
  };
 
  const agregarPasajero = () => {
    setPasajeros([...pasajeros, { pasaporte: '', nombre: '', ap1: '', ap2: '', nacionalidad: '', fechaNacimiento: '' }]);
  };

  const confirmarReserva = async () => {
    if (!usuario) {
      Alert.alert('Error', 'Debe iniciar sesión para hacer una reserva.');
      return;
    }
 
    for (const p of pasajeros) {
      if (!p.pasaporte || !p.nombre || !p.ap1 || !p.nacionalidad || !p.fechaNacimiento) {
        Alert.alert('Error', 'Debe completar todos los campos de cada pasajero.');
        return;
      }
    }
 
    setCargando(true);
    try {
      const dto = {
        id_usuario: usuario.idUser,
        pasaporteTitular: pasajeros[0].pasaporte,
        pasajeros: pasajeros.map(p => ({
          pasaporte: p.pasaporte,
          nombre: p.nombre,
          ap1: p.ap1,
          ap2: p.ap2 || null,
          nacionalidad: p.nacionalidad,
          fechaNacimiento: p.fechaNacimiento,
          boletos: resultado.vuelos.map(v => ({
            id_itinerario: v.idItinerario,
            id_asiento: null
          }))
        }))
      };
 
      await api.crearReserva(dto);
      Alert.alert('Éxito', 'Reserva creada correctamente.', [
        { text: 'OK', onPress: onFinalizar }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo crear la reserva.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Confirmar Reserva</Text>
 
      <View style={styles.card}>
        <Text style={styles.destino}>{resultado.ruta.ciudadOrigen} → {resultado.ruta.ciudadDestino}</Text>
        <Text style={styles.precio}>Total: ${resultado.ruta.precio}</Text>
        {resultado.vuelos.map((v, i) => (
          <Text key={i} style={styles.tramo}>Tramo {i + 1}: {v.ciudadOrigen} → {v.ciudadDestino} | {v.fecha}</Text>
        ))}
      </View>
 
      <Text style={styles.subtitulo}>Datos de pasajeros</Text>
 
      {pasajeros.map((p, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.pasajeroTitulo}>Pasajero {index + 1}</Text>
          {[
            { label: 'Pasaporte *', campo: 'pasaporte', placeholder: 'Número de pasaporte' },
            { label: 'Nombre *', campo: 'nombre', placeholder: 'Nombre' },
            { label: 'Primer apellido *', campo: 'ap1', placeholder: 'Primer apellido' },
            { label: 'Segundo apellido', campo: 'ap2', placeholder: 'Segundo apellido (opcional)' },
            { label: 'Nacionalidad *', campo: 'nacionalidad', placeholder: 'Nacionalidad' },
            { label: 'Fecha de nacimiento * (YYYY-MM-DD)', campo: 'fechaNacimiento', placeholder: '2000-01-01' },
          ].map(({ label, campo, placeholder }) => (
            <View key={campo}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={p[campo]}
                onChangeText={(val) => actualizarPasajero(index, campo, val)}
              />
            </View>
          ))}
        </View>
      ))}
 
      <Button title="+ Agregar pasajero" onPress={agregarPasajero} color="#555" />
      <View style={{ height: 15 }} />
      <Button title={cargando ? 'Procesando...' : 'Confirmar reserva'} onPress={confirmarReserva} disabled={cargando} />
      <View style={{ height: 12 }} />
      <Button title="Volver" onPress={onVolver} color="#888" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 25, 
    backgroundColor: '#fff' 
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center'
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10
  },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },

  destino: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },

  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 5
  },

  tramo: {
    color: '#555',
      marginBottom: 3
  },

  pasajeroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },

  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 5,
    marginTop: 8 
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
});