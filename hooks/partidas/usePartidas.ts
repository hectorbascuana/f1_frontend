import { useQuery } from '@tanstack/react-query';
import { partidas as getPartidas } from '@/core/api/partidas.action';

/**
 * usePartidas
 * 
 * Hook para gestionar la lista de partidas del usuario utilizando TanStack Query.
 * Delegamos la gestión de estados (loading, error, data) y el almacenamiento en caché
 * a la biblioteca, mejorando la eficiencia y limpieza del código.
 * 
 * @returns Un objeto con la información de la consulta de partidas.
 */
export const usePartidas = () => {
    const { data: partidas = [], isLoading, error } = useQuery({
        queryKey: ['partidas'],
        queryFn: getPartidas,
        // Tiempo de frescura de los datos (1 día) para evitar re-peticiones constantes
        staleTime: 1000 * 60 * 60 * 24
    });

    return {
        partidas,
        isLoading,
        error: error ? error.message : null
    };
};
