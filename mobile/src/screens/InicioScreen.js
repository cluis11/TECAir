import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function InicioScreen({ onAnonimo, onLogin, onRegistro }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TECAir</Text>
      <Text style={styles.subtitulo}>Bienvenido</Text>

      <View style={styles.boton}>
        <Button title="Continuar como anónimo" onPress={onAnonimo} />
      </View>

      <View style={styles.boton}>
        <Button title="Iniciar sesión" onPress={onLogin} />
      </View>

      <View style={styles.boton}>
        <Button title="Crear cuenta" onPress={onRegistro} />
      </View>
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
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 35,
    marginTop: 10,
  },
  boton: {
    marginBottom: 15,
  },
});