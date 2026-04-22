import { Partida } from '@/types/partida';
import { api } from '@/utils/api';
import { mapPartidasFromDTOList } from '../mappers/partidaMapper';
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

        // Registro de datos recibidos para facilitar la trazabilidad en el TFG
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

/**
 * crearPartida (Action)
 * 
 * Envía los datos para generar una nueva partida en el servidor.
 * Devuelve información sobre el éxito de la operación y el ID de la partida generada.
 */
export const crearPartida = async (nombre: string, escuderiaId: number): Promise<{ mensaje: string; status: string; partidaId: number }> => {
    try {
        // Usamos ruta relativa sin barra inicial para que respete el /api/ de baseURL
        // El backend espera el campo 'idEscuderiaJson' según el error 500 recibido.
        const { data } = await api.post('partida/nueva', { nombre, idEscuderiaJson: escuderiaId });

        console.log('Resultado de creación:', JSON.stringify(data, null, 2));
        
        return data; 
    } catch (error: any) {
        // Mejoramos el log para ver si es un 404, 500, etc.
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
