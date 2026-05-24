import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

export default function RegistroUsuarioScreen({ onVolver }) {
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono1, setTelefono1] = useState('');
  const [telefono2, setTelefono2] = useState('');
  const [password, setPassword] = useState('');

  const [esEstudiante, setEsEstudiante] = useState(false);
  const [universidad, setUniversidad] = useState('');
  const [carnet, setCarnet] = useState('');

  const guardarUsuario = () => {
    if (
      !nombre ||
      !apellido1 ||
      !apellido2 ||
      !correo ||
      !telefono1 ||
      !password
    ) {
      Alert.alert(
        'Error',
        'Debe completar todos los campos obligatorios.'
      );
      return;
    }

    if (esEstudiante && (!universidad || !carnet)) {
      Alert.alert(
        'Error',
        'Debe completar universidad y carnet.'
      );
      return;
    }

    const usuario = {
      nombre,
      apellido1,
      apellido2,
      correo,
      telefono1,
      telefono2,
      password,
      esEstudiante,
      universidad: esEstudiante ? universidad : null,
      carnet: esEstudiante ? carnet : null,
    };

    console.log('Usuario registrado:', usuario);

    Alert.alert(
      'Éxito',
      'Usuario registrado correctamente.'
    );

    setNombre('');
    setApellido1('');
    setApellido2('');
    setCorreo('');
    setTelefono1('');
    setTelefono2('');
    setPassword('');
    setEsEstudiante(false);
    setUniversidad('');
    setCarnet('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Cuenta</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Apellido 1</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el primer apellido"
        value={apellido1}
        onChangeText={setApellido1}
      />

      <Text style={styles.label}>Apellido 2</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el segundo apellido"
        value={apellido2}
        onChangeText={setApellido2}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Teléfono 1</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el teléfono principal"
        value={telefono1}
        onChangeText={setTelefono1}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Teléfono 2 (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el segundo teléfono"
        value={telefono2}
        onChangeText={setTelefono2}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Es estudiante?</Text>
        <Switch
          value={esEstudiante}
          onValueChange={setEsEstudiante}
        />
      </View>

      {esEstudiante && (
        <>
          <Text style={styles.label}>Universidad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la universidad"
            value={universidad}
            onChangeText={setUniversidad}
          />

          <Text style={styles.label}>Carnet</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el carnet"
            value={carnet}
            onChangeText={setCarnet}
          />
        </>
      )}

      <Button
        title="Registrar usuario"
        onPress={guardarUsuario}
      />

      <View style={styles.separador} />

      <Button
        title="Volver al inicio"
        onPress={onVolver}
      />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 30,
    textAlign: 'center',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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

  separador: {
    height: 12,
  },
});