import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import MarketListItem from '@/components/pilotos/MarketListItem';
import MarketDetailModal from '@/components/pilotos/MarketDetailModal';
import { useMercado } from '@/core/api/hooks/mercado/useMercado';
import { useTraspasosHistorial } from '@/core/api/hooks/traspasos/useTraspasosHistorial';
import { getDriverImage } from '@/constants/DriverAssets';
import { getTeamImage } from '@/constants/TeamAssets';
import { BASE_URL } from '@/utils/api';

import PartidaHeader from '../../../../../components/partidas/PartidaHeader';

/**
 * MercadoScreen
 * 
 * Pantalla global de mercado con selector de pestañas:
 * - Fichajes: Explorar y negociar con pilotos.
 * - Historial: Ver los traspasos confirmados en la partida.
 */
export default function MercadoScreen() {
    const [activeTab, setActiveTab] = useState<'fichajes' | 'historial'>('fichajes');
    const {
        partida,
        filteredPilotos,
        search,
        setSearch,
        selectedPiloto,
        modalVisible,
        offerPrice,
        setOfferPrice,
        handlePriceChange,
        isSending,
        negotiationStatus,
        negotiationResult,
        isLoading,
        error,
        loadingGame,
        handleOpenDetail,
        handleCloseDetail,
        handleSendOffer,
        isPilotoBlocked,
        hasEnoughFunds,
        refetch
    } = useMercado();

    // Cargamos el historial de traspasos
    const { 
        data: historial, 
        isLoading: loadingHistorial 
    } = useTraspasosHistorial(partida?.id || 0, partida?.proximoCircuito || 0);

    if (loadingGame) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
                <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px] text-xs uppercase">Cargando Partida...</Text>
            </View>
        );
    }

    if (!partida) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center px-10">
                <Ionicons name="alert-circle-outline" size={48} color="#E10600" />
                <Text className="text-white text-center font-black mt-4 uppercase italic">Error de Partida</Text>
                <Text className="text-[#555] text-center text-xs mt-2">No se ha podido sincronizar la partida activa.</Text>
                <TouchableOpacity
                    onPress={() => router.replace('/(partidas)')}
                    className="mt-6 bg-[#151515] border border-[#222] px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold uppercase text-[10px]">Volver al Menú</Text>
                </TouchableOpacity>
            </View>
        );
    }   

    return (
        <View className="flex-1 bg-[#0a0a0a]">
            <PartidaHeader />
            {/* Header Integrado */}
            <View className="pt-6 pb-0 px-6">
                <View className="flex-row items-center justify-between mb-5">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-[#151515] border border-[#222] rounded-full items-center justify-center shadow-sm active:opacity-70"
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-[#E10600] text-[8px] font-black uppercase tracking-[3px] mb-0.5">Global Transfer</Text>
                        <Text className="text-white text-lg font-black italic uppercase">CENTRO DE TRASPASOS</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Buscador Integrado */}
                {activeTab === 'fichajes' && (
                    <View className="bg-[#151515] border border-[#333] rounded-2xl px-4 py-3 flex-row items-center shadow-lg mb-6">
                        <Ionicons name="search-outline" size={18} color="#E10600" />
                        <TextInput 
                            placeholder="Buscar piloto en el paddock..."
                            placeholderTextColor="#444"
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1 ml-3 text-white font-bold text-sm"
                        />
                    </View>
                )}

                {/* Selector de Pestañas Premium */}
                <View className="flex-row bg-[#111] p-1 rounded-2xl border border-[#222] mb-6">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('fichajes')}
                        className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'fichajes' ? 'bg-[#E10600]' : ''}`}
                    >
                        <Text className={`font-black uppercase italic text-[11px] ${activeTab === 'fichajes' ? 'text-white' : 'text-[#555]'}`}>Fichajes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('historial')}
                        className={`flex-1 py-3 items-center rounded-xl ${activeTab === 'historial' ? 'bg-[#E10600]' : ''}`}
                    >
                        <Text className={`font-black uppercase italic text-[11px] ${activeTab === 'historial' ? 'text-white' : 'text-[#555]'}`}>Historial</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'fichajes' ? (
                    <>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#E10600" className="mt-10" />
                        ) : error || !filteredPilotos ? (
                            <View className="py-10 items-center">
                                <Text className="text-white font-bold">Error al cargar pilotos</Text>
                                <TouchableOpacity onPress={() => refetch()} className="mt-4"><Text className="text-[#E10600]">Reintentar</Text></TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View className="flex-row items-center justify-between mb-6 px-1">
                                    <View className="flex-row items-center">
                                        <Text className="text-[#555] text-[10px] font-black uppercase tracking-[1px]">Ordenado por Valoración</Text>
                                    </View>
                                    <Text className="text-[#333] text-[10px] font-bold uppercase">{filteredPilotos?.length} Candidatos</Text>
                                </View>
                                {filteredPilotos.map((piloto) => (
                                    <MarketListItem 
                                        key={piloto.id}
                                        piloto={piloto}
                                        isBlocked={isPilotoBlocked(piloto)}
                                        isUserPilot={piloto.escuderia?.id === partida?.escuderia.id}
                                        onPress={() => handleOpenDetail(piloto)}
                                    />
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {loadingHistorial ? (
                            <ActivityIndicator size="small" color="#666" className="mt-10" />
                        ) : historial && historial.length > 0 ? (
                            historial.map((traspaso, index) => {
                                const driverImg = traspaso.piloto?.imagen 
                                    ? getDriverImage(traspaso.piloto.imagen.replace('assets/drivers/', 'assets/images/drivers/'))
                                    : null;
                                    
                                const teamOrigenImg = traspaso.escuderiaOrigen?.imagen 
                                    ? getTeamImage(traspaso.escuderiaOrigen.imagen.replace(BASE_URL, ''))
                                    : null;
                                    
                                const teamDestinoImg = traspaso.escuderiaDestino?.imagen 
                                    ? getTeamImage(traspaso.escuderiaDestino.imagen.replace(BASE_URL, ''))
                                    : null;

                                return (
                                    <View key={index} className="bg-[#151515] border border-[#222] rounded-[32px] p-5 mb-5 overflow-hidden">
                                        <View className="flex-row items-center mb-4">
                                            {/* Foto Piloto Ampliada */}
                                            <View className="w-16 h-16 bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
                                                {driverImg && <Image source={driverImg} className="w-full h-full" resizeMode="cover" />}
                                            </View>

                                            <View className="flex-1 ml-4">
                                                <Text className="text-[#E10600] text-[8px] font-black uppercase tracking-[3px]">Traspaso Oficial</Text>
                                                <Text className="text-white text-[18px] font-black italic uppercase leading-tight">{traspaso.piloto?.nombre || 'Desconocido'}</Text>
                                                <Text className="text-[#555] text-[9px] font-bold uppercase mt-1">Acuerdo de Temporada {traspaso.temporada}</Text>
                                            </View>

                                            <View className="items-end pl-2">
                                                <Text className="text-emerald-500 font-black italic text-xl leading-none">{traspaso.precio}M</Text>
                                                <Text className="text-[#444] text-[8px] font-bold uppercase tracking-[1px] mt-1">Importe</Text>
                                            </View>
                                        </View>
                                        
                                        {/* Flujo de Escuderías Refinado: Nombres debajo de Logos */}
                                        <View className="flex-row items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
                                            {/* Origen */}
                                            <View className="items-center flex-1">
                                                <View className="w-14 h-14 items-center justify-center bg-[#1a1a1a] rounded-full border border-white/10 overflow-hidden shadow-sm">
                                                    {teamOrigenImg ? (
                                                        <Image source={teamOrigenImg} className="w-full h-full" resizeMode="cover" />
                                                    ) : (
                                                        <Ionicons name="shield-outline" size={24} color="#333" />
                                                    )}
                                                </View>
                                                <Text className="text-[#888] text-[9px] font-black uppercase italic mt-3 text-center" numberOfLines={2}>
                                                    {traspaso.escuderiaOrigen?.nombre || 'Agente Libre'}
                                                </Text>
                                            </View>
                                            
                                            {/* Conector */}
                                            <View className="px-2 items-center justify-center pb-4">
                                                <View className="flex-row items-center">
                                                    <View className="h-[1.5px] w-5 bg-[#333]" />
                                                    <View className="w-8 h-8 bg-[#151515] border border-[#222] rounded-full items-center justify-center mx-1 shadow-lg">
                                                        <Ionicons name="chevron-forward" size={14} color="#E10600" />
                                                    </View>
                                                    <View className="h-[1.5px] w-5 bg-[#333]" />
                                                </View>
                                            </View>

                                            {/* Destino */}
                                            <View className="items-center flex-1">
                                                <View className="w-14 h-14 items-center justify-center bg-[#1a1a1a] rounded-full border border-[#E10600]/30 overflow-hidden shadow-sm">
                                                    {teamDestinoImg ? (
                                                        <Image source={teamDestinoImg} className="w-full h-full" resizeMode="cover" />
                                                    ) : (
                                                        <Ionicons name="shield-outline" size={24} color="#333" />
                                                    )}
                                                </View>
                                                <Text className="text-white text-[9px] font-black uppercase italic mt-3 text-center" numberOfLines={2}>
                                                    {traspaso.escuderiaDestino?.nombre}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View className="py-20 items-center justify-center">
                                <Ionicons name="time-outline" size={48} color="#151515" />
                                <Text className="text-[#333] mt-4 font-black uppercase italic">Sin movimientos recientes</Text>
                                <Text className="text-[#222] text-[9px] mt-1 text-center px-10">Los traspasos aceptados aparecerán aquí.</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <MarketDetailModal 
                visible={modalVisible}
                onClose={handleCloseDetail}
                piloto={selectedPiloto}
                offerPrice={offerPrice}
                setOfferPrice={setOfferPrice}
                onPriceChange={handlePriceChange}
                onSendOffer={handleSendOffer}
                isSending={isSending}
                status={negotiationStatus}
                negotiationResult={negotiationResult}
                hasEnoughFunds={hasEnoughFunds}
            />
        </View>
    );
}
