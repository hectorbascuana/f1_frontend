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
    tunelVientoCosto: number;
    bancoPruebas: number;
    bancoPruebasCosto: number;
    escuelaPilotos: number;
    escuelaPilotosCosto: number;
    imagenUrl?: string;
}
