import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import useMejoras from "../../hooks/escuderia/useMejoras";

// Componente de Tarjeta Cuadrada para el Coche
    const CarCard = ({ label, value, icon, color, maxValue = 100 }: any) => {
        const { calculateCost } = useMejoras();
        const cost = calculateCost(value, 'car');
        return (
            <View className="bg-[#121212] border border-[#222] rounded-[28px] p-4 flex-1 m-1 h-36 justify-between relative overflow-hidden">
                <View className="absolute -right-4 -bottom-4 opacity-[0.06]">
                    <Ionicons name={icon} size={90} color={color} />
                </View>
                <View>
                    <View className="flex-row items-center mb-1">
                        <View style={{ backgroundColor: `${color}20` }} className="p-1.5 rounded-lg mr-2">
                            <Ionicons name={icon} size={13} color={color} />
                        </View>
                        <Text className="text-[#aaa] font-black text-[8px] uppercase tracking-[1px]">{label}</Text>
                    </View>
                    <View className="flex-row items-baseline">
                        <Text className="text-white font-black text-xl">{value}</Text>
                        <Text className="text-[#444] font-black text-[9px] ml-1">/{String(maxValue).toUpperCase()}</Text>
                    </View>
                </View>
                <View>
                    <View className="h-1 bg-[#222] rounded-full mb-3 overflow-hidden">
                        <View className="h-full rounded-full" style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: color }} />
                    </View>
                    <TouchableOpacity className="bg-[#151515] border border-[#222] py-2 rounded-xl items-center flex-row justify-center shadow-sm">
                        <View className="bg-emerald-500/10 p-0.5 rounded-md mr-2">
                            <Ionicons name="wallet" size={10} color="#10b981" />
                        </View>
                        <Text className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.5px]">{cost}M €</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    export default CarCard;