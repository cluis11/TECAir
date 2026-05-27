import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ScrollView } from 'react-native';
import * as api from '../database/api';

export default function ReservaScreen({ resultado, usuario, onVolver, onFinalizar }) {
  const [cargando, setCargando] = useState(false);
  const [pasajeros, setPasajeros] = useState([]);

  // Sincronizar dinámicamente según la cantidad de pasajeros elegida y pre-rellenar al titular
  useEffect(() => {
    const cantidadRequerida = resultado?.cantidadPasajeros || 1;
    const plantillaPasajeros = Array.from({ length: cantidadRequerida }, (_, index) => {
      // Si es el pasajero 1 (índice 0) y el usuario está logueado, pre-rellenamos como en la Web
      if (index === 0 && usuario) {
        return {
          pasaporte: '',
          nombre: usuario.nombre || '',
          ap1: usuario.ap1 || '',
          ap2: usuario.ap2 || '',
          nacionalidad: '',
          fechaNacimiento: ''
        };
      }
      // De lo contrario, retorna un formulario completamente vacío
      return { pasaporte: '', nombre: '', ap1: '', ap2: '', nacionalidad: '', fechaNacimiento: '' };
    });
    setPasajeros(plantillaPasajeros);
  }, [resultado, usuario]);
 
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

    const cantidadBuscada = resultado?.cantidadPasajeros || 1;
    if (pasajeros.length !== cantidadBuscada) {
      Alert.alert(
        'Error en pasajeros', 
        `Buscaste vuelos para ${cantidadBuscada} personas, pero tienes formularios para ${pasajeros.length} pasajeros.`
      );
      return;
    }
 
    for (const p of pasajeros) {
      if (!p.pasaporte || !p.nombre || !p.ap1 || !p.nacionalidad || !p.fechaNacimiento) {
        Alert.alert('Error', 'Debe completar todos los campos obligatorios (*) de cada pasajero.');
        return;
      }
    }
 
    setCargando(true);
    try {
      const dto = {
        id_usuario: usuario.idUser,
        PasaporteTitular: pasajeros[0].pasaporte, 
        Pasajeros: pasajeros.map(p => ({          
          Pasaporte: p.pasaporte,                 
          Nombre: p.nombre,                       
          Ap1: p.ap1,                             
          Ap2: p.ap2 || null,                     
          Nacionalidad: p.nacionalidad,           
          FechaNacimiento: p.fechaNacimiento,     
          Boletos: resultado.vuelos.map(v => ({   
            id_itinerario: v.idItinerario,
            id_asiento: null
          }))
        }))
      };
      onFinalizar(pasajeros)
    } catch {
      Alert.alert('Error', 'No se pudo crear la reserva.');
    } finally {
      setCargando(false);
    }
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Confirmar Reserva</Text>
      
      <View style={styles.cardInfoVuelo}>
        <Text style={styles.destino}>{resultado.ruta.ciudadOrigen} → {resultado.ruta.ciudadDestino}</Text>
        <Text style={styles.precio}>Total: ${resultado.ruta.precio}</Text>
        <Text style={styles.pasajerosInfo}>🎟️ Espacios requeridos: {resultado?.cantidadPasajeros || 1}</Text>
        {resultado.vuelos.map((v, i) => (
          <Text key={i} style={styles.tramo}>Tramo {i + 1}: {v.ciudadOrigen} → {v.ciudadDestino} | {v.fecha}</Text>
        ))}
      </View>
 
      <Text style={styles.subtitulo}>Datos de Pasajeros</Text>
      
      {pasajeros.map((p, index) => (
        <View key={index} style={styles.cardPasajero}>
          <Text style={styles.pasajeroTitulo}>👤 Pasajero #{index + 1} {index === 0 ? '(Titular)' : ''}</Text>
          
          {/* PASAPORTE */}
          <Text style={styles.fieldLabel}>Número de Pasaporte *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: A00000000"
            placeholderTextColor="#94A3B8"
            value={p.pasaporte}
            onChangeText={(v) => actualizarPasajero(index, 'pasaporte', v)}
          />

          {/* NOMBRE */}
          <Text style={styles.fieldLabel}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Juan"
            placeholderTextColor="#94A3B8"
            value={p.nombre}
            onChangeText={(v) => actualizarPasajero(index, 'nombre', v)}
          />

          {/* PRIMER APELLIDO */}
          <Text style={styles.fieldLabel}>Primer Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Pérez"
            placeholderTextColor="#94A3B8"
            value={p.ap1}
            onChangeText={(v) => actualizarPasajero(index, 'ap1', v)}
          />

          {/* SEGUNDO APELLIDO */}
          <Text style={styles.fieldLabel}>Segundo Apellido (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Rodríguez"
            placeholderTextColor="#94A3B8"
            value={p.ap2}
            onChangeText={(v) => actualizarPasajero(index, 'ap2', v)}
          />

          {/* NACIONALIDAD */}
          <Text style={styles.fieldLabel}>Nacionalidad *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Costarricense"
            placeholderTextColor="#94A3B8"
            value={p.nacionalidad}
            onChangeText={(v) => actualizarPasajero(index, 'nacionalidad', v)}
          />

          {/* FECHA DE NACIMIENTO */}
          <Text style={styles.fieldLabel}>Fecha de Nacimiento *</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD (Ej: 1995-08-24)"
            placeholderTextColor="#94A3B8"
            value={p.fechaNacimiento}
            onChangeText={(v) => actualizarPasajero(index, 'fechaNacimiento', v)}
          />
        </View>
      ))}
 
      <Button title="+ Agregar Pasajero Extra" onPress={agregarPasajero} color="#475569" />
      <View style={{ height: 15 }} />
      <Button title={cargando ? 'Procesando...' : 'Confirmar Reserva'} onPress={confirmarReserva} disabled={cargando} color="#0066cc" />
      <View style={{ height: 12 }} />
      <Button title="Volver a Vuelos" onPress={onVolver} color="#888" />
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#F1F5F9' 
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    color: '#1E293B'
  },
  subtitulo: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
    color: '#334155'
  },
  cardInfoVuelo: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 1
  },
  cardPasajero: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#0066cc',
    elevation: 2
  },
  destino: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5,
    color: '#1E293B'
  },
  precio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 5
  },
  pasajerosInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10
  },
  tramo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2
  },
  pasajeroTitulo: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    color: '#0066cc',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 4
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
    fontSize: 14
  }
});