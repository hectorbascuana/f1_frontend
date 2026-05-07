import React from 'react';
import { Tabs, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import PartidaHeader from '../../../components/partidas/PartidaHeader';

/**
 * PartidaLayout (Tabs)
 * 
 * Gestiona la navegación interna de una partida activa.
 * 4 Secciones principales: Siguiente Carrera, Mejoras Técnicas, Pilotos y Clasificación.
 */
export default function PartidaLayout() {
  const segments = useSegments() as string[];
  
  // Detectar si estamos en la pantalla de simulación
  const isSimulacion = segments.includes('simulacion');

  return (
    <View className="flex-1">
      {/* Ocultar el header persistente si estamos simulando carrera */}
      {!isSimulacion && <PartidaHeader />}
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#E10600',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#0c0c0c',
            borderTopColor: '#222',
            paddingTop: 5,
            display: isSimulacion ? 'none' : 'flex', // Ocultar menú tabs
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: 5,
          },
          headerStyle: {
              backgroundColor: '#0a0a0a',
          },
          headerTitleStyle: {
              color: 'white',
              fontWeight: '900',
              fontStyle: 'italic',
          },
          headerShown: false,
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="carrera/index"
          options={{
            title: 'Carrera',
            tabBarLabel: 'Carrera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flag-outline" size={size} color={color} />
            ),
            headerTitle: 'PRÓXIMA CARRERA',
          }}
        />
        
        <Tabs.Screen
          name="mejoras/index"
          options={{
            title: 'I+D',
            tabBarLabel: 'Mejoras',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="construct-outline" size={size} color={color} />
            ),
            headerTitle: 'DESARROLLO TÉCNICO',
          }}
        />

        <Tabs.Screen
          name="pilotos/index"
          options={{
            title: 'Pilotos',
            tabBarLabel: 'Pilotos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
            headerTitle: 'GESTIÓN DE PILOTOS',
          }}
        />

        <Tabs.Screen
          name="clasificación/index"
          options={{
            title: 'Mundial',
            tabBarLabel: 'Mundial',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
            headerTitle: 'CLASIFICACIÓN MUNDIAL',
          }}
        />

        {/* Ruta de Mercado: Registrada para el sistema de tipos pero oculta en las Tabs */}
        <Tabs.Screen
          name="pilotos/mercado"
          options={{
            href: null,
          }}
        />

        {/* Ruta de Simulación: Oculta de las Tabs y sin menú inferior */}
        <Tabs.Screen
          name="simulacion/index"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </View>
  );
}
