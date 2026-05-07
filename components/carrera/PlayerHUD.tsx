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
  pilotos: any[]; // Puede ser PilotoRankingDTO o ParrillaEntryDTO
  compuestos: Record<number, Compuesto>;
  pitStopsConfirmados?: Record<number, boolean>;
  onSelectCompuesto: (pilotoId: number, c: Compuesto) => void;
  onConfirmPitStop?: (pilotoId: number) => void;
  isGrid?: boolean;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  pilotos,
  compuestos,
  pitStopsConfirmados = {},
  onSelectCompuesto,
  onConfirmPitStop,
  isGrid = false,
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

  const getPosicionColor = (pos: number) => {
    switch (pos) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#E10600';
    }
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-[#0f0f0f]/95 border-t-2 border-[#E10600]/30 p-4 pt-3 flex-row justify-between shadow-2xl">
      {pilotos.map((p, idx) => {
        const nextComp = compuestos[p.pilotoId] || 'MEDIO';
        const isConfirmed = !!pitStopsConfirmados[p.pilotoId];
        
        return (
          <View 
            key={p.pilotoId} 
            className={`w-[48.5%] ${idx === 0 ? 'border-r border-[#333] pr-3' : 'pl-3'}`}
            style={{ opacity: p.dnf ? 0.3 : 1 }}
          >
            {/* Overlay RETIRED */}
            {p.dnf && (
              <View className="absolute inset-0 z-10 items-center justify-center">
                <Text className="text-red-500 font-black italic text-[10px] tracking-[2px] bg-black/60 px-2 py-0.5 rounded border border-red-500/50">RETIRED</Text>
              </View>
            )}

            {/* Cabecera Piloto */}
            <View className={`flex-row justify-between items-center mb-3 ${idx === 0 ? 'flex-row-reverse' : ''}`}>
              <View className={`flex-row items-center ${idx === 0 ? 'flex-row-reverse' : ''}`}>
                <View className={`bg-[#E10600] w-2 h-4 rounded-full ${idx === 0 ? 'ml-2' : 'mr-2'}`} />
                <Text className="text-white font-black text-[13px] uppercase" numberOfLines={1}>{p.nombre.split(' ').pop()}</Text>
              </View>
              <Text style={{ color: getPosicionColor(p.posicion) }} className="font-black text-[14px] italic">{p.posicion}º</Text>
            </View>

            {/* Telemetría rápida (Oculta en Parrilla) */}
            {!isGrid && (
              <View className={`flex-row justify-between items-center mb-3 ${idx === 0 ? 'flex-row-reverse' : ''}`}>
                <View className={`flex-row items-center ${idx === 0 ? 'flex-row-reverse' : ''}`}>
                    <Ionicons name="speedometer-outline" size={12} color="#888" />
                    <Text className={`text-[#888] text-[10px] font-bold ${idx === 0 ? 'mr-1.5' : 'ml-1.5'}`}>{Math.round(p.desgaste || 0)}%</Text>
                </View>
                <Text className="text-[#555] text-[10px] font-bold italic">GAP: {p.gapMs === 0 ? 'LDR' : `${(p.gapMs/1000).toFixed(1)}s`}</Text>
              </View>
            )}

            {/* Selector y Botón (MÁS GRANDES) */}
            <View className={`flex-row items-center justify-between ${idx === 0 ? 'flex-row-reverse' : ''}`}>
               <View className={`flex-row bg-black p-1 rounded-xl border border-[#222] ${isGrid ? 'p-1.5' : ''}`}>
                  {(['S', 'M', 'H'] as const).map((letter, i) => {
                    const c = i === 0 ? 'BLANDO' : i === 1 ? 'MEDIO' : 'DURO';
                    const isSel = nextComp === c;
                    const cColor = getCompuestoColor(c as Compuesto);
                    return (
                      <TouchableOpacity 
                        key={c}
                        onPress={() => onSelectCompuesto(p.pilotoId, c as Compuesto)}
                        disabled={isConfirmed || p.dnf || p.enPitStop}
                        className={`${isGrid ? 'w-10 h-10' : 'w-7 h-7'} items-center justify-center rounded-lg ${isSel ? 'bg-white/5 border' : ''}`}
                        style={isSel ? { borderColor: `${cColor}66` } : {}}
                      >
                        <Text style={{ color: isSel ? cColor : '#555' }} className={`${isGrid ? 'text-[14px]' : 'text-[11px]'} font-black`}>{letter}</Text>
                      </TouchableOpacity>
                    );
                  })}
               </View>

               {!isGrid && onConfirmPitStop && (
                 <TouchableOpacity 
                  onPress={() => onConfirmPitStop(p.pilotoId)}
                  disabled={isConfirmed || p.dnf || p.enPitStop}
                  className={`p-3 rounded-xl border-2 ${isConfirmed ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-[#E10600]/10 border-[#E10600]/40'}`}
                 >
                   <Ionicons 
                    name={isConfirmed ? "checkmark-circle" : "construct-outline"} 
                    size={20} 
                    color={isConfirmed ? "#F97316" : "#E10600"} 
                   />
                 </TouchableOpacity>
               )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
