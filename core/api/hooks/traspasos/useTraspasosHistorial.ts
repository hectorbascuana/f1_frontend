import { useQuery } from "@tanstack/react-query";
import { obtenerTraspasosAceptados } from "../../action/traspasos.action";
import { OfertaPiloto } from "@/types/piloto";

/**
 * useTraspasosHistorial
 * Hook para obtener el historial de traspasos aceptados de la partida.
 * Se actualiza automáticamente cuando cambia el ID de la partida o el número de carrera.
 * 
 * @param {number} partidaId - ID de la partida activa.
 * @param {number} carrera - Contador de carreras (para refrescar el historial al avanzar).
 */
export function useTraspasosHistorial(partidaId: number, carrera: number) {
    return useQuery<OfertaPiloto[]>({
        queryKey: ['traspasos', 'historial', partidaId, carrera],
        queryFn: () => obtenerTraspasosAceptados(partidaId),
        enabled: !!partidaId,
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });
}
