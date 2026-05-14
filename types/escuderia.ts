export interface Escuderia {
    id: number;
    nombre: string;
    imagen: string; 
    presupuesto: number;
    aerodinamica: number;
    aerodinamicaCosto: number;
    motor: number;
    motorCosto: number;
    durabilidad: number;
    durabilidadCosto: number;
    tunelViento: number;
    tunelVientoCosto?: number;
    bancoPruebas: number;
    bancoPruebasCosto?: number;
    escuelaPilotos: number;
    escuelaPilotosCosto?: number;
    imagenUrl?: string;
}

export enum TipoMejora {
    AERODINAMICA = 'AERODINAMICA',
    MOTOR = 'MOTOR',
    DURABILIDAD = 'DURABILIDAD',
    TUNEL_VIENTO = 'TUNEL_VIENTO',
    BANCO_PRUEBAS = 'BANCO_PRUEBAS',
    ESCUELA_PILOTOS = 'ESCUELA_PILOTOS'
}

export interface MejoraRequest {
    escuderiaId: number;
    tipoMejora: TipoMejora;
}

export interface MejoraResponse {
    presupuesto: number;
    nuevoCoste: number;
    nivelActual: number;
    aumento: number;
}
