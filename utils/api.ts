import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * api.ts
 * 
 * Este archivo establece y centraliza las configuraciones de peticiones HTTP.
 * Se ha diseñado para que la IP de conexión al backend no esté programada de manera "hard-codeada" / estática.
 * 
 * ¿Como se asigna la IP automáticamente?
 * 1. Mediante Expo Constants: Intentamos obtener la IP de la máquina por donde se está
 *    sirviendo la aplicación de React Native a través de `hostUri`.
 * 2. Si fallara esa comprobación, determinamos un fallo seguro "fallback" usando Platform (si es
 *    el emulador de Android será 10.0.2.2 en lugar de localhost por requerimientos de la VM, y 'localhost' de otro modo).
 */

const getInitialUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    // debuggerHost suele venir en formato "192.168.1.13:8081". Nos quedamos solo con la IP.
    const ip = debuggerHost.split(':')[0];
    console.log("IP: ", ip);
    return `http://${ip}:8081/`;
  }
  
  // Fallback
  return Platform.OS === 'android' ? 'http://10.0.2.2:8081/' : 'http://localhost:8081/';
};

export const api = axios.create({
  baseURL: getInitialUrl(),
  timeout: 5000, // Evitar colapsar la app si no hay conexión 
  headers: {
    'Content-Type': 'application/json',
  }
});
