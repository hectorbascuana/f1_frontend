import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MarketListItem from '@/components/pilotos/MarketListItem';
import MarketDetailModal from '@/components/pilotos/MarketDetailModal';
import { useMercado } from '@/core/api/hooks/mercado/useMercado';

/**
 * MercadoScreen
 * 
 * Pantalla global de mercado donde se listan todos los pilotos de la partida 
 * ordenados por valoración. La lógica de negocio está centralizada en el hook useMercado.
 */
export default function MercadoScreen() {
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

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
                <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px] text-xs uppercase">Escaneando Paddock...</Text>
            </View>
        );
    }

    if (error || !filteredPilotos) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center px-10">
                <Ionicons name="alert-circle-outline" size={48} color="#E10600" />
                <Text className="text-white text-center font-black mt-4 uppercase italic">Error de Mercado</Text>
                <Text className="text-[#555] text-center text-xs mt-2">No se ha podido sincronizar la base de datos de pilotos.</Text>
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
            {/* Header Integrado - Se funde con el layout global */}
            <View className="pt-4 pb-6 px-6">
                <View className="flex-row items-center justify-between mb-5">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-[#151515] border border-[#222] rounded-full items-center justify-center shadow-sm active:opacity-70"
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-[#E10600] text-[8px] font-black uppercase tracking-[3px] mb-0.5">Global Transfer</Text>
                        <Text className="text-white text-lg font-black italic uppercase">MERCADO DE PILOTOS</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Buscador Integrado */}
                <View className="bg-[#151515] border border-[#333] rounded-2xl px-4 py-3 flex-row items-center shadow-lg">
                    <Ionicons name="search-outline" size={18} color="#E10600" />
                    <TextInput 
                        placeholder="Buscar piloto en el paddock..."
                        placeholderTextColor="#444"
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 ml-3 text-white font-bold text-sm"
                    />
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 25 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Info de Ordenación */}
                <View className="flex-row items-center justify-between mb-6 px-1">
                    <View className="flex-row items-center">
                        <View className="bg-[#E10600]/10 p-1.5 rounded-lg mr-2">
                            <Ionicons name="filter-outline" size={12} color="#E10600" />
                        </View>
                        <Text className="text-[#555] text-[10px] font-black uppercase tracking-[1px]">Ordenado por Valoración</Text>
                    </View>
                    <Text className="text-[#333] text-[10px] font-bold uppercase">{filteredPilotos?.length} Pilotos encontrados</Text>
                </View>

                {/* Listado de Tiras Compactas */}
                {filteredPilotos && filteredPilotos.length > 0 ? (
                    filteredPilotos.map((piloto) => (
                        <MarketListItem 
                            key={piloto.id}
                            piloto={piloto}
                            isBlocked={isPilotoBlocked(piloto)}
                            isUserPilot={piloto.escuderia?.id === partida?.escuderia.id}
                            onPress={() => handleOpenDetail(piloto)}
                        />
                    ))
                ) : (
                    <View className="py-20 items-center justify-center">
                        <Ionicons name="search-outline" size={48} color="#1a1a1a" />
                        <Text className="text-[#333] mt-4 font-black uppercase italic">Sin resultados</Text>
                    </View>
                )}
                
                <View className="h-10" />
            </ScrollView>

            {/* Modal de Detalle y Oferta */}
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
