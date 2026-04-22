import { useMutation, useQueryClient } from '@tanstack/react-query';
import { borrarPartida } from '../../core/api/partidas.action';
import { Alert } from 'react-native';
import { Partida } from '../../types/partida';

/**
 * useBorrarPartida
 * 
 * Hook que gestiona la eliminación de una partida con Actualización Optimista.
 * Permite que la UI se actualice instantáneamente mientras la petición viaja al server.
 */
export const useBorrarPartida = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => borrarPartida(id),
        
        // Actualización Optimista: Se ejecuta antes de la función de mutación
        onMutate: async (idASuprimir) => {
            // Cancelamos refetches salientes para no sobrescribir nuestra actualización optimista
            await queryClient.cancelQueries({ queryKey: ['partidas'] });

            // Snapshot del valor previo en caso de que necesitemos hacer rollback
            const partidasPrevias = queryClient.getQueryData<Partida[]>(['partidas']);

            // Actualizamos el caché de forma optimista eliminando la partida
            if (partidasPrevias) {
                queryClient.setQueryData(['partidas'], 
                    partidasPrevias.filter(p => p.id !== idASuprimir)
                );
            }

            // Devolvemos el contexto con el valor previo
            return { partidasPrevias };
        },

        // Si la mutación falla, usamos el valor del contexto para restaurar la lista
        onError: (error: any, id, context) => {
            if (context?.partidasPrevias) {
                queryClient.setQueryData(['partidas'], context.partidasPrevias);
            }
            Alert.alert('Error', error.message || 'No se pudo eliminar la partida');
        },

        // Al terminar (éxito o fallo), invalidamos para asegurar sincronización real con el server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['partidas'] });
        },

        onSuccess: (data) => {
            console.log('Borrado confirmado por servidor:', data.mensaje);
        }
    });
};
