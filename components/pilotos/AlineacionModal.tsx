import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Piloto } from "@/types/piloto";
import { getDriverImage } from "@/constants/DriverAssets";

/**
 * AlineacionModal
 * Modal para seleccionar qué piloto asignar a un asiento específico.
 */
export default function AlineacionModal({ 
    visible, 
    onClose, 
    asiento,
    pilotos,
    pilotoActualId,
    onSelect
}: { 
    visible: boolean, 
    onClose: () => void, 
    asiento: number,
    pilotos: Piloto[],
    pilotoActualId: number | null,
    onSelect: (pilotoId: number | null) => void
}) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 justify-end">
                <View className="bg-[#121212] border-t-2 border-[#E10600] rounded-t-[40px] max-h-[85%]">
                    {/* Indicador de arrastre */}
                    <View className="items-center py-4">
                        <View className="w-12 h-1.5 bg-[#222] rounded-full" />
                    </View>

                    <View className="px-8 pb-6">
                        <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-2">Selección de Piloto</Text>
                        <Text className="text-white text-2xl font-black italic uppercase">Asignar Asiento {asiento}</Text>
                        <Text className="text-[#555] text-xs mt-1">Elige quién pilotará el coche en este asiento o déjalo libre.</Text>
                    </View>

                    <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                        {/* Opción: Dejar Asiento Libre */}
                        <TouchableOpacity 
                            onPress={() => onSelect(null)}
                            className={`flex-row items-center p-4 rounded-2xl mb-4 border-2 ${pilotoActualId === null ? 'bg-[#E10600]/10 border-[#E10600]' : 'bg-[#1a1a1a] border-transparent'}`}
                        >
                            <View className="w-12 h-12 rounded-xl bg-[#222] items-center justify-center mr-4">
                                <Ionicons name="close-circle-outline" size={24} color={pilotoActualId === null ? "#E10600" : "#444"} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black uppercase italic">Asiento Vacío</Text>
                                <Text className="text-[#555] text-[10px] uppercase font-bold">Sin piloto asignado</Text>
                            </View>
                            {pilotoActualId === null && <Ionicons name="checkmark-circle" size={20} color="#E10600" />}
                        </TouchableOpacity>

                        <Text className="text-[#333] text-[9px] font-black uppercase tracking-[2px] mb-4 ml-2">Plantilla Disponible</Text>

                        {pilotos.map((p) => {
                            const isSelected = pilotoActualId === p.id;
                            const driverImg = getDriverImage(p.imagen.replace('assets/drivers/', 'assets/images/drivers/'));
                            
                            return (
                                <TouchableOpacity 
                                    key={p.id}
                                    onPress={() => onSelect(p.id)}
                                    className={`flex-row items-center p-4 rounded-2xl mb-4 border-2 ${isSelected ? 'bg-[#E10600]/10 border-[#E10600]' : 'bg-[#1a1a1a] border-transparent'}`}
                                >
                                    <View className="w-12 h-12 rounded-xl bg-[#222] overflow-hidden mr-4 border border-[#333]">
                                        {driverImg ? (
                                            <Image source={driverImg} className="w-full h-full" resizeMode="cover" />
                                        ) : (
                                            <Ionicons name="person" size={24} color="#444" />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="text-white font-black uppercase italic mr-2">{p.nombre}</Text>
                                            <View className="bg-[#222] px-1.5 py-0.5 rounded flex-row items-center">
                                                <Text className="text-white text-[8px] font-bold mr-1">{p.estadisticas.valoracion}</Text>
                                                {p.estadisticas.progresoTemporada !== 0 && (
                                                    <Ionicons 
                                                        name={p.estadisticas.progresoTemporada > 0 ? "caret-up" : "caret-down"} 
                                                        size={6} 
                                                        color={p.estadisticas.progresoTemporada > 0 ? "#10b981" : "#E10600"} 
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        <Text className="text-[#555] text-[10px] uppercase font-bold">
                                            {p.asiento ? `Asiento Actual: ${p.asiento}` : 'Piloto Reserva'}
                                        </Text>
                                    </View>
                                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#E10600" />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Botón Cerrar */}
                    <View className="p-8">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="bg-[#1a1a1a] border border-[#222] py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white font-black text-xs uppercase">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
