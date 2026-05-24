import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function LoginScreen({ onRegister, onVolver, onLogin, usuario }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = () => {
    if (
      correo === usuario.correo &&
      password === usuario.password
    ) {
      onLogin(usuario);
    } else {
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TECAir</Text>
      <Text style={styles.subtitulo}>Inicio de sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingrese su correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Iniciar sesión" onPress={iniciarSesion} />

      <View style={styles.separador} />

      <Button title="Crear cuenta" onPress={onRegister} />

      <View style={styles.separador} />

      <Button title="Volver al inicio" onPress={onVolver} />
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
  separador: {
    height: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
});