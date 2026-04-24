import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { OfertaPiloto, Piloto } from "@/types/piloto";
import { getTeamImage } from "@/constants/TeamAssets";

/**
 * OffersModal
 * Componente modal para visualizar y gestionar las ofertas de compra recibidas por un piloto.
 */
export default function OffersModal({ 
    visible, 
    onClose, 
    piloto 
}: { 
    visible: boolean, 
    onClose: () => void, 
    piloto: Piloto | null 
}) {
    if (!piloto) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80 justify-center px-6">
                <View className="bg-[#121212] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl">
                    {/* Cabecera del Modal */}
                    <View className="p-7 border-b border-[#222] flex-row justify-between items-center bg-[#151515]">
                        <View className="flex-1 mr-4">
                            <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[3px] mb-1">Negociaciones</Text>
                            <Text className="text-white text-xl font-black italic uppercase" numberOfLines={1}>
                                Ofertas: {piloto.nombre}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-[#222] w-10 h-10 rounded-full items-center justify-center">
                            <Ionicons name="close" size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Cuerpo - Listado de Ofertas */}
                    <ScrollView className="max-h-[450px] p-5">
                        {piloto.ofertas && piloto.ofertas.length > 0 ? (
                            piloto.ofertas.map((oferta) => {
                                const teamLogo = getTeamImage(oferta.escuderiaImagen);
                                const isProfit = oferta.monto > piloto.valor;

                                return (
                                    <View key={oferta.id} className="bg-[#1a1a1a] border border-[#222] rounded-2xl p-4 mb-4">
                                        <View className="flex-row items-center justify-between mb-4">
                                            <View className="flex-row items-center flex-1 mr-3">
                                                <View className="w-10 h-10 bg-[#222] rounded-lg items-center justify-center mr-3 overflow-hidden">
                                                    {teamLogo ? (
                                                        <Image source={teamLogo} className="w-full h-full" resizeMode="contain" />
                                                    ) : (
                                                        <Ionicons name="car-sport" size={20} color="#444" />
                                                    )}
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px]">Escudería</Text>
                                                    <Text className="text-white font-bold text-xs uppercase" numberOfLines={1} ellipsizeMode="tail">
                                                        {oferta.escuderiaNombre}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <View className="items-end min-w-[80px]">
                                                <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px] mb-1">Propuesta</Text>
                                                <Text className={`font-black text-base ${isProfit ? 'text-emerald-400' : 'text-white'}`}>
                                                    {oferta.monto.toLocaleString('es-ES', { minimumFractionDigits: 1 })}M
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Botones de Acción */}
                                        <View className="flex-row mt-2 justify-between">
                                            <TouchableOpacity 
                                                style={{ width: '48%' }}
                                                className="bg-[#222]/30 border border-[#333] py-3 rounded-xl items-center"
                                            >
                                                <Text className="text-[#666] font-black text-[10px] uppercase">Rechazar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={{ width: '48%' }}
                                                className="bg-[#E10600] py-3 rounded-xl items-center shadow-lg shadow-[#E10600]/20"
                                            >
                                                <Text className="text-white font-black text-[10px] uppercase italic">Aceptar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View className="py-10 items-center">
                                <Ionicons name="documents-outline" size={32} color="#333" />
                                <Text className="text-[#555] mt-4 font-bold uppercase text-xs">No hay ofertas en firme</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Informativo */}
                    <View className="p-4 bg-[#0c0c0c] flex-row items-center justify-center">
                        <Ionicons name="shield-checkmark" size={12} color="#10b981" />
                        <Text className="text-[#444] text-[8px] font-bold uppercase ml-2 tracking-[1px]">Garantía de Transferencia F1 Manager</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
