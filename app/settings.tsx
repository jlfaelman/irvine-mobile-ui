import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function SettingsScreen() {
    const [gpsDefault, setGpsDefault] = useState(true);
    const router = useRouter();
    const handleSyncNow = () => Alert.alert('Syncing...', 'Manual sync started.');
    const handleClearCache = () => Alert.alert('Cache Cleared', 'Local data has been cleared.');
    const handleLogout = () => Alert.alert('Logged Out', 'Session cleared. Please re-login.');

    return (
        <Box className="flex-1 bg-white px-6 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">Settings</Text>
                <Pressable onPress={() => { router.back(); }}>Back</Pressable>
            </HStack>
            <VStack space="md">
                <Pressable onPress={handleSyncNow} className="flex-row items-center justify-between py-3 border-b">
                    <Text className="text-base">Sync Now</Text>
                    <MaterialIcons name="sync" size={20} color="#3b82f6" />
                </Pressable>

                <Pressable onPress={handleClearCache} className="flex-row items-center justify-between py-3 border-b">
                    <Text className="text-base">Clear Cache</Text>
                    <MaterialIcons name="delete" size={20} color="#ef4444" />
                </Pressable>

                <View className="flex-row items-center justify-between py-3 border-b">
                    <Text className="text-base">Use GPS by Default</Text>
                    <Switch isChecked={gpsDefault} onToggle={() => setGpsDefault(!gpsDefault)} />
                </View>

                <Pressable onPress={handleLogout} className="flex-row items-center justify-between py-3 border-b">
                    <Text className="text-base">Re-login</Text>
                    <MaterialIcons name="logout" size={20} color="#000" />
                </Pressable>
            </VStack>

        </Box>
    );
}