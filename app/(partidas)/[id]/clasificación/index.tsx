import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActiveGame } from '@/hooks/store/useActiveGame';
import { useClasificacionConstructores, useClasificacionPilotos } from '@/core/api/hooks/clasificacion/useClasificacion';
import { StandingsDriverItem } from '@/components/clasificacion/StandingsDriverItem';
import { StandingsConstructorItem } from '@/components/clasificacion/StandingsConstructorItem';

/**
 * EmptyStandings
 * Componente visual para cuando no hay datos (temporada no empezada).
 */
const EmptyStandings = () => (
    <View className="py-20 items-center justify-center">
        <View className="bg-[#151515] p-10 rounded-full border border-[#222] mb-6">
            <Ionicons name="calendar-outline" size={60} color="#333" />
        </View>
        <Text className="text-white font-black italic text-xl uppercase">Temporada no comenzada</Text>
        <Text className="text-[#555] text-[10px] font-bold uppercase tracking-[2px] mt-2 text-center px-10">
            Las clasificaciones se actualizarán tras completar el primer Gran Premio.
        </Text>
    </View>
);

/**
 * ClasificacionScreen
 * 
 * Muestra el Mundial de Pilotos y Constructores con un diseño premium.
 * Incluye un selector de pestañas para alternar entre ambas clasificaciones.
 */
export default function ClasificacionScreen() {
    const [activeTab, setActiveTab] = useState<'pilotos' | 'constructores'>('pilotos');
    const { partida, isLoading: loadingGame } = useActiveGame();

    // Hooks de TanStack Query
    const { 
        data: pilotos, 
        isLoading: loadingPilotos 
    } = useClasificacionPilotos(partida?.id || 0, partida?.proximoCircuito || 0);

    const { 
        data: constructores, 
        isLoading: loadingConstructores 
    } = useClasificacionConstructores(partida?.id || 0, partida?.proximoCircuito || 0);

    if (loadingGame) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0a0a0a]">
            {/* Cabecera de la Sección */}
            <View className="pt-8 pb-4 px-6 bg-[#0c0c0c] border-b border-[#1a1a1a]">
                <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-1">Standings</Text>
                <Text className="text-white text-2xl font-black italic uppercase">CAMPEONATO MUNDIAL</Text>
                
                {/* Selector de Pestañas */}
                <View className="flex-row bg-[#151515] p-1 rounded-2xl border border-[#222] mt-6">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('pilotos')}
                        className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'pilotos' ? 'bg-[#E10600]' : ''}`}
                    >
                        <Text className={`font-black uppercase italic text-[11px] ${activeTab === 'pilotos' ? 'text-white' : 'text-[#555]'}`}>Pilotos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('constructores')}
                        className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'constructores' ? 'bg-[#E10600]' : ''}`}
                    >
                        <Text className={`font-black uppercase italic text-[11px] ${activeTab === 'constructores' ? 'text-white' : 'text-[#555]'}`}>Constructores</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'pilotos' ? (
                    loadingPilotos ? (
                        <ActivityIndicator size="small" color="#E10600" className="mt-20" />
                    ) : (pilotos && pilotos.length > 0) ? (
                        pilotos
                            .sort((a, b) => b.puntos - a.puntos)
                            .map((piloto, index) => (
                                <StandingsDriverItem key={piloto.id} piloto={piloto} index={index} />
                            ))
                    ) : (
                        <EmptyStandings />
                    )
                ) : (
                    loadingConstructores ? (
                        <ActivityIndicator size="small" color="#E10600" className="mt-20" />
                    ) : (constructores && constructores.length > 0) ? (
                        constructores
                            .sort((a, b) => b.puntos - a.puntos)
                            .map((constructor, index) => (
                                <StandingsConstructorItem key={constructor.id} constructor={constructor} index={index} />
                            ))
                    ) : (
                        <EmptyStandings />
                    )
                )}

                {/* Info de Temporada */}
                <View className="mt-6 items-center">
                    <View className="bg-[#151515] px-4 py-2 rounded-full border border-[#222]">
                        <Text className="text-[#555] text-[8px] font-black uppercase tracking-[2px]">Temporada {partida?.anio || 2024} • Round {partida?.proximoCircuito || 1}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
