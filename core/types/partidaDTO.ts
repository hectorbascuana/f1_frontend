/**
 * PartidaDTO.ts
 * 
 * Representa la estructura exacta de datos que devuelve el servidor (Data Transfer Object).
 * Se utiliza en la capa core/api para tipar las respuestas antes de ser transformadas.
 */

export interface EscuderiaDTO {
    id: number;
    nombre: string;
    imagen: string;
    presupuesto: number;
}

export interface PartidaDTO {
    id: number;
    nombre: string;
    escuderiaSeleccionada: EscuderiaDTO;
    proximoCircuito: number;
    fechaCreacion: string;
    anio: number;
}
