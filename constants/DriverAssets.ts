/**
 * DriverAssets.ts
 * 
 * Registro estático de las imágenes de los pilotos para React Native.
 */

export const DRIVER_IMAGES: { [key: string]: any } = {
    'assets/images/drivers/verstappen.png': require('../assets/images/drivers/verstappen.png'),
    'assets/images/drivers/hadjar.png': require('../assets/images/drivers/hadjar.png'),
    'assets/images/drivers/russell.png': require('../assets/images/drivers/russell.png'),
    'assets/images/drivers/antonelli.png': require('../assets/images/drivers/antonelli.png'),
    'assets/images/drivers/hamilton.png': require('../assets/images/drivers/hamilton.png'),
    'assets/images/drivers/leclerc.png': require('../assets/images/drivers/leclerc.png'),
    'assets/images/drivers/norris.png': require('../assets/images/drivers/norris.png'),
    'assets/images/drivers/piastri.png': require('../assets/images/drivers/piastri.png'),
    'assets/images/drivers/alonso.png': require('../assets/images/drivers/alonso.png'),
    'assets/images/drivers/stroll.png': require('../assets/images/drivers/stroll.png'),
    'assets/images/drivers/gasly.png': require('../assets/images/drivers/gasly.png'),
    'assets/images/drivers/colapinto.png': require('../assets/images/drivers/colapinto.png'),
    'assets/images/drivers/sainz.png': require('../assets/images/drivers/sainz.png'),
    'assets/images/drivers/albon.png': require('../assets/images/drivers/albon.png'),
    'assets/images/drivers/lawson.png': require('../assets/images/drivers/lawson.png'),
    'assets/images/drivers/lindblad.png': require('../assets/images/drivers/lindblad.png'),
    'assets/images/drivers/hulkenberg.png': require('../assets/images/drivers/hulkenberg.png'),
    'assets/images/drivers/bortoleto.png': require('../assets/images/drivers/bortoleto.png'),
    'assets/images/drivers/ocon.png': require('../assets/images/drivers/ocon.png'),
    'assets/images/drivers/bearman.png': require('../assets/images/drivers/bearman.png'),
    'assets/images/drivers/perez.png': require('../assets/images/drivers/perez.png'),
    'assets/images/drivers/bottas.png': require('../assets/images/drivers/bottas.png'),
};

export const getDriverImage = (path: string) => {
    return DRIVER_IMAGES[path] || null;
};
