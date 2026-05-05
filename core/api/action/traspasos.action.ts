import { OfertaPiloto, Piloto } from "@/types/piloto";
import { api } from "@/utils/api";
import { mapOfertasFromDTO } from "../../mappers/pilotoMapper";

/**
 * Recupera las ofertas de traspaso asociadas a un piloto específico.
 * @param {Piloto} piloto - El objeto del piloto a consultar.
 * @returns {Promise<OfertaPiloto[]>} Promesa que resuelve a un array de ofertas mapeadas.
 */
export const traspasoPiloto = async (piloto: Piloto): Promise<OfertaPiloto[]> => {
    // Intentamos cargar todas las ofertas (activas e inactivas) para detectar rechazos previstos por el backend
    const url = `traspasos/piloto/${piloto.id}/historial`;
    try {
        const { data } = await api.get<any[]>(url);
        return mapOfertasFromDTO(data);
    } catch (error: any) {
        // Si el endpoint de historial no existe o falla, intentamos con el de activos o el base
        try {
            const { data } = await api.get<any[]>(`traspasos/piloto/${piloto.id}/activos`);
            return mapOfertasFromDTO(data);
        } catch (e) {
            if (error.response?.status === 404) return [];
            return [];
        }
    }
};

export const aceptarOferta = async (oferta: number): Promise<boolean> => {
    try {
        const { data } = await api.post(`traspasos/${oferta}/aceptar`);
        return true;
    } catch (error: any) {
        const apiError = error.response?.data;
        const msg = typeof apiError === 'string' ? apiError : apiError?.message || 'No se ha podido aceptar la oferta.';
        return false;
    }
}

export const rechazarOferta = async (oferta: number): Promise<boolean> => {
    try {
        const { data } = await api.post(`traspasos/${oferta}/rechazar`);
        return true;
    } catch (error: any) {
        const apiError = error.response?.data;
        const msg = typeof apiError === 'string' ? apiError : apiError?.message || 'No se ha podido rechazar la oferta.';
        return false;
    }
}

export interface RespuestaNegociacion {
    resultado: 'ACEPTADO' | 'RECHAZADO';
    mensaje: string;
    presupuestoRestante: number;
    traspaso: any;
}

/**
 * Negocia una oferta oficial de traspaso por un piloto.
 * @param {number} partidaId - ID de la partida actual.
 * @param {number} pilotoId - ID del piloto objetivo.
 * @param {number} escuderiaDestinoId - ID de la escudería que hace la oferta (la del usuario).
 * @param {number} precio - Importe de la oferta.
 */
export const enviarOferta = async (
    partidaId: number,
    pilotoId: number,
    escuderiaDestinoId: number,
    precio: number
): Promise<RespuestaNegociacion> => {
    try {
        const { data } = await api.post('traspasos/negociar', {
            partidaId,
            pilotoId,
            escuderiaDestinoId,
            precio
        });
        console.log('[API] Negociación procesada:', data);
        return data as RespuestaNegociacion;
    } catch (error: any) {
        // Extracción extremadamente robusta del mensaje de error
        // El servidor puede devolver un string plano o un objeto con .message
        const apiError = error.response?.data;
        const msg = typeof apiError === 'string' ? apiError : apiError?.message || error.message;

        console.log('[API] Error al negociar oferta:', msg);
        return msg;
    }
}
/**
 * Obtiene el listado de IDs de pilotos bloqueados para una partida específica.
 * @param {number} partidaId - ID de la partida.
 * @returns {Promise<number[]>} Lista de IDs.
 */
export const obtenerPilotosBloqueados = async (partidaId: number): Promise<number[]> => {
    try {
        const { data } = await api.get<number[]>(`traspasos/${partidaId}/bloqueados`);
        return data;
    } catch (error) {
        console.log('[API] Error al obtener pilotos bloqueados:', error);
        return [];
    }
}
