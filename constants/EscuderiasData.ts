import { Escuderia } from '../types/escuderia';

/**
 * ESCUDERIAS_DATA
 * 
 * Listado estático de escuderías disponibles para el inicio de una nueva partida.
 * Los datos técnicos definen la dificultad inicial y el potencial del equipo.
 */
export const ESCUDERIAS_DATA: Escuderia[] = [
    {
        id: 1,
        nombre: "Oracle Red Bull Racing",
        imagenUrl: "assets/images/teams/red-bull.png", // Corregido .jpg a .png para coincidir con assets
        presupuesto: 145.00,
        aerodinamica: 76,
        motor: 72,
        durabilidad: 12,
        tunel_viento: 3,
        banco_pruebas: 2,
        escuela_pilotos: 3
    },
    {
        id: 2,
        nombre: "Mercedes-AMG PETRONAS",
        imagenUrl: "assets/images/teams/mercedes.png",
        presupuesto: 140.00,
        aerodinamica: 72,
        motor: 78,
        durabilidad: 16,
        tunel_viento: 3,
        banco_pruebas: 3,
        escuela_pilotos: 2
    },
    {
        id: 3,
        nombre: "Scuderia Ferrari HP",
        imagenUrl: "assets/images/teams/ferrari.png",
        presupuesto: 142.00,
        aerodinamica: 74,
        motor: 79,
        durabilidad: 14,
        tunel_viento: 2,
        banco_pruebas: 3,
        escuela_pilotos: 3
    },
    {
        id: 4,
        nombre: "McLaren Formula 1",
        imagenUrl: "assets/images/teams/mclaren.png",
        presupuesto: 135.00,
        aerodinamica: 80,
        motor: 77,
        durabilidad: 17,
        tunel_viento: 3,
        banco_pruebas: 2,
        escuela_pilotos: 2
    },
    {
        id: 5,
        nombre: "Aston Martin Aramco",
        imagenUrl: "assets/images/teams/aston-martin.png",
        presupuesto: 125.00,
        aerodinamica: 73,
        motor: 75,
        durabilidad: 13,
        tunel_viento: 3,
        banco_pruebas: 2,
        escuela_pilotos: 1
    },
    {
        id: 6,
        nombre: "Alpine F1 Team",
        imagenUrl: "assets/images/teams/alpine.png",
        presupuesto: 110.00,
        aerodinamica: 65,
        motor: 68,
        durabilidad: 10,
        tunel_viento: 2,
        banco_pruebas: 2,
        escuela_pilotos: 3
    },
    {
        id: 7,
        nombre: "Williams Racing",
        imagenUrl: "assets/images/teams/williams.png",
        presupuesto: 95.00,
        aerodinamica: 62,
        motor: 76,
        durabilidad: 15,
        tunel_viento: 1,
        banco_pruebas: 2,
        escuela_pilotos: 2
    },
    {
        id: 8,
        nombre: "Racing Bulls (VCARB)",
        imagenUrl: "assets/images/teams/racing-bulls.png",
        presupuesto: 85.00,
        aerodinamica: 68,
        motor: 71,
        durabilidad: 12,
        tunel_viento: 2,
        banco_pruebas: 1,
        escuela_pilotos: 3
    },
    {
        id: 9,
        nombre: "Audi F1 Team",
        imagenUrl: "assets/images/teams/audi.png", // Corregido .jpg a .png
        presupuesto: 130.00,
        aerodinamica: 66,
        motor: 74,
        durabilidad: 11,
        tunel_viento: 2,
        banco_pruebas: 3,
        escuela_pilotos: 2
    },
    {
        id: 10,
        nombre: "MoneyGram Haas F1 Team",
        imagenUrl: "assets/images/teams/haas.png",
        presupuesto: 80.00,
        aerodinamica: 64,
        motor: 75,
        durabilidad: 16,
        tunel_viento: 1,
        banco_pruebas: 1,
        escuela_pilotos: 1
    },
    {
        id: 11,
        nombre: "Cadillac Andretti F1",
        imagenUrl: "assets/images/teams/cadilac.png",
        presupuesto: 120.00,
        aerodinamica: 60,
        motor: 70,
        durabilidad: 9,
        tunel_viento: 2,
        banco_pruebas: 2,
        escuela_pilotos: 1
    }
];
