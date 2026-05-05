import React from 'react';
import { View, Text, Image } from 'react-native';
import { ClasificacionPiloto } from '@/core/api/action/clasificacion.action';
import { getTeamImage } from '@/constants/TeamAssets';
import { BASE_URL } from '@/utils/api';

interface StandingsDriverItemProps {
    piloto: ClasificacionPiloto;
    index: number;
}

/**
 * StandingsDriverItem
 * Componente para renderizar una fila en la clasificación de pilotos.
 */
export const StandingsDriverItem = ({ piloto, index }: StandingsDriverItemProps) => {
    const teamImg = getTeamImage(piloto.escuderia.imagen.replace(BASE_URL, ''));

    return (
        <View className="bg-[#151515] border border-[#222] rounded-3xl p-4 mb-4 flex-row items-center">
            {/* Posición */}
            <View className="w-8 items-center">
                <Text className={`font-black italic text-lg ${index < 3 ? 'text-[#E10600]' : 'text-[#333]'}`}>
                    {index + 1}
                </Text>
            </View>

            {/* Avatar Piloto (Fallback con logo de escudería) */}
            <View className="w-12 h-12 bg-[#1a1a1a] rounded-full border border-[#333] overflow-hidden ml-2">
                {teamImg && <Image source={teamImg} className="w-full h-full" resizeMode="contain" />}
            </View>

            <View className="flex-1 ml-4">
                <Text className="text-white font-black uppercase italic text-[14px] leading-tight">{piloto.nombre}</Text>
                <Text className="text-[#555] text-[9px] font-bold uppercase mt-1">Escudería {piloto.escuderia.nombre}</Text>
            </View>

            <View className="items-end">
                <Text className="text-white font-black italic text-xl">{piloto.puntos}</Text>
                <Text className="text-[#444] text-[8px] font-bold uppercase tracking-[1px]">PTS</Text>
            </View>
        </View>
    );
};
