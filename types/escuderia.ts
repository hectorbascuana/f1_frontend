export interface Escuderia {
    id: number;
    nombre: string;
    imagen: string; // URL o referencia local
    presupuesto: number;
    aerodinamica: number;
    motor: number;
    durabilidad: number;
    tunelViento: number;
    bancoPruebas: number;
    escuelaPilotos: number;
    imagenUrl?: string; // Mantener opcional para compatibilidad temporal
}
