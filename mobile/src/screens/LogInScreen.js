import React, { useState, useEffect } from 'react';
import { getDBConnection, createTables, loginLocal, guardarUsuarioLocal } from '../database/db';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const API_URL = 'http://192.168.0.49:5103';

export default function LoginScreen({ onRegister, onLoginExitoso }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const conn = await getDBConnection();
      await createTables(conn);
      setDb(conn);
    };
    initDB();
  }, []);

  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Debe ingresar correo y contraseña.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (response.ok) {
        const usuario = await response.json();
        // Guardar en SQLite para uso offline
        await guardarUsuarioLocal(db, usuario);
        Alert.alert('Éxito', `Bienvenido ${usuario.nombre}`);
        onLoginExitoso(usuario);
        return;
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
        return;
      }
    } catch (error) {
      // Sin internet — intentar login local
      console.log('Sin conexión, intentando login offline...');
    }

    // Login offline con SQLite
    const usuarioLocal = await loginLocal(db, correo, contrasena);
    if (usuarioLocal) {
      Alert.alert('Éxito', `Bienvenido ${usuarioLocal.nombre} (modo offline)`);
      onLoginExitoso(usuarioLocal);
    } else {
      Alert.alert('Error', 'Sin conexión y no se encontró sesión guardada.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TECAir</Text>
      <Text style={styles.subtitulo}>Inicio de sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <Button title="Iniciar sesión" onPress={iniciarSesion} />

      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.link}>Crear una cuenta nueva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0066cc',
    fontWeight: 'bold',
  },
});