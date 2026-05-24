import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';

export default function DescuentosScreen({ onVolver }) {
  const vuelos = [
    {
      id: '1',
      origen: 'San José',
      destino: 'México',
      fecha: '25/05/2026',
      hora: '08:30 AM',
      precio: 320,
      descuento: 15,
    },
    {
      id: '2',
      origen: 'San José',
      destino: 'España',
      fecha: '27/05/2026',
      hora: '02:15 PM',
      precio: 890,
      descuento: 0,
    },
    {
      id: '3',
      origen: 'Liberia',
      destino: 'Estados Unidos',
      fecha: '30/05/2026',
      hora: '09:45 PM',
      precio: 450,
      descuento: 20,
    },
    {
      id: '4',
      origen: 'San José',
      destino: 'Colombia',
      fecha: '02/06/2026',
      hora: '11:00 AM',
      precio: 280,
      descuento: 10,
    },
    {
      id: '5',
      origen: 'San José',
      destino: 'Panamá',
      fecha: '04/06/2026',
      hora: '06:45 AM',
      precio: 180,
      descuento: 0,
    },
    {
      id: '6',
      origen: 'Liberia',
      destino: 'Canadá',
      fecha: '07/06/2026',
      hora: '04:20 PM',
      precio: 620,
      descuento: 25,
    },
  ];

  const vuelosConDescuento = vuelos.filter((vuelo) => vuelo.descuento > 0);

  const calcularPrecioFinal = (precio, descuento) => {
    return precio - precio * (descuento / 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vuelos con Descuento</Text>

      <FlatList
        data={vuelosConDescuento}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const precioFinal = calcularPrecioFinal(item.precio, item.descuento);

          return (
            <View style={styles.card}>
              <Text style={styles.destino}>
                {item.origen} → {item.destino}
              </Text>

              <Text>Fecha: {item.fecha}</Text>
              <Text>Hora: {item.hora}</Text>
              <Text>Precio original: ${item.precio}</Text>
              <Text>Descuento: {item.descuento}%</Text>
              <Text style={styles.precioFinal}>
                Precio final: ${precioFinal.toFixed(2)}
              </Text>
            </View>
          );
        }}
      />

      <Button title="Volver a vuelos" onPress={onVolver} />
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
    marginBottom: 8,
  },
  precioFinal: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});