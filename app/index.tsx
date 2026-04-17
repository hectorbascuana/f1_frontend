import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import PartidaSlot from '../components/partidas/PartidaSlot';
import { usePartidas } from '../hooks/partidas/usePartidas';

/**
 * Pantalla de Inicio (index.tsx)
 * 
 * Responsabilidad: Ser la primera pantalla que encuentra el jugador. 
 * Muestra el menú de selección de partidas (Modo Carrera).
 * 
 * Por petición para el TFG:
 * - Solamente se permiten 3 slots de juego a la vez. (Por eso forzamos iterar de 1 a 3).
 * - Utilizamos dark theme para maximar eficacia de batería.
 * - Usamos hooks separados para aislar lógica del front.
 */
export default function MenuPartidasScreen() {
    // Extraemos la información del custom hook (Clean code)
    const { partidas, isLoading, error } = usePartidas();

    return (
        <View style={styles.container}>
            {/* Header / Titulo Superior */}
            <View style={styles.headerContainer}>
                <Text style={styles.mainTitle}>F1 MANAGER</Text>
                <Text style={styles.subTitle}>MODO CARRERA</Text>
            </View>

            {/* Contenedor principal de guardados */}
            <ScrollView contentContainerStyle={styles.slotsContainer}>
                {isLoading ? (
                    // Spinner oscuro / corporativo para cargar datos
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#E10600" />
                        <Text style={styles.loaderText}>Cargando datos de telemetría...</Text>
                    </View>
                ) : error ? (
                    // Manejo de error si falla la conexión al server 8081
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>⚠️ ALERTA DE SISTEMA</Text>
                        <Text style={styles.errorMessage}>{error}</Text>
                    </View>
                ) : (
                    // Iteramos exactamente de 1 a 3 para mapear siempre los tres slots mandatorios
                    [1, 2, 3].map((slotNumber) => {
                        // Comprobamos si el servidor nos devuelve una partida para este indice
                        // Nota: Asume que las partidas que vengan ocupan los slots en el orden en el que de las devuelva el array (max 3)
                        const partidaParaEsteSlot = partidas[slotNumber - 1];

                        return (
                            <PartidaSlot
                                key={`slot-${slotNumber}`}
                                slotNumber={slotNumber}
                                partida={partidaParaEsteSlot}
                            />
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

// Estilzado Oscuro y eficiente.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a', // Oscuro absoluto de fondo
        paddingTop: 50, // Pequeño espacio para la status bar en móviles
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#222222',
        marginBottom: 16,
    },
    mainTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
    },
    subTitle: {
        color: '#E10600',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 4,
        marginTop: 4,
    },
    slotsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    loaderContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 16,
        color: '#AAAAAA',
        fontSize: 14,
    },
    errorContainer: {
        marginTop: 40,
        backgroundColor: '#2A0808',
        borderColor: '#E10600',
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    errorText: {
        color: '#E10600',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    errorMessage: {
        color: '#FFCCCC',
        textAlign: 'center',
        lineHeight: 20,
    }
});
