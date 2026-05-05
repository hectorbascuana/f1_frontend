import { getDriverImage } from "@/constants/DriverAssets";
import { getTeamImage } from "@/constants/TeamAssets";
import { RespuestaNegociacion } from "@/core/api/action/traspasos.action";
import { Piloto } from "@/types/piloto";
import { BASE_URL } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Dimensions, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

interface MarketDetailModalProps {
    visible: boolean;
    onClose: () => void;
    piloto: Piloto | null;
    offerPrice: number;
    setOfferPrice: (price: number) => void;
    onPriceChange: (amount: number) => void;
    onSendOffer: () => Promise<void>;
    isSending: boolean;
    status: 'idle' | 'loading' | 'result';
    negotiationResult: RespuestaNegociacion | null;
    hasEnoughFunds: boolean;
}

/**
 * StatBar Component (Internal)
 * Barra de progreso refinada y elegante.
 */
const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <View className="mb-3">
        <View className="flex-row justify-between mb-1 items-center px-0.5">
            <Text className="text-[#888] text-[8px] font-bold uppercase tracking-[1.5px]">{label}</Text>
            <Text className="text-white text-[10px] font-black italic">{value}</Text>
        </View>
        <View className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <View
                style={{ width: `${value}%`, backgroundColor: color }}
                className="h-full rounded-full"
            />
        </View>
    </View>
);

/**
 * NegotiationStatusModal
 * Pantalla de estado con diseño equilibrado y tipografía controlada.
 */
