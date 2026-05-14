import CarCard from '@/components/mejoras/CarCard';
import FacilityRow from '@/components/mejoras/FacilityRow';
import { TipoMejora } from '@/types/escuderia';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Text, TouchableOpacity, View } from 'react-native';
import { useMejorarEscuderia } from '../../../../../core/api/hooks/escuderia/useMejorarEscuderia';
import { useEscuderia } from '../../../../../core/api/hooks/partidas/useEscuderia';
import { useActiveGame } from '../../../../../hooks/store/useActiveGame';
import PartidaHeader from '../../../../../components/partidas/PartidaHeader';

/**
 * MejorasScreen
 * 
 * Pantalla de Desarrollo Técnico (I+D) con diseño de tarjetas cuadradas.
 */
export default function MejorasScreen() {
    const { partida, isLoading: loadingGame, error: errorGame } = useActiveGame();
    const [showAumento, setShowAumento] = useState<{ value: number, label: string } | null>(null);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Obtenemos el ID de la escudería de la partida activa
    const escuderiaId = partida?.escuderia?.id;
    const { data: escuderia, isLoading: loadingTech, error: errorTech, refetch } = useEscuderia(escuderiaId || 0);
    const { mutate: mejorar, isPending: mejorando, error: errorMejora, reset: resetError } = useMejorarEscuderia();

    useEffect(() => {
        if (escuderia) {
            console.log('[MejorasScreen] Datos de escudería renderizados:', {
                presupuesto: escuderia.presupuesto,
                aero: escuderia.aerodinamica,
                motor: escuderia.motor
            });
        }
    }, [escuderia]);

    // Resetear error al cambiar de pantalla o tras un tiempo
    useEffect(() => {
        if (errorMejora) {
            const timer = setTimeout(() => resetError(), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMejora]);

    // Efecto para animar el panel de aumento
    useEffect(() => {
        if (showAumento) {
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
            ]).start(() => setShowAumento(null));
        }
    }, [showAumento]);

    const handleMejorar = (tipo: TipoMejora, label: string) => {
        if (!escuderiaId) return;

        mejorar({ escuderiaId, tipoMejora: tipo }, {
            onSuccess: (data) => {
                // Solo mostramos el panel para Motor y Aerodinámica
                if (tipo === TipoMejora.MOTOR || tipo === TipoMejora.AERODINAMICA) {
                    setShowAumento({ value: data.aumento, label });
                }
            }
        });
    };

    // Estado de carga unificado
    if (loadingGame || (loadingTech && !!escuderiaId)) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <ActivityIndicator size="large" color="#E10600" />
                <Text className="text-[#AAAAAA] mt-4 font-bold tracking-[2px] text-xs uppercase">Sincronizando I+D...</Text>
            </View>
        );
    }

    // Estado de error
    if (errorGame || errorTech || (!escuderia && !loadingTech && !!escuderiaId)) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center px-10">
                <Ionicons name="cloud-offline-outline" size={48} color="#E10600" />
                <Text className="text-white text-center font-black mt-4 uppercase italic">Error de Conexión</Text>
                <Text className="text-[#555] text-center text-xs mt-2">No se ha podido recuperar la telemetría técnica de la escudería.</Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="mt-6 bg-[#151515] border border-[#222] px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold uppercase text-[10px]">Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!escuderia) {
        return (
            <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
                <Text className="text-[#555] font-black uppercase italic">Esperando datos de partida...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0a0a0a]">
            <PartidaHeader />
            <View className="flex-1 px-5 py-4">
                {/* Cabecera Minimalista */}
                <View className="mb-4 mt-2 px-1">
                    <Text className="text-[#E10600] text-[10px] font-black uppercase tracking-[4px] mb-0.5">Centro de Innovación</Text>
                    <View className="flex-row justify-between items-end">
                        <Text className="text-white text-2xl font-black italic uppercase tracking-[-1px]">I+D Y MEJORAS</Text>
                        {mejorando && <ActivityIndicator size="small" color="#E10600" />}
                    </View>

                    {/* Visualización de errores de mutación */}
                    {errorMejora && (
                        <View className="mt-2 bg-red-500/10 border border-red-500/20 p-2 rounded-lg flex-row items-center">
                            <Ionicons name="alert-circle" size={14} color="#ef4444" />
                            <Text className="text-red-400 text-[10px] font-bold ml-2 uppercase">
                                {errorMejora instanceof Error ? errorMejora.message : 'Error en la mejora'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* GRUPO 1: RENDIMIENTO MONOPLAZA */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-2.5 ml-2">
                        <View className="w-1 h-1 bg-[#E10600] rounded-full mr-2" />
                        <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px]">Evolución del Coche</Text>
                    </View>
                    <View className="flex-row">
                        <CarCard
                            label="Aerodinámica"
                            value={escuderia.aerodinamica}
                            cost={escuderia.aerodinamicaCosto}
                            presupuesto={escuderia.presupuesto}
                            icon="airplane"
                            color="#00D2FF"
                            onPress={() => handleMejorar(TipoMejora.AERODINAMICA, "Aerodinámica")}
                        />
                        <CarCard
                            label="Potencia Motor"
                            value={escuderia.motor}
                            cost={escuderia.motorCosto}
                            presupuesto={escuderia.presupuesto}
                            icon="flame"
                            color="#FF1E1E"
                            onPress={() => handleMejorar(TipoMejora.MOTOR, "Motor")}
                        />
                    </View>
                    <View className="flex-row">
                        <CarCard
                            label="Durabilidad"
                            value={escuderia.durabilidad}
                            cost={escuderia.durabilidadCosto}
                            presupuesto={escuderia.presupuesto}
                            icon="shield-checkmark"
                            color="#4CD964"
                            maxValue={20}
                            onPress={() => handleMejorar(TipoMejora.DURABILIDAD, "Durabilidad")}
                        />
                        <View className="flex-1 m-1" />
                    </View>
                </View>

                {/* GRUPO 2: INFRAESTRUCTURA */}
                <View className="mb-4">
                    <View className="flex-row items-center mb-2.5 ml-2">
                        <View className="w-1 h-1 bg-amber-500 rounded-full mr-2" />
                        <Text className="text-[#555] text-[9px] font-black uppercase tracking-[2px]">Instalaciones HQ</Text>
                    </View>
                    <FacilityRow
                        label="Túnel Viento"
                        value={escuderia.tunelViento}
                        cost={escuderia.tunelVientoCosto}
                        presupuesto={escuderia.presupuesto}
                        icon="air"
                        color="#FFD700"
                        IconSet={MaterialIcons}
                        onPress={() => handleMejorar(TipoMejora.TUNEL_VIENTO, "Túnel de Viento")}
                    />
                    <FacilityRow
                        label="Banco Pruebas"
                        value={escuderia.bancoPruebas}
                        cost={escuderia.bancoPruebasCosto}
                        presupuesto={escuderia.presupuesto}
                        icon="speedometer-outline"
                        color="#FF8C00"
                        onPress={() => handleMejorar(TipoMejora.BANCO_PRUEBAS, "Banco de Pruebas")}
                    />
                    <FacilityRow
                        label="Academia"
                        value={escuderia.escuelaPilotos}
                        cost={escuderia.escuelaPilotosCosto}
                        presupuesto={escuderia.presupuesto}
                        icon="school"
                        color="#A020F0"
                        onPress={() => handleMejorar(TipoMejora.ESCUELA_PILOTOS, "Escuela de Pilotos")}
                    />
                </View>

                {/* Panel de Aumento (Pop-up Temporal) */}
                {showAumento && (() => {
                    const getLevelData = (val: number) => {
                        if (val <= 0) return { label: 'FALLO', msg: 'Mejora fallida', color: '#ef4444', icon: 'close-circle' };
                        if (val === 1) return { label: 'NORMAL', msg: 'Resultado esperado', color: '#00D2FF', icon: 'trending-up' };
                        if (val === 2) return { label: 'OPTIMO', msg: 'Resultado positivo', color: '#10b981', icon: 'checkmark-circle' };
                        return { label: 'ÉPICO', msg: 'Mejora excelente', color: '#FFD700', icon: 'flash' };
                    };
                    const level = getLevelData(showAumento.value);

                    return (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                                shadowColor: level.color,
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: showAumento.value >= 3 ? 0.5 : 0.2,
                                shadowRadius: 20,
                                borderColor: `${level.color}40`,
                                borderWidth: 1
                            }}
                            className={`absolute bottom-10 left-5 right-5 bg-[#151515] border rounded-2xl p-4 flex-row items-center justify-between z-50`}
                        >
                            <View className="flex-row items-center flex-1 mr-2">
                                <View style={{ backgroundColor: `${level.color}15` }} className="p-2.5 rounded-full mr-3">
                                    <Ionicons name={level.icon as any} size={22} color={level.color} />
                                </View>
                                <View className="flex-1">
                                    <Text style={{ color: level.color }} className="text-[8px] font-black uppercase tracking-[1px] mb-0.5">{level.label}</Text>
                                    <Text className="text-white font-bold text-[13px] italic uppercase tracking-[-0.5px]">
                                        {level.msg}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: level.color }} className="px-4 py-2 rounded-xl shadow-lg">
                                <Text className="text-black font-black text-lg">+{showAumento.value}</Text>
                            </View>
                        </Animated.View>
                    );
                })()}
            </View>
        </View>
    );
}
