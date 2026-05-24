import React from 'react';
import {
  View,
 Text,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function VuelosScreen() {

  const vuelos = [
    {
      id: '1',
      destino: 'San José → México',
      salida: 'Juan Santamaría',
      hora: '08:30 AM',
      fecha: '25/05/2026',
    },
    {
      id: '2',
      destino: 'San José → España',
      salida: 'Juan Santamaría',
      hora: '02:15 PM',
      fecha: '27/05/2026',
    },
    {
      id: '3',
      destino: 'San José → Estados Unidos',
      salida: 'Daniel Oduber',
      hora: '09:45 PM',
      fecha: '30/05/2026',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vuelos Disponibles</Text>

      <FlatList
        data={vuelos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.destino}>
              {item.destino}
            </Text>

            <Text style={styles.texto}>
              Aeropuerto de salida: {item.salida}
            </Text>

            <Text style={styles.texto}>
              Hora de salida: {item.hora}
            </Text>

            <Text style={styles.texto}>
              Fecha: {item.fecha}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  destino: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  texto: {
    fontSize: 15,
    marginBottom: 4,
  },
});