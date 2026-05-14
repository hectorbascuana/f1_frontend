import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { getTeamImage } from '../../constants/TeamAssets';
import { useBorrarPartida } from '../../core/api/hooks/partidas/useBorrarPartida';
import { useGameStore } from '../../core/store/useGameStore';
import { Partida } from '../../types/partida';
import { BASE_URL } from '../../utils/api';

/**
 * Interface del componente.
 */
interface GameSlotProps {
    partida?: Partida;
    slotNumber: number;
}

/**
 * PartidaSlot Component
 * 
 * Responsabilidad: Renderizar un hueco de partida guardada.
 */
export default function PartidaSlot({ partida, slotNumber }: GameSlotProps) {
    const { mutate: borrar, isPending: estaBorrando } = useBorrarPartida();
    const setPartida = useGameStore((state) => state.setPartida);

    const confirmarBorrado = () => {
        if (!partida) return;

        Alert.alert(
            "Eliminar Partida",
            `¿Estás seguro de que quieres borrar la carrera "${partida.nombre}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => borrar(partida.id)
                }
            ]
        );
    };

    const cargarPartida = (partida: Partida) => {
        setPartida(partida);
        router.push({
            pathname: "/(partidas)/[id]/carrera",
            params: { id: partida.id }
        });
    };

    if (!partida) {
        return (
            <Link href="/nueva-partida" asChild>
                <TouchableOpacity
                    className="bg-[#0c0c0c] border-dashed border-2 border-[#222] justify-center items-center py-8 rounded-2xl mb-4"
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle-outline" size={32} color="#444" className="mb-2" />
                    <Text className="text-[#444] text-xs font-black tracking-[2px] mb-1">RANURA {slotNumber}</Text>
                    <Text className="text-[#E10600] text-sm font-bold uppercase">Iniciar Nueva Carrera</Text>
                </TouchableOpacity>
            </Link>
        );
    }

    const { escuderia } = partida;
    const localImage = getTeamImage(escuderia.imagen.replace(BASE_URL, ''));
    const imageSource = localImage ? localImage : { uri: escuderia.imagen };

    const parsedDate = new Date(partida.fechaCreacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <TouchableOpacity
            className={`bg-[#151515] rounded-2xl p-4 mb-4 border border-[#222] shadow-black/30 shadow-lg ${estaBorrando ? 'opacity-50' : ''}`}
            activeOpacity={0.8}
            onPress={() => cargarPartida(partida)}
        >
            <View className="flex-row items-center">
                <View className="w-16 h-16 bg-[#1e1e1e] rounded-xl justify-center items-center mr-4 border border-[#333] overflow-hidden">
                    {escuderia.imagen ? (
                        <Image
                            source={imageSource}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="car-sport-outline" size={30} color="#555" />
                    )}
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-white text-[17px] font-black flex-1 mr-2" numberOfLines={1}>
                            {partida.nombre}
                        </Text>
                        <View className="bg-[#E10600] px-2 py-0.5 rounded">
                            <Text className="text-white text-[10px] font-bold">{partida.anio}</Text>
                        </View>
                    </View>

                    <Text className="text-[#AAAAAA] text-sm font-semibold mb-2">{escuderia.nombre}</Text>

                    <View className="flex-row items-center">
                        <View className="flex-row items-center mr-4">
                            <Ionicons name="wallet-outline" size={16} color="#4CD964" />
                            <Text className="text-emerald-400 text-xs font-bold ml-1">{escuderia.presupuesto} M €</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="flag-outline" size={16} color="#FFB800" />
                            <Text className="text-amber-400 text-xs font-bold ml-1">{partida.proximoCircuito}/24</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="mt-3 pt-2 border-t border-[#222] flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={12} color="#555" className="mr-1" />
                    <Text className="text-[#555] text-[11px] font-semibold">Guardado: {parsedDate}</Text>
                </View>

                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={confirmarBorrado}
                        className="mr-3 p-1"
                        disabled={estaBorrando}
                    >
                        {estaBorrando ? (
                            <ActivityIndicator size="small" color="#E10600" />
                        ) : (
                            <Ionicons name="trash-outline" size={18} color="#999" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>

    );
}
