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
