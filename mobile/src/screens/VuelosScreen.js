import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, Modal,
} from 'react-native';
import * as api from '../database/api';
 
// ─────────────────────────────────────────────────────────────
// Utilidad: obtener un ID único de un aeropuerto de forma segura
// ─────────────────────────────────────────────────────────────
const getAeropuertoId = (a) => {
  if (!a) return null;
  return a.idAeropuerto ?? a.id_aeropuerto ?? a.id ?? a.ID ?? a.IdAeropuerto ?? null;
};
 
// ─────────────────────────────────────────────────────────────
// DatePicker sin dependencias externas
// ─────────────────────────────────────────────────────────────
function DatePickerModal({ visible, value, onChange, onClose }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day,   setDay]   = useState(today.getDate());
 
  useEffect(() => {
    if (visible && value) {
      const parts = value.split('-');
      setYear(parseInt(parts[0]));
      setMonth(parseInt(parts[1]) - 1);
      setDay(parseInt(parts[2]));
    }
  }, [visible]);
 
  const MESES    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const DIAS_SEM = ['D','L','M','X','J','V','S'];
  const pad      = (n) => String(n).padStart(2, '0');
 
  const diasEnMes = (y, m) => new Date(y, m + 1, 0).getDate();
  const primerDia = (y, m) => new Date(y, m, 1).getDay();
 
  const mesAnterior  = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setDay(1); };
  const mesSiguiente = () => { if (month === 11){ setMonth(0);  setYear(y => y+1); } else setMonth(m => m+1); setDay(1); };
 
  const total  = diasEnMes(year, month);
  const inicio = primerDia(year, month);
  const celdas = Array.from({ length: inicio + total }, (_, i) => i < inicio ? null : i - inicio + 1);
 
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={dp.overlay}>
        <View style={dp.modal}>
          <View style={dp.header}>
            <TouchableOpacity onPress={mesAnterior}  style={dp.navBtn}><Text style={dp.navTxt}>‹</Text></TouchableOpacity>
            <Text style={dp.mesTxt}>{MESES[month]} {year}</Text>
            <TouchableOpacity onPress={mesSiguiente} style={dp.navBtn}><Text style={dp.navTxt}>›</Text></TouchableOpacity>
          </View>
          <View style={dp.fila}>
            {DIAS_SEM.map(d => <Text key={d} style={dp.diaSemana}>{d}</Text>)}
          </View>
          <View style={dp.grilla}>
            {celdas.map((d, i) => (
              <TouchableOpacity
                key={`celda-${i}`}
                style={[dp.celda, d === day && dp.celdaSel, !d && dp.celdaVacia]}
                onPress={() => d && setDay(d)}
                disabled={!d}
              >
                <Text style={[dp.celdaTxt, d === day && dp.celdaTxtSel]}>{d || ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={dp.acciones}>
            <TouchableOpacity onPress={onClose} style={dp.btnCancelar}>
              <Text style={dp.btnCancelarTxt}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { onChange(`${year}-${pad(month+1)}-${pad(day)}`); onClose(); }}
              style={dp.btnConfirmar}
            >
              <Text style={dp.btnConfirmarTxt}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
 
// ─────────────────────────────────────────────────────────────
// Chip de aeropuerto
// ─────────────────────────────────────────────────────────────
const AeropuertoChip = React.memo(({ aeropuerto, seleccionado, onPress }) => (
  <TouchableOpacity
    style={[styles.opcion, seleccionado && styles.opcionSeleccionada]}
    onPress={onPress}
  >
    <Text style={[styles.opcionTexto, seleccionado && styles.opcionTextoSeleccionado]}>
      {aeropuerto.ciudad} ({aeropuerto.codigo})
    </Text>
  </TouchableOpacity>
));
 
// ─────────────────────────────────────────────────────────────
// Pantalla principal
// ─────────────────────────────────────────────────────────────
export default function VuelosScreen({ usuario, promoPreRellenada, onVolver, onSeleccionarVuelo, onVerDescuentos, onVerPerfil }) {
  const [aeropuertos, setAeropuertos] = useState([]);
  const [origenId,    setOrigenId]    = useState(null);  
  const [destinoId,   setDestinoId]   = useState(null);  
  const [fecha,       setFecha]       = useState('');
  const [pasajeros,   setPasajeros]   = useState(1);
  const [resultados,  setResultados]  = useState([]);
  const [cargando,    setCargando]    = useState(false);
  const [buscado,     setBuscado]     = useState(false);
  const [mostrarDP,   setMostrarDP]   = useState(false);
 
  const promoAnterior = useRef(null);
 
  // ── Carga de aeropuertos ────────────────────────────────────
  useEffect(() => {
    api.getAeropuertos()
      .then(data => {
        if (data?.length > 0) console.log('[TECAir] Aeropuerto ejemplo:', JSON.stringify(data[0]));
        setAeropuertos(data || []);
      })
      .catch(() => Alert.alert('Error', 'No se pudieron cargar los aeropuertos.'));
  }, []);
 
  // ── Pre-rellenar desde promo ────────────────────────────────
  useEffect(() => {
    if (!promoPreRellenada || aeropuertos.length === 0) return;
    if (promoAnterior.current === promoPreRellenada) return;
    promoAnterior.current = promoPreRellenada;
 
    const origen  = aeropuertos.find(a => a.ciudad?.toLowerCase().trim() === promoPreRellenada.ciudadOrigen?.toLowerCase().trim());
    const destino = aeropuertos.find(a => a.ciudad?.toLowerCase().trim() === promoPreRellenada.ciudadDestino?.toLowerCase().trim());
 
    const idO = getAeropuertoId(origen);
    const idD = getAeropuertoId(destino);
 
    setOrigenId(idO);
    setDestinoId(idD);
 
    if (!idO || !idD) {
      Alert.alert('Atención', 'No se encontraron por completo los aeropuertos de esta promoción en la lista local.');
    }
  }, [promoPreRellenada, aeropuertos]);
 
  // ── Búsqueda ────────────────────────────────────────────────
  const buscar = async () => {
    if (!origenId || !destinoId) {
      Alert.alert('Error', 'Seleccione origen y destino.');
      return;
    }
    if (origenId === destinoId) {
      Alert.alert('Error', 'El origen y destino no pueden ser iguales.');
      return;
    }
    if (!fecha) {
      Alert.alert('Error', 'Seleccione la fecha de salida.');
      return;
    }
    setCargando(true);
    setBuscado(false);
    try {
      const data = await api.buscarVuelos(origenId, destinoId, fecha, String(pasajeros));
      setResultados(data);
      setBuscado(true);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };
 
  const formatHora = (ts) => ts ? ts.substring(0, 5) : '--:--';
 
  return (
    <View style={styles.container}>
      {/* Encabezado o sección superior de tu pantalla */}
      <View style={styles.headerControl}>
        <Text style={styles.bienvenida}>¡Hola, {usuario?.nombre || 'Explorador'}! 👋</Text>
        
        {/* 2. Añadimos el botón visual para ir al Perfil */}
        {usuario && (
          <TouchableOpacity style={styles.botonPerfilMini} onPress={onVerPerfil}>
            <Text style={styles.textoBotonPerfil}>⚙️ Mi Perfil</Text>
          </TouchableOpacity>
        )}
      </View>

      <DatePickerModal
        visible={mostrarDP}
        value={fecha}
        onChange={setFecha}
        onClose={() => setMostrarDP(false)}
      />
 
      <FlatList
        data={resultados}
        keyExtractor={(_, i) => `resultado-${i}`}
        ListHeaderComponent={
          <View style={styles.cardFormulario}>
            <Text style={styles.tituloHeader}>Busca tu próximo destino</Text>
 
            {usuario && (
              <Text style={styles.usuarioBadget}>👋 ¡Hola, {usuario.nombre}!</Text>
            )}
 
            {/* ── ORIGEN ── */}
            <Text style={styles.label}>📍 Origen</Text>
            <View style={styles.picker}>
              {aeropuertos.map((a, index) => {
                const id = getAeropuertoId(a) || index;
                return (
                  <AeropuertoChip
                    key={`origen-${id}`}
                    aeropuerto={a}
                    seleccionado={origenId !== null && origenId === getAeropuertoId(a)}
                    onPress={() => setOrigenId(getAeropuertoId(a))}
                  />
                );
              })}
            </View>
 
            {/* ── DESTINO ── */}
            <Text style={styles.label}>🎯 Destino</Text>
            <View style={styles.picker}>
              {aeropuertos.map((a, index) => {
                const id = getAeropuertoId(a) || index;
                return (
                  <AeropuertoChip
                    key={`destino-${id}`}
                    aeropuerto={a}
                    seleccionado={destinoId !== null && destinoId === getAeropuertoId(a)}
                    onPress={() => setDestinoId(getAeropuertoId(a))}
                  />
                );
              })}
            </View>
 
            {/* ── FECHA ── */}
            <Text style={styles.label}>📅 Fecha de Salida</Text>
            <TouchableOpacity style={styles.inputFecha} onPress={() => setMostrarDP(true)} activeOpacity={0.7}>
              <Text style={fecha ? styles.fechaTxt : styles.fechaPlaceholder}>
                {fecha || 'Seleccionar fecha'}
              </Text>
              <Text style={styles.calIcon}>📆</Text>
            </TouchableOpacity>
 
            {/* ── PASAJEROS ── */}
            <Text style={styles.label}>👥 Cantidad de Pasajeros</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setPasajeros(p => Math.max(1, p - 1))}>
                <Text style={styles.stepTxt}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepVal}>{pasajeros}</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setPasajeros(p => p + 1)}>
                <Text style={styles.stepTxt}>+</Text>
              </TouchableOpacity>
            </View>
 
            <TouchableOpacity style={styles.botonBuscar} onPress={buscar}>
              <Text style={styles.textoBotonBuscar}>Buscar Vuelos</Text>
            </TouchableOpacity>
 
            <TouchableOpacity style={styles.botonPromos} onPress={onVerDescuentos}>
              <Text style={styles.textoBotonPromos}>Ver Promociones Activas</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardResultado}>
            <View style={styles.cardHeader}>
              <Text style={styles.rutaTexto}>{item.ruta?.ciudadOrigen} ✈ {item.ruta?.ciudadDestino}</Text>
              <Text style={styles.precioTexto}>${item.ruta?.precio}</Text>
            </View>
            <Text style={styles.vueloSubtexto}>Duración: {item.ruta?.duracion}</Text>
            {item.vuelos?.map((v, i) => (
              <View key={`vuelo-${index}-${i}`} style={styles.vueloDetalleItem}>
                <Text style={styles.horaTexto}>⏱️ {formatHora(v.horaSalida ?? v.salida)}</Text>
                <Text style={styles.detalleTexto}>💺 {v.asientosLibres} asientos libres</Text>
              </View>
            ))}
            {/* Agregamos de manera explícita la cantidad de pasajeros al objeto seleccionado */}
            <TouchableOpacity 
              style={styles.botonSeleccionar} 
              onPress={() => onSeleccionarVuelo({ ...item, cantidadPasajeros: pasajeros })}
            >
              <Text style={styles.textoBotonSeleccionar}>Seleccionar Vuelo</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          buscado && !cargando
            ? <Text style={styles.sinResultados}>No se encontraron vuelos para esta búsqueda.</Text>
            : null
        }
      />

      {cargando && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      )}
    </View>
  );
}

