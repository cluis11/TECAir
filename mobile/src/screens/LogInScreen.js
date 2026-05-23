import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function LoginScreen({ onRegister }) {
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  const iniciarSesion = () => {
    if (!correo || !telefono) {
      Alert.alert('Error', 'Debe ingresar correo y teléfono.');
      return;
    }

    Alert.alert('Éxito', 'Inicio de sesión correcto.');
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
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
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