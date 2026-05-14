import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

/**
 * Inicialización de QueryClient fuera del componente para evitar re-creaciones innecesarias
 * durante los re-renders. Se encarga de la gestión de caché y estados de las peticiones.
 */
const queryClient = new QueryClient();

/**
 * RootLayout: Archivo principal de configuración visual y de navegación del framework Expo Router.
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(partidas)" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
