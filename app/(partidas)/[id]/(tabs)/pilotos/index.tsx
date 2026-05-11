import { Piloto } from '@/types/piloto';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AlineacionModal from '../../../../../components/pilotos/AlineacionModal';
import DriverCard from '../../../../../components/pilotos/DriverCard';
import OffersModal from '../../../../../components/pilotos/OffersModal';
import TransferModal from '../../../../../components/pilotos/TransferModal';
import { useAlinearPiloto } from '../../../../../core/api/hooks/pilotos/useAlinearPiloto';
import { usePilotosEscuderia } from '../../../../../core/api/hooks/pilotos/usePilotosEscuderia';
import { useActiveGame } from '../../../../../hooks/store/useActiveGame';
import PartidaHeader from '../../../../../components/partidas/PartidaHeader';

/**
 * PilotosScreen
 * 
 * Pantalla que muestra el plantel actual de pilotos de la escudería del jugador.
 */
export default function PilotosScreen() {
    const { partida, isLoading: loadingGame, error: errorGame } = useActiveGame();
    const { mutate: alinear, isPending: alignPending } = useAlinearPiloto();
    const [selectedPiloto, setSelectedPiloto] = React.useState<Piloto | null>(null);
    const [modalOffersVisible, setModalOffersVisible] = React.useState(false);
    const [modalTransferVisible, setModalTransferVisible] = React.useState(false);

    // Estados para Alineación
    const [modalAlineacionVisible, setModalAlineacionVisible] = React.useState(false);
    const [selectedAsiento, setSelectedAsiento] = React.useState<number>(1);

    // Obtenemos los pilotos de nuestra escudería
    const escuderiaId = partida?.escuderia?.id;
    const {
        data: pilotos,
        isLoading: loadingPilotos,
        error: errorPilotos,
        refetch
    } = usePilotosEscuderia(escuderiaId || 0);

    const p1 = pilotos?.find(p => p.asiento === 1) || null;
    const p2 = pilotos?.find(p => p.asiento === 2) || null;

    // Estado de carga unificado: Solo mostramos el spinner de pantalla completa si NO tenemos datos.
    // Durante un refetch (al cambiar alineación o gestionar ofertas), mantenemos la UI visible.
    const isInitialLoading = (loadingGame && !partida) || (loadingPilotos && !pilotos && !!escuderiaId);

    if (isInitialLoading) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
                <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px] text-xs uppercase">Sincronizando Plantel...</Text>
            </View>
        );
    }

    // Estado de error
    if (errorGame || errorPilotos || (!pilotos && !loadingPilotos && !!escuderiaId)) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center px-10">
                <Ionicons name="alert-circle-outline" size={48} color="#E10600" />
                <Text className="text-white text-center font-black mt-4 uppercase italic">Error de Datos</Text>
                <Text className="text-[#555] text-center text-xs mt-2">No se ha podido recuperar la información oficial de los pilotos.</Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="mt-6 bg-[#151515] border border-[#222] px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold uppercase text-[10px]">Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0a0a0a]">
            <PartidaHeader />
            <ScrollView
                className='flex-1'
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 25 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabecera de la Sección con Acción de Mercado */}
                <View className="mb-8 flex-row justify-between items-start px-1">
                    <View className="flex-1">
                        <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-1">Squadra Oficial</Text>
                        <Text className="text-white text-2xl font-black italic uppercase tracking-[-1px]">GESTIÓN DE PILOTOS</Text>
                        <View className="h-0.5 w-10 bg-[#E10600] mt-3" />
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push("/(partidas)/[id]/pilotos/mercado")}
                        className="bg-[#151515] border border-[#222] p-3 rounded-2xl flex-row items-center shadow-sm active:opacity-70"
                    >
                        <View className="bg-[#E10600]/10 p-2 rounded-xl mr-2">
                            <Ionicons name="cart-outline" size={16} color="#E10600" />
                        </View>
                        <View>
                            <Text className="text-[#555] text-[7px] font-black uppercase tracking-[1px]">Explorar</Text>
                            <Text className="text-white text-[10px] font-black uppercase">MERCADO</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Listado de Pilotos */}
                {pilotos && pilotos.length > 0 ? (
                    <>
                        {/* Pilotos Oficiales (Asiento 1 y 2) */}
                        <View>
                            <View className="flex-row items-center mb-4 px-1">
                                <View className="bg-[#E10600] w-6 h-6 rounded-md items-center justify-center mr-3">
                                    <Text className="text-white font-black text-[10px] italic">1</Text>
                                </View>
                                <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px]">Primer Piloto</Text>
                            </View>

                            <DriverCard
                                piloto={p1}
                                emptyLabel="ASIENTO 1 VACÍO"
                                onPress={() => { setSelectedAsiento(1); setModalAlineacionVisible(true); }}
                                onPressEmpty={() => { setSelectedAsiento(1); setModalAlineacionVisible(true); }}
                                onPressOffers={() => { if (p1) { setSelectedPiloto(p1); setModalOffersVisible(true); } }}
                                onPressTransfer={() => { if (p1) { setSelectedPiloto(p1); setModalTransferVisible(true); } }}
                            />

                            <View className="flex-row items-center mb-4 px-1 mt-2">
                                <View className="bg-[#E10600] w-6 h-6 rounded-md items-center justify-center mr-3">
                                    <Text className="text-white font-black text-[10px] italic">2</Text>
                                </View>
                                <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px]">Segundo Piloto</Text>
                            </View>

                            <DriverCard
                                piloto={p2}
                                emptyLabel="ASIENTO 2 VACÍO"
                                onPress={() => { setSelectedAsiento(2); setModalAlineacionVisible(true); }}
                                onPressEmpty={() => { setSelectedAsiento(2); setModalAlineacionVisible(true); }}
                                onPressOffers={() => { if (p2) { setSelectedPiloto(p2); setModalOffersVisible(true); } }}
                                onPressTransfer={() => { if (p2) { setSelectedPiloto(p2); setModalTransferVisible(true); } }}
                            />
                        </View>

                        {/* Sección de Reservas */}
                        {pilotos.filter(p => p.asiento === null).length > 0 && (
                            <View className="mt-8">
                                <View className="flex-row items-center mb-6 px-1">
                                    <Ionicons name="layers-outline" size={16} color="#555" />
                                    <Text className="text-[#555] text-[10px] font-black uppercase tracking-[2px] ml-3">Pilotos de Reserva</Text>
                                    <View className="flex-1 h-[1px] bg-[#222] ml-4" />
                                </View>

                                {pilotos.filter(p => p.asiento === null).map((piloto) => (
                                    <DriverCard
                                        key={piloto.id}
                                        piloto={piloto}
                                        onPress={() => {
                                            // Al pulsar un reserva, podríamos abrir su gestión o simplemente
                                            // informar de que debe asignarse a un asiento arriba.
                                        }}
                                        onPressOffers={() => { setSelectedPiloto(piloto); setModalOffersVisible(true); }}
                                        onPressTransfer={() => { setSelectedPiloto(piloto); setModalTransferVisible(true); }}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    <View className="py-20 items-center justify-center border border-dashed border-[#222] rounded-[32px]">
                        <Ionicons name="person-add-outline" size={32} color="#333" />
                        <Text className="text-[#555] mt-4 font-bold uppercase text-xs">No hay pilotos contratados</Text>
                    </View>
                )}

                {/* Modal de Ofertas */}
                <OffersModal
                    visible={modalOffersVisible}
                    onClose={() => setModalOffersVisible(false)}
                    piloto={selectedPiloto}
                />

                {/* Modal de Transferencia */}
                <TransferModal
                    visible={modalTransferVisible}
                    onClose={() => setModalTransferVisible(false)}
                    piloto={selectedPiloto}
                    onConfirm={(precio) => {
                        console.log('Poner en venta por:', precio);
                        setModalTransferVisible(false);
                    }}
                />

                {/* Modal de Alineación */}
                <AlineacionModal
                    visible={modalAlineacionVisible}
                    onClose={() => setModalAlineacionVisible(false)}
                    asiento={selectedAsiento}
                    pilotos={pilotos || []}
                    pilotoActualId={pilotos?.find(p => p.asiento === selectedAsiento)?.id || null}
                    onSelect={(pilotoId) => {
                        alinear({ escuderiaId: escuderiaId!, pilotoId, asiento: selectedAsiento });
                        setModalAlineacionVisible(false);
                    }}
                />
            </ScrollView>
        </View>
    );
}