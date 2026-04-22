import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ESCUDERIAS_DATA } from '../constants/EscuderiasData';
import { getTeamImage } from '../constants/TeamAssets';
import { Escuderia } from '../types/partida';
import { useCrearPartida } from '../hooks/partidas/useCrearPartida';

/**
 * NuevaPartidaScreen
 * 
 * Pantalla para la creación de una nueva partida de F1 Manager.
 * Permite al usuario definir el nombre de su carrera y seleccionar una escudería inicial.
 */
export default function NuevaPartidaScreen() {
    const [nombrePartida, setNombrePartida] = useState('');
    const [escuderiaSeleccionada, setEscuderiaSeleccionada] = useState<Escuderia>(ESCUDERIAS_DATA[0]);

    // Integración del hook de mutación
    const { mutate, isPending } = useCrearPartida();

    // Lógica para deshabilitar el botón de envío
    const isFormInvalid = nombrePartida.trim().length < 3 || !escuderiaSeleccionada;

    const handleCrearPartida = () => {
        if (isFormInvalid) return;

        mutate({
            nombre: nombrePartida,
            escuderiaId: escuderiaSeleccionada.id
        });
    };

    // Función para renderizar los niveles de una estadística (1 a 5)
    const renderStatLevel = (level: number, color: string) => {
        return (
            <View className="flex-row">
                {[1, 2, 3, 4, 5].map((i) => (
                    <View 
                        key={i} 
                        className={`w-3.5 h-1.5 rounded-full mr-0.5 ${i <= level ? color : 'bg-[#333]'}`}
                    />
                ))}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#0a0a0a] pt-12">
            {/* Header */}
            <View className="flex-row items-center px-4 mb-6">
                <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2" disabled={isPending}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-black italic">NUEVA CARRERA</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Nombre de la Partida */}
                <View className="mb-8">
                    <Text className="text-[#AAAAAA] text-xs font-bold tracking-[2px] mb-3 uppercase">Nombre de la Carrera</Text>
                    <View className="bg-[#151515] border border-[#222] rounded-xl px-4 py-3 flex-row items-center">
                        <Ionicons name="pencil-outline" size={20} color="#E10600" className="mr-3" />
                        <TextInput
                            placeholder="Ej: Mi Carrera 2026"
                            placeholderTextColor="#555"
                            className="flex-1 text-white text-[16px] font-bold"
                            value={nombrePartida}
                            onChangeText={setNombrePartida}
                            editable={!isPending}
                        />
                    </View>
                </View>

                {/* Selección de Escudería */}
                <Text className="text-[#AAAAAA] text-xs font-bold tracking-[2px] mb-4 uppercase">Selecciona tu Escudería</Text>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    className="mb-8"
                    contentContainerClassName="pr-6"
                >
                    {ESCUDERIAS_DATA.map((item) => (
                        <Pressable 
                            key={item.id}
                            onPress={() => !isPending && setEscuderiaSeleccionada(item)}
                            className={`mr-4 w-24 h-24 rounded-2xl border-2 items-center justify-center overflow-hidden ${
                                escuderiaSeleccionada.id === item.id 
                                ? 'border-[#E10600] bg-[#1e1e1e]' 
                                : 'border-[#222] bg-[#151515]'
                            }`}
                        >
                            <Image 
                                source={getTeamImage(item.imagenUrl)}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            {escuderiaSeleccionada.id === item.id && (
                                <View className="absolute top-2 right-2 bg-[#E10600] rounded-full p-1 shadow-md shadow-black">
                                    <Ionicons name="checkmark" size={12} color="white" />
                                </View>
                            )}
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Detalle de la Escudería Seleccionada */}
                <View className="bg-[#151515] border border-[#222] rounded-3xl p-6 mb-10 overflow-hidden">
                    <View className="absolute top-0 right-0 p-4 opacity-10">
                         <Ionicons name="speedometer-outline" size={120} color="white" />
                    </View>

                    <View className="flex-row items-center mb-6">
                        <View className="w-20 h-20 bg-black rounded-2xl mr-4 items-center justify-center border border-[#333] overflow-hidden">
                            <Image 
                                source={getTeamImage(escuderiaSeleccionada.imagenUrl)}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-black italic leading-none mb-1">
                                {escuderiaSeleccionada.nombre.toUpperCase()}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="wallet-outline" size={14} color="#4CD964" className="mr-1" />
                                <Text className="text-[#4CD964] font-bold">{escuderiaSeleccionada.presupuesto} M €</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row flex-wrap justify-between">
                        {/* Aerodinámica */}
                        <View className="w-[48%] mb-4 bg-black/30 p-3 rounded-xl border border-[#222]">
                            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Aerodinámica</Text>
                            <View className="flex-row items-end">
                                <Text className="text-white text-xl font-black mr-2">{escuderiaSeleccionada.aerodinamica}</Text>
                                <View className="mb-1.5 flex-1 h-1 bg-[#333] rounded-full">
                                    <View className="h-full bg-cyan-400 rounded-full" style={{ width: `${escuderiaSeleccionada.aerodinamica}%` }} />
                                </View>
                            </View>
                        </View>

                        {/* Motor */}
                        <View className="w-[48%] mb-4 bg-black/30 p-3 rounded-xl border border-[#222]">
                            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-1">Potencia Motor</Text>
                            <View className="flex-row items-end">
                                <Text className="text-white text-xl font-black mr-2">{escuderiaSeleccionada.motor}</Text>
                                <View className="mb-1.5 flex-1 h-1 bg-[#333] rounded-full">
                                    <View className="h-full bg-red-500 rounded-full" style={{ width: `${escuderiaSeleccionada.motor}%` }} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Instalaciones */}
                    <Text className="text-[#555] text-[10px] font-black tracking-[1px] mb-3 uppercase mt-2">Instalaciones</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-[#AAA] text-[9px] mb-1">Túnel Viento</Text>
                            {renderStatLevel(escuderiaSeleccionada.tunel_viento, 'bg-amber-400')}
                        </View>
                        <View className="items-center">
                            <Text className="text-[#AAA] text-[9px] mb-1">Banco Pruebas</Text>
                            {renderStatLevel(escuderiaSeleccionada.banco_pruebas, 'bg-emerald-400')}
                        </View>
                        <View className="items-center">
                            <Text className="text-[#AAA] text-[9px] mb-1">Escuela Pilotos</Text>
                            {renderStatLevel(escuderiaSeleccionada.escuela_pilotos, 'bg-indigo-400')}
                        </View>
                    </View>
                </View>

                {/* Botón Iniciar */}
                <TouchableOpacity 
                    className={`rounded-2xl py-4 flex-row justify-center items-center mb-10 ${
                        isFormInvalid || isPending ? 'bg-[#222]' : 'bg-[#E10600]'
                    }`}
                    disabled={isFormInvalid || isPending}
                    onPress={handleCrearPartida}
                >
                    {isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white text-lg font-black italic mr-2 uppercase">Iniciar Carrera</Text>
                            <Ionicons name="flag-outline" size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
