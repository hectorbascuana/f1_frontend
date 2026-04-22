
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useActiveGame } from '../../../../hooks/partidas/useActiveGame';

export default function PilotosScreen() {
  const { partida, isLoading } = useActiveGame();

  return (
    <View className='flex-1 bg-[#0a0a0a] justify-center items-center p-10'>
      <View className="bg-[#151515] p-8 rounded-full mb-6 border border-[#222]">
        <Ionicons name="people-outline" size={60} color="#E10600" />
      </View>
      <Text className='text-white font-black italic text-2xl uppercase'>Pilotos: {partida?.escuderia.nombre || '...'}</Text>
      <Text className='text-[#555] italic uppercase text-[10px] tracking-[2px] mt-2 text-center'>
        Gestiona tus contratos y revisa el rendimiento de tus pilotos actuales.
      </Text>
      <View className="mt-10 bg-[#151515] px-6 py-3 rounded-xl border border-dashed border-[#333]">
        <Text className='text-[#E10600] font-bold text-xs uppercase tracking-[1px]'>Módulo en fase de desarrollo</Text>
      </View>
    </View>
  );
}