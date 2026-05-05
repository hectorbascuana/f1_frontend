import { mapPartidaFromDTO } from '@/core/mappers/partidaMapper';
import { PartidaDTO } from '@/core/types/partidaDTO';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { Partida } from '../../../../types/partida';

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
            const { data } = await api.get<PartidaDTO>(`partida/${identity}`);
            return mapPartidaFromDTO(data);
        },
        enabled: !!identity,
    });
};
