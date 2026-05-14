import { OfertaPiloto } from "../../types/piloto";

/**
 * Mapea una lista de ofertas desde el DTO de la API al modelo de dominio.
 * Excluye el campo 'piloto' para evitar redundancias y referencias circulares.
 * 
 * @param ofertasRaw - Datos brutos de la API.
 * @returns Lista de ofertas procesadas.
 */
export const mapOfertasFromDTO = (ofertasRaw: any[]): OfertaPiloto[] => {
    return ofertasRaw.map(raw => ({
        id: raw.id,
        precio: raw.precio,
        temporada: raw.temporada,
        aceptada: raw.aceptada,
        enCurso: raw.enCurso,
        escuderiaOrigen: {
            id: raw.escuderiaOrigen.id,
            nombre: raw.escuderiaOrigen.nombre,
            imagen: raw.escuderiaOrigen.imagen
        },
        escuderiaDestino: {
            id: raw.escuderiaDestino.id,
            nombre: raw.escuderiaDestino.nombre,
            imagen: raw.escuderiaDestino.imagen
        },
        // Mapeamos el piloto si viene incluido (útil para el historial global)
        piloto: raw.piloto ? {
            id: raw.piloto.id,
            nombre: raw.piloto.nombre,
            imagen: raw.piloto.imagen
        } : undefined
    }));
};
