import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alinearPiloto } from "@/core/api/escuderia.action";
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
            // Invalidamos las consultas de pilotos y escudería para refrescar la UI
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
            queryClient.invalidateQueries({ queryKey: ['escuderia'] });
            queryClient.invalidateQueries({ queryKey: ['activeGame'] });
        },
        
        onError: (error: any) => {
            Alert.alert("Error de Alineación", error.message || "No se ha podido cambiar la alineación.");
        }
    });
}
