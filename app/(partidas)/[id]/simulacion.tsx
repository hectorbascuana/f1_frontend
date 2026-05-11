import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PilotoCard } from '../../../components/carrera/PilotoCard';
import { PlayerHUD } from '../../../components/carrera/PlayerHUD';
import { useCarreras } from '../../../hooks/carreras/useCarreras';
import { Compuesto } from '../../../core/types/carreraDTO';
import { useActiveGame } from '../../../hooks/store/useActiveGame';

/**
 * CarreraSimulacionScreen
 * 
 * Pantalla principal de la simulación de carrera.
 * Orquestada mediante el hook useCarreras.
 */

export default function CarreraSimulacionScreen() {
  const { partida } = useActiveGame();
  // Usamos un ref/estado para garantizar que no cambie y no dependa de Hooks de Router
  const [partidaId] = useState(() => partida?.id || 0);

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
    pilotosVisiblesCount,
    handleStartRace,
    handleConfirmPitStop,
    handleFinishAndExit,
    setCompuestoSeleccionado,
    setCompuestoInicial
  } = useCarreras(partidaId);

  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll al revelar pilotos en parrilla
  React.useEffect(() => {
    if (fase === 'PRECARRERA' && startData) {
      const total = startData.parrilla.length;
      const currentPosRevealed = total - pilotosVisiblesCount + 1;
      
      // Scroll suave hacia el piloto recién revelado
      scrollRef.current?.scrollTo({ 
        y: Math.max(0, (currentPosRevealed - 1) * 90 - 100), 
        animated: true 
      });
    }
  }, [pilotosVisiblesCount, fase, startData]);

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
        {fase === 'PRECARRERA' && (
          <TouchableOpacity 
            onPress={handleStartRace}
            className="bg-[#E10600] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-black italic text-[12px]">START</Text>
          </TouchableOpacity>
        )}
        {fase === 'FINALIZADA' && (
          <TouchableOpacity 
            onPress={handleFinishAndExit}
            className="bg-[#E10600] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">SALIR</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollRef}
        className="flex-1 px-4 mt-4" 
        contentContainerStyle={{ 
          paddingBottom: (fase === 'ACTIVA' || (fase === 'PRECARRERA' && pilotosVisiblesCount === startData?.parrilla.length)) ? 160 : 40 
        }}
      >
        <View style={{ height: (fase === 'PRECARRERA' ? startData?.parrilla.length || 0 : ranking.length) * 90 }}>
          
          {/* FASE 1: Parrilla de Salida (Revelación con suspense) */}
          {fase === 'PRECARRERA' && startData?.parrilla
            .filter(p => p.posicion >= (startData.parrilla.length - pilotosVisiblesCount + 1))
            .map((p) => {
              const isFirst3 = p.posicion <= 3;
              const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

              return (
                <View 
                  key={p.pilotoId} 
                  className={`bg-[#121212] border-2 ${p.esJugador ? 'border-[#E10600]' : 'border-[#222]'} rounded-2xl p-4 mb-3 flex-row items-center`}
                  style={{ position: 'absolute', top: (p.posicion - 1) * 90, left: 0, right: 0 }}
                >
                  <Text 
                    style={{ color: isFirst3 ? podiumColors[p.posicion - 1] : '#E10600' }} 
                    className="font-black text-xl italic w-10 text-center"
                  >
                    {p.posicion}º
                  </Text>
                  <View className="flex-1 ml-2">
                    <Text className="text-white font-black text-base">{p.nombre.toUpperCase()}</Text>
                    <View className="flex-row items-center">
                      <Text className="text-[#555] text-[10px] font-bold">{p.escuderia.toUpperCase()}</Text>
                      <View className="w-1 h-1 bg-[#444] rounded-full mx-1.5" />
                      <Text 
                        style={{ color: (p as any).dnf ? '#EF4444' : '#888' }} 
                        className="text-[10px] font-bold uppercase italic"
                      >
                        {(p as any).dnf ? 'DNF' : (p.posicion === 1 ? 'Leader' : `+${((p.tiempoClasificacionMs - (startData?.parrilla[0]?.tiempoClasificacionMs || 0)) / 1000).toFixed(3)}s`)}
                      </Text>
                    </View>
                  </View>
                  {p.esJugador && (
                    <View className="bg-[#E10600]/10 px-2 py-1 rounded">
                      <Text className="text-[#E10600] text-[8px] font-black uppercase">Tu Piloto</Text>
                    </View>
                  )}
                </View>
              );
            })
          }

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
      {/* HUD Persistente del Jugador */}
      {fase === 'ACTIVA' && (
        <PlayerHUD 
          pilotos={ranking.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId)}
          compuestos={compuestosSiguientes}
          pitStopsConfirmados={pitStopsConfirmados}
          onSelectCompuesto={setCompuestoSeleccionado}
          onConfirmPitStop={handleConfirmPitStop}
        />
      )}

      {fase === 'PRECARRERA' && pilotosVisiblesCount === startData?.parrilla.length && (
        <PlayerHUD 
          pilotos={startData?.parrilla.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId) || []}
          compuestos={compuestosIniciales}
          onSelectCompuesto={setCompuestoInicial}
          isGrid
        />
      )}
    </SafeAreaView>
  );
}
