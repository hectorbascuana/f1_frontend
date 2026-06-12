import { getDriverImage } from "@/constants/DriverAssets";
import { Piloto } from "@/types/piloto";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const { width } = Dimensions.get('window');

/**
 * DriverCard
 * Componente premium para mostrar la información detallada de un piloto.
 */
export default function DriverCard({ 
    piloto, 
    onPressOffers, 
    onPress,
    emptyLabel = "ASIENTO VACÍO",
    onPressEmpty
}: { 
    piloto: Piloto | null, 
    onPressOffers?: () => void, 
    onPress?: () => void,
    emptyLabel?: string,
    onPressEmpty?: () => void
}) {
    
    // Función de utilidad para las barras de estado
    const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
        <View className="mb-2">
            <View className="flex-row justify-between mb-1 items-center">
                <Text className="text-[#AAAAAA] text-[8px] font-black uppercase tracking-[1px]">{label}</Text>
                <Text className="text-white text-[9px] font-bold">{value}</Text>
            </View>
            <View className="h-1 bg-[#222] rounded-full overflow-hidden">
                <View 
                    style={{ width: `${value}%`, backgroundColor: color }} 
                    className="h-full rounded-full" 
                />
            </View>
        </View>
    );

    // Si no hay piloto, renderizamos un estado vacío premium
    if (!piloto) {
        return (
            <Pressable 
                onPress={onPressEmpty}
                className="bg-[#121212] border border-[#222] border-dashed rounded-[32px] mb-6 overflow-hidden h-40 items-center justify-center active:opacity-80"
            >
                <View className="bg-[#1a1a1a] w-16 h-16 rounded-full items-center justify-center border border-[#333] mb-3">
                    <Ionicons name="person-add-outline" size={32} color="#444" />
                </View>
                <Text className="text-[#444] font-black italic uppercase tracking-[1px]">{emptyLabel}</Text>
                <Text className="text-[#333] text-[10px] uppercase font-bold mt-1">Pulsa para asignar un piloto</Text>
            </Pressable>
        );
    }

    const normalizedPath = piloto.imagen.replace('assets/drivers/', 'assets/images/drivers/');
    const imageSource = getDriverImage(normalizedPath);

    return (
        <Pressable 
            onPress={onPress}
            className="bg-[#121212] border border-[#222] rounded-[32px] mb-6 overflow-hidden shadow-2xl shadow-black active:opacity-70"
        >
            {/* Cabecera de la Tarjeta con Imagen y Datos Básicos */}
            <View className="flex-row p-5">
                {/* Imagen del Piloto con Marco Estilizado */}
                <View className="relative">
                    <View className="w-24 h-24 bg-[#1a1a1a] rounded-2xl border border-[#333] items-center justify-center overflow-hidden">
                        {imageSource ? (
                            <Image 
                                source={imageSource} 
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="items-center justify-center">
                                <Ionicons name="person" size={40} color="#333" />
                                <Text className="text-[#333] text-[6px] font-bold mt-1">NO ASSET</Text>
                            </View>
                        )}
                    </View>
                    {/* Badge de Valoración General */}
                    <View className="absolute -bottom-2 -right-2 bg-[#E10600] w-10 h-10 rounded-xl items-center justify-center border-2 border-[#121212] z-10">
                        <Text className="text-white font-black text-xs italic">{piloto.estadisticas.valoracion}</Text>
                    </View>

                    {/* Indicador de Evolución de Temporada */}
                    {piloto.estadisticas.progresoTemporada !== 0 && (
                        <View className="absolute -bottom-1 right-8 bg-[#1a1a1a] px-2 py-1 rounded-lg border border-[#333] flex-row items-center shadow-sm">
                            <Ionicons 
                                name={piloto.estadisticas.progresoTemporada > 0 ? "caret-up" : "caret-down"} 
                                size={8} 
                                color={piloto.estadisticas.progresoTemporada > 0 ? "#10b981" : "#E10600"} 
                            />
                            <Text className={`text-[9px] font-black ml-1 ${piloto.estadisticas.progresoTemporada > 0 ? 'text-[#10b981]' : 'text-[#E10600]'}`}>
                                {piloto.estadisticas.progresoTemporada > 0 ? `+${piloto.estadisticas.progresoTemporada}` : piloto.estadisticas.progresoTemporada}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Información Personal */}
                <View className="ml-5 flex-1 justify-center">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-[#E10600] text-[8px] font-black uppercase tracking-[2px]">{piloto.pais}</Text>
                        <View className="w-1 h-1 bg-[#444] rounded-full mx-2" />
                        <Text className="text-[#555] text-[8px] font-black uppercase tracking-[2px]">{piloto.edad} AÑOS</Text>
                    </View>
                    <View className="flex-row"> 
                        <Text className="text-white text-xl font-black italic uppercase tracking-[-0.5px] leading-tight mb-2">
                            {piloto.nombre}
                        </Text>
                        {
                        piloto.isRokie && ( // El piloto llega correctamente con el campo isRokie correcto. Al cumplirse esta condición, también se renderiza la palabra rokie. respecto al view, es necesario por el flex row que coloca su contenido horizontalmente en lugar de verticalmente.
                            <Text className="text-green-600 mr-5">
                                ROOKIE
                            </Text>
                        )}
                        
                    </View>
                    
                    
                    {/* Fila Inferior: Valor y Acción de Mercado */}
                    <View className="flex-row items-center justify-between">
                        {/* Valor de Mercado */}
                        <View className="bg-[#1a1a1a] self-start px-3 py-1.5 rounded-lg border border-[#222] flex-row items-center">
                            <Ionicons name="pricetag-outline" size={10} color="#10b981" />
                            <Text className="text-emerald-400 font-black text-[10px] ml-1.5">
                                {piloto.valor.toLocaleString('es-ES', { minimumFractionDigits: 1 })}M
                            </Text>
                        </View>

                        {/* Botón de Mercado (Prueba Visual) */}
                        {piloto.ofertasPendientes && piloto.ofertasPendientes > 0 ? (
                            <Pressable 
                                onPress={onPressOffers}
                                className="bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-lg flex-row items-center active:opacity-70"
                            >
                                <View className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse" />
                                <Text className="text-amber-500 font-black text-[8px] uppercase tracking-[0.5px]">
                                    {piloto.ofertasPendientes} OFERTAS
                                </Text>
                            </Pressable>
                        ) : (
                            <View className="bg-[#1a1a1a] border border-[#222] px-3 py-1.5 rounded-lg flex-row items-center opacity-40">
                                <Text className="text-[#555] font-black text-[8px] uppercase tracking-[0.5px]">
                                    0 OFERTAS
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Panel de Estadísticas Técnicas */}
            <View className="bg-[#181818] px-5 py-4 border-t border-[#222]">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="analytics" size={12} color="#555" />
                    <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px] ml-2">Telemetría de Piloto</Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                    <View className="w-[47%]">
                        <StatBar label="Curva Rápida" value={piloto.estadisticas.curvaRapida} color="#00D2FF" />
                        <StatBar label="Curva Lenta" value={piloto.estadisticas.curvaLenta} color="#FFD700" />
                    </View>
                    <View className="w-[47%]">
                        <StatBar label="Salidas" value={piloto.estadisticas.salidas} color="#FF1E1E" />
                        <StatBar label="Consistencia" value={piloto.estadisticas.consistencia} color="#A020F0" />
                    </View>
                </View>
            </View>

            {/* Aviso de Interacción Integrado */}
            {onPress && (
                <View className="bg-[#1a1a1a] py-2.5 border-t border-[#333] flex-row items-center justify-center">
                    <Ionicons name="swap-horizontal" size={12} color="#555" />
                    <Text className="text-[#555] text-[9px] font-black uppercase tracking-[1px] ml-1.5">
                        Pulsa tarjeta para intercambiar pilotos
                    </Text>
                </View>
            )}
        </Pressable>
    );
}
