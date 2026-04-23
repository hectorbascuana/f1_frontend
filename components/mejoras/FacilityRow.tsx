import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import useMejoras from "../../hooks/escuderia/useMejoras";

    // Componente de Fila Horizontal para Instalaciones
    const FacilityRow = ({ label, value, icon, color, IconSet = Ionicons }: any) => {
        const { calculateCost } = useMejoras();
        const cost = calculateCost(value, 'facility');
        const IconComponent = IconSet;

        return (
            <View className="bg-[#121212] border border-[#222] rounded-2xl p-3 mb-2 flex-row items-center justify-between shadow-sm">
                <View className="flex-row items-center flex-1">
                    <View style={{ backgroundColor: `${color}15` }} className="p-2.5 rounded-xl mr-3 border border-white/5">
                        <IconComponent name={icon} size={18} color={color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-black uppercase text-[10px] tracking-[1px] mb-1.5">{label}</Text>
                        <View className="flex-row">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View 
                                    key={i} 
                                    className={`h-1 flex-1 mr-1.5 rounded-full ${i <= value ? '' : 'bg-[#222]'}`}
                                    style={{ backgroundColor: i <= value ? color : '#222' }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="bg-[#151515] border border-[#222] px-3 py-2 rounded-xl items-center flex-row shadow-sm ml-4">
                    <View className="bg-emerald-500/10 p-0.5 rounded-md mr-2">
                        <Ionicons name="wallet" size={10} color="#10b981" />
                    </View>
                    <Text className="text-emerald-400 font-black text-[9px] uppercase">{cost}M €</Text>
                </TouchableOpacity>
            </View>
        );
    };

    export default FacilityRow;