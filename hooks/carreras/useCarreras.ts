import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { useIniciarCarrera, useAvanzarVuelta } from '../../core/api/hooks/carrera/useCarreraSimulacion';
import { PilotoRankingDTO, Compuesto, VueltaRequestDTO } from '../../core/types/carreraDTO';

/**
 * useCarreras.ts
 * 
 * Centraliza la lógica de negocio y gestión de estado de la simulación de carrera.
 * Separa la orquestación del bucle de carrera de la capa visual.
 */

type FaseCarrera = 'PRECARRERA' | 'ACTIVA' | 'FINALIZADA';

export const useCarreras = (partidaId: number) => {
  const router = useRouter();

  // Estados de fase y datos
  const [fase, setFase] = useState<FaseCarrera>('PRECARRERA');
  const [uuid, setUuid] = useState<string | null>(null);
  const [ranking, setRanking] = useState<PilotoRankingDTO[]>([]);
  const [vueltaActual, setVueltaActual] = useState(0);
  const [totalVueltas, setTotalVueltas] = useState(0);

  // Estados de estrategia (Jugador)
  const [compuestosIniciales, setCompuestosIniciales] = useState<Record<number, Compuesto>>({});
  const [pitStopsConfirmados, setPitStopsConfirmados] = useState<Record<number, boolean>>({});
  const [compuestosSiguientes, setCompuestosSiguientes] = useState<Record<number, Compuesto>>({});

  // Hooks de API (TanStack Query)
  const { data: startData, isLoading: loadingStart, error: errorStart } = useIniciarCarrera(partidaId);
  const mutationVuelta = useAvanzarVuelta();

  // Referencias para el bucle y cierres (stale closures)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const estrategiaRef = useRef({
    pitStops: {} as Record<number, boolean>,
    compuestos: {} as Record<number, Compuesto>
  });

  // Sincronizar refs con el estado para que el loop async siempre vea lo último
  useEffect(() => {
    estrategiaRef.current = { 
      pitStops: pitStopsConfirmados, 
      compuestos: compuestosSiguientes 
    };
  }, [pitStopsConfirmados, compuestosSiguientes]);

  // Bloquear retroceso físico durante la carrera
  useEffect(() => {
    const backAction = () => {
      if (fase === 'ACTIVA') {
        Alert.alert("Carrera en curso", "No puedes abandonar la carrera hasta que finalice.");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [fase]);

  // Inicializar estrategia al recibir la parrilla (StartData)
  useEffect(() => {
    if (startData) {
      setUuid(startData.uuid);
      const iniciales: Record<number, Compuesto> = {};
      startData.parrilla.forEach(p => {
        if (p.esJugador) {
          iniciales[p.pilotoId] = 'MEDIO';
        }
      });
      setCompuestosIniciales(iniciales);
    }
  }, [startData]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * ejecutarVuelta
   * 
   * Bucle recursivo que orquesta el avance de la carrera.
   */
  const ejecutarVuelta = useCallback(async (currentUuid: string) => {
    try {
      const { pitStops, compuestos } = estrategiaRef.current;

      // Identificar pilotos del jugador para el DTO de la vuelta
      const pJugador = ranking.length > 0 
        ? ranking.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId)
        : startData?.parrilla.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId) || [];

      const body: VueltaRequestDTO = {
        pitStopPiloto1: pJugador[0] ? (ranking.length > 0 && !!pitStops[pJugador[0].pilotoId]) : false,
        nuevoCompuestoPiloto1: pJugador[0] ? (ranking.length === 0 ? compuestosIniciales[pJugador[0].pilotoId] : (compuestos[pJugador[0].pilotoId] || null)) : null,
        pitStopPiloto2: pJugador[1] ? (ranking.length > 0 && !!pitStops[pJugador[1].pilotoId]) : false,
        nuevoCompuestoPiloto2: pJugador[1] ? (ranking.length === 0 ? compuestosIniciales[pJugador[1].pilotoId] : (compuestos[pJugador[1].pilotoId] || null)) : null,
      };

      const res = await mutationVuelta.mutateAsync({ uuid: currentUuid, body });

      // Actualizar ranking y telemetría
      setRanking([...res.ranking].sort((a, b) => a.posicion - b.posicion));
      setVueltaActual(res.vueltaActual);
      setTotalVueltas(res.totalVueltas);

      // Resetear flags de pit stop confirmados si ya se están ejecutando
      setPitStopsConfirmados(prev => {
        const nuevos = { ...prev };
        res.ranking.forEach(p => {
          if (p.enPitStop) nuevos[p.pilotoId] = false;
        });
        return nuevos;
      });

      if (res.finalizada) {
        setFase('FINALIZADA');
      } else {
        timeoutRef.current = setTimeout(() => ejecutarVuelta(currentUuid), 2000);
      }
    } catch (err) {
      console.error("Error en bucle de carrera:", err);
      // Reintento tras error de red
      timeoutRef.current = setTimeout(() => ejecutarVuelta(currentUuid), 5000);
    }
  }, [ranking, startData, compuestosIniciales, mutationVuelta]);

  /**
   * handleStartRace
   * 
   * Transición de parrilla a carrera activa.
   */
  const handleStartRace = () => {
    if (!uuid) return;
    setFase('ACTIVA');
    ejecutarVuelta(uuid);
  };

  /**
   * handleConfirmPitStop
   * 
   * Registro de decisión de parada en boxes del jugador.
   */
  const handleConfirmPitStop = (pilotoId: number) => {
    setPitStopsConfirmados(prev => ({ ...prev, [pilotoId]: true }));
    if (!compuestosSiguientes[pilotoId]) {
      setCompuestosSiguientes(prev => ({ ...prev, [pilotoId]: 'MEDIO' }));
    }
  };

  /**
   * setCompuestoSeleccionado
   * 
   * Cambia el neumático que se pondrá en el próximo pit stop.
   */
  const setCompuestoSeleccionado = (pilotoId: number, c: Compuesto) => {
    setCompuestosSiguientes(prev => ({ ...prev, [pilotoId]: c }));
  };

  /**
   * setCompuestoInicial
   * 
   * Cambia el neumático de salida (fase parrilla).
   */
  const setCompuestoInicial = (pilotoId: number, c: Compuesto) => {
    setCompuestosIniciales(prev => ({ ...prev, [pilotoId]: c }));
  };

  return {
    fase,
    startData,
    ranking,
    vueltaActual,
    totalVueltas,
    loadingStart,
    errorStart,
    compuestosIniciales,
    compuestosSiguientes,
    pitStopsConfirmados,
    handleStartRace,
    handleConfirmPitStop,
    setCompuestoSeleccionado,
    setCompuestoInicial
  };
};
