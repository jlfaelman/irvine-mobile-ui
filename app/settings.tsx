import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { clearAllStorage } from '@/src/middleware/configuration';
import { loadDashboardInfo } from '@/src/middleware/dashboard';
import { syncHistory, syncJobs } from '@/src/middleware/history';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import useShowAlert from './screens/alert';

export default function SettingsScreen() {
    const [gpsDefault, setGpsDefault] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();
    const showAlert = useShowAlert();

    const handleSyncNow = async () => {
        setIsSyncing(true);
        try {
            await syncJobs();
            await syncHistory();
            showAlert('Sync Complete', 'All data has been synchronized successfully', 'success');
        } catch (error) {
            showAlert('Sync Failed', 'Failed to sync data. Please try again.', 'error');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleClearCache = () => {
        Alert.alert(
            'Refresh Data',
            'This will refresh locations and contaminants from the server. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear only dashboard info (locations and contaminants)
                            await AsyncStorage.removeItem('dashboardInfo');
                            
                            // Refresh dashboard info from API
                            await loadDashboardInfo(true);
                            
                            showAlert('Data Refreshed', 'Locations and contaminants have been updated from server', 'success');
                        } catch (error) {
                            console.error('Error clearing cache:', error);
                            showAlert('Error', 'Failed to refresh data. Please try again.', 'error');
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllStorage();
                        router.replace('/auth');
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, rightElement, isDestructive = false }: {
        icon: string;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        isDestructive?: boolean;
    }) => (
        <Pressable 
            onPress={onPress} 
            className={`flex-row items-center justify-between py-4 px-4 rounded-lg mb-2 ${
                isDestructive ? 'bg-red-50' : 'bg-gray-50'
            }`}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            <HStack className="items-center flex-1">
                <Box className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    isDestructive ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                    <MaterialIcons 
                        name={icon as any} 
                        size={20} 
                        color={isDestructive ? '#ef4444' : '#3b82f6'} 
                    />
                </Box>
                <VStack className="flex-1">
                    <Text className={`text-base font-medium ${
                        isDestructive ? 'text-red-700' : 'text-gray-900'
                    }`}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-sm text-gray-500 mt-1">
                            {subtitle}
                        </Text>
                    )}
                </VStack>
            </HStack>
            {rightElement || (
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            )}
        </Pressable>
    );

    return (
        <LinearGradient
            colors={['#A7C8FF', '#B9D5FF', '#FFFFFF']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <Box className="flex-1">
            {/* Header */}
            <Box className="bg-white px-6 pt-12 pb-4">
                <HStack className="justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900">Settings</Text>
                    <Pressable 
                        onPress={() => router.back()}
                        className="w-8 h-8 items-center justify-center"
                    >
                        <MaterialIcons name="close" size={24} color="#6b7280" />
                    </Pressable>
                </HStack>
            </Box>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Sync Section */}
                <VStack className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Data Management</Text>
                    <SettingItem
                        icon="sync"
                        title="Sync Now"
                        subtitle="Synchronize all data with server"
                        onPress={handleSyncNow}
                        rightElement={
                            isSyncing ? (
                                <MaterialIcons name="hourglass-empty" size={20} color="#3b82f6" />
                            ) : (
                                <MaterialIcons name="sync" size={20} color="#3b82f6" />
                            )
                        }
                    />
                    <SettingItem
                        icon="refresh"
                        title="Refresh Data"
                        subtitle="Update locations and contaminants from server"
                        onPress={handleClearCache}
                        isDestructive
                    />
                </VStack>

                {/* Preferences Section */}
                <VStack className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Preferences</Text>
                    <Box 
                        className="flex-row items-center justify-between py-4 px-4 rounded-lg bg-gray-50"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <HStack className="items-center flex-1">
                            <Box className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-green-100">
                                <MaterialIcons name="gps-fixed" size={20} color="#22c55e" />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-base font-medium text-gray-900">
                                    Use GPS by Default
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1">
                                    Automatically enable GPS for new readings
                                </Text>
                            </VStack>
                        </HStack>
                        <Switch 
                            isChecked={gpsDefault} 
                            onToggle={() => setGpsDefault(!gpsDefault)} 
                        />
                    </Box>
                </VStack>

                {/* Account Section */}
                <VStack className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Account</Text>
                    <SettingItem
                        icon="logout"
                        title="Logout"
                        subtitle="Sign out and clear session"
                        onPress={handleLogout}
                        isDestructive
                    />
                </VStack>

                {/* App Info */}
                <Box className="items-center py-8">
                    <Text className="text-sm text-gray-400 text-center">
                        Irvine Mobile App v1.0.0
                    </Text>
                    <Text className="text-xs text-gray-400 text-center mt-1">
                        © 2024 Irvine Analytics Services
                    </Text>
                </Box>
            </ScrollView>
            </Box>
        </LinearGradient>
    );
}