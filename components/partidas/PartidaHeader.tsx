import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getTeamImage } from '../../constants/TeamAssets';
import { useEscuderia } from '../../core/api/hooks/partidas/useEscuderia';
import { useActiveGame } from '../../hooks/store/useActiveGame';
import { useGameStore } from '../../core/store/useGameStore';
import { BASE_URL } from '../../utils/api';

/**
 * PartidaHeader Component
 * 
 * Responsabilidad: Mostrar un resumen global de la partida (Logo, Escudería y Presupuesto)
 * que persista en todas las pantallas internas de la sesión. Incluye opción de salida.
 */
export default function PartidaHeader() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { partida, isLoading: loadingGame } = useActiveGame();
    const { limpiarPartida } = useGameStore();

    // Conectamos el Header directamente a la query de la escudería
    const { data: escuderia } = useEscuderia(partida?.escuderia?.id || 0);

    const handleExit = () => {
        Alert.alert(
            "Abandonar sesión",
            "¿Estás seguro de que quieres volver al menú principal?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Salir", 
                    style: "destructive",
                    onPress: () => {
                        limpiarPartida();
                        router.replace('/');
                    }
                }
            ]
        );
    };

    if (loadingGame || !partida || !escuderia) return null;

    const localImage = escuderia.imagen ? getTeamImage(escuderia.imagen.replace(BASE_URL, '')) : null;
    const imageSource = localImage ? localImage : { uri: escuderia.imagen };

    return (
        <View
            style={{ paddingTop: Math.max(insets.top, 20) }}
            className="bg-[#0c0c0c] pb-7 px-5 border-b border-[#222] shadow-xl shadow-black/50"
        >
            <View className="flex-row items-center justify-between">
                
                {/* Lado Izquierdo: Botón Salir + Identidad */}
                <View className="flex-row items-center flex-1 mr-2">
                    <TouchableOpacity 
                        onPress={handleExit}
                        className="mr-3 bg-[#151515] p-2.5 rounded-xl border border-[#222] items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={18} color="#E10600" />
                    </TouchableOpacity>

                    <View className="w-10 h-10 bg-[#151515] rounded-xl border border-[#222] items-center justify-center overflow-hidden">
                        {escuderia.imagen ? (
                            <Image
                                source={imageSource}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="car-sport" size={18} color="#555" />
                        )}
                    </View>

                    <View className="ml-3 flex-1">
                        <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1.5px]">Escudería</Text>
                        <Text
                            numberOfLines={1}
                            className="text-white text-[15px] font-black italic uppercase leading-tight"
                        >
                            {escuderia.nombre}
                        </Text>
                    </View>
                </View>

                {/* Lado Derecho: HUD Financiero */}
                <View className="min-w-[100px]">
                    <View className="bg-[#151515] border border-[#222] pl-2 pr-3 py-1.5 rounded-2xl flex-row items-center">
                        <View className="bg-emerald-500/10 p-1 rounded-lg mr-2 border border-emerald-500/20">
                            <Ionicons name="wallet" size={12} color="#10b981" />
                        </View>
                        <View>
                            <Text className="text-[#444] text-[7px] font-black uppercase tracking-[1px] mb-0.5">Tesorería</Text>
                            <Text
                                className="text-emerald-400 font-black text-[13px] tracking-[0.5px]"
                            >
                                {escuderia.presupuesto.toLocaleString('es-ES', { minimumFractionDigits: 1 })}M €
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
