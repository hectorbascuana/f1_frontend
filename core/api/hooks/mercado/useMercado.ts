import { enviarOferta, obtenerPilotosBloqueados, RespuestaNegociacion } from '@/core/api/action/traspasos.action';
import { usePilotosMercado } from '@/core/api/hooks/pilotos/usePilotosMercado';
import { useActiveGame } from '@/hooks/store/useActiveGame';
import { Piloto } from '@/types/piloto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useMercado() {
    const queryClient = useQueryClient();
    const { partida, isLoading: loadingGame, error: errorGame } = useActiveGame();

    // Estados UI de Mercado
    const [selectedPiloto, setSelectedPiloto] = useState<Piloto | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    // Lógica y estados de negociación
    const [offerPrice, setOfferPrice] = useState<number>(0);
    const [negotiationStatus, setNegotiationStatus] = useState<'idle' | 'loading' | 'result'>('idle');
    const [negotiationResult, setNegotiationResult] = useState<RespuestaNegociacion | null>(null);

    // Listado de IDs bloqueados localmente en esta sesión (para respuesta inmediata)
    const [localBlockedIds, setLocalBlockedIds] = useState<number[]>([]);

    const {
        data: pilotos,
        isLoading: loadingPilotos,
        error: errorPilotos,
        refetch
    } = usePilotosMercado(partida?.id || 0);

    // Consulta oficial de bloqueos del servidor
    const { data: serverBlockedIds } = useQuery({
        queryKey: ['pilotos', 'bloqueados', partida?.id],
        queryFn: () => obtenerPilotosBloqueados(partida!.id),
        enabled: !!partida?.id
    });

    /**
     * Determina si un piloto debe estar bloqueado para nuevas ofertas.
     */
    const isPilotoBlocked = (piloto: Piloto): boolean => {
        // 1. Verificamos bloqueos locales de la sesión
        if (localBlockedIds.includes(piloto.id)) return true;

        // 2. Verificamos la respuesta oficial del servidor
        if (serverBlockedIds?.includes(piloto.id)) return true;

        // 3. (Fallback) Verificamos el historial de ofertas persistentes
        if (!partida || !piloto.ofertas) return false;
        return piloto.ofertas.some(o =>
            !o.aceptada && !o.enCurso && o.escuderiaDestino?.id === partida.escuderia?.id
        );
    };

    // Filtrado de pilotos por nombre
    const filteredPilotos = pilotos?.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );


    /**
     * Abre el modal de detalle para un piloto específico e inicializa el precio.
     */
    const handleOpenDetail = (piloto: Piloto) => {
        setSelectedPiloto(piloto);
        setOfferPrice(piloto.valor);
        setNegotiationStatus('idle');
        setNegotiationResult(null);
        setModalVisible(true);
    };

    /**
     * Cierra el modal de detalle y limpia la selección.
     */
    const handleCloseDetail = () => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedPiloto(null);
            setOfferPrice(0);
            setNegotiationStatus('idle');
            setNegotiationResult(null);
        }, 300);
    };

    const handlePriceChange = (amount: number) => {
        setOfferPrice(prev => Math.max(0.1, Number((prev + amount).toFixed(1))));
    };

    // Mutación para conectar con el backend y TanStack Query
    const mutation = useMutation({
        mutationFn: (precio: number) =>
            enviarOferta(partida!.id, selectedPiloto!.id, partida!.escuderia.id, precio),
        onMutate: () => {
            setNegotiationStatus('loading');
        },
        onSuccess: async (data: any) => {
            // Inteligencia Artificial: Añadimos 3 segundos de suspense/intriga
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Si enviarOferta devolvió un string (error capturado por el usuario en el action)
            if (typeof data === 'string') {
                setNegotiationResult({
                    resultado: 'RECHAZADO',
                    mensaje: `Tu oferta por ${selectedPiloto?.nombre} ha sido rechazada`,
                    presupuestoRestante: partida?.escuderia?.presupuesto || 0,
                    traspaso: null
                });
                setNegotiationStatus('result');

                if (selectedPiloto) {
                    setLocalBlockedIds(prev => {
                        if (prev.includes(selectedPiloto.id)) return prev;
                        return [...prev, selectedPiloto.id];
                    });
                }
            } else if (data.resultado === 'RECHAZADO') {
                // Si es un rechazo oficial del contrato
                if (selectedPiloto) {
                    setLocalBlockedIds(prev => {
                        if (prev.includes(selectedPiloto.id)) return prev;
                        return [...prev, selectedPiloto.id];
                    });
                }

                setNegotiationResult({
                    ...data,
                    mensaje: `Tu oferta por ${selectedPiloto?.nombre} ha sido rechazada`
                });
                setNegotiationStatus('result');
            } else {
                // Aceptado
                setNegotiationResult(data);
                setNegotiationStatus('result');
            }

            // Invalidar queries para actualizar partida (presupuesto), mercado, alineaciones e historial
            queryClient.invalidateQueries({ queryKey: ['partida'] });
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
            queryClient.invalidateQueries({ queryKey: ['escuderia'] });
            queryClient.invalidateQueries({ queryKey: ['traspasos'] });
        },
        onError: (err: any) => {
            // Siempre mostramos el mensaje estandarizado en el modal para evitar Alerts
            setNegotiationResult({
                resultado: 'RECHAZADO',
                mensaje: `Tu oferta por ${selectedPiloto?.nombre} ha sido rechazada`,
                presupuestoRestante: partida?.escuderia?.presupuesto || 0,
                traspaso: null
            });
            setNegotiationStatus('result');

            // Si falla por cualquier motivo, lo bloqueamos localmente
            if (selectedPiloto) {
                setLocalBlockedIds(prev => {
                    if (prev.includes(selectedPiloto.id)) return prev;
                    return [...prev, selectedPiloto.id];
                });
            }

            queryClient.invalidateQueries({ queryKey: ['partida'] });
            queryClient.invalidateQueries({ queryKey: ['pilotos'] });
            queryClient.invalidateQueries({ queryKey: ['escuderia'] });
            queryClient.invalidateQueries({ queryKey: ['traspasos'] });
        }
    });

    const handleSendOffer = async () => {
        if (!partida || !selectedPiloto || !hasEnoughFunds) return;
        mutation.mutate(offerPrice);
    };

    const hasEnoughFunds = (partida?.escuderia?.presupuesto || 0) >= offerPrice;

    return {
        // Estado
        partida,
        pilotos,
        filteredPilotos,
        search,
        selectedPiloto,
        modalVisible,
        offerPrice,
        bloqueadosIds: serverBlockedIds || localBlockedIds,
        hasEnoughFunds,

        // Estado de Negociación para el Modal
        negotiationStatus,
        negotiationResult,
        isSending: mutation.isPending,

        // Flags de Carga y Error
        isLoading: loadingGame || loadingPilotos,
        error: errorGame || errorPilotos,
        loadingGame,

        // Acciones
        setSearch,
        setOfferPrice,
        handlePriceChange,
        handleOpenDetail,
        handleCloseDetail,
        handleSendOffer,
        isPilotoBlocked,
        refetch
    };
}
