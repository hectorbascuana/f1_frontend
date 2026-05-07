import { PartidaDTO } from "@/core/types/partidaDTO";
import { Circuito } from "@/types/circuito";
import { api } from "@/utils/api";

export const circuito = async (id: number): Promise<Circuito> => {
    try {
        const { data } = await api.get<Circuito>(`circuitos/${id}`);
        return data;
    } catch (error) {
        console.error('Error al cargar circuito:', error);
        throw new Error('No se ha podido cargar la información del circuito.');
    }
};

export const circuitos = async (): Promise<Circuito[]> => {
    try {
        const { data } = await api.get<Circuito[]>('circuitos');
        return data;
    } catch (error) {
        console.error('Error al cargar la lista de circuitos:', error);
        throw new Error('No se ha podido cargar el calendario de circuitos.');
    }
};

export const siguienteCarrera = async (partida_id: number): Promise<PartidaDTO> => {
    try {
        const { data } = await api.post<PartidaDTO>(`partida/${partida_id}/avanzar`);
        return data;
    } catch (error) {
        console.error('Error al avanzar a la siguiente carrera:', error);
        throw new Error('No se ha podido avanzar a la siguiente carrera.');
    }
};  
