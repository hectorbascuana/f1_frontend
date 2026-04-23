import { Partida } from '../../types/partida';
import { BASE_URL } from '../../utils/api';
import { PartidaDTO } from '../types/partidaDTO';

/**
 * partidaMapper.ts
 * 
 * Responsabilidad: Transformar los objetos DTO (Data Transfer Object) que vienen de la API
 * a objetos del Modelo de Dominio de la aplicación.
 * 
 * Esto permite que si la API cambia el nombre de un campo (ej: 'escuderiaSeleccionada'),
 * solo tengamos que cambiarlo aquí y no en toda la aplicación.
 */

export const mapPartidaFromDTO = (partidaDTO: PartidaDTO): Partida => {
    return {
        id: partidaDTO.id,
        nombre: partidaDTO.nombre,
        anio: partidaDTO.anio,
        proximoCircuito: partidaDTO.proximoCircuito,
        fechaCreacion: partidaDTO.fechaCreacion,
        escuderia: {
            id: partidaDTO.escuderiaSeleccionada.id,
            nombre: partidaDTO.escuderiaSeleccionada.nombre,
            presupuesto: partidaDTO.escuderiaSeleccionada.presupuesto,
            // Reconstruimos la URL completa de la imagen
            imagen: partidaDTO.escuderiaSeleccionada.imagen
        }
    };
};

export const mapPartidasFromDTOList = (partidasDTO: PartidaDTO[]): Partida[] => {
    return partidasDTO.map(mapPartidaFromDTO);
};
