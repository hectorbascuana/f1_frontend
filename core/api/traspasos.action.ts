import { OfertaPiloto, Piloto } from "@/types/piloto";
import { api } from "@/utils/api";
import { mapOfertasFromDTO } from "../mappers/pilotoMapper";

/**
 * Recupera las ofertas de traspaso asociadas a un piloto específico.
 * @param {Piloto} piloto - El objeto del piloto a consultar.
 * @returns {Promise<OfertaPiloto[]>} Promesa que resuelve a un array de ofertas mapeadas.
 */
export const traspasoPiloto = async (piloto: Piloto): Promise<OfertaPiloto[]> => {
    const url = `traspasos/piloto/${piloto.id}/activos`;
    try {
        const { data } = await api.get<any[]>(url);
        return mapOfertasFromDTO(data);
    } catch (error: any) {
        // Si el backend devuelve 404, lo tratamos como que el piloto no tiene ofertas
        if (error.response?.status === 404) {
            return [];
        }
        console.error(`Error al traspasar el piloto en ${url}:`, error);
        throw new Error('No se ha podido realizar el traspaso.');
    }
};

export const aceptarOferta = async (oferta: number): Promise<boolean> => {
    try {
        const { data } = await api.post(`traspasos/${oferta}/aceptar`);
        console.log(data);
        return true;
    } catch (error: any) {
        console.error(`Error al aceptar la oferta en ${oferta}:`, error);
        return false;
    }
}

export const rechazarOferta = async (oferta: number): Promise<boolean> => {
    try {
        const { data } = await api.post(`traspasos/${oferta}/rechazar`);
        console.log(data);
        return true;
    } catch (error: any) {
        console.error(`Error al rechazar la oferta en ${oferta}:`, error);
        return false;
    }
}