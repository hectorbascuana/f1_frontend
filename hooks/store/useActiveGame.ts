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
    const urlId = Array.isArray(id) ? id[0] : id;

    // Solo consideramos que NO coincide si tenemos un ID en la URL y es distinto al del Store.
    // Si urlId es undefined (transición), mantenemos la partida del Store como válida provisionalmente.
    const idCoincide = !!partida && (!urlId || partida.id.toString() === urlId.toString());

    // Si no coincide o no hay partida en el store, pedimos los datos reales
    const fetchId = !idCoincide ? urlId : undefined;
    const { data: serverPartida, isLoading, error } = usePartida(fetchId);

    useEffect(() => {
        // Solo actualizamos el store si recibimos datos nuevos y válidos del servidor
        if (serverPartida && (!partida || serverPartida.id !== partida.id)) {
            setPartida(serverPartida);
        }
    }, [serverPartida, partida, setPartida]);

    return {
        // Si urlId es el correcto, usamos lo del store. Si no, lo que venga del server.
        partida: idCoincide ? partida : serverPartida,
        isLoading: !idCoincide && isLoading,
        error: error ? 'Error al sincronizar la sesión de juego' : null
    };
};
