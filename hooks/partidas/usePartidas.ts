import { useState, useEffect } from 'react';
import { Partida } from '../../types/partida';
import { api } from '../../utils/api';

/**
 * usePartidas (Hook central de gestión de datos)
 * 
 * Este Custom Hook encapsula toda la interacción y estado relacionado con el recurso "Partida".
 * Cumpliendo los estándares de Clean Code, evitamos que la interfaz gráfica (UI) sepa CÓMO se consiguen 
 * los datos (Fetch vs Axios vs Async Storage), simplemente lo invoca y obtiene variables reactivas.
 * 
 * Retorna:
 * - partidas: Array con la lista de partidas recibidas del backend.
 * - isLoading: Booleano para saber si estamos esperando la red (útil para spinners).
 * - error: Cadena de texto si hay error, permite notificar al usuario.
 * - reloadData: Función que nos permite forzar otra llamada para refrescar.
 */
export const usePartidas = () => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPartidas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Se hace la petición asíncrona mediante axios GET
            const response = await api.get<Partida[]>('api/partida');
            setPartidas(response.data);
        } catch (err) {
            console.error("Error obteniendo partidas:", err);
            setError("No se pudieron cargar las partidas. Revisa que el servidor en el puerto 8081 esté encendido.");
        } finally {
            // Independientemente de si falló o no, terminamos de cargar.
            setIsLoading(false);
        }
    };

    // Al montar el hook (cuando se carga la pantalla inicial), obtenemos las partidas automáticamente.
    useEffect(() => {
        fetchPartidas();
    }, []);

    return {
        partidas,
        isLoading,
        error,
        reloadData: fetchPartidas
    };
};
