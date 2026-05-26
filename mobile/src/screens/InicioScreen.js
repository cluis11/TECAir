import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default function InicioScreen({ onAnonimo, onLogin, onRegistro }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>✈️ TECAir</Text>
        <Text style={styles.subtitulo}>Viaja fácil, viaja seguro</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={[styles.boton, styles.botonPrimario]} onPress={onLogin}>
          <Text style={styles.textoPrimario}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonSecundario]} onPress={onRegistro}>
          <Text style={styles.textoSecundario}>Crear Cuenta Nueva</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonEnlace} onPress={onAnonimo}>
          <Text style={styles.textoEnlace}>Continuar como explorador anónimo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0066cc',
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  menuContainer: {
    marginBottom: 60,
    gap: 14,
  },
  boton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  botonPrimario: {
    backgroundColor: '#0066cc',
  },
  botonSecundario: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  botonEnlace: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  textoPrimario: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textoSecundario: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
  },
  textovuelos: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});