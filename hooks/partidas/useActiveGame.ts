import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useGameStore } from '../../core/store/useGameStore';
import { usePartida } from './usePartida';

/**
 * Hook useActiveGame
 * 
 * Responsabilidad: Garantizar que la partida seleccionada esté disponible 
 * tanto en el estado global (Zustand) como sincronizada con la API.
 * 
 * Lógica:
 * 1. Si la partida existe en el Store, la devuelve inmediatamente.
 * 2. Si no existe (ej. tras un refresh), usa TanStack Query para pedirla al backend.
 * 3. Una vez recibida de la API, actualiza el Store global.
 * 
 * Beneficio: Cumple con los principios de eficiencia al evitar recargas innecesarias
 * y asegurar la persistencia en memoria durante la navegación por pestañas.
 */
export const useActiveGame = () => {
    const { id } = useLocalSearchParams();
    const { partida, setPartida } = useGameStore();
    
    // Determinamos si la partida en el Store es la correcta comparando IDs
    // Si los IDs no coinciden, forzamos la petición a la API ignorando el Store
    const idCoincide = partida && id && partida.id.toString() === id.toString();
    
    const { data: serverPartida, isLoading, error } = usePartida(idCoincide ? undefined : id);

    useEffect(() => {
        // Si los datos del servidor llegan y no coinciden con lo que hay en el Store, actualizamos
        if (serverPartida && (!partida || serverPartida.id !== partida.id)) {
            setPartida(serverPartida);
        }
    }, [serverPartida, partida, setPartida]);

    return {
        partida: idCoincide ? partida : serverPartida,
        isLoading: !idCoincide && isLoading,
        error: error ? 'Error al sincronizar la sesión de juego' : null
    };
};
