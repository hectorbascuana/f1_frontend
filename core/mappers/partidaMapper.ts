import { PartidaDTO } from '../types/partidaDTO';
import { Partida, Escuderia } from '../../types/partida';
import { BASE_URL } from '../../utils/api';

/**
 * partidaMapper.ts
 * 
 * Responsabilidad: Transformar los objetos DTO (Data Transfer Object) que vienen de la API
 * a objetos del Modelo de Dominio de la aplicación.
 * 
 * Esto permite que si la API cambia el nombre de un campo (ej: 'escuderiaSeleccionada'),
 * solo tengamos que cambiarlo aquí y no en toda la aplicación.
 */

export const mapPartidaFromDTO = (dto: PartidaDTO): Partida => {
    return {
        id: dto.id,
        nombre: dto.nombre,
        anio: dto.anio,
        proximoCircuito: dto.proximoCircuito,
        fechaCreacion: dto.fechaCreacion,
        escuderia: {
            id: dto.escuderiaSeleccionada.id,
            nombre: dto.escuderiaSeleccionada.nombre,
            presupuesto: dto.escuderiaSeleccionada.presupuesto,
            // Reconstruimos la URL completa de la imagen
            imagenUrl: `${BASE_URL}${dto.escuderiaSeleccionada.imagen}`
        }
    };
};

export const mapPartidasFromDTOList = (dtos: PartidaDTO[]): Partida[] => {
    return dtos.map(mapPartidaFromDTO);
};
