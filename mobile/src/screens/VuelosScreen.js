import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
} from 'react-native';

export default function VuelosScreen({ usuario, onVolver, onSeleccionarVuelo }) {
  const [buscarOrigen, setBuscarOrigen] = useState('');
  const [buscarDestino, setBuscarDestino] = useState('');

  const vuelos = [
    {
      id: '1',
      origen: 'San José',
      destino: 'México',
      salida: 'Juan Santamaría',
      hora: '08:30 AM',
      fecha: '25/05/2026',
    },
    {
      id: '2',
      origen: 'San José',
      destino: 'España',
      salida: 'Juan Santamaría',
      hora: '02:15 PM',
      fecha: '27/05/2026',
    },
    {
      id: '3',
      origen: 'Liberia',
      destino: 'Estados Unidos',
      salida: 'Daniel Oduber',
      hora: '09:45 PM',
      fecha: '30/05/2026',
    },
  ];

  const vuelosFiltrados = vuelos.filter((vuelo) => {
    const origenCoincide = vuelo.origen
      .toLowerCase()
      .includes(buscarOrigen.toLowerCase());

    const destinoCoincide = vuelo.destino
      .toLowerCase()
      .includes(buscarDestino.toLowerCase());

    return origenCoincide && destinoCoincide;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vuelos Disponibles</Text>

      {usuario ? (
        <Text style={styles.usuario}>Usuario: {usuario.correo}</Text>
      ) : (
        <Text style={styles.usuario}>Modo anónimo</Text>
      )}

      <Text style={styles.label}>Origen</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar origen"
        value={buscarOrigen}
        onChangeText={setBuscarOrigen}
      />

      <Text style={styles.label}>Destino</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar destino"
        value={buscarDestino}
        onChangeText={setBuscarDestino}
      />

      <FlatList
        data={vuelosFiltrados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.sinResultados}>No se encontraron vuelos</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.destino}>
              {item.origen} → {item.destino}
            </Text>

            <Text style={styles.texto}>Aeropuerto de salida: {item.salida}</Text>
            <Text style={styles.texto}>Hora de salida: {item.hora}</Text>
            <Text style={styles.texto}>Fecha: {item.fecha}</Text>

            <Button
              title="Seleccionar vuelo"
              onPress={() => onSeleccionarVuelo(item)}
            />
          </View>
        )}
      />

      <Button title="Volver al inicio" onPress={onVolver} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
    usuario: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 15,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  destino: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  texto: { fontSize: 15, marginBottom: 4 },
  sinResultados: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});