import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { login, loginlocal } from '../database/db';
import { getDBConnection } from '../database/db';
import * as api from '../database/api';



export default function LoginScreen({ onRegister, onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Debe ingresar correo y contraseña.');
      return;
    }
    setCargando(true);
    try {
      // 1 - Intenar login con la API
      const usuario = await api.login(correo, contrasena);
      onLogin(usuario);
    } catch (error) {
      // 2 - Si falla la API, intenar login local (SQLite)
      try {
        const db = await getDBConnection();
        const usuarioLocal = await loginlocal(db, correo, contrasena);
        if (usuarioLocal) {
          onLogin(usuarioLocal);
        } else {
          Alert.alert('Error', 'Correo o contraseña incorrectos.');
        }
      } catch (err) {
        Alert.alert('Error', 'No se pudo iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setCargando(false);
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
 
      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <Button title="Iniciar sesión" onPress={iniciarSesion} />
      )}
 
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
    justifyContent: 'center',
    backgroundColor: '#fff',
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
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  link: {
    textAlign: 'center',
    color: '#0066cc',
    fontWeight: 'bold',
    marginTop: 20,
  },
});