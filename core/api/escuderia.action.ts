import { api } from "@/utils/api";
import { Escuderia } from "@/types/escuderia";

export const escuderia = async (id: number): Promise<Escuderia> => {
    try {
        const { data } = await api.get<Escuderia>(`escuderias/${id}`);
        return data;
    } catch (error) {
        console.error('Error al cargar escuderia:', error);
        throw new Error('No se ha podido cargar la información de la escuderia.');
    }
};