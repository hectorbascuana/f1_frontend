import { api } from "@/utils/api";
import { Piloto } from "@/types/piloto";

/**
 * Obtiene los pilotos pertenecientes a una escudería específica.
 * @param {number} escuderiaId - ID de la escudería.
 * @returns {Promise<Piloto[]>} Listado de pilotos.
 */
export const obtenerPilotosEscuderia = async (escuderiaId: number): Promise<Piloto[]> => {
    try {
        const { data } = await api.get<Piloto[]>(`pilotos/escuderia/${escuderiaId}`);
        return data;
    } catch (error) {
        console.error('Error al cargar pilotos de la escudería:', error);
        throw new Error('No se ha podido recuperar la información de los pilotos.');
    }
};
