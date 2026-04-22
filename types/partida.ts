/**
 * partida.ts (Modelo de Dominio)
 * 
 * Este es el modelo de datos que utiliza la aplicación en sus componentes y hooks.
 * Está desacoplado de la estructura exacta de la API gracias al uso de Mappers.
 */

export interface Escuderia {
    id: number;
    nombre: string;
    imagenUrl: string; // URL completa o referencia local
    presupuesto: number;
    aerodinamica: number;
    motor: number;
    durabilidad: number;
    tunel_viento: number;
    banco_pruebas: number;
    escuela_pilotos: number;
}

export interface Partida {
    id: number;
    nombre: string;
    escuderia: Escuderia;
    proximoCircuito: number;
    fechaCreacion: string;
    anio: number;
}
