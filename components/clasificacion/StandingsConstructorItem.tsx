import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClasificacionConstructor } from '@/core/api/action/clasificacion.action';
import { getTeamImage } from '@/constants/TeamAssets';
import { BASE_URL } from '@/utils/api';

interface StandingsConstructorItemProps {
    constructor: ClasificacionConstructor;
    index: number;
}

/**
 * StandingsConstructorItem
 * Componente para renderizar la tarjeta de una escudería en el mundial de constructores.
 */
export const StandingsConstructorItem = ({ constructor, index }: StandingsConstructorItemProps) => {
    const teamImg = getTeamImage(constructor.imagen.replace(BASE_URL, ''));

    return (
        <View className="bg-[#151515] border border-[#222] rounded-3xl p-5 mb-5 shadow-sm">
            <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center flex-1">
                    {/* Posición */}
                    <View className="w-8 items-center">
                        <Text className={`font-black italic text-xl ${index < 3 ? 'text-[#E10600]' : 'text-[#333]'}`}>
                            {index + 1}
                        </Text>
                    </View>

                    {/* Logo Escudería */}
                    <View className="w-12 h-12 bg-[#0a0a0a] rounded-full items-center justify-center border border-[#333] overflow-hidden ml-2 shadow-inner">
                        {teamImg ? (
                            <Image source={teamImg} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <Ionicons name="shield-outline" size={20} color="#E10600" />
                        )}
                    </View>

                    <View className="ml-4 flex-1">
                        <Text className="text-white font-black uppercase italic text-lg leading-tight" numberOfLines={1}>{constructor.nombre}</Text>
                    </View>
                </View>

                <View className="items-end">
                    <Text className="text-white font-black italic text-2xl leading-none">{constructor.puntos}</Text>
                    <Text className="text-[#E10600] text-[8px] font-black uppercase tracking-[1px] mt-1">PTS</Text>
                </View>
            </View>

            {/* Desglose de Pilotos */}
            <View className="flex-row bg-black/20 rounded-2xl p-3 border border-white/5">
                <View className="flex-1 border-r border-[#222] pr-2">
                    <Text className="text-[#555] text-[7px] font-black uppercase mb-1">Piloto 1</Text>
                    <Text className="text-white text-[10px] font-bold uppercase italic" numberOfLines={1}>{constructor.piloto1.nombre}</Text>
                    <Text className="text-[#E10600] text-[9px] font-black italic">{constructor.piloto1.puntos} PTS</Text>
                </View>
                <View className="flex-1 pl-4">
                    <Text className="text-[#555] text-[7px] font-black uppercase mb-1">Piloto 2</Text>
                    <Text className="text-white text-[10px] font-bold uppercase italic" numberOfLines={1}>{constructor.piloto2.nombre}</Text>
                    <Text className="text-[#E10600] text-[9px] font-black italic">{constructor.piloto2.puntos} PTS</Text>
                </View>
            </View>
        </View>
    );
};
