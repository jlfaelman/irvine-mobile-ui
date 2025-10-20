import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
    SelectPortal,
    SelectTrigger
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { DashboardInfo } from '@/src/interface/dashboard';
import English from '@/src/language/english';
import { loadDashboardInfo } from '@/src/middleware/dashboard';
import { syncHistory } from '@/src/middleware/history';
import { syncJobs } from '@/src/middleware/job';
import { checkToken, getRefreshToken, getToken } from '@/src/middleware/jwt';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import useShowAlert from './screens/alert';
import Header from './screens/header';
import LoadingScreen from './screens/loading';

const items = [
    { 
        name: English.dashboard.buttons.history, 
        icon: 'history', 
        route: '/history',
        color: '#3b82f6',
        bgColor: '#eff6ff',
        description: 'View past readings and reports'
    },
    { 
        name: English.dashboard.buttons.tips, 
        icon: 'lightbulb', 
        route: '/tips',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        description: 'Get water quality tips and guidance'
    },
    { 
        name: English.dashboard.buttons.sync, 
        icon: 'settings', 
        route: '/settings',
        color: '#6b7280',
        bgColor: '#f9fafb',
        description: 'Manage app settings and preferences'
    },
];



export default function DashboardScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUserAuth, setIsUserAuth] = useState(true);
    const { width } = useWindowDimensions();
    const [selectedValue, setSelectedValue] = useState('');
    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>(null);
    const [username, setUsername] = useState('');
    const iconSize = width >= 1024 ? 60 : width >= 768 ? 50 : 40;
    const router = useRouter();
    const { sync } = useLocalSearchParams();
    const showAlert = useShowAlert();
    useEffect(() => {
        const authUser = async () => {
            const token = await getToken();
            const refreshToken = await getRefreshToken();

            if (!token && !refreshToken) {
                router.push('/auth');
            }
        };

        const loadDashboard = async () => {
            const token = await checkToken();

            const dashboardData = await loadDashboardInfo(true);
            setDashboardInfo(dashboardData);
            setUsername(dashboardData.firstName + " " + dashboardData.lastName)
            if (token) setIsLoading(false);

        };

        authUser();
        loadDashboard();
    }, []);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const checkConnectivity = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error('Error checking connectivity:', error);
            return false;
        }
    };

    const showNoInternetAlert = () => {
        Alert.alert(
            'No Internet Connection',
            'Action requires stable internet connection',
            [{ text: 'OK', style: 'default' }]
        );
    };

    const syncJobsToDatabase = async () => {
        const connected = await checkConnectivity();
        if (!connected) {
            showNoInternetAlert();
            return;
        }

        setIsSyncing(true);

        const status = await syncJobs();
        if (!status) console.log('No Jobs Found!');

        const syncStatus = await syncHistory();

        if (syncStatus) {
            await sleep(2000); 
            setIsSyncing(false);

            showAlert('Sync Completed', "Queue has been synchronized to cloud successfully.",'success');
        }
    };
    const syncDashboard = async () => {
        const connected = await checkConnectivity();
        if (!connected) {
            showNoInternetAlert();
            return;
        }

        setIsRefreshing(true);
        try {
            const dashboardData = await loadDashboardInfo(true);
            setDashboardInfo(dashboardData);
            setUsername(dashboardData.firstName + " " + dashboardData.lastName);
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
        } finally {
            setIsRefreshing(false);
        }
    }

    const onRefresh = async () => {
        await syncDashboard();
    }





    if (isLoading) return <LoadingScreen message='Logged In successfully. Loading Dashboard for you.' />
    if (isSyncing) return <LoadingScreen message='Syncing queue to cloud...' />
    else return (
        <LinearGradient
            colors={['#A7C8FF', '#B9D5FF', '#FFFFFF']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView 
                    contentContainerStyle={{ padding: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                >
                <Header name={username} />

                {/* Welcome Section */}
                <VStack className="mb-6">
                    <Text className="text-3xl font-bold text-gray-900">Welcome back!</Text>
                </VStack>

                {/* Location Selector */}
                <Box className="w-full mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Select Location</Text>
                    <Select
                        selectedValue={selectedValue}
                        onValueChange={(value) => setSelectedValue(value)}
                    >
                        <SelectTrigger className="border border-gray-200 bg-white rounded-xl px-5 py-4 h-14" style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}>
                            <Box className="flex-1 flex-row items-center justify-between">
                                <Text className="text-base font-medium text-gray-900 flex-1">
                                    {selectedValue || "Choose a location to continue"}
                                </Text>
                                <MaterialIcons name="keyboard-arrow-down" size={20} color="#6b7280" />
                            </Box>
                        </SelectTrigger>

                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>

                                {dashboardInfo?.locations?.length ? (
                                    dashboardInfo.locations.map(loc => (
                                        <SelectItem key={loc.id} label={loc.name} value={loc.name} />
                                    ))
                                ) : (
                                    <SelectItem label="No locations found" value="none" isDisabled />
                                )}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </Box>

                {/* Add Reading Button */}
                <Box className="mb-4">
                    <Pressable 
                        onPress={() => {
                            if (selectedValue === "__GluestackPlaceholder__" || selectedValue === "") {
                                showAlert("Invalid Location", "Please choose a valid location first");
                            } else {
                                const selectedLocation = dashboardInfo?.locations.find((loc) => loc.name === selectedValue);
                                router.push({
                                    pathname: '/reading',
                                    params: {
                                        parameters: JSON.stringify(selectedLocation ?? {}),
                                        contaminants: JSON.stringify(dashboardInfo?.contaminants),
                                        from: "dashboard"
                                    }
                                });
                            }
                        }}
                        className="bg-green-600 p-4 rounded-xl flex-row items-center justify-center"
                        style={{
                            shadowColor: '#10b981',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <MaterialIcons name="add-circle" size={24} color="white" />
                        <Text className="text-white font-semibold ml-2">Add Reading</Text>
                    </Pressable>
                </Box>

                {/* Sync Locally Button */}
                <Box className="mb-6">
                    <Pressable 
                        onPress={syncJobsToDatabase} 
                        className="bg-blue-600 p-4 rounded-xl flex-row items-center justify-center"
                        style={{
                            shadowColor: '#3b82f6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <MaterialIcons name="sync" size={24} color="white" />
                        <Text className="text-white font-semibold ml-2">Sync Queue to Cloud</Text>
                    </Pressable>
                </Box>
                {/* Action Cards */}
                <VStack className="space-y-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</Text>
                    {items.map((item, idx) => (
                        <Pressable
                            onPress={() => {
                                const selectedLocation = dashboardInfo?.locations.find((loc) => loc.name === selectedValue);
                                router.push({
                                    pathname: item.route,
                                    params: {
                                        parameters: JSON.stringify(selectedLocation ?? {}),
                                        contaminants: JSON.stringify(dashboardInfo?.contaminants),
                                        from: "dashboard"
                                    }
                                })
                            }}
                            key={idx}
                            className="bg-white p-5 rounded-xl flex-row items-center mb-4"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Box 
                                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                                style={{ backgroundColor: item.bgColor }}
                            >
                                <MaterialIcons 
                                    name={(item.icon as any) || ('help-outline' as any)} 
                                    size={24} 
                                    color={item.color} 
                                />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
                                <Text className="text-sm text-gray-600">{item.description}</Text>
                            </VStack>
                            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
                        </Pressable>
                    ))}
                </VStack>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
