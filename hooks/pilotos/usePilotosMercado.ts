import { obtenerPilotosPartida } from '@/core/api/piloto.action';
import { Piloto } from '@/types/piloto';
import { useQuery } from '@tanstack/react-query';

/**
 * usePilotosMercado
 * 
 * Hook para gestionar la lista global de pilotos disponibles en la partida.
 * Se utiliza principalmente en la pantalla de Mercado.
 * 
 * @param {number} partidaId - ID de la partida activa.
 */
export const usePilotosMercado = (partidaId: number) => {
    return useQuery<Piloto[]>({
        queryKey: ['pilotos', 'mercado', partidaId],
        queryFn: () => obtenerPilotosPartida(partidaId),
        enabled: !!partidaId,
        staleTime: 1000 * 60 * 2, // 2 minutos de caché para el mercado
    });
};
