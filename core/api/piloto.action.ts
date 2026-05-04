import { api } from "@/utils/api";
import { OfertaPiloto, Piloto } from "@/types/piloto";
import { mapOfertasFromDTO } from "../mappers/pilotoMapper";
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
       
        return data;
    } catch (error) {
        console.error('Error al cargar pilotos de la escudería:', error);
        throw new Error('No se ha podido recuperar la información de los pilotos.');
    }
};

