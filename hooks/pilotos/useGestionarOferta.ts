import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aceptarOferta, rechazarOferta } from "@/core/api/traspasos.action";
import { Alert } from "react-native";

/**
 * useGestionarOferta
 * Hook para gestionar la aceptación o el rechazo de ofertas de pilotos.
 */
export function useGestionarOferta() {
    const queryClient = useQueryClient();

    const acceptMutation = useMutation({
        mutationFn: (ofertaId: number) => aceptarOferta(ofertaId),
        onSuccess: () => {
            // Si aceptamos una oferta, invalidamos partida para refrescar el Header (presupuesto)
            // e invalidamos pilotos/escuderia para ver los cambios en la plantilla.
            queryClient.invalidateQueries({ queryKey: ['partida'] });
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
            queryClient.invalidateQueries({ queryKey: ['escuderia'] });
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "No se ha podido aceptar la oferta.");
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (ofertaId: number) => rechazarOferta(ofertaId),
        onSuccess: () => {
            // Si rechazamos, solo nos interesan las ofertas (que están dentro de pilotos)
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
        },
        onError: (error: any) => {
            Alert.alert("Error", error.message || "No se ha podido rechazar la oferta.");
        }
    });

    return {
        aceptar: acceptMutation,
        rechazar: rejectMutation
    };
}
