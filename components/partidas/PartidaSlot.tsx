import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Partida } from '../../types/partida';

/**
 * Interface del componente que acepta ya sea una partida para renderizar su información,
 * o "null" / undefined en caso de que este slot (hueco) esté vacío.
 */
interface GameSlotProps {
    partida?: Partida; 
    slotNumber: number;
}

/**
 * PartidaSlot Component
 * 
 * Responsabilidad: Renderizar gráficamente un único hueco de "Guardado de Partida".
 * Está construido sobre fondos oscuros usando la recomendación del TFG en sostenibilidad
 * para que genere muy bajo consumo lumínico/energético en la pantalla del usuario.
 * 
 * Si está vacío, ofrece la opción de crear una partida nueva.
 */
export default function PartidaSlot({ partida, slotNumber }: GameSlotProps) {
    if (!partida) {
        // Slot Vacío
        return (
            <TouchableOpacity style={[styles.container, styles.emptyContainer]} activeOpacity={0.7}>
                <Text style={styles.emptyTitle}>RANURA {slotNumber}</Text>
                <Text style={styles.newGameText}>+ Iniciar Nueva Carrera</Text>
            </TouchableOpacity>
        );
    }

    // Forma de parsear fecha "2026-04-16T14:51:22" a algo mas limpio, por ejemplo "16/4/2026"
    const parsedDate = new Date(partida.fechaCreacion).toLocaleDateString();

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7}>
            <View style={styles.header}>
                <Text style={styles.title}>{partida.nombre}</Text>
                <Text style={styles.yearText}>Temp. {partida.anio}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>Escudería ID: {partida.idEscuderiaSeleccionada}</Text>
                <Text style={styles.infoText}>Circuito ID: {partida.proximoCircuito}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.dateText}>Creado: {parsedDate}</Text>
            </View>
        </TouchableOpacity>
    );
}

// Estilos estrictamente orientados al Tema Oscuro (Dark Theme)
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E', // Gris super oscuro
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#E10600', // Rojo "F1 Racing" para darle la temática pero eficientemente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Android shadow
    },
    emptyContainer: {
        borderLeftColor: '#444444', // Grisapagado para indicar inactivo
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyTitle: {
        color: '#666666',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    newGameText: {
        color: '#E10600',
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    yearText: {
        color: '#FFB800', // Amarillo neumático
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'column',
        marginBottom: 12,
    },
    infoText: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 8,
    },
    dateText: {
        color: '#666666',
        fontSize: 12,
        fontStyle: 'italic',
    }
});
