import { Piloto } from "@/types/piloto";
import { api } from "@/utils/api";
import { traspasoPiloto } from "./traspasos.action";

/**
 * Obtiene los pilotos pertenecientes a una escudería específica.
 * @param {number} escuderiaId - ID de la escudería.
 * @returns {Promise<Piloto[]>} Listado de pilotos con sus ofertas cargadas.
 */
export const obtenerPilotosEscuderia = async (escuderiaId: number): Promise<Piloto[]> => {
    try {
        const { data } = await api.get<Piloto[]>(`pilotos/escuderia/${escuderiaId}`);

        // Resolvemos las ofertas de cada piloto de forma concurrente
        // Usamos Promise.all para esperar a que todas las peticiones asíncronas finalicen
        await Promise.all(
            data.map(async (piloto) => {
                const ofertas = await traspasoPiloto(piloto);
                piloto.ofertas = ofertas;
                piloto.ofertasPendientes = ofertas.length;
            })
        );
        console.log(data) // Este console log se ejecuta cuando hace la petición al backend (abrir pantalla de pilotos). Como se muestra, devuelve toda la información de los pilotos de esa escudería incluido el campo isRookie
        return data;
    } catch (error) {
        console.error('Error al cargar pilotos de la escudería:', error);
        throw new Error('No se ha podido recuperar la información de los pilotos.');
    }
};
export const obtenerPilotosPartida = async (partidaId: number): Promise<Piloto[]> => {
    // Validación de seguridad para evitar el 400 por ID inválido
    if (!partidaId || isNaN(partidaId)) {
        console.warn('[API] Intento de cargar mercado con ID de partida inválido:', partidaId);
        return [];
    }

    const url = `pilotos/partida/${partidaId}`;
    try {
        const { data } = await api.get<Piloto[]>(url);

        // Resolvemos las ofertas de cada piloto para detectar bloqueos por rechazo
        // Esto permite que el estado de bloqueo sea persistente entre sesiones
        await Promise.all(
            data.map(async (piloto) => {
                const ofertas = await traspasoPiloto(piloto);
                piloto.ofertas = ofertas;
            })
        );

        return data;
    } catch (error: any) {
        console.error('Error detallado en Mercado:', {
            path: url,
            status: error.response?.status,
            data: error.response?.data
        });
        throw new Error('No se han podido cargar los pilotos del mercado.');
    }
};
