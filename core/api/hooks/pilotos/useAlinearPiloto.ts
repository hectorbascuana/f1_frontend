import { alinearPiloto } from "@/core/api/action/escuderia.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

/**
 * useAlinearPiloto
 * Hook para gestionar la asignación de pilotos a asientos (titulares o reservas).
 */
export function useAlinearPiloto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ escuderiaId, pilotoId, asiento }: { escuderiaId: number, pilotoId: number | null, asiento: number }) =>
            alinearPiloto(escuderiaId, pilotoId, asiento),

        onSuccess: (data) => {
            // Solo invalidamos pilotos, ya que es lo único que cambia al mover asientos.
            // El presupuesto y datos de escudería permanecen intactos.
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
        },

        onError: (error: any) => {
            Alert.alert("Error de Alineación", error.message || "No se ha podido cambiar la alineación.");
        }
    });
}
