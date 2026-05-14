import { aceptarOferta, rechazarOferta } from "@/core/api/action/traspasos.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

/**
 * useGestionarOferta
 * Hook para gestionar la aceptación o el rechazo de ofertas de pilotos.
 */
export function useGestionarOferta() {
    const queryClient = useQueryClient();

    const acceptMutation = useMutation({
        mutationFn: (ofertaId: number) => aceptarOferta(ofertaId),
        onSuccess: (success) => {
            if (!success) {
                Alert.alert("Error", "No se ha podido aceptar la oferta. Verifica los requisitos (presupuesto, plantilla...)");
                return;
            }
            // Si aceptamos una oferta, invalidamos partida para refrescar el Header (presupuesto)
            // e invalidamos pilotos/escuderia para ver los cambios en la plantilla.
            queryClient.invalidateQueries({ queryKey: ['partida'] });
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
            queryClient.invalidateQueries({ queryKey: ['escuderia'] });
            queryClient.invalidateQueries({ queryKey: ['traspasos'] });
        },
        onError: () => {
            Alert.alert("Error", "Error de conexión con el servidor.");
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (ofertaId: number) => rechazarOferta(ofertaId),
        onSuccess: (success) => {
            if (!success) {
                Alert.alert("Error", "No se ha podido rechazar la oferta.");
                return;
            }
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
        },
        onError: () => {
            Alert.alert("Error", "Error de conexión con el servidor.");
        }
    });

    return {
        aceptar: acceptMutation,
        rechazar: rejectMutation
    };
}
