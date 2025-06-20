import { Pressable } from "@/components/ui/pressable";
import { Text } from '@/components/ui/text';
import { View } from "@/components/ui/view";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
    name: string
}
export default function Header({ name }: HeaderProps) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="account-circle" color="#3b82f6" size={32} />
                <Text className="font-semibold">{name}</Text>
            </Pressable>
        </View>

    )
}