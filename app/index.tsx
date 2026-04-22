import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import PartidaSlot from '../components/partidas/PartidaSlot';
import { usePartidas } from '../hooks/partidas/usePartidas';

/**
 * Pantalla de Inicio (index.tsx)
 * 
 * Responsabilidad: Ser la primera pantalla que encuentra el jugador. 
 * Muestra el menú de selección de partidas (Modo Carrera).
 */
export default function MenuPartidasScreen() {
    // Extraemos la información del custom hook (Clean code)
    const { partidas, isLoading, error } = usePartidas();

    return (
        <View className="flex-1 bg-[#0a0a0a] pt-[50px]">
            {/* Header / Titulo Superior */}
            <View className="items-center py-6 border-b border-[#222222] mb-4">
                <Text className="text-white text-[28px] font-black tracking-[2px]">F1 MANAGER</Text>
                <Text className="text-[#E10600] text-base font-bold tracking-[4px] mt-1">MODO CARRERA</Text>
            </View>

            {/* Contenedor principal de guardados */}
            <ScrollView contentContainerClassName="px-4 pb-6">
                {isLoading ? (
                    // Spinner oscuro / corporativo para cargar datos
                    <View className="mt-[50px] items-center">
                        <ActivityIndicator size="large" color="#E10600" />
                        <Text className="mt-4 text-[#AAAAAA] text-sm">Cargando datos de telemetría...</Text>
                    </View>
                ) : error ? (
                    // Manejo de error si falla la conexión al server 8081
                    <View className="mt-10 bg-[#2A0808] border border-[#E10600] p-4 rounded-lg items-center">
                        <Text className="text-[#E10600] font-bold text-base mb-2">⚠️ ALERTA DE SISTEMA</Text>
                        <Text className="text-[#FFCCCC] text-center leading-5">{error}</Text>
                    </View>
                ) : (
                    // Iteramos exactamente de 1 a 3 para mapear siempre los tres slots mandatorios
                    [1, 2, 3].map((slotNumber) => {
                        // Comprobamos si el servidor nos devuelve una partida para este indice
                        // Nota: Asume que las partidas que vengan ocupan los slots en el orden en el que de las devuelva el array (max 3)
                        const partidaParaEsteSlot = partidas[slotNumber - 1];

                        return (
                            <PartidaSlot
                                key={`slot-${slotNumber}`}
                                slotNumber={slotNumber}
                                partida={partidaParaEsteSlot}
                            />
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}
