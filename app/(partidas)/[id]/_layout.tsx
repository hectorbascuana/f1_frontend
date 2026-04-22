import React from 'react';
import { Tabs } from 'expo-router';
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
  return (
    <View className="flex-1">
      <PartidaHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#E10600',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#0c0c0c',
            borderTopColor: '#222',
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            textTransform: 'uppercase',
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
      </Tabs>
    </View>
  );
}
