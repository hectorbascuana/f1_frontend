import { circuito, siguienteCarrera } from '@/core/api/action/circuitos.action';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Circuito } from '../../../../types/circuito';
import { PartidaDTO } from '@/core/types/partidaDTO';

/**
 * Hook useCircuito
 * 
 * Responsabilidad: Obtener la información técnica de un circuito específico.
 * Se utiliza para mostrar los requisitos y detalles de la próxima carrera.
 * 
 * @param identity - ID del circuito a consultar
 */
export const useCircuito = (identity: number) => {
    return useQuery<Circuito>({
        queryKey: ['circuito', identity],
        queryFn: () => circuito(identity),
        enabled: !!identity, // Solo se ejecuta si tenemos un ID
    });
};  

export const useSiguienteCarrera = (partida_id: number) => {
  return useMutation<PartidaDTO>({
    mutationFn: () => siguienteCarrera(partida_id),
  });
};