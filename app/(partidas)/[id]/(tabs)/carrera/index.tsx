import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PartidaHeader from '../../../../../components/partidas/PartidaHeader';
import { getDriverImage } from '../../../../../constants/DriverAssets';
import { useCircuito } from '../../../../../core/api/hooks/carrera/useCircuito';
import { useCircuitos } from '../../../../../core/api/hooks/carrera/useCircuitos';
import { useResultadoCarrera } from '../../../../../core/api/hooks/carrera/useResultadoCarrera';
import { useActiveGame } from '../../../../../hooks/store/useActiveGame';

export default function GameDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { partida, isLoading: loadingPartida } = useActiveGame();
  const { data: todosLosCircuitos, isLoading: loadingTodos } = useCircuitos();

  // Estado para el circuito que estamos visualizando actualmente
  const [idCircuitoVisualizado, setIdCircuitoVisualizado] = useState<number | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [clasificacionVisible, setClasificacionVisible] = useState(false);

  // Sincronizar el ID visualizado con el de la partida al cargar o cuando avanza la ronda
  useEffect(() => {
    if (partida?.proximoCircuito) {
      setIdCircuitoVisualizado(partida.proximoCircuito);
    }
  }, [partida?.proximoCircuito]);

  const { data: circuito, isLoading: loadingCircuito } = useCircuito(idCircuitoVisualizado || 1);

  // Nuevo Hook para resultados oficiales
  const {
    data: resultados,
    isLoading: loadingResultados
  } = useResultadoCarrera(
    partida?.id || 0,
    partida?.anio || 2025,
    idCircuitoVisualizado || 0,
    partida?.proximoCircuito || 0
  );

  if (loadingPartida || loadingCircuito || loadingTodos) {
    return (
      <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
        <ActivityIndicator size="large" color="#E10600" />
        <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px]">SINCRONIZANDO TELEMETRÍA...</Text>
      </View>
    );
  }

  if (!partida || !circuito) return null;

  const esSiguienteCarrera = idCircuitoVisualizado === partida.proximoCircuito;
  const esCarreraPasada = (idCircuitoVisualizado || 0) < partida.proximoCircuito;

  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    return parts.length < 3 ? timeStr : `${parts[1]}:${parts[2]}`;
  };

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      <PartidaHeader />
      <View className="flex-1 px-6">

        {/* Sección 1: Cabecera con Selector */}
        <View className="pt-2 mb-2">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center">
              <View className="bg-[#E10600] w-2 h-3 mr-2" />
              <Text className="text-[#555] text-[10px] font-black uppercase tracking-[3px]">
                {esSiguienteCarrera ? "Siguiente carrera" : esCarreraPasada ? "Carrera finalizada" : "Próximo evento"}
              </Text>
            </View>

            {!esSiguienteCarrera && (
              <TouchableOpacity
                onPress={() => setIdCircuitoVisualizado(partida.proximoCircuito)}
                className="flex-row items-center bg-[#E10600]/10 px-2 py-1 rounded-md"
              >
                <Ionicons name="arrow-back" size={12} color="#E10600" />
                <Text className="text-[#E10600] text-[9px] font-black uppercase ml-1">Volver a la actual</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className="bg-[#121212] border border-[#222] rounded-2xl p-4 flex-row items-center justify-between shadow-lg"
            onPress={() => setSelectorVisible(true)}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={10} color="#E10600" />
                <Text className="text-[#555] text-[9px] font-black uppercase tracking-[1.5px] ml-1">Circuito Seleccionado</Text>
              </View>
              <Text
                className="text-white text-2xl font-black italic uppercase tracking-[-0.5px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {circuito.nombre}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-sharp" size={10} color="#E10600" />
                <Text className="text-[#888] text-[10px] font-bold ml-1 uppercase">{circuito.pais}</Text>
              </View>
            </View>
            <View className="bg-[#E10600]/10 p-2.5 rounded-xl border border-[#E10600]/20">
              <Ionicons name="swap-horizontal" size={20} color="#E10600" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center">
          {/* Sección 2: Datos de Carrera */}
          <View className="mb-4">
            <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-2">Datos de Carrera</Text>
            <View className="bg-[#121212] rounded-[25px] border border-[#222] p-6 shadow-xl">
              <View className="flex-row justify-between items-center">
                <View className="items-center">
                  <Ionicons name="repeat" size={18} color="#E10600" />
                  <Text className="text-white font-black text-lg mt-1">{circuito.numVueltas}</Text>
                  <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">Vueltas</Text>
                </View>
                <View className="w-[1px] bg-[#222] h-8" />
                <View className="items-center">
                  <Ionicons name="stopwatch" size={18} color="#E10600" />
                  <Text className="text-white font-black text-lg mt-1">{formatTime(circuito.tiempoBase)}</Text>
                  <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">T. Base</Text>
                </View>
                <View className="w-[1px] bg-[#222] h-8" />
                <View className="items-center">
                  <Ionicons name="calendar-clear" size={18} color="#E10600" />
                  <Text className="text-white font-black text-lg mt-1">{partida.anio}</Text>
                  <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">Año</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sección 3: Importancia Técnica */}
          <View className="mb-2">
            <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-2">Importancia Técnica</Text>
            <View className="flex-row justify-between">
              <View className="bg-[#121212] w-[48.5%] rounded-[25px] border border-[#222] p-5 items-center relative overflow-hidden h-36 justify-center">
                <View className="absolute -right-2 -bottom-2 opacity-[0.05]">
                  <Ionicons name="airplane-outline" size={80} color="#3b82f6" />
                </View>
                <View className="bg-blue-500/10 p-2 rounded-xl mb-2 border border-blue-500/20">
                  <Ionicons name="airplane-outline" size={20} color="#3b82f6" />
                </View>
                <Text className="text-[#555] text-[8px] font-black uppercase mb-1">Aerodinámica</Text>
                <Text className="text-white text-2xl font-black mb-2">{circuito.aerodinamicaReq}<Text className="text-[#333] text-xs">/10</Text></Text>
                <View className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                  <View className="h-full bg-blue-500" style={{ width: `${circuito.aerodinamicaReq * 10}%` }} />
                </View>
              </View>

              <View className="bg-[#121212] w-[48.5%] rounded-[25px] border border-[#222] p-5 items-center relative overflow-hidden h-36 justify-center">
                <View className="absolute -right-2 -bottom-2 opacity-[0.05]">
                  <Ionicons name="flame" size={80} color="#ef4444" />
                </View>
                <View className="bg-red-500/10 p-2 rounded-xl mb-2 border border-red-500/20">
                  <Ionicons name="flame" size={20} color="#ef4444" />
                </View>
                <Text className="text-[#555] text-[8px] font-black uppercase mb-1">Potencia Motor</Text>
                <Text className="text-white text-2xl font-black mb-2">{circuito.motorReq}<Text className="text-[#333] text-sm">/10</Text></Text>
                <View className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                  <View className="h-full bg-red-600" style={{ width: `${circuito.motorReq * 10}%` }} />
                </View>
              </View>
            </View>
          </View>

          {/* Sección 4: Resultados / Podio (Si es pasada) */}
          {esCarreraPasada && resultados && resultados.length > 0 && (
            <View className="mt-4">
              <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-3">Resultados GP</Text>
              <TouchableOpacity
                onPress={() => setClasificacionVisible(true)}
                activeOpacity={0.8}
                className="bg-[#121212] border border-[#222] rounded-[25px] p-4 items-center"
              >
                <View className="flex-row items-end justify-center mb-2">
                  {/* 2º Puesto */}
                  <View className="items-center mx-2 transform translate-y-2">
                    <Text className="text-[#C0C0C0] font-black text-xs">2º</Text>
                    <View className="bg-[#1a1a1a] p-1.5 rounded-full border border-gray-500 my-1 overflow-hidden w-10 h-10 items-center justify-center">
                      {resultados[1] ? (
                        <Image
                          source={getDriverImage(resultados[1].pilotoImagen.replace('assets/drivers/', 'assets/images/drivers/'))}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={20} color="#C0C0C0" />
                      )}
                    </View>
                    <Text className="text-white text-[9px] font-bold">{resultados[1]?.pilotoNombre.split(' ').pop()?.toUpperCase() || '---'}</Text>
                  </View>
                  {/* 1º Puesto */}
                  <View className="items-center mx-4 -translate-y-1">
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                    <View className="bg-[#1a1a1a] p-1 rounded-full border border-yellow-500 my-1 overflow-hidden w-14 h-14 items-center justify-center">
                      {resultados[0] ? (
                        <Image
                          source={getDriverImage(resultados[0].pilotoImagen.replace('assets/drivers/', 'assets/images/drivers/'))}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={28} color="#FFD700" />
                      )}
                    </View>
                    <Text className="text-white text-[10px] font-black uppercase">{resultados[0]?.pilotoNombre.split(' ').pop()?.toUpperCase() || '---'}</Text>
                  </View>
                  {/* 3º Puesto */}
                  <View className="items-center mx-2 transform translate-y-4">
                    <Text className="text-[#CD7F32] font-black text-xs">3º</Text>
                    <View className="bg-[#1a1a1a] p-1.5 rounded-full border border-orange-500 my-1 overflow-hidden w-10 h-10 items-center justify-center">
                      {resultados[2] ? (
                        <Image
                          source={getDriverImage(resultados[2].pilotoImagen.replace('assets/drivers/', 'assets/images/drivers/'))}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={20} color="#CD7F32" />
                      )}
                    </View>
                    <Text className="text-white text-[9px] font-bold">{resultados[2]?.pilotoNombre.split(' ').pop()?.toUpperCase() || '---'}</Text>
                  </View>
                </View>
                <View className="bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333] mt-4">
                  <Text className="text-[#E10600] text-[9px] font-black uppercase">Ver Resultados Completos</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Sección Acción / Botón */}
        <View className="mt-auto mb-6">
          {esSiguienteCarrera && (
            <TouchableOpacity
              onPress={() => router.push(`/(partidas)/${id}/simulacion` as any)}
              className="bg-[#E10600] rounded-[22px] py-5 flex-row items-center justify-center shadow-xl active:opacity-90"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-black italic tracking-[2px] uppercase">ENTRAR A PISTA</Text>
              <Ionicons name="chevron-forward-circle" size={22} color="white" className="ml-2" />
            </TouchableOpacity>
          )}
        </View>

        {/* MODAL: Selector de Circuitos */}
        <Modal visible={selectorVisible} animationType="slide" transparent={true}>
          <View className="flex-1 bg-black/90" style={{ paddingTop: insets.top + 20 }}>
            <View className="flex-row justify-between items-center px-6 mb-6">
              <Text className="text-white text-2xl font-black italic uppercase">Calendario {partida.anio}</Text>
              <TouchableOpacity onPress={() => setSelectorVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#E10600" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={todosLosCircuitos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setIdCircuitoVisualizado(item.id);
                    setSelectorVisible(false);
                  }}
                  className={`mx-6 mb-3 p-4 rounded-2xl border ${item.id === idCircuitoVisualizado ? 'bg-[#E10600] border-transparent' : 'bg-[#151515] border-[#333]'}`}
                >
                  <View className="flex-row items-center">
                    <View className="flex-1 mr-4">
                      <Text className="text-[#555] text-[10px] font-black uppercase mb-1">RACE {item.id}</Text>
                      <Text
                        className={`text-lg font-black ${item.id === idCircuitoVisualizado ? 'text-white' : 'text-white'}`}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.nombre}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className={`text-xs font-bold mr-2 ${item.id === idCircuitoVisualizado ? 'text-white/80' : 'text-[#888]'}`}>{item.pais}</Text>
                      {item.id === partida.proximoCircuito && (
                        <View className="bg-white/20 px-2 py-0.5 rounded">
                          <Text className="text-white text-[8px] font-black">ACTUAL</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        </Modal>

        {/* MODAL: Clasificación Final */}
        <Modal visible={clasificacionVisible} animationType="fade" transparent={true}>
          <View className="flex-1 bg-black/95" style={{ paddingTop: insets.top + 20 }}>
            <View className="flex-row justify-between items-center px-6 mb-6">
              <View className="flex-1 mr-4">
                <Text className="text-[#E10600] text-xs font-black uppercase tracking-[3px]">Resultados Finales</Text>
                <Text className="text-white text-2xl font-black italic uppercase" numberOfLines={1}>{circuito.nombre}</Text>
              </View>
              <TouchableOpacity onPress={() => setClasificacionVisible(false)} className="p-1">
                <Ionicons name="close-circle" size={32} color="#E10600" />
              </TouchableOpacity>
            </View>

            {loadingResultados ? (
              <ActivityIndicator size="large" color="#E10600" className="mt-20" />
            ) : (
              <FlatList
                data={resultados}
                keyExtractor={(item) => item.pilotoId.toString()}
                renderItem={({ item, index }) => {
                  // Cálculo de puntos F1 estándar
                  const getPoints = (pos: number | null) => {
                    if (pos === 1) return 25;
                    if (pos === 2) return 18;
                    if (pos === 3) return 15;
                    if (pos === 4) return 12;
                    if (pos === 5) return 10;
                    if (pos === 6) return 8;
                    if (pos === 7) return 6;
                    if (pos === 8) return 4;
                    if (pos === 9) return 2;
                    if (pos === 10) return 1;
                    return 0;
                  };

                  const points = getPoints(item.posicion);
                  const driverImg = getDriverImage(item.pilotoImagen.replace('assets/drivers/', 'assets/images/drivers/'));

                  // Nota: La vuelta rápida global se marcaría si la API lo indicara, 
                  // de momento usamos el índice 0 como referencia visual si tiene tiempo.
                  const esVueltaRapidaGlobal = index === 0 && !!item.vueltaRapida;
                  const purpleF1 = "#B35AD1";

                  return (
                    <View className="mx-6 mb-2 bg-[#121212] border border-[#222] rounded-xl p-3 flex-row items-center">
                      <Text className="text-[#E10600] font-black w-8 text-center">
                        {item.posicion ? `${item.posicion}º` : 'DNF'}
                      </Text>

                      <View className="w-10 h-10 bg-[#1a1a1a] rounded-full border border-[#333] mr-3 items-center justify-center overflow-hidden">
                        {driverImg ? (
                          <Image source={driverImg} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <Ionicons name="person" size={20} color="#555" />
                        )}
                      </View>

                      <View className="flex-1">
                        <Text className="text-white font-bold text-sm">{item.pilotoNombre.toUpperCase()}</Text>
                        <View className="flex-row items-center mt-0.5">
                          <Ionicons
                            name="stopwatch-outline"
                            size={10}
                            color={esVueltaRapidaGlobal ? purpleF1 : "#555"}
                          />
                          <Text
                            style={{ color: esVueltaRapidaGlobal ? purpleF1 : "#555" }}
                            className="text-[9px] font-black uppercase ml-1"
                          >
                            {item.vueltaRapida || '---'}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end">
                        <Text className="text-white text-[10px] font-black">{item.tiempoTotal || 'OUT'}</Text>
                        {points > 0 && (
                          <View className="bg-emerald-500/10 px-2 py-0.5 rounded mt-1">
                            <Text className="text-emerald-400 font-bold text-[9px]">+{points} PTS</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
}