const dp = StyleSheet.create({
  overlay:    { flex:1, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'center', alignItems:'center' },
  modal:      { backgroundColor:'#fff', borderRadius:18, padding:20, width:320, elevation:12 },
  header:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  navBtn:     { padding:8 },
  navTxt:     { fontSize:24, color:'#0066cc', fontWeight:'700' },
  mesTxt:     { fontSize:17, fontWeight:'800', color:'#1E293B' },
  fila:       { flexDirection:'row', justifyContent:'space-around', marginBottom:8 },
  diaSemana:  { width:36, textAlign:'center', fontSize:12, fontWeight:'700', color:'#94A3B8' },
  grilla:     { flexDirection:'row', flexWrap:'wrap' },
  celda:      { width:'14.28%', aspectRatio:1, justifyContent:'center', alignItems:'center', borderRadius:50 },
  celdaVacia: { opacity:0 },
  celdaSel:   { backgroundColor:'#0066cc' },
  celdaTxt:   { fontSize:14, color:'#334155', fontWeight:'600' },
  celdaTxtSel:{ color:'#fff', fontWeight:'800' },
  acciones:   { flexDirection:'row', justifyContent:'flex-end', gap:10, marginTop:16 },
  btnCancelar:   { paddingVertical:10, paddingHorizontal:18, borderRadius:8, borderWidth:1, borderColor:'#CBD5E1' },
  btnCancelarTxt:{ color:'#64748B', fontWeight:'700' },
  btnConfirmar:   { paddingVertical:10, paddingHorizontal:18, borderRadius:8, backgroundColor:'#0066cc' },
  btnConfirmarTxt:{ color:'#fff', fontWeight:'700' },
});
 
