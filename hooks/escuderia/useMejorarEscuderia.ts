import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mejorarEscuderia } from '@/core/api/escuderia.action';
import { Escuderia, MejoraRequest, MejoraResponse, TipoMejora } from '@/types/escuderia';
import { useGameStore } from '../../core/store/useGameStore';

/**
 * Hook personalizado para gestionar la mejora de componentes o instalaciones de la escudería.
 */
export const useMejorarEscuderia = () => {
    const queryClient = useQueryClient();
    const actualizarPresupuestoStore = useGameStore((state) => state.actualizarPresupuesto);

    return useMutation({
        mutationFn: (request: MejoraRequest) => mejorarEscuderia(request),
        onSuccess: (data: MejoraResponse, variables: MejoraRequest) => {
            console.log('[Hook] Mejora exitosa, actualizando caché para ID:', variables.escuderiaId);
            const queryKey = ['escuderia', variables.escuderiaId];

            // 1. Actualizamos el Store Global (Header)
            actualizarPresupuestoStore(data.presupuesto);

            // 2. Actualización Directa de la Caché (Optimista/Rápida para la pantalla actual)
            queryClient.setQueryData<Escuderia>(queryKey, (oldData) => {
                if (!oldData) {
                    console.warn('[Hook] No se encontró data previa en la caché para la clave:', queryKey);
                    return oldData;
                }
                
                // Creamos una copia profunda o al menos lo suficiente para disparar el re-render
                const updatedData = JSON.parse(JSON.stringify(oldData));
                updatedData.presupuesto = data.presupuesto;

                switch (variables.tipoMejora) {
                    case TipoMejora.AERODINAMICA:
                        updatedData.aerodinamica = data.nivelActual;
                        updatedData.aerodinamicaCosto = data.nuevoCoste;
                        break;
                    case TipoMejora.MOTOR:
                        updatedData.motor = data.nivelActual;
                        updatedData.motorCosto = data.nuevoCoste;
                        break;
                    case TipoMejora.DURABILIDAD:
                        updatedData.durabilidad = data.nivelActual;
                        updatedData.durabilidadCosto = data.nuevoCoste;
                        break;
                    case TipoMejora.TUNEL_VIENTO:
                        updatedData.tunelViento = data.nivelActual;
                        updatedData.tunelVientoCosto = data.nuevoCoste;
                        break;
                    case TipoMejora.BANCO_PRUEBAS:
                        updatedData.bancoPruebas = data.nivelActual;
                        updatedData.bancoPruebasCosto = data.nuevoCoste;
                        break;
                    case TipoMejora.ESCUELA_PILOTOS:
                        updatedData.escuelaPilotos = data.nivelActual;
                        updatedData.escuelaPilotosCosto = data.nuevoCoste;
                        break;
                }

                console.log('[Hook] Caché actualizada correctamente:', updatedData);
                return updatedData;
            });

            // 2. Invalidación (Garantiza consistencia absoluta con el backend)
            // Esto hará que useEscuderia vuelva a pedir los datos en segundo plano
            queryClient.invalidateQueries({ queryKey });
            
            // 3. También invalidamos la partida, por si otras pantallas dependen del presupuesto ahí
            queryClient.invalidateQueries({ queryKey: ['partida'] });
        },
        onError: (error) => {
            console.error('Error al realizar la mejora:', error);
        }
    });
};
