import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
    History
} from '@/src/interface/history';
import { loadDashboardInfo } from '@/src/middleware/dashboard';
import { clearHistory, getHistory, removeHistoryItem } from '@/src/middleware/history';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
const statusBadge:any = {
    pending: { label: 'Pending', color: '#facc15' },
    completed: { label: 'Completed', color: '#22c55e' },
    error: { label: 'Error', color: '#ef4444' },
};

export default function HistoryScreen() {
    const router = useRouter();
    const { contaminants } = useLocalSearchParams();
    const [c, setC] = useState(Array<any | null>)
    const [selectedTab, setSelectedTab] = useState('all');
    const [historyList, setHistoryList] = useState<History[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardInfo, setDashboardInfo] = useState<any>(null);

    const fetchHistory = async () => {
        try {
            setRefreshing(true);
            const history = await getHistory();
            setHistoryList(history || []);
            
            // Also refresh dashboard data to get latest location info
            await loadDashboardData();
        } catch (err) {
            Alert.alert('Error', 'Failed to load history.');
        } finally {
            setRefreshing(false);
        }
    };

    const loadDashboardData = async () => {
        try {
            const dashboardData = await loadDashboardInfo(false);
            setDashboardInfo(dashboardData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const clear = async () => {
        await clearHistory();
    }

    const getUnitByName = (name: string) => {
        const found = c.find(contaminant => contaminant.name === name);
        return found ? found.units : null;

    }


    useEffect(() => {
        fetchHistory();
        loadDashboardData();
        const parsed_c = JSON.parse(Array.isArray(contaminants) ? contaminants[0] : contaminants)
        setC(parsed_c)
    }, []);

    const filteredData =
        selectedTab === 'all'
            ? historyList
            : historyList.filter((item: History) => item?.status === selectedTab);
    
    // Sort by created_at in descending order (newest first)
    const sortedData = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Descending order (newest first)
    });

    const HistoryCard = ({ item }: { item: History }) => {
        const { data, status, created_at, finished_at }: any = item;
        const badge = statusBadge[status] || { label: status, color: '#9ca3af' };
        
        // Extract location information from data or dashboard
        const getLocationInfo = () => {
            // First try to get from data object
            if (data?.location?.name) {
                return {
                    name: data.location.name,
                    description: data.location.description || ''
                };
            }
            
            // Try alternative data structure
            if (data?.locationName) {
                return {
                    name: data.locationName,
                    description: data.locationDescription || ''
                };
            }
            
            // Fallback to dashboard data using location ID
            if (data?.location && dashboardInfo?.locations) {
                const location = dashboardInfo.locations.find((loc: any) => loc.id === data.location);
                if (location) {
                    return {
                        name: location.name,
                        description: location.description || ''
                    };
                }
            }
            
            return {
                name: 'Unknown Location',
                description: ''
            };
        };
        
        const locationInfo = getLocationInfo();


        const confirmDelete = (createdAt: string) => {
            Alert.alert('Delete reading', 'Delete this pending reading?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const ok = await removeHistoryItem(createdAt);
                            if (ok) {
                                await fetchHistory();
                            } else {
                                Alert.alert('Error', 'Failed to delete the item.');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete the item.');
                        }
                    }
                }
            ]);
        };

        return (
            <Box 
                className="p-4 rounded-lg mb-3"
                style={{
                    backgroundColor: '#ffffff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <HStack className="justify-between items-start">
                    <VStack className="flex-1">
                        <HStack className="items-center mb-2">
                            <Box 
                                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: badge.color + '20' }}
                            >
                                <MaterialIcons 
                                    name={status === 'completed' ? 'check-circle' : 
                                          status === 'error' ? 'error' : 'schedule'} 
                                    size={16} 
                                    color={badge.color} 
                                />
                            </Box>
                            <VStack className="flex-1">
                                <HStack className="items-baseline">
                                    <Text className="text-lg font-bold text-gray-900">
                                        {data?.contaminant}
                                    </Text>
                                    <Text className="text-lg font-bold text-gray-900 ml-1">
                                        {data?.value}
                                    </Text>
                                    <Text className="text-sm text-gray-500 ml-1">
                                        {getUnitByName(data?.contaminant)}
                                    </Text>
                                </HStack>
                                
                                {/* Location Information */}
                                <HStack className="items-center mt-2">
                                    <MaterialIcons name="location-on" size={14} color="#6b7280" />
                                    <Text className="text-sm text-gray-600 ml-1 font-medium">
                                        {locationInfo.name}
                                    </Text>
                                    {locationInfo.description && (
                                        <Text className="text-xs text-gray-400 ml-2">
                                            - {locationInfo.description}
                                        </Text>
                                    )}
                                </HStack>
                                
                            </VStack>
                        </HStack>

                        <VStack className="ml-11">
                            <HStack className="items-center mb-1">
                                <MaterialIcons name="schedule" size={14} color="#6b7280" />
                                <Text className="text-sm text-gray-500 ml-2">
                                    Created: {new Date(created_at).toLocaleDateString()} at {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </HStack>
                            {finished_at && (
                                <HStack className="items-center">
                                    <MaterialIcons name="check" size={14} color="#22c55e" />
                                    <Text className="text-sm text-gray-500 ml-2">
                                        Finished: {new Date(finished_at).toLocaleDateString()} at {new Date(finished_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </VStack>
                    
                    <Box className="items-end">
                        {status === 'pending' && (
                            <Pressable
                                onPress={() => confirmDelete(created_at)}
                                className="mb-2 w-10 h-10 items-center justify-center"
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <MaterialIcons name="delete" size={24} color="#ef4444" />
                            </Pressable>
                        )}
                        <Box
                            className="px-3 py-1 rounded-full"
                            style={{ backgroundColor: badge.color }}
                        >
                            <Text className="text-xs font-medium text-white">
                                {badge.label}
                            </Text>
                        </Box>
                    </Box>
                </HStack>
            </Box>
        );
    };

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
                    <Text className="text-2xl font-bold text-gray-900">History</Text>
                    <Pressable
                        onPress={() => {
                            if (router.canGoBack?.()) {
                                router.back();
                            } else {
                                router.push('/dashboard');
                            }
                        }}
                        className="w-8 h-8 items-center justify-center"
                    >
                        <MaterialIcons name="close" size={24} color="#6b7280" />
                    </Pressable>
                </HStack>
            </Box>

            {/* Tabs */}
            <Box className="bg-white px-6 pb-4">
                <Tabs
                    tabs={['all', 'pending', 'completed', 'error']}
                    selected={selectedTab}
                    onChange={setSelectedTab}
                />
            </Box>

            {/* Content */}
            <Box className="flex-1 px-6 pt-4">
                <FlatList
                    data={sortedData}
                    keyExtractor={(item: History) => item.created_at}
                    onRefresh={fetchHistory}
                    refreshing={refreshing}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={() => (
                        <Box className="items-center justify-center py-20">
                            <Box 
                                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                style={{ backgroundColor: '#f3f4f6' }}
                            >
                                <MaterialIcons name="history" size={32} color="#9ca3af" />
                            </Box>
                            <Text className="text-lg font-medium text-gray-500 text-center mb-2">
                                No readings found
                            </Text>
                            <Text className="text-sm text-gray-400 text-center">
                                Your history will appear here once you add readings
                            </Text>
                        </Box>
                    )}
                    renderItem={({ item }) => <HistoryCard item={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </Box>

            {/* Footer */}
            <Box className="bg-white px-6 py-4 border-t border-gray-200">
                <Text className="text-xs text-center text-gray-400">
                    Last synced: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </Box>
            </Box>
        </LinearGradient>
    );
}
