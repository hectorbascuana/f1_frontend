import CarCard from '@/components/mejoras/CarCard';
import FacilityRow from '@/components/mejoras/FacilityRow';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useEscuderia } from '../../../../hooks/partidas/useEscuderia';
import { useActiveGame } from '../../../../hooks/store/useActiveGame';


/**
 * MejorasScreen
 * 
 * Pantalla de Desarrollo Técnico (I+D) con diseño de tarjetas cuadradas.
 */
export default function MejorasScreen() {
    const { partida, isLoading: loadingGame, error: errorGame } = useActiveGame();

    // Obtenemos el ID de la escudería de la partida activa
    const escuderiaId = partida?.escuderia?.id;
    const { data: escuderia, isLoading: loadingTech, error: errorTech, refetch } = useEscuderia(escuderiaId || 0);

    // Estado de carga unificado
    if (loadingGame || (loadingTech && !!escuderiaId)) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
                <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px] text-xs uppercase">Sincronizando I+D...</Text>
            </View>
        );
    }

    // Estado de error
    if (errorGame || errorTech || (!escuderia && !loadingTech && !!escuderiaId)) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center px-10">
                <Ionicons name="cloud-offline-outline" size={48} color="#E10600" />
                <Text className="text-white text-center font-black mt-4 uppercase italic">Error de Conexión</Text>
                <Text className="text-[#555] text-center text-xs mt-2">No se ha podido recuperar la telemetría técnica de la escudería.</Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="mt-6 bg-[#151515] border border-[#222] px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold uppercase text-[10px]">Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!escuderia) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <Text className="text-[#555] font-black uppercase italic">Esperando datos de partida...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0a0a0a] px-5 py-4">
            {/* Cabecera Minimalista */}
            <View className="mb-4 mt-2 px-1">
                <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-0.5">Centro de Innovación</Text>
                <Text className="text-white text-2xl font-black italic uppercase tracking-[-1px]">I+D Y MEJORAS</Text>
            </View>

            {/* GRUPO 1: RENDIMIENTO MONOPLAZA */}
            <View className="mb-4">
                <View className="flex-row items-center mb-2.5 ml-2">
                    <View className="w-1 h-1 bg-[#E10600] rounded-full mr-2" />
                    <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px]">Evolución del Coche</Text>
                </View>
                <View className="flex-row">
                    <CarCard label="Aerodinámica" value={escuderia.aerodinamica} cost={escuderia.aerodinamicaCosto} presupuesto={escuderia.presupuesto} icon="airplane" color="#00D2FF" />
                    <CarCard label="Potencia Motor" value={escuderia.motor} cost={escuderia.motorCosto} presupuesto={escuderia.presupuesto} icon="flame" color="#FF1E1E" />
                </View>
                <View className="flex-row">
                    <CarCard label="Durabilidad" value={escuderia.durabilidad} cost={escuderia.durabilidadCosto} presupuesto={escuderia.presupuesto} icon="shield-checkmark" color="#4CD964" maxValue={20} />
                    <View className="flex-1 m-1" />
                </View>
            </View>

            {/* GRUPO 2: INFRAESTRUCTURA */}
            <View className="mb-4">
                <View className="flex-row items-center mb-2.5 ml-2">
                    <View className="w-1 h-1 bg-amber-500 rounded-full mr-2" />
                    <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px]">Instalaciones HQ</Text>
                </View>
                <FacilityRow label="Túnel Viento" value={escuderia.tunelViento} cost={escuderia.tunelVientoCosto} presupuesto={escuderia.presupuesto} icon="air" color="#FFD700" IconSet={MaterialIcons} />
                <FacilityRow label="Banco Pruebas" value={escuderia.bancoPruebas} cost={escuderia.bancoPruebasCosto} presupuesto={escuderia.presupuesto} icon="speedometer-outline" color="#FF8C00" />
                <FacilityRow label="Academia" value={escuderia.escuelaPilotos} cost={escuderia.escuelaPilotosCosto} presupuesto={escuderia.presupuesto} icon="school" color="#A020F0" />
            </View>


        </View>
    );
}
