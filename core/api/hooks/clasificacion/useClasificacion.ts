import { useQuery } from "@tanstack/react-query";
import { obtenerClasificacionConstructores, obtenerClasificacionPilotos } from "../../action/clasificacion.action";

/**
 * useClasificacionPilotos
 * Hook para obtener la clasificación de pilotos.
 * Se refresca automáticamente cuando cambia el circuito activo.
 */
export function useClasificacionPilotos(partidaId: number, proximoCircuito: number) {
    return useQuery({
        queryKey: ['clasificacion', 'pilotos', partidaId, proximoCircuito],
        queryFn: () => obtenerClasificacionPilotos(partidaId),
        enabled: !!partidaId,
        staleTime: 1000 * 60 * 10, // 10 minutos de caché
    });
}

/**
 * useClasificacionConstructores
 * Hook para obtener la clasificación de constructores.
 * Se refresca automáticamente cuando cambia el circuito activo.
 */
export function useClasificacionConstructores(partidaId: number, proximoCircuito: number) {
    return useQuery({
        queryKey: ['clasificacion', 'constructores', partidaId, proximoCircuito],
        queryFn: () => obtenerClasificacionConstructores(partidaId),
        enabled: !!partidaId,
        staleTime: 1000 * 60 * 10,
    });
}
