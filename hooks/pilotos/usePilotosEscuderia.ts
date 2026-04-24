import { useQuery } from '@tanstack/react-query';
import { obtenerPilotosEscuderia } from '@/core/api/piloto.action';
import { Piloto } from '@/types/piloto';

/**
 * Hook para gestionar la carga de pilotos de una escudería.
 * @param {number} escuderiaId - ID de la escudería a consultar.
 */
export const usePilotosEscuderia = (escuderiaId: number) => {
    return useQuery<Piloto[]>({
        queryKey: ['pilotos', 'escuderia', escuderiaId],
        queryFn: () => obtenerPilotosEscuderia(escuderiaId),
        enabled: !!escuderiaId,
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });
};
