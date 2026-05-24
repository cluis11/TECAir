import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';

export default function ReservaScreen({ vuelo, onVolver, onContinuarPago }) {
  const [cantidadBoletos, setCantidadBoletos] = useState('');

  const continuar = () => {
    const cantidad = Number(cantidadBoletos);

    if (!cantidad || cantidad <= 0) {
      Alert.alert('Error', 'Debe ingresar una cantidad válida de boletos.');
      return;
    }

    onContinuarPago({
      vuelo,
      cantidadBoletos: cantidad,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reservar vuelo</Text>

      <View style={styles.card}>
        <Text style={styles.destino}>
          {vuelo.origen} → {vuelo.destino}
        </Text>
        <Text>Salida: {vuelo.salida}</Text>
        <Text>Fecha: {vuelo.fecha}</Text>
        <Text>Hora: {vuelo.hora}</Text>
      </View>

      <Text style={styles.label}>Cantidad de boletos</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 2"
        value={cantidadBoletos}
        onChangeText={setCantidadBoletos}
        keyboardType="numeric"
      />

      <Button title="Continuar a pago" onPress={continuar} />

      <View style={styles.separador} />

      <Button title="Volver a vuelos" onPress={onVolver} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
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
    marginBottom: 20,
  },
  destino: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  separador: { height: 12 },
});