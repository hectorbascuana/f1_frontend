import { create } from 'zustand';
import { Partida } from '../../types/partida';

/**
 * GameState
 * 
 * Interfaz que define el estado global de la sesión de juego activa.
 */
interface GameState {
    partida: Partida | null;
    
    // Acciones
    setPartida: (partida: Partida) => void;
    actualizarPresupuesto: (nuevoPresupuesto: number) => void;
    limpiarPartida: () => void;
}

/**
 * useGameStore
 * 
 * Store de Zustand para gestionar la partida seleccionada.
 * Evita peticiones redundantes a la API y centraliza la información del equipo y progreso.
 * 
 * Beneficio TFG: Mejora la eficiencia energética al reducir el tráfico de red y 
 * el procesamiento de datos en cada cambio de pantalla.
 */
export const useGameStore = create<GameState>((set) => ({
    partida: null,

    /**
     * Establece la partida activa al cargar un guardado o crear uno nuevo.
     */
    setPartida: (partida) => set({ partida }),

    /**
     * Permite actualizar solo el presupuesto sin recargar toda la partida.
     * Útil tras compras en el mercado o cobro de premios.
     */
    actualizarPresupuesto: (nuevoPresupuesto) => set((state) => ({
        partida: state.partida ? {
            ...state.partida,
            escuderia: { ...state.partida.escuderia, presupuesto: nuevoPresupuesto }
        } : null
    })),

    /**
     * Limpia la sesión actual (ej. al volver al menú principal).
     */
    limpiarPartida: () => set({ partida: null }),
}));
