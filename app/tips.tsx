import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking } from 'react-native';

export default function SettingsScreen() {
    const [gpsDefault, setGpsDefault] = useState(true);
    const router = useRouter();
    const handleSyncNow = () => Alert.alert('Syncing...', 'Manual sync started.');
    const handleClearCache = () => Alert.alert('Cache Cleared', 'Local data has been cleared.');
    const handleLogout = () => Alert.alert('Logged Out', 'Session cleared. Please re-login.');

    return (
        <Box className="flex-1 bg-white px-6 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">Help and Tips</Text>
                <Pressable onPress={() => { router.back(); }}>Back</Pressable>
            </HStack>
            <VStack space="md">
                <Text className="text-base text-gray-700">
                    Offline Tip: Always save locally before midday. This ensures everything syncs before end-of-day.
                </Text>

                <Video
                    source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
                    useNativeControls
                    resizeMode="contain"
                    style={{ width: '100%', height: 200, borderRadius: 8 }}
                />

                <Pressable
                    onPress={() => Linking.openURL('mailto:support@example.com')}
                    className="flex-row items-center justify-between py-3"
                >
                    <Text className="text-base text-blue-600 font-medium">Contact Support</Text>
                    <MaterialIcons name="email" size={20} color="#3b82f6" />
                </Pressable>
            </VStack>
        </Box>
    );
}