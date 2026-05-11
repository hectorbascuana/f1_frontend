import { useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { usePartida } from '../../core/api/hooks/partidas/usePartida';
import { useGameStore } from '../../core/store/useGameStore';

/**
 * Hook useActiveGame
 * 
 * Responsabilidad: Garantizar que la partida seleccionada esté disponible 
 * tanto en el estado global (Zustand) como sincronizada con la API.
 */
export const useActiveGame = () => {
    const { id } = useGlobalSearchParams();
    const { partida, setPartida } = useGameStore();

    // El id del search params puede venir como string o array de strings
    const rawId = Array.isArray(id) ? id[0] : id;

    // Ignoramos placeholders tipo "[id]" que a veces devuelve Expo Router en la carga inicial
    const urlId = (rawId && rawId !== '[id]' && rawId !== '{id}') ? rawId : undefined;

    // Sincronizamos con el servidor siempre que tengamos un ID válido en la URL.
    // Esto permite que queryClient.invalidateQueries(['partida', urlId]) funcione.
    const { data: serverPartida, isLoading, error } = usePartida(urlId);

    useEffect(() => {
        if (serverPartida) {
            // Solo actualizamos el store si hay cambios reales para evitar re-renderizados infinitos
            if (JSON.stringify(serverPartida) !== JSON.stringify(partida)) {
                setPartida(serverPartida);
            }
        }
    }, [serverPartida, setPartida, partida]);

    return {
        partida: serverPartida || partida, // Prioridad al dato más fresco del servidor
        isLoading: isLoading && !partida,   // Solo mostramos loading si no tenemos nada en el store
        error: error ? 'Error al sincronizar la sesión de juego' : null
    };
};
