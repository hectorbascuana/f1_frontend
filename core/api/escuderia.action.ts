import { Escuderia, MejoraRequest, MejoraResponse } from "@/types/escuderia";
import { api } from "@/utils/api";

/**
 * Obtiene la información de una escudería por ID.
 * @param {number} id - ID de la escudería.
 * @returns {Promise<Escuderia>} Datos de la escudería.
 */
export const escuderia = async (id: number): Promise<Escuderia> => {
    try {
        const { data } = await api.get<Escuderia>(`escuderias/${id}`);
        return data;
    } catch (error) {
        console.error('Error al cargar escuderia:', error);
        throw new Error('No se ha podido cargar la información de la escuderia.');
    }
};

/**
 * Alínea un piloto en un asiento específico de la escudería.
 */
export const alinearPiloto = async (escuderiaId: number, pilotoId: number | null, asiento: number): Promise<Escuderia> => {
    const response = await api.put<Escuderia>('escuderias/alineacion', {
        escuderiaId,
        pilotoId,
        asiento
    });
    return response.data;
};

/**
 * Realiza una mejora en la escudería (coche o instalaciones).
 * @param {MejoraRequest} request - Datos de la mejora (ID escudería y tipo).
 * @returns {Promise<MejoraResponse>} Datos actualizados tras la mejora.
 */
export const mejorarEscuderia = async (request: MejoraRequest): Promise<MejoraResponse> => {
    try {
        console.log('[API] Enviando solicitud:', request);
        const { data } = await api.put<MejoraResponse>('escuderias/mejorar', request);
        console.log('[API] Éxito:', data);
        return data;
    } catch (error: any) {
        // Extraemos el mensaje de error del backend si existe
        const backendMessage = error.response?.data?.message || error.response?.data || error.message;
        console.error('[API] Error detallado:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        throw new Error(backendMessage || 'No se ha podido realizar la mejora.');
    }
};