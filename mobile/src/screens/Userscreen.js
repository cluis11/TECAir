import React, { useState, useEffect } from 'react';
import { getDBConnection, createTables, guardarUsuarioLocal } from '../database/db';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

const API_URL = 'http://192.168.0.49:5103';


export default function RegistroUsuarioScreen( { onRegistroExitoso } ) {
  const [nombre, setNombre] = useState('');
  const [ap1, setAp1] = useState('');
  const [ap2, setAp2] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [esEstudiante, setEsEstudiante] = useState(false);
  const [universidad, setUniversidad] = useState('');
  const [carnet, setCarnet] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const conn = await getDBConnection();
        await createTables(conn);
        setDb(conn);
        console.log('DB iniciada correctamente');
      } catch (error) {
        console.log('Error iniciando DB:', error);
      }
    };
    initDB();
  }, []);

  const guardarUsuario = async () => {
     console.log('PRESIONADO', db);
    console.log('Datos:', { nombre, ap1, telefono, correo, contrasena }); // ✅ y esto

    if (!nombre || !ap1 || !telefono || !correo || !contrasena) {
      Alert.alert('Error', 'Debe completar todos los campos obligatorios.');
      return;
    }

    if (esEstudiante && (!universidad || !carnet)) {
      Alert.alert('Error', 'Debe completar universidad y carnet.');
      return;
    }

    const body = {
      correo, contrasena, nombre, ap1,
      ap2: ap2 || null,
      telefono,
      esEstudiante,
      estudiante: esEstudiante ? { carnet, universidad } : null,
    };

    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const usuario = await response.json();
        // Guardar en SQLite para uso offline
        await guardarUsuarioLocal(db, {
          ...usuario,
          contrasena,
          esEstudiante,
          carnet: esEstudiante ? carnet : null,
          universidad: esEstudiante ? universidad : null,
        });
        Alert.alert('Éxito', 'Usuario registrado correctamente.');
        onRegistroExitoso?.();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message ?? 'No se pudo registrar el usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'Sin conexión. No es posible registrarse sin internet.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Primer apellido</Text>
      <TextInput style={styles.input} placeholder="Primer apellido" value={ap1} onChangeText={setAp1} />

      <Text style={styles.label}>Segundo apellido (opcional)</Text>
      <TextInput style={styles.input} placeholder="Segundo apellido" value={ap2} onChangeText={setAp2} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={styles.input} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Es estudiante?</Text>
        <Switch value={esEstudiante} onValueChange={setEsEstudiante} />
      </View>

      {esEstudiante && (
        <>
          <Text style={styles.label}>Universidad</Text>
          <TextInput style={styles.input} placeholder="Universidad" value={universidad} onChangeText={setUniversidad} />
          <Text style={styles.label}>Carnet</Text>
          <TextInput style={styles.input} placeholder="Carnet" value={carnet} onChangeText={setCarnet} />
        </>
      )}

      <Button title="Registrar usuario" onPress={guardarUsuario} />
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  switchContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});