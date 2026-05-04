import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTeamImage } from '../../constants/TeamAssets';
import { useActiveGame } from '../../hooks/store/useActiveGame';
import { useEscuderia } from '../../hooks/partidas/useEscuderia';
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
    const insets = useSafeAreaInsets();
    const { partida, isLoading: loadingGame } = useActiveGame();
    
    // Conectamos el Header directamente a la query de la escudería
    // Esto permite que el presupuesto se actualice al invalidar esta query específica
    const { data: escuderia, isLoading: loadingEscuderia } = useEscuderia(partida?.escuderia?.id || 0);

    if (loadingGame || !partida || !escuderia) return null;

    const localImage = escuderia.imagen ? getTeamImage(escuderia.imagen.replace(BASE_URL, '')) : null;
    const imageSource = localImage ? localImage : { uri: escuderia.imagen };

    return (
        <View
            style={{ paddingTop: Math.max(insets.top, 20) }}
            className="bg-[#0c0c0c] pb-7 px-6 border-b border-[#222] shadow-xl shadow-black/50"
        >
            <View className="flex-row items-center justify-between">
                {/* Lado Izquierdo: Identidad de Escudería */}
                <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-11 h-11 bg-[#151515] rounded-xl border border-[#222] items-center justify-center overflow-hidden shadow-sm">
                        {escuderia.imagen ? (
                            <Image
                                source={imageSource}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="car-sport" size={20} color="#555" />
                        )}
                    </View>

                    <View className="ml-3 flex-1">
                        <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px]">Escudería Oficial</Text>
                        <Text 
                            numberOfLines={1} 
                            ellipsizeMode="tail"
                            className="text-white text-lg font-black italic uppercase leading-tight tracking-[-0.5px]"
                        >
                            {escuderia.nombre}
                        </Text>
                    </View>
                </View>

                {/* Lado Derecho: HUD Financiero Premium (Preparado para 8+ dígitos) */}
                <View className="min-w-[110px]">
                    <View className="bg-[#151515] border border-[#222] pl-2 pr-3 py-1.5 rounded-2xl flex-row items-center shadow-2xl">
                        <View className="bg-emerald-500/15 p-1.5 rounded-xl mr-2.5 border border-emerald-500/20">
                            <Ionicons name="wallet" size={14} color="#10b981" />
                        </View>
                        <View>
                            <Text className="text-[#444] text-[8px] font-black uppercase tracking-[1px] mb-0.5">Tesorería</Text>
                            <Text 
                                className="text-emerald-400 font-black text-sm tracking-[0.5px]"
                                style={{ fontSize: escuderia.presupuesto > 9999 ? 12 : 14 }}
                            >
                                {escuderia.presupuesto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}M €
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
