import { api } from '@/utils/api';
import { StartCarreraDTO, VueltaRequestDTO, VueltaResponseDTO } from '../../types/carreraDTO';

/**
 * carreraSimulacion.action.ts
 * 
 * Acciones de API para la simulación de carrera.
 */

/**
 * iniciarCarrera
 * 
 * Llama al endpoint /start para obtener la parrilla inicial y el UUID de la carrera.
 */
export const iniciarCarrera = async (partidaId: number): Promise<StartCarreraDTO> => {
  try {
    const { data } = await api.post<StartCarreraDTO>(`carrera/start/${partidaId}`);
    return data;
  } catch (error: any) {
    console.error('Error al iniciar la carrera:', error.response?.status, error.response?.data || error.message);
    throw new Error('No se ha podido iniciar la carrera.');
  }
};

/**
 * avanzarVuelta
 * 
 * Envía el estado de los pit stops y recibe el nuevo ranking de la vuelta.
 */
export const avanzarVuelta = async (uuid: string, body: VueltaRequestDTO): Promise<VueltaResponseDTO> => {
  try {
    console.log(`[API] POST /carrera/vuelta/${uuid} | Body:`, JSON.stringify(body));
    const { data } = await api.post<VueltaResponseDTO>(`carrera/vuelta/${uuid}`, body);
    return data;
  } catch (error: any) {
    console.error('Error al avanzar vuelta:', error.response?.status, error.response?.data || error.message);
    throw new Error('Error en la telemetría de la vuelta.');
  }
};
