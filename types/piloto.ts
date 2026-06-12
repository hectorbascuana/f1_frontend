import { Escuderia } from "./escuderia";

/**
 * EstadisticasPiloto
 * Representa el desglose técnico del rendimiento de un piloto.
 */
export interface EstadisticasPiloto {
    id: number;
    valoracion: number;
    curvaRapida: number;
    curvaLenta: number;
    salidas: number;
    consistencia: number;
    progresoTemporada: number;
}

/**
 * Piloto
 * Modelo de dominio para un piloto de la competición.
 */
export interface Piloto {
    id: number;
    nombre: string;
    pais: string;
    imagen: string;
    edad: number;
    puntos: number;
    valor: number;
    escuderia: Partial<Escuderia>;
    estadisticas: EstadisticasPiloto;
    asiento: number | null;
    // Sistema de Mercado
    enTransferible?: boolean;
    ofertas?: OfertaPiloto[];
    ofertasPendientes?: number;
    isRokie: boolean;
}

/**
 * OfertaPiloto
 * Estructura de una oferta recibida desde otro equipo.
 */
export interface OfertaPiloto {
    id: number;
    precio: number;
    temporada: number;
    aceptada: boolean;
    enCurso: boolean;
    piloto?: {
        id: number;
        nombre: string;
        imagen: string;
    };
    escuderiaOrigen: {
        id: number;
        nombre: string;
        imagen: string;
    };
    escuderiaDestino: {
        id: number;
        nombre: string;
        imagen: string;
    };
}
