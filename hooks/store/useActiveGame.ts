import { useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useGameStore } from '../../core/store/useGameStore';
import { usePartida } from '../partidas/usePartida';

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

    // Solo consideramos que NO coincide si tenemos un ID en la URL y es distinto al del Store.
    // Si urlId es undefined (transición), mantenemos la partida del Store como válida provisionalmente.
    const idCoincide = !!partida && (!urlId || partida.id.toString() === urlId.toString());

    // Si no coincide o no hay partida en el store, pedimos los datos reales (solo si tenemos un URL id real)
    const fetchId = !idCoincide ? urlId : undefined;
    const { data: serverPartida, isLoading, error } = usePartida(fetchId);

    useEffect(() => {
        if (serverPartida) {
            console.log('[useActiveGame] Datos recibidos del servidor para partida:', serverPartida.id);
            // Solo actualizamos si realmente es diferente para evitar loops
            if (JSON.stringify(serverPartida) !== JSON.stringify(partida)) {
                console.log('[useActiveGame] Actualizando store con datos frescos');
                setPartida(serverPartida);
            }
        }
    }, [serverPartida, setPartida, partida]);

    return {
        // Priorizamos la partida del servidor si acabamos de hacer fetch por discrepancia de ID
        partida: idCoincide ? partida : serverPartida,
        isLoading: !idCoincide && !!urlId && isLoading,
        error: error ? 'Error al sincronizar la sesión de juego' : null
    };
};
