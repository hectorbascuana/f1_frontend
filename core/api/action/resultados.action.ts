import { api } from "@/utils/api";

/**
 * ResultadoCarreraDTO
 * Estructura del resultado de un piloto en un Gran Premio específico.
 */
export interface ResultadoCarreraDTO {
    posicion: number | null;
    tiempoTotal: string | null;
    vueltaRapida: string | null;
    pilotoId: number;
    pilotoNombre: string;
    pilotoImagen: string;
    pilotoPais: string;
    escuderiaNombre: string;
    escuderiaImagen: string;
}

/**
 * obtenerResultadoCarrera
 * Recupera el resultado oficial de una carrera específica.
 */
export const obtenerResultadoCarrera = async (
    partidaId: number, 
    temporada: number, 
    circuitoId: number
): Promise<ResultadoCarreraDTO[]> => {
    try {
        const { data } = await api.get<ResultadoCarreraDTO[]>(
            `piloto-circuito/resultado/${partidaId}/${temporada}/${circuitoId}`
        );
        return data;
    } catch (error: any) {
        console.log('[API] Error al obtener resultado de carrera:', error.response?.status, error.message);
        return [];
    }
};
