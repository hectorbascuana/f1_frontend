import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Piloto } from "@/types/piloto";
import { getDriverImage } from "@/constants/DriverAssets";
import { getTeamImage } from "@/constants/TeamAssets";
import { BASE_URL } from "@/utils/api";

interface MarketListItemProps {
    piloto: Piloto;
    isBlocked?: boolean;
    isUserPilot?: boolean;
    onPress: () => void;
}

/**
 * MarketListItem
 * 
 * Componente compacto para representar un piloto en la lista del mercado.
 * Diseño estilo "tira" con información esencial.
 */
export default function MarketListItem({ piloto, isBlocked = false, isUserPilot = false, onPress }: MarketListItemProps) {
    const normalizedPath = piloto.imagen.replace('assets/drivers/', 'assets/images/drivers/');
    const driverImage = getDriverImage(normalizedPath);
    
    // Obtener imagen de la escudería
    const escuderiaImagen = piloto.escuderia?.imagen 
        ? piloto.escuderia.imagen.replace(BASE_URL, '') 
        : null;
    const teamImage = escuderiaImagen ? getTeamImage(escuderiaImagen) : null;

    // Lógica de colores y etiquetas
    let statusLabel = "MERCADO";
    let statusColor = "#10b981"; // Verde
    let bgColor = "bg-[#10b981]/10";
    let borderColor = "border-[#10b981]/20";

    if (isUserPilot) {
        statusLabel = "TU EQUIPO";
        statusColor = "#0070FF"; // Azul
        bgColor = "bg-[#0070FF]/10";
        borderColor = "border-[#0070FF]/25";
    } else if (isBlocked) {
        statusLabel = "BLOQUEADO";
        statusColor = "#E10600"; // Rojo
        bgColor = "bg-[#E10600]/10";
        borderColor = "border-[#E10600]/20";
    }

    return (
        <Pressable 
            onPress={(isBlocked || isUserPilot) ? undefined : onPress}
            className={`bg-[#121212] border border-[#222] rounded-2xl mb-3 flex-row items-center p-3 active:opacity-70 overflow-hidden ${isBlocked ? 'opacity-50' : ''} ${isUserPilot ? 'border-[#0070FF]/40' : ''}`}
        >
            {/* Foto del Piloto (Miniatura) con logo de equipo de fondo */}
            <View className="w-14 h-14 bg-[#1a1a1a] rounded-xl border border-[#333] items-center justify-center overflow-hidden">
                {teamImage && (
                    <Image 
                        source={teamImage} 
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        resizeMode="cover"
                    />
                )}
                {driverImage ? (
                    <Image 
                        source={driverImage} 
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <Ionicons name="person" size={24} color="#333" />
                )}
            </View>

            {/* Información Central: Nombre y Escudería */}
            <View className="flex-1 mx-4 justify-center">
                <Text 
                    numberOfLines={2}
                    className="text-[#E10600] text-[8px] font-black uppercase tracking-[1px] mb-0.5 leading-tight"
                >
                    {piloto.escuderia?.nombre || 'Agente Libre'}
                </Text>
                <Text 
                    numberOfLines={1}
                    className="text-white text-base font-black italic uppercase tracking-[-0.5px]"
                >
                    {piloto.nombre}
                </Text>
            </View>

            {/* Estadísticas Compactas (Valoración) */}
            <View className="items-center w-12">
                <Text className="text-[#555] text-[7px] font-black uppercase mb-0.5">VAL</Text>
                <Text className="text-white font-black text-lg italic leading-tight">{piloto.estadisticas.valoracion}</Text>
            </View>

            {/* Precio y Estado Dinámico */}
            <View className={`px-3 py-2 rounded-xl border items-center justify-center min-w-[75px] ${bgColor} ${borderColor}`}>
                <Text style={{ color: statusColor }} className="text-[7px] font-black uppercase tracking-[1px] mb-0.5">{statusLabel}</Text>
                <Text className="text-white font-black text-xs">
                    {piloto.valor.toLocaleString('es-ES', { minimumFractionDigits: 1 })}M
                </Text>
            </View>


            {/* Indicador de más info o escudo de equipo */}
            <View className="ml-2">
                <Ionicons 
                    name={isUserPilot ? "shield-checkmark" : "chevron-forward"} 
                    size={14} 
                    color={isUserPilot ? "#0070FF" : "#333"} 
                />
            </View>
        </Pressable>
    );
}