const styles = StyleSheet.create({
  container:        { flex:1, backgroundColor:'#F1F5F9', paddingHorizontal:16 },
  cardFormulario:   { backgroundColor:'#FFF', borderRadius:16, padding:20, marginTop:20, marginBottom:20, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:10, elevation:3 },
  tituloHeader:     { fontSize:22, fontWeight:'800', color:'#1E293B', marginBottom:5 },
  usuarioBadget:    { fontSize:14, color:'#0066cc', fontWeight:'600', marginBottom:15 },
  label:            { fontSize:14, fontWeight:'700', color:'#475569', marginTop:12, marginBottom:8 },
  inputFecha:       { borderWidth:1, borderColor:'#CBD5E1', borderRadius:10, padding:12, backgroundColor:'#F8FAFC', flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  fechaTxt:         { fontSize:15, color:'#1E293B' },
  fechaPlaceholder: { fontSize:15, color:'#94A3B8' },
  calIcon:          { fontSize:16 },
  stepper:          { flexDirection:'row', alignItems:'center', gap:16, borderWidth:1, borderColor:'#CBD5E1', borderRadius:10, paddingHorizontal:16, paddingVertical:8, backgroundColor:'#F8FAFC', alignSelf:'flex-start' },
  stepBtn:          { width:32, height:32, borderRadius:16, backgroundColor:'#0066cc', justifyContent:'center', alignItems:'center' },
  stepTxt:          { color:'#fff', fontSize:20, fontWeight:'700', lineHeight:22 },
  stepVal:          { fontSize:18, fontWeight:'800', color:'#1E293B', minWidth:24, textAlign:'center' },
  picker:           { flexDirection:'row', flexWrap:'wrap', gap:8 },
  opcion:           { borderWidth:1, borderColor:'#CBD5E1', borderRadius:20, paddingVertical:8, paddingHorizontal:14, backgroundColor:'#FFF' },
  opcionSeleccionada:      { backgroundColor:'#0066cc', borderColor:'#0066cc' },
  opcionTexto:             { color:'#64748B', fontWeight:'600', fontSize:13 },
  opcionTextoSeleccionado: { color:'#FFF', fontWeight:'700' },
  botonBuscar:      { backgroundColor:'#0066cc', paddingVertical:14, borderRadius:10, alignItems:'center', marginTop:20 },
  textoBotonBuscar: { color:'#FFF', fontSize:16, fontWeight:'700' },
  botonPromos:      { borderWidth:1, borderColor:'#0066cc', paddingVertical:12, borderRadius:10, alignItems:'center', marginTop:10 },
  textoBotonPromos: { color:'#0066cc', fontSize:14, fontWeight:'700' },
  cardResultado:    { backgroundColor:'#FFF', borderRadius:14, padding:16, marginBottom:14, borderLeftWidth:5, borderLeftColor:'#0066cc', elevation:2 },
  cardHeader:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  rutaTexto:        { fontSize:17, fontWeight:'800', color:'#1E293B', flex:1, flexWrap:'wrap' },
  precioTexto:      { fontSize:20, fontWeight:'900', color:'#10B981' },
  vueloSubtexto:    { color:'#64748B', fontSize:13, marginBottom:10 },
  vueloDetalleItem: { backgroundColor:'#F8FAFC', padding:10, borderRadius:8, marginTop:6 },
  horaTexto:        { fontSize:13, fontWeight:'700', color:'#334155' },
  detalleTexto:     { fontSize:12, color:'#64748B', marginTop:2 },
  botonSeleccionar: { backgroundColor:'#1E293B', paddingVertical:10, borderRadius:8, alignItems:'center', marginTop:12 },
  textoBotonSeleccionar: { color:'#FFF', fontWeight:'700' },
  sinResultados:    { textAlign:'center', color:'#64748B', marginTop:20 },
  loadingOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(255,255,255,0.7)', justifyContent:'center', alignItems:'center' },
  headerControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 15,
  },
  bienvenida: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  botonPerfilMini: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  textoBotonPerfil: {
    color: '#0066cc',
    fontWeight: '700',
    fontSize: 13,
  },
});