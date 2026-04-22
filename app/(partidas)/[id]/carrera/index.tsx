import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useActiveGame } from '../../../../hooks/partidas/useActiveGame';
import { useCircuito } from '../../../../hooks/partidas/useCircuito';
import { Ionicons } from '@expo/vector-icons';

/**
 * GameDashboard (Siguiente Carrera)
 * 
 * Responsabilidad: Mostrar toda la información técnica del próximo GP y permitir
 * al usuario prepararse antes de la carrera.
 */
export default function GameDashboard() {
  const { partida, isLoading: loadingPartida } = useActiveGame();
  
  // Realizamos la consulta del circuito una vez tenemos el proximoCircuito de la partida
  const { data: circuito, isLoading: loadingCircuito } = useCircuito(partida!.proximoCircuito);

  if (loadingPartida || loadingCircuito) {
    return (
      <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
        <ActivityIndicator size="large" color="#E10600" />
        <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px]">SINCRONIZANDO TELEMETRÍA...</Text>
      </View>
    );
  }

  if (!partida || !circuito) {
    return (
      <View className="flex-1 bg-[#0a0a0a] justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#E10600" />
        <Text className="text-white text-lg font-bold mt-4 text-center">Error al cargar la información de la carrera</Text>
      </View>
    );
  }

  // Formateador de tiempo: de HH:MM:SS.MS a MM:SS.MS
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length < 3) return timeStr;
    return `${parts[1]}:${parts[2]}`; // Tomamos Minutos y Segundos.ms
  };

  return (
    <View className="flex-1 bg-[#0a0a0a] px-6">
      {/* Sección 1: Identificación del GP (Más compacto) */}
      <View className="pt-6 mb-6">
        <View className="flex-row items-center mb-1">
          <View className="bg-[#E10600] w-2 h-3 mr-2" />
          <Text className="text-[#555] text-[10px] font-black uppercase tracking-[3px]">Siguiente carrera</Text>
        </View>
        <Text className="text-white text-3xl font-black italic uppercase tracking-[-1px]">
          {circuito.nombre}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-sharp" size={12} color="#E10600" />
          <Text className="text-[#888] text-xs font-bold ml-1 uppercase">
            {circuito.pais}
          </Text>
        </View>
      </View>

      <View className="flex-1 justify-center">
        {/* Sección 2: Datos de Carrera */}
        <View className="mb-8">
          <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-3">Datos de Carrera</Text>
          <View className="bg-[#121212] rounded-[25px] border border-[#222] p-6 shadow-xl">
              <View className="flex-row justify-between items-center">
                  <View className="items-center">
                      <Ionicons name="repeat" size={20} color="#E10600" />
                      <Text className="text-white font-black text-lg mt-1">{circuito.numVueltas}</Text>
                      <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">Vueltas</Text>
                  </View>

                  <View className="w-[1px] bg-[#222] h-8" />

                  <View className="items-center">
                      <Ionicons name="stopwatch" size={20} color="#E10600" />
                      <Text className="text-white font-black text-lg mt-1">{formatTime(circuito.tiempoBase)}</Text>
                      <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">T. Base</Text>
                  </View>

                  <View className="w-[1px] bg-[#222] h-8" />

                  <View className="items-center">
                      <Ionicons name="calendar-clear" size={20} color="#E10600" />
                      <Text className="text-white font-black text-lg mt-1">{partida.anio}</Text>
                      <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">Año</Text>
                  </View>
              </View>
          </View>
        </View>

        {/* Sección 3: importancia técnica */}
        <View>
          <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-3">Importancia Técnica</Text>
          
          <View className="flex-row justify-between">
              {/* Aerodinámica */}
              <View className="bg-[#121212] w-[48.5%] rounded-[25px] border border-[#222] p-6 items-center relative overflow-hidden h-40 justify-center">
                  <View className="absolute -right-2 -bottom-2 opacity-[0.07]">
                      <Ionicons name="airplane-outline" size={100} color="#3b82f6" />
                  </View>
                  <View className="bg-blue-500/10 p-2 rounded-xl mb-3 border border-blue-500/20">
                      <Ionicons name="airplane-outline" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-[#555] text-[9px] font-black uppercase mb-1">Aerodinámica</Text>
                  <Text className="text-white text-3xl font-black mb-2">{circuito.aerodinamicaReq}<Text className="text-[#333] text-sm">/10</Text></Text>
                  
                  {/* Barra de progreso Aero */}
                  <View className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                    <View 
                        className="h-full bg-blue-500" 
                        style={{ width: `${circuito.aerodinamicaReq * 10}%` }} 
                    />
                  </View>
              </View>

              {/* Motor */}
              <View className="bg-[#121212] w-[48.5%] rounded-[25px] border border-[#222] p-6 items-center relative overflow-hidden h-40 justify-center">
                  <View className="absolute -right-2 -bottom-2 opacity-[0.07]">
                      <Ionicons name="flame" size={100} color="#ef4444" />
                  </View>
                  <View className="bg-red-500/10 p-2 rounded-xl mb-3 border border-red-500/20">
                      <Ionicons name="flame" size={24} color="#ef4444" />
                  </View>
                  <Text className="text-[#555] text-[9px] font-black uppercase mb-1">Potencia Motor</Text>
                  <Text className="text-white text-3xl font-black mb-2">{circuito.motorReq}<Text className="text-[#333] text-sm">/10</Text></Text>

                  {/* Barra de progreso Motor */}
                  <View className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                    <View 
                        className="h-full bg-red-600" 
                        style={{ width: `${circuito.motorReq * 10}%` }} 
                    />
                  </View>
              </View>
          </View>
        </View>
      </View>

      {/* Sección 4: Acción (Más compacto) */}
      <View className="mt-auto mb-10">
        <TouchableOpacity 
            className="bg-[#E10600] rounded-[20px] py-5 flex-row items-center justify-center shadow-2xl shadow-[#E10600]/40 active:opacity-90"
            activeOpacity={0.8}
        >
            <Text className="text-white text-lg font-black italic tracking-[2px] uppercase">ENTRAR A PISTA</Text>
            <Ionicons name="chevron-forward-circle" size={22} color="white" className="ml-2" />
        </TouchableOpacity>
        <Text className="text-[#333] text-center text-[9px] font-black uppercase mt-4 tracking-[1px]">
            Ingenieros listos · ¿Proceder al inicio?
        </Text>
      </View>
    </View>
  );
}
