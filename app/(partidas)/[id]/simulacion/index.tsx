import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PilotoCard } from '../../../../components/carrera/PilotoCard';
import { PlayerHUD } from '../../../../components/carrera/PlayerHUD';
import { useCarreras } from '../../../../hooks/carreras/useCarreras';
import { Compuesto } from '../../../../core/types/carreraDTO';

/**
 * CarreraSimulacionScreen
 * 
 * Pantalla principal de la simulación de carrera.
 * Orquestada mediante el hook useCarreras.
 */

export default function CarreraSimulacionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const partidaId = Number(id);

  const {
    fase,
    startData,
    ranking,
    vueltaActual,
    totalVueltas,
    loadingStart,
    compuestosIniciales,
    compuestosSiguientes,
    pitStopsConfirmados,
    handleStartRace,
    handleConfirmPitStop,
    setCompuestoSeleccionado,
    setCompuestoInicial
  } = useCarreras(partidaId);

  if (loadingStart) {
    return (
      <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
        <ActivityIndicator size="large" color="#E10600" />
        <Text className="text-white mt-4 font-bold tracking-[2px]">PREPARANDO MOTORES...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top', 'bottom']}>
      
      {/* Cabecera de Telemetría */}
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-[#222]">
        <View>
          <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[2px]">
            {fase === 'PRECARRERA' ? 'Parrilla de Salida' : fase === 'ACTIVA' ? 'Carrera en Vivo' : 'Fin de Carrera'}
          </Text>
          <Text className="text-white text-xl font-black italic">
            {fase === 'ACTIVA' ? `VUELTA ${vueltaActual} / ${totalVueltas}` : 'GP SIMULACIÓN'}
          </Text>
        </View>
        {fase === 'FINALIZADA' && (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-[#E10600] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">SALIR</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        className="flex-1 px-4 mt-4" 
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={{ height: (fase === 'PRECARRERA' ? startData?.parrilla.length || 0 : ranking.length) * 90 }}>
          
          {/* FASE 1: Parrilla de Salida */}
          {fase === 'PRECARRERA' && startData?.parrilla.map((p, index) => (
            <View 
              key={p.pilotoId} 
              className="bg-[#121212] border border-[#222] rounded-2xl p-4 mb-3 flex-row items-center"
              style={{ position: 'absolute', top: index * 90, left: 0, right: 0 }}
            >
              <Text className="text-[#E10600] font-black text-xl italic w-10 text-center">{p.posicion}º</Text>
              <View className="flex-1 ml-2">
                <Text className="text-white font-black text-base">{p.nombre.toUpperCase()}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="help-circle" size={14} color="#555" />
                  <Text className="text-[#555] text-[10px] font-bold ml-1">Estrategia Oculta</Text>
                </View>
              </View>
              {p.esJugador && (
                <View className="flex-row bg-black p-1 rounded-lg">
                  {(['BLANDO', 'MEDIO', 'DURO'] as Compuesto[]).map(c => (
                    <TouchableOpacity 
                      key={c}
                      onPress={() => setCompuestoInicial(p.pilotoId, c)}
                      className={`px-3 py-1 rounded ${compuestosIniciales[p.pilotoId] === c ? 'bg-[#333]' : ''}`}
                    >
                      <Text className={`text-[9px] font-black ${compuestosIniciales[p.pilotoId] === c ? 'text-white' : 'text-[#555]'}`}>
                        {c.charAt(0)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* FASE 2 y 3: Carrera Activa / Finalizada */}
          {fase !== 'PRECARRERA' && ranking.map((p, index) => (
            <PilotoCard 
              key={p.pilotoId}
              piloto={p}
              index={index}
              totalPilotos={ranking.length}
            />
          ))}
        </View>
      </ScrollView>

      {/* HUD Persistente del Jugador */}
      {fase === 'ACTIVA' && (
        <PlayerHUD 
          pilotos={ranking.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId)}
          compuestosSiguientes={compuestosSiguientes}
          pitStopsConfirmados={pitStopsConfirmados}
          onSelectCompuesto={setCompuestoSeleccionado}
          onConfirmPitStop={handleConfirmPitStop}
        />
      )}

      {/* Botón de Inicio (Solo en Parrilla) */}
      {fase === 'PRECARRERA' && (
        <View className="absolute bottom-10 left-10 right-10">
          <TouchableOpacity 
            onPress={handleStartRace}
            className="bg-[#E10600] py-5 rounded-2xl items-center shadow-2xl active:opacity-90"
          >
            <Text className="text-white text-xl font-black italic uppercase tracking-[2px]">¡Semáforos fuera!</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
