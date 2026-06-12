/**
 * TeamAssets.ts
 * 
 * Este archivo actúa como un registro estático de las imágenes de las escuderías.
 * En React Native, las imágenes locales deben ser importadas mediante 'require' en tiempo de compilación.
 * Este mapeo permite cargar la imagen correcta basándose en la cadena de texto que devuelve la API.
 */

export const TEAM_IMAGES: { [key: string]: any } = {
    'assets/images/teams/alpine.png': require('../assets/images/teams/alpine.png'),
    'assets/images/teams/aston-martin.png': require('../assets/images/teams/aston-martin.png'),
    'assets/images/teams/audi.png': require('../assets/images/teams/audi.png'),
    'assets/images/teams/cadilac.png': require('../assets/images/teams/cadilac.png'),
    'assets/images/teams/ferrari.png': require('../assets/images/teams/ferrari.png'),
    'assets/images/teams/haas.png': require('../assets/images/teams/haas.png'),
    'assets/images/teams/mclaren.png': require('../assets/images/teams/mclaren.png'),
    'assets/images/teams/mercedes.png': require('../assets/images/teams/mercedes.png'),
    'assets/images/teams/racing-bulls.png': require('../assets/images/teams/racing-bulls.png'),
    'assets/images/teams/red-bull.png': require('../assets/images/teams/red-bull.png'),
    'assets/images/teams/williams.png': require('../assets/images/teams/williams.png'),
    //Esta es la nueva ruta de la imagen que tendrá el nuevo equipo.
    'assets/images/teams/andretti.png': require('../assets/images/teams/andretti.png')
};

/**
 * Función de utilidad para obtener la imagen de una escudería.
 * Si no se encuentra, devuelve una imagen por defecto o null.
 */
export const getTeamImage = (path: string) => {
    return TEAM_IMAGES[path] || null;
};
