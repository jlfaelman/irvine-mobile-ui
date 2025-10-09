import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from '@/components/ui/text';
import { VStack } from "@/components/ui/vstack";
import { clearTokens } from '@/src/middleware/jwt';
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

interface HeaderProps {
    name: string
}
export default function Header({ name }: HeaderProps) {
    const router = useRouter();

    const onLogout = async () => {
        await clearTokens();
        router.replace('/auth');
    };
    
    return (
        <Box className="mb-6">
            <HStack className="justify-between items-center">
                <HStack className="items-center">
                    <Box 
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: '#eff6ff' }}
                    >
                        <MaterialIcons name="account-circle" color="#3b82f6" size={28} />
                    </Box>
                    <VStack>
                        <Text className="text-lg font-semibold text-gray-900">{name}</Text>
                    </VStack>
                </HStack>
                <Pressable 
                    onPress={onLogout} 
                    className="flex-row items-center px-4 py-2 rounded-lg"
                    style={{ backgroundColor: '#fef2f2' }}
                >
                    <MaterialIcons name="logout" size={20} color="#ef4444" />
                    <Text className="text-[#ef4444] font-medium ml-2">Logout</Text>
                </Pressable>
            </HStack>
        </Box>
    )
}