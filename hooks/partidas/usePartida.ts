import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import { Partida } from '../../types/partida';

/**
 * Hook usePartida
 * 
 * Responsabilidad: Obtener los detalles completos de una partida específica.
 * Incluye información de la escudería, presupuesto y progreso de la temporada.
 * 
 * @param identity - ID de la partida (desde la URL)
 */
export const usePartida = (identity: string | string[] | undefined) => {
    return useQuery<Partida>({
        queryKey: ['partida', identity],
        queryFn: async () => {
            if (!identity) throw new Error('ID de partida no proporcionado');
            const response = await axios.get(`${BASE_URL}/api/partidas/${identity}`);
            return response.data;
        },
        enabled: !!identity,
    });
};
