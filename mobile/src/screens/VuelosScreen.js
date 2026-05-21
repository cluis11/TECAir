import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  getDBConnection,
  createTables,
  insertVuelo,
  getVuelos,
  deleteVuelo,
} from '../database/db';

export default function VuelosScreen() {
  const [db, setDb] = useState(null);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [precio, setPrecio] = useState('');
  const [vuelos, setVuelos] = useState([]);

  useEffect(() => {
    iniciarBD();
  }, []);

  const iniciarBD = async () => {
    const conexion = await getDBConnection();
    await createTables(conexion);
    setDb(conexion);

    const datos = await getVuelos(conexion);
    setVuelos(datos);
  };

  const guardarVuelo = async () => {
    if (!origen || !destino || !fecha || !precio) {
      return;
    }

    await insertVuelo(db, origen, destino, fecha, Number(precio));

    setOrigen('');
    setDestino('');
    setFecha('');
    setPrecio('');

    const datos = await getVuelos(db);
    setVuelos(datos);
  };

  const eliminarVuelo = async (id) => {
    await deleteVuelo(db, id);

    const datos = await getVuelos(db);
    setVuelos(datos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TECAir Mobile</Text>

      <TextInput
        style={styles.input}
        placeholder="Origen"
        value={origen}
        onChangeText={setOrigen}
      />

      <TextInput
        style={styles.input}
        placeholder="Destino"
        value={destino}
        onChangeText={setDestino}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <Button title="Guardar vuelo" onPress={guardarVuelo} />

      <FlatList
        data={vuelos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>
              {item.origen} → {item.destino}
            </Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Precio: ${item.precio}</Text>

            <TouchableOpacity onPress={() => eliminarVuelo(item.id)}>
              <Text style={styles.eliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  texto: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  eliminar: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
  },
});