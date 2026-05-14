import React from 'react';
import { Stack } from 'expo-router';

/**
 * Pilotos Stack Layout
 * Permite navegar entre la gestión de pilotos y el mercado
 * manteniendo las pestañas activas.
 */
export default function PilotosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="mercado" />
    </Stack>
  );
}
