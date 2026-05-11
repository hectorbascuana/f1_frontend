import { useQuery } from '@tanstack/react-query';
import { obtenerResultadoCarrera, ResultadoCarreraDTO } from '../../action/resultados.action';

/**
 * useResultadoCarrera
 * 
 * Hook para obtener los resultados de un Gran Premio específico.
 * Solo se ejecuta si la carrera ya ha finalizado en la partida.
 * 
 * @param partidaId - ID de la partida
 * @param temporada - Año de la temporada
 * @param circuitoId - ID del circuito a consultar
 * @param proximoCircuito - El ID del circuito que toca correr ahora (para saber si circuitoId ya pasó)
 */
export const useResultadoCarrera = (
    partidaId: number, 
    temporada: number, 
    circuitoId: number, 
    proximoCircuito: number
) => {
    // La carrera ya ha finalizado si el próximo circuito es mayor al que buscamos
    const haFinalizado = proximoCircuito > circuitoId;

    return useQuery<ResultadoCarreraDTO[]>({
        queryKey: ['resultado-carrera', partidaId, temporada, circuitoId],
        queryFn: () => obtenerResultadoCarrera(partidaId, temporada, circuitoId),
        enabled: !!partidaId && !!temporada && !!circuitoId && haFinalizado,
        staleTime: 1000 * 60 * 60, // Datos estáticos una vez finalizada la carrera
    });
};
