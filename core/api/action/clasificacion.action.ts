import { api } from "@/utils/api";

/**
 * ClasificacionPiloto
 * Estructura de la clasificación individual de pilotos en una partida.
 */
export interface ClasificacionPiloto {
    id: number;
    nombre: string;
    puntos: number;
    haCorrido: boolean;
    escuderia: {
        id: number;
        nombre: string;
        imagen: string;
    };
    asiento: number;
}

/**
 * ClasificacionConstructor
 * Estructura de la clasificación por equipos (Mundial de Constructores).
 */
export interface ClasificacionConstructor {
    id: number;
    nombre: string;
    imagen: string;
    puntos: number;
    presupuesto: number;
    aerodinamica: number;
    motor: number;
    piloto1: { id: number; nombre: string; puntos: number };
    piloto2: { id: number; nombre: string; puntos: number };
}

/**
 * obtenerClasificacionPilotos
 * Recupera el ranking actual de pilotos de una partida.
 */
export const obtenerClasificacionPilotos = async (partidaId: number): Promise<ClasificacionPiloto[]> => {
    try {
        const { data } = await api.get<ClasificacionPiloto[]>(`clasificacion/${partidaId}/pilotos`);
        return data;
    } catch (error) {
        console.log('[API] Error al obtener clasificación de pilotos:', error);
        return [];
    }
};

/**
 * obtenerClasificacionConstructores
 * Recupera el ranking actual de escuderías de una partida.
 */
export const obtenerClasificacionConstructores = async (partidaId: number): Promise<ClasificacionConstructor[]> => {
    try {
        const { data } = await api.get<ClasificacionConstructor[]>(`clasificacion/${partidaId}/constructores`);
        return data;
    } catch (error) {
        console.log('[API] Error al obtener clasificación de constructores:', error);
        return [];
    }
};
