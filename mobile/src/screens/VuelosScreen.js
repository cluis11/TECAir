import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as api from '../database/api';

export default function VuelosScreen({ usuario, onVolver, onSeleccionarVuelo, onVerDescuentos }) {
  const [aeropuertos, setAeropuertos] = useState([]);
  const [idOrigen, setIdOrigen] = useState('');
  const [idDestino, setIdDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [pasajeros, setPasajeros] = useState('1');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    api.getAeropuertos()
      .then(setAeropuertos)
      .catch(() => Alert.alert('Error', 'No se pudieron cargar los aeropuertos.'));
  }, []);

  const buscar = async () => {
    if (!idOrigen || !idDestino || !fecha || !pasajeros) {
      Alert.alert('Error', 'Debe completar todos los campos.');
      return;
    }
    if (idOrigen === idDestino) {
      Alert.alert('Error', 'El origen y destino no pueden ser iguales.');
      return;
    }
 
    setCargando(true);
    setBuscado(false);
    try {
      const data = await api.buscarVuelos(idOrigen, idDestino, fecha, pasajeros);
      setResultados(data);
      setBuscado(true);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const formatHora = (timeSpan) => {
    if (!timeSpan) return '--:--';
    return timeSpan.substring(0, 5);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscar Vuelos</Text>
 
      {usuario && <Text style={styles.usuario}>Usuario: {usuario.correo}</Text>}
 
      <Text style={styles.label}>Origen</Text>
      <View style={styles.picker}>
        {aeropuertos.map(a => (
          <TouchableOpacity
            key={a.idAeropuerto}
            style={[styles.opcion, idOrigen === String(a.idAeropuerto) && styles.opcionSeleccionada]}
            onPress={() => setIdOrigen(String(a.idAeropuerto))}
          >
            <Text style={idOrigen === String(a.idAeropuerto) ? styles.opcionTextoSeleccionado : styles.opcionTexto}>
              {a.ciudad} ({a.codigo})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
      <Text style={styles.label}>Destino</Text>
      <View style={styles.picker}>
        {aeropuertos.filter(a => String(a.idAeropuerto) !== idOrigen).map(a => (
          <TouchableOpacity
            key={a.idAeropuerto}
            style={[styles.opcion, idDestino === String(a.idAeropuerto) && styles.opcionSeleccionada]}
            onPress={() => setIdDestino(String(a.idAeropuerto))}
          >
            <Text style={idDestino === String(a.idAeropuerto) ? styles.opcionTextoSeleccionado : styles.opcionTexto}>
              {a.ciudad} ({a.codigo})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2026-06-01" value={fecha} onChangeText={setFecha} />
 
      <Text style={styles.label}>Pasajeros</Text>
      <TextInput style={styles.input} placeholder="1" value={pasajeros} onChangeText={setPasajeros} keyboardType="numeric" />
 
      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <Button title="Buscar vuelos" onPress={buscar} />
      )}
 
      {buscado && resultados.length === 0 && (
        <Text style={styles.sinResultados}>No se encontraron vuelos disponibles.</Text>
      )}
 
      <FlatList
        data={resultados}
        keyExtractor={(_, i) => String(i)}
        style={{ marginTop: 15 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.destino}>{item.ruta.ciudadOrigen} → {item.ruta.ciudadDestino}</Text>
            <Text style={styles.precio}>${item.ruta.precio}</Text>
            {item.vuelos.map((v, i) => (
              <View key={i} style={styles.vuelo}>
                <Text style={styles.tramo}>Tramo {i + 1}: {v.ciudadOrigen} → {v.ciudadDestino}</Text>
                <Text>Salida: {formatHora(v.salida)} · Llegada: {formatHora(v.llegada)}</Text>
                <Text>Puerta: {v.puertaEmbarque} · Asientos libres: {v.asientosLibres}</Text>
              </View>
            ))}
            <Button title="Seleccionar" onPress={() => onSeleccionarVuelo(item)} />
          </View>
        )}
      />
 
      <View style={{ height: 12 }} />
      <Button title="Ver promociones" onPress={onVerDescuentos} color="#555" />
      <View style={{ height: 12 }} />
      <Button title="Volver" onPress={onVolver} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center'
  },

  usuario: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    color: '#555'
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },

  opcion: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12
  },

  opcionSeleccionada: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc'
  },

  opcionTexto: {
    color: '#333'
  },

  opcionTextoSeleccionado: {
    color: '#fff',
    fontWeight: 'bold'
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
    marginBottom: 8
  },

  vuelo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },

  tramo: {
    fontWeight: 'bold',
    marginBottom: 3
  },

  sinResultados: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    color: '#777',
  },
});