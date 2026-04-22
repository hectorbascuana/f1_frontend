import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActiveGame } from '../../hooks/partidas/useActiveGame';
import { getTeamImage } from '../../constants/TeamAssets';
import { BASE_URL } from '../../utils/api';

/**
 * PartidaHeader Component
 * 
 * Responsabilidad: Mostrar un resumen global de la partida (Logo, Escudería y Presupuesto)
 * que persista en todas las pantallas internas de la sesión.
 * 
 * Estilo: Dark Premium con acento en F1 Red.
 */
export default function PartidaHeader() {
  const { partida, isLoading } = useActiveGame();

  if (isLoading || !partida) return null;

  const { escuderia } = partida;
  const localImage = getTeamImage(escuderia.imagenUrl.replace(BASE_URL, ''));
  const imageSource = localImage ? localImage : { uri: escuderia.imagenUrl };

  return (
    <View className="bg-[#0c0c0c] pt-20 pb-7 px-6 border-b border-[#222] shadow-xl shadow-black/50">
      <View className="flex-row items-center justify-between">
        {/* Lado Izquierdo: Identidad de Escudería */}
        <View className="flex-row items-center">
            <View className="w-12 h-12 bg-[#151515] rounded-xl border border-[#333] items-center justify-center overflow-hidden shadow-inner">
                {escuderia.imagenUrl ? (
                    <Image 
                        source={imageSource} 
                        className="w-full h-full" 
                        resizeMode="contain" 
                    />
                ) : (
                    <Ionicons name="car-sport" size={24} color="#555" />
                )}
            </View>
            
            <View className="ml-4">
                <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px]">Manager de</Text>
                <Text className="text-white text-xl font-black italic uppercase leading-tight tracking-[-0.5px]">
                    {escuderia.nombre}
                </Text>
            </View>
        </View>

        {/* Lado Derecho: Estado Financiero (Aún más compacto) */}
        <View className="items-end">
            <View className="bg-[#151515] border border-[#222] px-2.5 py-1 rounded-xl flex-row items-center shadow-lg">
                <View className="bg-emerald-500/10 p-1 rounded-lg mr-2">
                    <Ionicons name="wallet" size={14} color="#10b981" />
                </View>
                <View>
                    <Text className="text-emerald-400 font-black text-sm leading-tight">{escuderia.presupuesto}M €</Text>
                </View>
            </View>
        </View>
      </View>
    </View>
  );
}
