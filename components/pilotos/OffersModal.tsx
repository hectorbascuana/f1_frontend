import { getTeamImage } from "@/constants/TeamAssets";
import { Piloto } from "@/types/piloto";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useGestionarOferta } from "@/hooks/pilotos/useGestionarOferta";

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
    const { aceptar, rechazar } = useGestionarOferta();

    // Efecto para cerrar el modal si el piloto deja de tener ofertas (ej: tras un rechazo)
    useEffect(() => {
        if (visible && piloto && (!piloto.ofertas || piloto.ofertas.length === 0)) {
            onClose();
        }
    }, [piloto?.ofertas?.length, visible]);

    if (!piloto) return null;

    const handleAceptar = async (ofertaId: number) => {
        await aceptar.mutateAsync(ofertaId);
        // Si la oferta se acepta con éxito, cerramos el modal ya que el equipo cambia por completo
        onClose();
    };

    const handleRechazar = async (ofertaId: number) => {
        await rechazar.mutateAsync(ofertaId);
        // El useEffect se encargará de cerrar el modal si era la última oferta
    };

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
                        {(aceptar.isPending || rechazar.isPending) && (
                            <View className="absolute z-10 w-full h-full bg-black/20 justify-center items-center">
                                <ActivityIndicator color="#E10600" />
                            </View>
                        )}
                        {piloto.ofertas && piloto.ofertas.length > 0 ? (
                            piloto.ofertas.map((oferta) => {
                                const teamLogo = getTeamImage(oferta.escuderiaDestino.imagen);
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
                                                        {oferta.escuderiaDestino.nombre}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="items-end min-w-[80px]">
                                                <Text className="text-[#555] text-[8px] font-black uppercase tracking-[1px] mb-1">Propuesta</Text>
                                                <Text className="font-black text-base text-white">
                                                    {oferta.precio.toLocaleString('es-ES', { minimumFractionDigits: 1 })}M
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Botones de Acción */}
                                        <View className="flex-row mt-2 justify-between">
                                            <TouchableOpacity
                                                style={{ width: '48%' }}
                                                className="bg-[#222]/30 border border-[#333] py-3 rounded-xl items-center"
                                                onPress={() => handleRechazar(oferta.id)}
                                                disabled={aceptar.isPending || rechazar.isPending}
                                            >
                                                <Text className="text-[#666] font-black text-[10px] uppercase">Rechazar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ width: '48%' }}
                                                className="bg-[#E10600] py-3 rounded-xl items-center shadow-lg shadow-[#E10600]/20"
                                                onPress={() => handleAceptar(oferta.id)}
                                                disabled={aceptar.isPending || rechazar.isPending}
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
