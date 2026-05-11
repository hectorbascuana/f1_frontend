import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * TabsLayout Interno
 * Gestiona las 4 secciones de gestión de la partida.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E10600',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#0c0c0c',
          borderTopColor: '#222',
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        headerShown: false,
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
        }}
      />
    </Tabs>
  );
}
