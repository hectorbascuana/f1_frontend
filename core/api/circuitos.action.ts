import { Circuito } from "@/types/partida";
import { api } from "@/utils/api";

export const circuito = async (id: number): Promise<Circuito> => {
    try {
        console.log(api.defaults.baseURL + "circuitos/" + id);
        const { data } = await api.get<Circuito>(`circuitos/${id}`);
        console.log('Datos de circuito recibidos (RAW):', JSON.stringify(data, null, 2));
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
