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
 * Beneficio TFG: Cumple con los principios de eficiencia al evitar recargas innecesarias
 * y asegurar la persistencia en memoria durante la navegación por pestañas.
 */
export const useActiveGame = () => {
    const { id } = useLocalSearchParams();
    const { partida, setPartida } = useGameStore();
    
    // Solo pedimos a la API si no tenemos la partida en el store
    const { data: serverPartida, isLoading, error } = usePartida(partida ? undefined : id);

    useEffect(() => {
        // Si el store está vacío pero la API nos ha devuelto los datos, "primamos" el store.
        if (!partida && serverPartida) {
            setPartida(serverPartida);
        }
    }, [serverPartida, partida, setPartida]);

    return {
        partida: partida || serverPartida,
        isLoading: !partida && isLoading,
        error: error ? 'Error al sincronizar la sesión de juego' : null
    };
};
