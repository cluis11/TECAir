import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDBConnection, loginLocal } from '../database/db';
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
      const usuario = await api.login(correo, contrasena);
      onLogin(usuario);
    } catch (error) {
      try {
        const db = await getDBConnection();
        const usuarioLocal = await loginLocal(db, correo, contrasena);
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
      <Text style={styles.logo}>✈️ TECAir</Text>
      <Text style={styles.subtitulo}>Inicio de Sesión</Text>
 
      {/* Campo: Correo Electrónico */}
      <Text style={styles.inputLabel}>Correo electrónico *</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        placeholderTextColor="#94A3B8"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
 
      {/* Campo: Contraseña */}
      <Text style={styles.inputLabel}>Contraseña *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#94A3B8"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
 
      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" style={{ marginVertical: 15 }} />
      ) : (
        <View style={{ marginTop: 10 }}>
          <Button title="Iniciar Sesión" onPress={iniciarSesion} color="#0066cc" />
        </View>
      )}
 
      <TouchableOpacity onPress={onRegister} style={styles.linkContainer}>
        <Text style={styles.link}>¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate aquí</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    color: '#0066cc',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 30,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
    color: '#1E293B',
    fontSize: 15,
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  link: {
    color: '#64748B',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#0066cc',
    fontWeight: '700',
  },
});