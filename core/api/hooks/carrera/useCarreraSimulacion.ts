import { VueltaRequestDTO } from '@/core/types/carreraDTO';
import { useMutation, useQuery } from '@tanstack/react-query';
import { avanzarVuelta, iniciarCarrera } from '../../action/carreraSimulacion.action';

/**
 * useCarreraSimulacion.ts
 * 
 * Hooks de TanStack Query para gestionar el estado de la simulación de carrera.
 */

/**
 * useIniciarCarrera
 * 
 * Hook para obtener la parrilla inicial.
 */
export const useIniciarCarrera = (partidaId: number) => {
  return useQuery({
    queryKey: ['carrera', 'start', partidaId],
    queryFn: () => iniciarCarrera(partidaId),
    enabled: !!partidaId,
    staleTime: Infinity, // Importante: No queremos re-iniciar la carrera por refocus
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * useAvanzarVuelta
 * 
 * Mutation para enviar los datos de la vuelta y obtener el ranking actualizado.
 */
export const useAvanzarVuelta = () => {
  return useMutation({
    mutationFn: ({ uuid, body }: { uuid: string; body: VueltaRequestDTO }) =>
      avanzarVuelta(uuid, body),
  });
};
