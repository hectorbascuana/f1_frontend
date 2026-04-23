import { useQuery } from '@tanstack/react-query';
import { Circuito } from '../../types/circuito';
import { circuitos } from '@/core/api/circuitos.action';

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
