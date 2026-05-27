import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getDBConnection, createTables, guardarUsuarioLocal } from '../database/db';
import * as api from '../database/api';


export default function RegistroUsuarioScreen({ onVolver }) {
  const [nombre, setNombre] = useState('');
  const [ap1, setAp1] = useState('');
  const [ap2, setAp2] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [esEstudiante, setEsEstudiante] = useState(false);
  const [universidad, setUniversidad] = useState('');
  const [carnet, setCarnet] = useState('');
  const [cargando, setCargando] = useState(false);

  const guardarUsuario = async () => {
    if (!nombre || !ap1 || !correo || !telefono || !contrasena) {
      Alert.alert('Error', 'Debe completar todos los campos obligatorios.');
      return;
    }

    if (esEstudiante && (!universidad || !carnet)) {
      Alert.alert('Error', 'Debe completar universidad y carnet.');
      return;
    }

    setCargando(true);
    try {
      const datos = {
        correo, contrasena, nombre, ap1,
        ap2: ap2 || null,
        telefono,
        esEstudiante,
        estudiante: esEstudiante ? { carnet, universidad } : null,
      };
 
      // 1 - Registrar en la API
      const usuario = await api.registrarUsuario(datos);
 
      // 2 - Guardar localmente en SQLite para uso offline
      const db = await getDBConnection();
      await createTables(db);
      await guardarUsuarioLocal(db, { ...usuario, contrasena });
 
      Alert.alert('Éxito', 'Usuario registrado correctamente.', [
        { text: 'OK', onPress: onVolver }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el usuario. Verifique los datos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Cuenta</Text>
 
      <Text style={styles.label}>Nombre *</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
 
      <Text style={styles.label}>Primer apellido *</Text>
      <TextInput style={styles.input} placeholder="Primer apellido" value={ap1} onChangeText={setAp1} />
 
      <Text style={styles.label}>Segundo apellido</Text>
      <TextInput style={styles.input} placeholder="Segundo apellido (opcional)" value={ap2} onChangeText={setAp2} />
 
      <Text style={styles.label}>Correo electrónico *</Text>
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
 
      <Text style={styles.label}>Teléfono *</Text>
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
 
      <Text style={styles.label}>Contraseña *</Text>
      <TextInput style={styles.input} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
 
      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Es estudiante?</Text>
        <Switch value={esEstudiante} onValueChange={setEsEstudiante} />
      </View>
 
      {esEstudiante && (
        <>
          <Text style={styles.label}>Universidad *</Text>
          <TextInput style={styles.input} placeholder="Universidad" value={universidad} onChangeText={setUniversidad} />
          <Text style={styles.label}>Carnet *</Text>
          <TextInput style={styles.input} placeholder="Carnet" value={carnet} onChangeText={setCarnet} />
        </>
      )}
 
      {cargando ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <Button title="Registrar usuario" onPress={guardarUsuario} />
      )}
 
      <View style={{ height: 12 }} />
      <Button title="Volver" onPress={onVolver} color="#888" />
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