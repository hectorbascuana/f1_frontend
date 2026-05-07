import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Compuesto } from '../../core/types/carreraDTO';

/**
 * PitStopControls.tsx
 * 
 * Controles de estrategia de carrera para los pilotos del jugador.
 * Permite seleccionar el próximo neumático y confirmar la entrada en boxes.
 */

interface PitStopControlsProps {
  compuestoSeleccionado: Compuesto;
  onSelectCompuesto: (compuesto: Compuesto) => void;
  pitStopConfirmado: boolean;
  onConfirmPitStop: () => void;
  disabled?: boolean;
}

export const PitStopControls: React.FC<PitStopControlsProps> = ({
  compuestoSeleccionado,
  onSelectCompuesto,
  pitStopConfirmado,
  onConfirmPitStop,
  disabled
}) => {
  const compuestos: Compuesto[] = ['BLANDO', 'MEDIO', 'DURO'];

  return (
    <View className="mt-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#333]">
      <Text className="text-[#888] text-[9px] font-black uppercase tracking-[1px] mb-2">Estrategia de Boxes</Text>
      
      <View className="flex-row justify-between items-center">
        {/* Selector de Compuesto */}
        <View className="flex-row bg-black p-1 rounded-lg">
          {compuestos.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => onSelectCompuesto(c)}
              disabled={pitStopConfirmado || disabled}
              className={`px-3 py-1.5 rounded-md ${compuestoSeleccionado === c ? 'bg-[#333]' : ''}`}
            >
              <Text 
                className={`text-[10px] font-bold ${
                  compuestoSeleccionado === c 
                    ? c === 'BLANDO' ? 'text-[#E10600]' : c === 'MEDIO' ? 'text-[#FDE047]' : 'text-white'
                    : 'text-[#555]'
                }`}
              >
                {c.charAt(0)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de Entrada */}
        <TouchableOpacity
          onPress={onConfirmPitStop}
          disabled={pitStopConfirmado || disabled}
          className={`px-4 py-2 rounded-lg border ${
            pitStopConfirmado 
              ? 'bg-[#F97316]/10 border-[#F97316]' 
              : 'bg-[#E10600]/10 border-[#E10600]'
          }`}
        >
          <Text className={`text-[10px] font-black uppercase ${pitStopConfirmado ? 'text-[#F97316]' : 'text-[#E10600]'}`}>
            {pitStopConfirmado ? '✓ Parada Confirmada' : 'Entrar en Boxes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
