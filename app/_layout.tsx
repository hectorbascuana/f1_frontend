import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

/**
 * RootLayout: Archivo principal de configuración visual y de navegación del framework Expo Router.
 * 
 * Para cumplir con los requisitos del TFG (sostenibilidad energética y reducción de consumo),
 * se ha eliminado el soporte de Light Theme y se ha inyectado directamente el `DarkTheme` estricto en
 * toda la aplicación. De esta forma, obligamos a un bajo consumo de batería (píxeles apagados en OLED).
 * 
 * Además, configuramos la navegación en Stack para ocular los "headers" que no necesitemos en el modo carrera.
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      {/* StatusBar configura la barra de arriba del sistema donde aparece la hora/batería para que se vea bien en fondo oscuro */}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
