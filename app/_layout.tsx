import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

/**
 * Inicialización de QueryClient fuera del componente para evitar re-creaciones innecesarias
 * durante los re-renders. Se encarga de la gestión de caché y estados de las peticiones.
 */
const queryClient = new QueryClient();

/**
 * RootLayout: Archivo principal de configuración visual y de navegación del framework Expo Router.
 * 
 * Para cumplir con los requisitos del TFG (sostenibilidad energética y reducción de consumo),
 * se ha eliminado el soporte de Light Theme y se ha inyectado directamente el `DarkTheme` estricto en
 * toda la aplicación. De esta forma, obligamos a un bajo consumo de batería (píxeles apagados en OLED).
 * 
 * Se ha integrado TanStack Query para centralizar la lógica de peticiones asíncronas y optimizar 
 * el consumo de red mediante caché, lo cual también contribuye a la eficiencia energética del TFG.
 * 
 * Además, configuramos la navegación en Stack para ocultar los "headers" que no necesitemos en el modo carrera.
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="nueva-partida" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="(partidas)/[id]" options={{ headerShown: false }} />
        </Stack>
        {/* StatusBar configura la barra de arriba del sistema donde aparece la hora/batería para que se vea bien en fondo oscuro */}
        <StatusBar style="light" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
