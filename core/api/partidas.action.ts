import { Partida } from '@/types/partida';
import { api } from '@/utils/api';
import { mapPartidaFromDTO, mapPartidasFromDTOList } from '../mappers/partidaMapper';
import { PartidaDTO } from '../types/partidaDTO';

/**
 * partidas (Action)
 * 
 * Función encargada de realizar la petición HTTP para obtener las partidas.
 * Incluye una fase de mapeo para transformar el DTO de la API al modelo de Dominio.
 */
export const partidas = async (): Promise<Partida[]> => {
    try {
        // Realizamos la petición tipada con el DTO (sin barra inicial para usar baseURL)
        const { data } = await api.get<PartidaDTO[]>('partida');

        // Registro de datos recibidos para facilitar la trazabilidad durante el desarrollo
        console.log('Datos de partidas recibidos (RAW):', JSON.stringify(data, null, 2));
        
        // Mapeamos los datos al modelo de dominio
        const mappedData = mapPartidasFromDTOList(data);
        
        console.log('Datos de partidas mapeados:', JSON.stringify(mappedData, null, 2));

        return mappedData;
    } catch (error) {
        console.error('Error al cargar partidas:', error);
        throw new Error('No se han podido cargar las partidas del sistema.');
    }
};

// ... (resto de funciones existentes)

/**
 * crearPartida (Action)
 * 
 * Envía los datos para generar una nueva partida y devuelve el objeto completo mapeado.
 */
export const crearPartida = async (nombre: string, escuderiaId: number): Promise<Partida> => {
    try {
        const { data } = await api.post<PartidaDTO>('partida/nueva', { nombre, idEscuderiaJson: escuderiaId });

        console.log('Objeto de partida recibido (RAW):', JSON.stringify(data, null, 2));
        
        // Mapeamos el DTO al modelo de Dominio
        return mapPartidaFromDTO(data); 
    } catch (error: any) {
        console.error('Error al crear la partida:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se ha podido crear la nueva partida. Inténtalo de nuevo.');
    }
};

/**
 * borrarPartida (Action)
 * 
 * Elimina una partida guardada del servidor dado su ID.
 * Devuelve el mensaje de confirmación del servidor.
 */
export const borrarPartida = async (id: number): Promise<{ mensaje: string; status: string }> => {
    try {
        const { data } = await api.delete(`partida/${id}`);
        console.log(`Respuesta borrado:`, JSON.stringify(data, null, 2));
        return data;
    } catch (error: any) {
        console.error('Error al eliminar la partida:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se ha podido eliminar la partida. Inténtalo de nuevo.');
    }
};
