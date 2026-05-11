import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useIniciarCarrera, useAvanzarVuelta } from '../../core/api/hooks/carrera/useCarreraSimulacion';
import { useSiguienteCarrera } from '../../core/api/hooks/carrera/useCircuito';
import { PilotoRankingDTO, Compuesto, VueltaRequestDTO } from '../../core/types/carreraDTO';
import { useQueryClient } from '@tanstack/react-query';

/**
 * useCarreras.ts
 * 
 * Centraliza la lógica de negocio y gestión de estado de la simulación de carrera.
 * Separa la orquestación del bucle de carrera de la capa visual.
 */

type FaseCarrera = 'PRECARRERA' | 'ACTIVA' | 'FINALIZADA';

export const useCarreras = (partidaId: number) => {

  // Estados de fase y datos
  const [fase, setFase] = useState<FaseCarrera>('PRECARRERA');
  const [uuid, setUuid] = useState<string | null>(null);
  const [ranking, setRanking] = useState<PilotoRankingDTO[]>([]);
  const [vueltaActual, setVueltaActual] = useState(0);
  const [totalVueltas, setTotalVueltas] = useState(0);
  const [pilotosVisiblesCount, setPilotosVisiblesCount] = useState(0);

  // Estados de estrategia (Jugador)
  const [compuestosIniciales, setCompuestosIniciales] = useState<Record<number, Compuesto>>({});
  const [pitStopsConfirmados, setPitStopsConfirmados] = useState<Record<number, boolean>>({});
  const [compuestosSiguientes, setCompuestosSiguientes] = useState<Record<number, Compuesto>>({});

  // Hooks de API (TanStack Query)
  const { data: startData, isLoading: loadingStart, error: errorStart } = useIniciarCarrera(partidaId);
  const mutationVuelta = useAvanzarVuelta();
  const mutationAvanzar = useSiguienteCarrera(partidaId);
  const queryClient = useQueryClient();

  // Referencias para el bucle y cierres (stale closures)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vueltaActualRef = useRef(0);
  const estrategiaRef = useRef({
    pitStops: {} as Record<number, boolean>,
    compuestos: {} as Record<number, Compuesto>
  });
  const rankingRef = useRef<PilotoRankingDTO[]>([]);

  // Sincronizar refs con el estado para que el loop async siempre vea lo último
  useEffect(() => {
    estrategiaRef.current = { 
      pitStops: pitStopsConfirmados, 
      compuestos: compuestosSiguientes 
    };
  }, [pitStopsConfirmados, compuestosSiguientes]);

  useEffect(() => {
    rankingRef.current = ranking;
  }, [ranking]);

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

  // Lógica de revelación de parrilla con suspense
  useEffect(() => {
    if (startData && fase === 'PRECARRERA') {
      setPilotosVisiblesCount(0);
      let count = 0;
      const total = startData.parrilla.length;
      
      const revealNext = () => {
        if (count < total) {
          count++;
          setPilotosVisiblesCount(count);
          
          // La posición que estamos revelando (de atrás hacia adelante)
          const currentPos = total - count + 1; 
          
          // Curva de delay: inicio pausado y ralentización progresiva hacia el P1
          let delay = 600;                        // Base para el fondo de la parrilla
          if (currentPos <= 15) delay = 750;      // Zona media
          if (currentPos <= 10) delay = 900;      // Top 10
          if (currentPos <= 5) delay = 1200;      // Top 5
          if (currentPos <= 3) delay = 2000;      // Podium (Drama total)
          
          timeoutRef.current = setTimeout(revealNext, delay);
        }
      };
      
      const initialTimeout = setTimeout(revealNext, 1000);
      return () => clearTimeout(initialTimeout);
    }
  }, [startData, fase]);

  // Inicializar estrategia y UUID al recibir la parrilla
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
      const currentRanking = rankingRef.current;

      // Identificar pilotos del jugador para el DTO de la vuelta
      const pJugador = currentRanking.length > 0 
        ? currentRanking.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId)
        : startData?.parrilla.filter(p => p.esJugador).sort((a, b) => a.pilotoId - b.pilotoId) || [];

      const body: VueltaRequestDTO = {
        pitStopPiloto1: pJugador[0] ? (currentRanking.length > 0 && !!pitStops[pJugador[0].pilotoId]) : false,
        nuevoCompuestoPiloto1: pJugador[0] ? (currentRanking.length === 0 ? compuestosIniciales[pJugador[0].pilotoId] : (compuestos[pJugador[0].pilotoId] || null)) : null,
        pitStopPiloto2: pJugador[1] ? (currentRanking.length > 0 && !!pitStops[pJugador[1].pilotoId]) : false,
        nuevoCompuestoPiloto2: pJugador[1] ? (currentRanking.length === 0 ? compuestosIniciales[pJugador[1].pilotoId] : (compuestos[pJugador[1].pilotoId] || null)) : null,
      };

      console.log(`[LOOP] Enviando telemetría Vuelta ${vueltaActualRef.current + 1}:`, JSON.stringify(body));

      const res = await mutationVuelta.mutateAsync({ uuid: currentUuid, body });

      // Actualizar ranking y telemetría
      const sortedRanking = [...res.ranking].sort((a, b) => a.posicion - b.posicion);
      setRanking(sortedRanking);
      setVueltaActual(res.vueltaActual);
      vueltaActualRef.current = res.vueltaActual;
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
  }, [startData, compuestosIniciales, mutationVuelta]);

  /**
   * handleStartRace
   * 
   * Transición de parrilla a carrera activa.
   */
  const handleStartRace = useCallback(() => {
    if (!uuid) return;
    setFase('ACTIVA');
    ejecutarVuelta(uuid);
  }, [uuid, ejecutarVuelta]);

  /**
   * handleConfirmPitStop
   * 
   * Registro de decisión de parada en boxes del jugador.
   */
  const handleConfirmPitStop = useCallback((pilotoId: number) => {
    console.log(`[useCarreras] Callback handleConfirmPitStop invocado para pilotoId: ${pilotoId}`);
    setPitStopsConfirmados(prev => {
        console.log('[useCarreras] Actualizando estado de pit stops confirmados:', { ...prev, [pilotoId]: true });
        return { ...prev, [pilotoId]: true };
    });
    setCompuestosSiguientes(prev => {
        if (!prev[pilotoId]) {
            return { ...prev, [pilotoId]: 'MEDIO' };
        }
        return prev;
    });
  }, []);

  /**
   * handleFinishAndExit
   * 
   * Avanza la carrera en el backend y vuelve a la pantalla de gestión.
   */
  const handleFinishAndExit = useCallback(async () => {
    try {
      await mutationAvanzar.mutateAsync();
      
      // Invalidamos las queries para que al volver, la info esté actualizada
      queryClient.invalidateQueries({ queryKey: ['partida'] });
      queryClient.invalidateQueries({ queryKey: ['calendario'] });
      
      router.replace(`/(partidas)/${partidaId}` as any);
    } catch (err) {
      console.error("Error al finalizar carrera:", err);
      Alert.alert("Error", "No se ha podido procesar el avance de la temporada.");
    }
  }, [mutationAvanzar, queryClient, partidaId]);

  /**
   * setCompuestoSeleccionado
   * 
   * Cambia el neumático que se pondrá en el próximo pit stop.
   */
  const setCompuestoSeleccionado = useCallback((pilotoId: number, c: Compuesto) => {
    setCompuestosSiguientes(prev => ({ ...prev, [pilotoId]: c }));
  }, []);

  /**
   * setCompuestoInicial
   * 
   * Cambia el neumático de salida (fase parrilla).
   */
  const setCompuestoInicial = useCallback((pilotoId: number, c: Compuesto) => {
    setCompuestosIniciales(prev => ({ ...prev, [pilotoId]: c }));
  }, []);

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
    pilotosVisiblesCount,
    handleStartRace,
    handleConfirmPitStop,
    handleFinishAndExit,
    setCompuestoSeleccionado,
    setCompuestoInicial
  };
};
