/**
 * carreraDTO.ts
 * 
 * Definición de interfaces para los contratos de datos de la simulación de carrera.
 * Sincronizado con el backend CarreraStartResponseDTO y CarreraVueltaResponseDTO.
 */

export type Compuesto = 'BLANDO' | 'MEDIO' | 'DURO';

export interface CircuitoInfoDTO {
  id: number;
  nombre: string;
  pais: string;
  numVueltas: number;
}

export interface PilotoParrillaDTO {
  posicion: number;
  pilotoId: number;
  nombre: string;
  escuderia: string;
  escuderiaImagen: string;
  tiempoClasificacionMs: number;
  compuesto: string;
  esJugador: boolean;
}

export interface StartCarreraDTO {
  uuid: string;
  circuito: CircuitoInfoDTO;
  parrilla: PilotoParrillaDTO[];
}

export interface VueltaRequestDTO {
  pitStopPiloto1: boolean;
  nuevoCompuestoPiloto1: Compuesto | null;
  pitStopPiloto2: boolean;
  nuevoCompuestoPiloto2: Compuesto | null;
}

export interface PilotoRankingDTO {
  posicion: number;
  pilotoId: number;
  nombre: string;
  escuderia: string;
  escuderiaImagen: string;
  tiempoTotalMs: number;
  tiempoVueltaMs: number;
  vueltaRapidaMs: number;
  gapMs: number;
  compuesto: Compuesto;
  desgaste: number;
  numParadas: number;
  enPitStop: boolean;
  dnf: boolean;
  esJugador: boolean;
}

export interface VueltaResponseDTO {
  vueltaActual: number;
  totalVueltas: number;
  finalizada: boolean;
  ranking: PilotoRankingDTO[];
}
