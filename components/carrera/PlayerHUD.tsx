import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PilotoRankingDTO, Compuesto } from '../../core/types/carreraDTO';

/**
 * PlayerHUD.tsx
 * 
 * Componente persistente (Sticky) que muestra el estado de los dos pilotos del jugador
 * y permite gestionar su estrategia sin importar el scroll del ranking general.
 */

interface PlayerHUDProps {
  pilotos: PilotoRankingDTO[];
  compuestosSiguientes: Record<number, Compuesto>;
  pitStopsConfirmados: Record<number, boolean>;
  onSelectCompuesto: (pilotoId: number, c: Compuesto) => void;
  onConfirmPitStop: (pilotoId: number) => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  pilotos,
  compuestosSiguientes,
  pitStopsConfirmados,
  onSelectCompuesto,
  onConfirmPitStop,
}) => {
  if (pilotos.length === 0) return null;

  const getCompuestoColor = (c: Compuesto) => {
    switch (c) {
      case 'BLANDO': return '#E10600';
      case 'MEDIO': return '#FDE047';
      case 'DURO': return '#FFFFFF';
      default: return '#555';
    }
  };

  const getDesgasteColor = (d: number) => {
    if (d < 40) return '#22C55E';
    if (d < 75) return '#FACC15';
    return '#EF4444';
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-[#0f0f0f]/95 border-t-2 border-[#E10600]/30 p-4 pt-3 flex-row justify-between shadow-2xl">
      {pilotos.map((p, idx) => {
        const nextComp = compuestosSiguientes[p.pilotoId] || 'MEDIO';
        const isConfirmed = !!pitStopsConfirmados[p.pilotoId];
        
        return (
          <View key={p.pilotoId} className={`w-[48.5%] ${idx === 0 ? 'border-r border-[#333] pr-3' : 'pl-1'}`}>
            {/* Cabecera Piloto */}
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <View className="bg-[#E10600] w-1.5 h-3 mr-1.5 rounded-full" />
                <Text className="text-white font-black text-[11px] uppercase" numberOfLines={1}>{p.nombre.split(' ').pop()}</Text>
              </View>
              <Text className="text-[#E10600] font-black text-[12px] italic">{p.posicion}º</Text>
            </View>

            {/* Telemetría rápida */}
            <View className="flex-row justify-between items-center mb-2">
               <View className="flex-row items-center">
                  <Ionicons name="speedometer-outline" size={10} color="#888" />
                  <Text className="text-[#888] text-[9px] font-bold ml-1">{Math.round(p.desgaste)}%</Text>
               </View>
               <Text className="text-[#555] text-[9px] font-bold">GAP: {p.gapMs === 0 ? 'LDR' : `${(p.gapMs/1000).toFixed(1)}s`}</Text>
            </View>

            {/* Selector Mini y Botón */}
            <View className="flex-row items-center justify-between">
               <View className="flex-row bg-black p-0.5 rounded border border-[#222]">
                  {(['B', 'M', 'D'] as const).map((letter, i) => {
                    const c = i === 0 ? 'BLANDO' : i === 1 ? 'MEDIO' : 'DURO';
                    const isSel = nextComp === c;
                    return (
                      <TouchableOpacity 
                        key={c}
                        onPress={() => onSelectCompuesto(p.pilotoId, c as Compuesto)}
                        disabled={isConfirmed || p.dnf || p.enPitStop}
                        className={`w-5 h-5 items-center justify-center rounded ${isSel ? 'bg-[#333]' : ''}`}
                      >
                        <Text style={{ color: isSel ? getCompuestoColor(c as Compuesto) : '#444' }} className="text-[8px] font-black">{letter}</Text>
                      </TouchableOpacity>
                    );
                  })}
               </View>

               <TouchableOpacity 
                onPress={() => onConfirmPitStop(p.pilotoId)}
                disabled={isConfirmed || p.dnf || p.enPitStop}
                className={`p-1.5 rounded border ${isConfirmed ? 'bg-orange-500/20 border-orange-500' : 'bg-[#E10600]/10 border-[#E10600]/40'}`}
               >
                 <Ionicons name={isConfirmed ? "checkmark-circle" : "construct-outline"} size={14} color={isConfirmed ? "#F97316" : "#E10600"} />
               </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};
