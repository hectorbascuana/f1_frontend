import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClasificacionScreen() {
  return (
    <View className='flex-1 bg-[#0a0a0a] justify-center items-center p-10'>
      <View className="bg-[#151515] p-8 rounded-full mb-6 border border-[#222]">
        <Ionicons name="list-outline" size={60} color="#E10600" />
      </View>
      <Text className='text-white font-black italic text-2xl uppercase'>Mundial F1</Text>
      <Text className='text-[#555] italic uppercase text-[10px] tracking-[2px] mt-2 text-center'>
        Consulta la clasificación de pilotos y constructores actualizada.
      </Text>
      <View className="mt-10 bg-[#151515] px-6 py-3 rounded-xl border border-dashed border-[#333]">
        <Text className='text-[#E10600] font-bold text-xs uppercase tracking-[1px]'>Módulo en fase de desarrollo</Text>
      </View>
    </View>
  );
}