const NegotiationStatusModal = ({
    visible,
    status,
    negotiationResult,
    onClose
}: {
    visible: boolean;
    status: 'loading' | 'result';
    negotiationResult: RespuestaNegociacion | null;
    onClose: () => void;
}) => {
    return (
        <Modal animationType="fade" transparent visible={visible}>
            <View className="flex-1 bg-black/90 justify-center items-center px-10">
                <View className="bg-[#121212] border border-[#222] rounded-[32px] w-full p-8 items-center shadow-2xl">
                    {status === 'loading' ? (
                        <View className="items-center py-4">
                            <View className="w-20 h-20 rounded-full items-center justify-center mb-6 border-2 border-white/10 bg-white/5">
                                <ActivityIndicator size="large" color="#E10600" />
                            </View>
                            <Text className="text-white font-black text-2xl italic uppercase tracking-[1px] text-center mb-2">Analizando Propuesta</Text>
                            <Text className="text-[#888] text-center text-xs font-medium leading-relaxed px-4">
                                La escudería está revisando los términos del contrato...
                            </Text>
                        </View>
                    ) : (
                        <>
                            {negotiationResult && (
                                <View className="items-center">
                                    <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 border-2 ${negotiationResult.resultado === 'ACEPTADO' ? 'bg-[#10b981]/10 border-[#10b981]/30' : 'bg-[#E10600]/10 border-[#E10600]/30'}`}>
                                        <Ionicons
                                            name={negotiationResult.resultado === 'ACEPTADO' ? "checkmark" : "close"}
                                            size={40}
                                            color={negotiationResult.resultado === 'ACEPTADO' ? "#10b981" : "#E10600"}
                                        />
                                    </View>
                                    <Text className={`font-black text-2xl italic uppercase mb-2 ${negotiationResult.resultado === 'ACEPTADO' ? 'text-[#10b981]' : 'text-[#E10600]'}`}>
                                        {negotiationResult.resultado}
                                    </Text>
                                    <Text className="text-[#999] text-center text-xs font-medium leading-relaxed mb-10 px-4">
                                        {negotiationResult.mensaje}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="bg-[#1a1a1a] py-4 px-12 rounded-2xl border border-[#333] active:opacity-70 w-full"
                                    >
                                        <Text className="text-white font-black text-center text-xs uppercase tracking-[2px]">Continuar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

/**
 * MarketDetailModal
 * Diseño equilibrado, premium y con proporciones controladas.
 */
export default function MarketDetailModal({
    visible,
    onClose,
    piloto,
    offerPrice,
    setOfferPrice,
    onPriceChange,
    onSendOffer,
    isSending,
    status,
    negotiationResult,
    hasEnoughFunds
}: MarketDetailModalProps) {
    if (!piloto) return null;

    const normalizedPath = piloto.imagen.replace('assets/drivers/', 'assets/images/drivers/');
    const driverImage = getDriverImage(normalizedPath);
    const escuderiaImagen = piloto.escuderia?.imagen ? piloto.escuderia.imagen.replace(BASE_URL, '') : null;
    const teamImage = escuderiaImagen ? getTeamImage(escuderiaImagen) : null;

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible && status === 'idle'}
                onRequestClose={onClose}
            >
                <View className="flex-1 bg-black/80 justify-center items-center px-6">
                    <View
                        style={{ width: width * 0.88 }}
                        className="bg-[#0f0f0f] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* Cabecera: Piloto & VAL en proporciones controladas */}
                        <View className="flex-row items-center p-6 bg-[#141414] border-b border-[#222]">
                            <View className="relative">
                                <View className="w-16 h-16 bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
                                    <Image source={driverImage} className="w-full h-full" resizeMode="cover" />
                                </View>
                                {/* Mini-badge Valoración (Abajo a la Derecha) */}
                                <View className="absolute -bottom-1 -right-2 bg-[#E10600] w-7 h-7 rounded-lg items-center justify-center border-2 border-[#141414] shadow-lg">
                                    <Text className="text-white font-black text-[11px] italic leading-none">{piloto.estadisticas.valoracion}</Text>
                                </View>
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-white text-xl font-black italic uppercase tracking-tight">{piloto.nombre}</Text>
                                <Text className="text-[#888] text-[9px] font-bold uppercase tracking-[1px] mt-0.5">{piloto.edad} AÑOS • {piloto.pais}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                className="w-8 h-8 bg-white/5 rounded-full items-center justify-center border border-white/5"
                            >
                                <Ionicons name="close" size={16} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View className="p-6">
                            {/* Bloque Equipo Refinado */}
                            <View className="flex-row items-center bg-[#1a1a1a] p-3.5 rounded-2xl border border-white/5 mb-6">
                                <View className="w-9 h-9 items-center justify-center bg-black/30 rounded-xl">
                                    {teamImage ? (
                                        <Image source={teamImage} style={{ width: 24, height: 24 }} resizeMode="contain" />
                                    ) : (
                                        <Ionicons name="shield-outline" size={20} color="#444" />
                                    )}
                                </View>
                                <View className="ml-3">
                                    <Text className="text-[#666] text-[7px] font-bold uppercase tracking-[2px]">Contrato Vigente</Text>
                                    <Text className="text-white text-[13px] font-black italic uppercase tracking-[0.5px]">
                                        {piloto.escuderia?.nombre || 'Agente Libre'}
                                    </Text>
                                </View>
                            </View>

                            {/* Estadísticas de Telemetría */}
                            <View className="mb-6">
                                <Text className="text-[#555] text-[7px] font-bold uppercase tracking-[3px] mb-4 text-center">Datos Telemetría</Text>
                                <View className="flex-row flex-wrap justify-between">
                                    <View className="w-[47%]"><StatBar label="Curva Rápida" value={piloto.estadisticas.curvaRapida} color="#00D2FF" /></View>
                                    <View className="w-[47%]"><StatBar label="Curva Lenta" value={piloto.estadisticas.curvaLenta} color="#FFD700" /></View>
                                    <View className="w-[47%]"><StatBar label="Salida" value={piloto.estadisticas.salidas} color="#FF1E1E" /></View>
                                    <View className="w-[47%]"><StatBar label="Consist." value={piloto.estadisticas.consistencia} color="#A020F0" /></View>
                                </View>
                            </View>

                            {/* Gestión de Oferta: Equilibrado */}
                            <View className="bg-black/40 p-5 rounded-[24px] border border-white/5 mb-6">
                                <View className="flex-row justify-between items-center mb-4 px-1">
                                    <View>
                                        <Text className="text-[#555] text-[7px] font-bold uppercase tracking-[1.5px]">Market Price</Text>
                                        <Text className="text-[#10b981] text-xs font-black italic">{piloto.valor}M €</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className={`${hasEnoughFunds ? 'text-[#555]' : 'text-[#E10600]'} text-[7px] font-bold uppercase tracking-[1.5px]`}>
                                            {hasEnoughFunds ? 'Tu Propuesta' : 'Fondos Insuficientes'}
                                        </Text>
                                        <Text className={`${hasEnoughFunds ? 'text-white' : 'text-[#E10600]'} text-xs font-black italic`}>
                                            {hasEnoughFunds ? 'Ajuste Manual' : 'Límite Superado'}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between bg-black/60 p-2 rounded-2xl border border-white/10">
                                    <TouchableOpacity
                                        onPress={() => onPriceChange(-0.5)}
                                        className="w-11 h-11 bg-[#1a1a1a] rounded-xl items-center justify-center border border-white/5 active:bg-[#222]"
                                    >
                                        <Ionicons name="remove" size={20} color="white" />
                                    </TouchableOpacity>

                                    <View className="flex-1 items-center flex-row justify-center">
                                        <TextInput
                                            keyboardType="numeric"
                                            value={offerPrice.toString()}
                                            onChangeText={(val) => setOfferPrice(Number(val.replace(',', '.')) || 0)}
                                            className="text-white text-3xl font-black italic text-center w-20"
                                            style={{ includeFontPadding: false }}
                                        />
                                        <Text className="text-[#E10600] text-lg font-black italic">M</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => onPriceChange(0.5)}
                                        className="w-11 h-11 bg-[#E10600] rounded-xl items-center justify-center shadow-lg shadow-[#E10600]/20 active:opacity-80"
                                    >
                                        <Ionicons name="add" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Botón de Acción Principal */}
                            <TouchableOpacity
                                onPress={onSendOffer}
                                disabled={isSending || !hasEnoughFunds}
                                className={`py-5 rounded-2xl flex-row items-center justify-center shadow-xl active:opacity-90 ${(isSending || !hasEnoughFunds) ? 'bg-gray-800 opacity-50' : 'bg-[#E10600]'
                                    }`}
                            >
                                <Ionicons name={hasEnoughFunds ? "send-outline" : "alert-circle-outline"} size={16} color="white" />
                                <Text className="text-white font-black text-[13px] uppercase italic tracking-[2px] ml-3">
                                    {hasEnoughFunds ? 'Formalizar Oferta' : 'Sin Presupuesto'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Status: Centrado y Equilibrado */}
            <NegotiationStatusModal
                visible={status !== 'idle'}
                status={status === 'loading' ? 'loading' : 'result'}
                negotiationResult={negotiationResult}
                onClose={onClose}
            />
        </>
    );
}
