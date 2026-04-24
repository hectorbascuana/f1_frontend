import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Modal, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Piloto } from "@/types/piloto";

/**
 * TransferModal
 * Modal para poner a un piloto en el mercado de transferencias y configurar el precio de salida.
 */
export default function TransferModal({ 
    visible, 
    onClose, 
    piloto,
    onConfirm
}: { 
    visible: boolean, 
    onClose: () => void, 
    piloto: Piloto | null,
    onConfirm: (precio: number) => void
}) {
    const [precio, setPrecio] = useState(0);

    useEffect(() => {
        if (piloto) {
            setPrecio(piloto.valor);
        }
    }, [piloto]);

    if (!piloto) return null;

    const ajustarPrecio = (cantidad: number) => {
        setPrecio(prev => Math.max(0, parseFloat((prev + cantidad).toFixed(1))));
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-black/80 justify-end"
            >
                <View className="bg-[#121212] border-t-2 border-[#E10600] rounded-t-[40px] p-8 pb-12 shadow-2xl">
                    {/* Indicador Superior */}
                    <View className="items-center mb-6">
                        <View className="w-12 h-1.5 bg-[#222] rounded-full" />
                    </View>

                    <View className="mb-8">
                        <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-2 text-center">Mercado de Pilotos</Text>
                        <Text className="text-white text-2xl font-black italic uppercase text-center">Transferir a {piloto.nombre}</Text>
                    </View>

                    {/* Selector de Precio Premium */}
                    <View className="bg-[#1a1a1a] border border-[#222] rounded-3xl p-6 mb-8">
                        <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] mb-4 text-center">Configurar Precio de Salida</Text>
                        
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity 
                                onPress={() => ajustarPrecio(-1)}
                                className="w-12 h-12 bg-[#222] rounded-2xl items-center justify-center active:bg-[#333]"
                            >
                                <Ionicons name="remove" size={24} color="white" />
                            </TouchableOpacity>

                            <View className="items-center flex-1">
                                <View className="flex-row items-baseline">
                                    <TextInput
                                        value={String(precio)}
                                        onChangeText={(val) => setPrecio(Number(val.replace(',', '.')) || 0)}
                                        keyboardType="numeric"
                                        className="text-white text-4xl font-black italic text-center p-0"
                                        selectionColor="#E10600"
                                    />
                                    <Text className="text-[#E10600] text-xl font-black ml-2 uppercase">M</Text>
                                </View>
                                <Text className="text-[#444] text-[9px] font-bold mt-1 uppercase">Valor Mercado: {piloto.valor}M €</Text>
                            </View>

                            <TouchableOpacity 
                                onPress={() => ajustarPrecio(1)}
                                className="w-12 h-12 bg-[#E10600] rounded-2xl items-center justify-center shadow-lg shadow-[#E10600]/20 active:opacity-80"
                            >
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Información Estratégica */}
                    <View className="flex-row bg-[#151515] p-4 rounded-2xl border border-[#222] mb-8 items-center">
                        <View className="bg-amber-500/10 p-2 rounded-xl mr-4">
                            <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-[11px] mb-1">Impacto en el mercado</Text>
                            <Text className="text-[#555] text-[10px] leading-relaxed">
                                Un precio inferior al valor de mercado atraerá más ofertas rápidamente, pero reducirá el margen de beneficio.
                            </Text>
                        </View>
                    </View>

                    {/* Botones de Acción */}
                    <View className="flex-row space-x-4">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="flex-1 bg-[#1a1a1a] border border-[#222] py-4 rounded-2xl items-center mr-2"
                        >
                            <Text className="text-white font-black text-xs uppercase">Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => onConfirm(precio)}
                            className="flex-[2] bg-[#E10600] py-4 rounded-2xl items-center shadow-lg shadow-[#E10600]/30 ml-2"
                        >
                            <Text className="text-white font-black text-xs uppercase italic tracking-[1px]">Publicar en Mercado</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
