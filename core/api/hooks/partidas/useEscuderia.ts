import { escuderia } from '@/core/api/action/escuderia.action';
import { useQuery } from '@tanstack/react-query';
import { Escuderia } from '../../../../types/escuderia';

export const useEscuderia = (identity: number) => {
    return useQuery<Escuderia>({
        queryKey: ['escuderia', identity],
        queryFn: () => escuderia(identity),
        enabled: !!identity, // Solo se ejecuta si tenemos un ID
    });
};