import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearPartida } from '../../core/api/partidas.action';
import { router } from 'expo-router';
import { useGameStore } from '../../core/store/useGameStore';

/**
 * useCrearPartida
 * 
 * Hook que gestiona la mutación para crear una nueva partida.
 */
export const useCrearPartida = () => {
    const queryClient = useQueryClient();
    const setPartida = useGameStore((state) => state.setPartida);

    return useMutation({
        mutationFn: ({ nombre, escuderiaId }: { nombre: string; escuderiaId: number }) => 
            crearPartida(nombre, escuderiaId),
        
        onSuccess: (data) => {
            // Invalidamos la consulta de partidas para que el caché esté fresco
            queryClient.invalidateQueries({ queryKey: ['partidas'] });
            
            // Guardamos la partida completa en el Store inmediatamente
            setPartida(data);

            // Navegamos directamente al interior de la partida
            router.replace({
                pathname: "/(partidas)/[id]/carrera",
                params: { id: data.id }
            });
        },
        onError: (error) => {
            console.error('Error en la mutación de creación:', error);
            // El manejo de errores visuales se puede hacer a través de la propiedad 'error' de useMutation
        }
    });
};


