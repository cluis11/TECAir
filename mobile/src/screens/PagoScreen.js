import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

export default function PagoScreen({ reserva, onVolver, onFinalizar }) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [cvv, setCvv] = useState('');
  const precioUnitario = reserva.vuelo.precio;
  const totalPagar = precioUnitario * reserva.cantidadBoletos;

  const [pasajeros, setPasajeros] = useState(
    Array.from({ length: reserva.cantidadBoletos }, (_, index) => ({
      id: index + 1,
      nombre: '',
      apellidos: '',
      telefono: '',
      titular: index === 0,
    }))
  );

  const actualizarPasajero = (index, campo, valor) => {
    const copia = [...pasajeros];
    copia[index][campo] = valor;
    setPasajeros(copia);
  };

  const seleccionarTitular = (index) => {
    const copia = pasajeros.map((pasajero, i) => ({
      ...pasajero,
      titular: i === index,
    }));

    setPasajeros(copia);
  };

  const pagar = () => {
    for (const pasajero of pasajeros) {
      if (!pasajero.nombre || !pasajero.apellidos || !pasajero.telefono) {
        Alert.alert(
          'Error',
          'Debe completar los datos de todos los pasajeros.'
        );
        return;
      }
    }

    const titularExiste = pasajeros.some((pasajero) => pasajero.titular);

    if (!titularExiste) {
      Alert.alert('Error', 'Debe seleccionar un pasajero titular.');
      return;
    }

    if (!numeroTarjeta || !nombreTarjeta || !cvv) {
      Alert.alert('Error', 'Debe completar los datos de la tarjeta.');
      return;
    }

    Alert.alert(
      'Reserva confirmada',
      `Vuelo: ${reserva.vuelo.origen} → ${reserva.vuelo.destino}\nTotal pagado: $${totalPagar}`
    );

    console.log('Reserva:', reserva);
    console.log('Pasajeros:', pasajeros);

    onFinalizar();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Pago con tarjeta</Text>

      <View style={styles.card}>
        <Text style={styles.destino}>
          Vuelo: {reserva.vuelo.origen} → {reserva.vuelo.destino}
        </Text>

        <Text>Boletos reservados: {reserva.cantidadBoletos}</Text>
        <Text>Fecha: {reserva.vuelo.fecha}</Text>
        <Text>Hora: {reserva.vuelo.hora}</Text>
        <Text>Precio por boleto: ${precioUnitario}</Text>

        <Text style={styles.total}>
          Total a pagar: ${totalPagar}
        </Text>
      </View>

      <Text style={styles.subtitulo}>Datos de pasajeros</Text>

      {pasajeros.map((pasajero, index) => (
        <View key={pasajero.id} style={styles.card}>
          <Text style={styles.pasajeroTitulo}>Pasajero {pasajero.id}</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre"
            value={pasajero.nombre}
            onChangeText={(texto) =>
              actualizarPasajero(index, 'nombre', texto)
            }
          />

          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese los apellidos"
            value={pasajero.apellidos}
            onChangeText={(texto) =>
              actualizarPasajero(index, 'apellidos', texto)
            }
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el teléfono"
            value={pasajero.telefono}
            onChangeText={(texto) =>
              actualizarPasajero(index, 'telefono', texto)
            }
            keyboardType="phone-pad"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Titular de la reserva</Text>
            <Switch
              value={pasajero.titular}
              onValueChange={() => seleccionarTitular(index)}
            />
          </View>
        </View>
      ))}

      <Text style={styles.subtitulo}>Datos de tarjeta</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
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
  pasajeroTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  total: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  switchContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separador: {
    height: 12,
  },
});