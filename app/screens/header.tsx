import { Pressable } from "@/components/ui/pressable";
import { Text } from '@/components/ui/text';
import { View } from "@/components/ui/view";
import { clearAllStorage } from '@/src/middleware/configuration';
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

interface HeaderProps {
    name: string
}
export default function Header({ name }: HeaderProps) {
    const router = useRouter();

    const onLogout = async () => {
        await clearAllStorage();
        router.replace('/');
    };
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="account-circle" color="#3b82f6" size={32} />
                <Text className="font-semibold">{name}</Text>
            </Pressable>
            <Pressable onPress={onLogout} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <MaterialIcons name="logout" size={24} color="#ef4444" />
                <Text className="text-[#ef4444] font-medium">Logout</Text>
            </Pressable>
        </View>

    )
}