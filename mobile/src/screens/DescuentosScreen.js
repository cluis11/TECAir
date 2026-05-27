import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as api from '../database/api';

export default function DescuentosScreen({ onVolver, onSeleccionarVuelo }) {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.getPromociones()
      .then(setPromociones)
      .catch(() => Alert.alert('Error', 'No se pudieron cargar las promociones.'))
      .finally(() => setCargando(false));
  }, []);

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    return fechaStr.split('T')[0];
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>Cargando promociones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Promociones Activas</Text>
 
      {promociones.length === 0 ? (
        <Text style={styles.sinResultados}>No hay promociones activas en este momento.</Text>
      ) : (
        <FlatList
          data={promociones}
          keyExtractor={(item) => String(item.idPromo)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.destino}>{item.ciudadOrigen} → {item.ciudadDestino}</Text>
              <Text>Descuento: {item.porcentaje}%</Text>
              <Text>Precio desde: ${item.precioPromocion}</Text>
              <Text style={styles.fecha}>{formatFecha(item.inicio)} — {formatFecha(item.fin)}</Text>
              <Button
                title="Ver vuelos de esta ruta"
                onPress={() => onSeleccionarVuelo(item)}
              />
            </View>
          )}
        />
      )}
 
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

  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center'
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
    marginBottom: 8
  },

  fecha: {
    color: '#777',
    marginTop: 5,
    marginBottom: 10
  },

  sinResultados: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: '#777'
  },
});