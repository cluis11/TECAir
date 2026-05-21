import React, { useState } from 'react';
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

export default function RegistroUsuarioScreen() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [esEstudiante, setEsEstudiante] = useState(false);
  const [universidad, setUniversidad] = useState('');
  const [carnet, setCarnet] = useState('');

  const guardarUsuario = () => {
    if (!nombreCompleto || !telefono || !correo) {
      Alert.alert('Error', 'Debe completar nombre, teléfono y correo.');
      return;
    }

    if (esEstudiante && (!universidad || !carnet)) {
      Alert.alert('Error', 'Debe completar universidad y carnet.');
      return;
    }

    const usuario = {
      nombreCompleto,
      telefono,
      correo,
      esEstudiante,
      universidad: esEstudiante ? universidad : null,
      carnet: esEstudiante ? carnet : null,
    };

    console.log('Usuario registrado:', usuario);

    Alert.alert('Éxito', 'Usuario registrado correctamente.');

    setNombreCompleto('');
    setTelefono('');
    setCorreo('');
    setEsEstudiante(false);
    setUniversidad('');
    setCarnet('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Usuario</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el nombre completo"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
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

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Es estudiante?</Text>
        <Switch value={esEstudiante} onValueChange={setEsEstudiante} />
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