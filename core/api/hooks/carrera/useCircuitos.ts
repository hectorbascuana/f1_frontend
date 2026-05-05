import { circuitos } from '@/core/api/action/circuitos.action';
import { useQuery } from '@tanstack/react-query';
import { Circuito } from '../../../../types/circuito';

/**
 * Hook useCircuitos
 * 
 * Responsabilidad: Obtener el calendario completo de circuitos.
 */
export const useCircuitos = () => {
    return useQuery<Circuito[]>({
        queryKey: ['circuitos'],
        queryFn: circuitos,
    });
};
