import { Stack } from 'expo-router';

/**
 * Layout del Grupo (partidas)
 * 
 * Este layout gestiona la navegación interna de las pantallas de gestión 
 * de partidas y el acceso al modo carrera.
 */
export default function PartidasLayout() {
  return (
    <Stack>
      {/* El menú principal de selección de partidas */}
      <Stack.Screen 
        name="index" 
        options={{ 
            headerShown: false 
        }} 
      />
      
      {/* La pantalla de creación de nueva carrera */}
      <Stack.Screen 
        name="nueva-partida" 
        options={{ 
            headerShown: false,
            animation: 'slide_from_bottom' 
        }} 
      />

      {/* El acceso dinámico al interior de cada partida */}
      <Stack.Screen 
        name="[id]" 
        options={{ 
            headerShown: false 
        }} 
      />
    </Stack>
  );
}
