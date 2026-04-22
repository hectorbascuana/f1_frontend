import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearPartida } from '../../core/api/partidas.action';
import { router } from 'expo-router';

/**
 * useCrearPartida
 * 
 * Hook que gestiona la mutación para crear una nueva partida.
 * Utiliza TanStack Query para controlar el estado de la petición (loading, success, error)
 * e invalida la caché de partidas previas para asegurar que el menú principal se actualice.
 */
export const useCrearPartida = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nombre, escuderiaId }: { nombre: string; escuderiaId: number }) => 
            crearPartida(nombre, escuderiaId),
        
        onSuccess: (data) => {
            // Invalidamos la consulta de partidas para que se refresque la lista en el index
            queryClient.invalidateQueries({ queryKey: ['partidas'] });
            
            // Opcionalmente, podríamos navegar a la pantalla de la partida recién creada
            // No obstante, por ahora volvemos al menú principal para ver el nuevo slot ocupado
            router.replace('/');
        },
        onError: (error) => {
            console.error('Error en la mutación de creación:', error);
            // El manejo de errores visuales se puede hacer a través de la propiedad 'error' de useMutation
        }
    });
};


