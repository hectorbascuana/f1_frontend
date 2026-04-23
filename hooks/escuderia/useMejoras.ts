// Lógica para simular costes dinámicos (Nivel * Factor)

const useMejoras = () => {
    const calculateCost = (level: number, type: 'car' | 'facility') => {
        const base = type === 'car' ? 0.5 : 2.5;
        return (level * base).toFixed(1);
    };

    return {
        calculateCost
    };
};

export default useMejoras;