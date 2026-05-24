import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

export default function PagoScreen({ reserva, onVolver, onFinalizar }) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [cvv, setCvv] = useState('');

  const pagar = () => {
    if (!numeroTarjeta || !nombreTarjeta || !cvv) {
      Alert.alert('Error', 'Debe completar los datos de la tarjeta.');
      return;
    }

    Alert.alert(
      'Reserva confirmada',
      `Se reservaron ${reserva.cantidadBoletos} boleto(s).`
    );

    onFinalizar();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pago con tarjeta</Text>

      <View style={styles.card}>
        <Text style={styles.destino}>
          {reserva.vuelo.origen} → {reserva.vuelo.destino}
        </Text>
        <Text>Boletos reservados: {reserva.cantidadBoletos}</Text>
        <Text>Fecha: {reserva.vuelo.fecha}</Text>
        <Text>Hora: {reserva.vuelo.hora}</Text>
      </View>

      <Text style={styles.label}>Número de tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número de tarjeta"
        value={numeroTarjeta}
        onChangeText={setNumeroTarjeta}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nombre en la tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el nombre"
        value={nombreTarjeta}
        onChangeText={setNombreTarjeta}
      />

      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
      />

      <Button title="Pagar y confirmar reserva" onPress={pagar} />

      <View style={styles.separador} />

      <Button title="Cancelar pago" onPress={onVolver} />
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