import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PilotoRankingDTO, Compuesto } from '../../core/types/carreraDTO';

/**
 * PilotoCard.tsx
 * 
 * Tarjeta individual para cada piloto en el ranking de carrera.
 * Incluye animaciones de posición, indicadores de desgaste y estados especiales (DNF, PitStop).
 */

interface PilotoCardProps {
  piloto: PilotoRankingDTO;
  index: number;
  totalPilotos: number;
  renderExtraControls?: React.ReactNode;
}

const CARD_HEIGHT = 80; // Altura base aproximada para el cálculo de posición

export const PilotoCard: React.FC<PilotoCardProps> = ({ 
  piloto, 
  index, 
  totalPilotos,
  renderExtraControls 
}) => {
  // Valor compartido para la posición vertical
  const translateY = useSharedValue(index * CARD_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(index * (CARD_HEIGHT + 6), {
      damping: 20,
      stiffness: 80,
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    position: 'absolute',
    left: 0,
    right: 0,
  }));

  const getCompuestoColor = (c: Compuesto) => {
    switch (c) {
      case 'BLANDO': return '#E10600';
      case 'MEDIO': return '#FDE047';
      case 'DURO': return '#FFFFFF';
      default: return '#555';
    }
  };

  const getDesgasteColor = (d: number) => {
    if (d < 40) return '#22C55E'; // Verde
    if (d < 75) return '#FACC15'; // Amarillo
    return '#EF4444'; // Rojo
  };

  const getPosicionColor = (pos: number) => {
    switch (pos) {
      case 1: return '#FFD700'; // Oro
      case 2: return '#C0C0C0'; // Plata
      case 3: return '#CD7F32'; // Bronce
      default: return '#E10600'; // F1 Red
    }
  };

  return (
    <Animated.View 
      style={[
        animatedStyle,
        { opacity: piloto.dnf ? 0.4 : 1 }
      ]}
      className={`bg-[#121212] border-2 ${piloto.esJugador ? 'border-[#E10600] shadow-[#E10600]/20' : 'border-[#222]'} rounded-2xl p-4 shadow-lg`}
    >
      <View className="flex-row items-center">
        {/* Posición */}
        <View className="w-10 items-center justify-center">
          <Text 
            style={{ color: getPosicionColor(piloto.posicion) }}
            className="font-black text-xl italic"
          >
            {piloto.posicion}º
          </Text>
        </View>

        {/* Info Piloto */}
        <View className="flex-1 ml-2">
          <View className="flex-row items-center justify-between">
            <Text className={`text-white font-black text-base ${piloto.dnf ? 'line-through text-[#555]' : ''}`}>
              {piloto.nombre.toUpperCase()}
            </Text>
            <Text className="text-[#AAA] text-[10px] font-bold">
              {piloto.gapMs === 0 ? 'LÍDER' : `+${(piloto.gapMs / 1000).toFixed(1)}s`}
            </Text>
          </View>

          {/* Telemetría en tiempo real */}
          <View className="flex-row items-center mt-2">
            {/* Neumático */}
            <View className="flex-row items-center mr-4">
              <View 
                className="w-4 h-4 rounded-full border-2 items-center justify-center mr-1.5"
                style={{ borderColor: getCompuestoColor(piloto.compuesto) }}
              >
                <Text style={{ color: getCompuestoColor(piloto.compuesto) }} className="text-[7px] font-black">
                  {piloto.compuesto.charAt(0)}
                </Text>
              </View>
              <Text className="text-[#888] text-[9px] font-bold">Tires</Text>
            </View>

            {/* Barra de Desgaste */}
            <View className="flex-1 flex-row items-center">
              <View className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden mr-2">
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.min(piloto.desgaste, 100)}%`,
                    backgroundColor: getDesgasteColor(piloto.desgaste)
                  }}
                />
              </View>
              <Text className="text-[#555] text-[8px] font-black">{Math.round(piloto.desgaste)}%</Text>
            </View>
          </View>
        </View>

        {/* Indicadores de Estado */}
        <View className="ml-3 items-center">
          {piloto.enPitStop && (
            <View className="bg-orange-500/20 px-2 py-1 rounded border border-orange-500/40">
              <Ionicons name="construct" size={12} color="#F97316" />
              <Text className="text-[#F97316] text-[8px] font-black uppercase mt-0.5">Boxes</Text>
            </View>
          )}
          {piloto.dnf && (
            <View className="bg-red-500/20 px-2 py-1 rounded border border-red-500/40">
              <Ionicons name="close-circle" size={12} color="#EF4444" />
              <Text className="text-[#EF4444] text-[8px] font-black uppercase mt-0.5">OUT</Text>
            </View>
          )}
        </View>
      </View>

      {/* Controles extra (solo para jugadores) */}
      {renderExtraControls}
    </Animated.View>
  );
};
