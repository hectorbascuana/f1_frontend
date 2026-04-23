import { useQuery } from '@tanstack/react-query';
import { Escuderia } from '../../types/escuderia';
import { escuderia } from '@/core/api/escuderia.action';

export const useEscuderia = (identity: number) => {
    return useQuery<Escuderia>({
        queryKey: ['escuderia', identity],
        queryFn: () => escuderia(identity),
        enabled: !!identity, // Solo se ejecuta si tenemos un ID
    });
};