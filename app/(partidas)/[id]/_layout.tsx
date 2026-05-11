import React from 'react';
import { Stack } from 'expo-router';

/**
 * Root Layout del ID de Partida
 * Gestiona el cambio entre el menú de gestión (Tabs) y la carrera (Simulación).
 */
export default function PartidaRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* El grupo de pestañas (Gestión) */}
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      
      {/* La simulación de carrera (Independiente) */}
      <Stack.Screen name="simulacion" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
    </Stack>
  );
}
