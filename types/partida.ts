/**
 * Definición de la entidad Partida recibida de la API.
 * 
 * Se ha diseñado este tipo para que el Front-End tenga una estructura estricta y segura 
 * a la hora de manejar los datos de las partidas guardadas del F1 Manager.
 * 
 * Atributos:
 * - id: Identificador único de la partida.
 * - nombre: Nombre asignado por el jugador al guardado.
 * - idEscuderiaSeleccionada: El ID que referencia a la escudería elegida.
 * - proximoCircuito: Identificador del siguiente circuito a correr.
 * - fechaCreacion: String ISO de la fecha en la que se generó la partida.
 * - anio: El año virtual en el que transcurre el juego.
 */

export interface Partida {
    id: number;
    nombre: string;
    idEscuderiaSeleccionada: number;
    proximoCircuito: number;
    fechaCreacion: string;
    anio: number;
}
