/**
 * types/partida.ts (Modelo de Dominio)
 * 
 * Este es el modelo de datos que utiliza la aplicación en sus componentes y hooks.
 * Está desacoplado de la estructura exacta de la API gracias al uso de Mappers.
 */



export interface Partida {
    id: number;
    nombre: string;
    escuderia: {
        id: number;
        nombre: string;
        presupuesto: number;
        imagen: string;
    };
    proximoCircuito: number;
    fechaCreacion: string;
    anio: number;
}
