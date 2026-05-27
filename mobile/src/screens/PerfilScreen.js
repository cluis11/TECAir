import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as api from '../database/api';

export default function PerfilScreen({ usuario, onActualizarUsuario, onVolver }) {
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [universidad, setUniversidad] = useState(usuario?.estudiante?.universidad || usuario?.universidad || '');
  const [carnet, setCarnet] = useState(usuario?.estudiante?.carnet || usuario?.carnet || '');
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);

  const millas = usuario?.estudiante?.millas || usuario?.millas || 0;

  const handleGuardarCambios = async () => {
    if (!telefono || (usuario?.esEstudiante && (!universidad || !carnet))) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos (*).');
      return;
    }

    setCargando(true);
    try {
      const dtoActualizacion = {
        correo: usuario.correo,
        telefono: telefono,
        universidad: usuario.esEstudiante ? universidad : null,
        carnet: usuario.esEstudiante ? carnet : null
      };

      const usuarioActualizado = { 
        ...usuario, 
        telefono, 
        estudiante: usuario.esEstudiante ? { ...usuario.estudiante, universidad, carnet, millas } : null 
      };

      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      onActualizarUsuario(usuarioActualizado); // Refresca el estado global en App.tsx
      setEditando(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Mi Perfil TECAir</Text>

      <View style={styles.cardInfo}>
        <Text style={styles.nombre}>{usuario?.nombre} {usuario?.ap1} {usuario?.ap2}</Text>
        <Text style={styles.correo}>✉ {usuario?.correo}</Text>
        
        <View style={styles.millasBadge}>
          <Text style={styles.millasTexto}>✈️ {millas} Millas Acumuladas</Text>
        </View>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>Teléfono móvil *</Text>
        <TextInput
          style={[styles.input, !editando && styles.inputDeshabilitado]}
          value={telefono}
          onChangeText={setTelefono}
          editable={editando}
          keyboardType="phone-pad"
        />

        {usuario?.esEstudiante && (
          <>
            <Text style={styles.label}>Universidad *</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDeshabilitado]}
              value={universidad}
              onChangeText={setUniversidad}
              editable={editando}
            />

            <Text style={styles.label}>Carné de Estudiante *</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDeshabilitado]}
              value={carnet}
              onChangeText={setCarnet}
              editable={editando}
            />
          </>
        )}

        <View style={{ marginTop: 20 }}>
          {cargando ? (
            <ActivityIndicator size="large" color="#0066cc" />
          ) : !editando ? (
            <Button title="Editar Datos" onPress={() => setEditando(true)} color="#0066cc" />
          ) : (
            <>
              <Button title="Guardar Cambios" onPress={handleGuardarCambios} color="#10B981" />
              <View style={{ height: 10 }} />
              <Button title="Cancelar" onPress={() => setEditando(false)} color="#EF4444" />
            </>
          )}
        </View>
      </View>

      <View style={{ height: 15 }} />
      <Button title="Volver al Menú" onPress={onVolver} color="#64748B" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: '#F8FAFC', flexGrow: 1 },
  titulo: { fontSize: 26, fontWeight: '900', marginTop: 30, marginBottom: 20, textAlign: 'center', color: '#0066cc' },
  cardInfo: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, marginBottom: 20 },
  nombre: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  correo: { fontSize: 14, color: '#64748B', marginTop: 4 },
  millasBadge: { backgroundColor: '#0066cc', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 15 },
  millasTexto: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  formulario: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, color: '#1E293B', backgroundColor: '#FFF' },
  inputDeshabilitado: { backgroundColor: '#F1F5F9', color: '#64748B', borderColor: '#E2E8F0' }
});