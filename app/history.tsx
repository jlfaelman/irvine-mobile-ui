import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const mockData = [
    {
        id: '1',
        type: 'chlorine',
        value: '0.6',
        timestamp: 'May 19, 08:15 AM',
        source: 'Borehole A',
        status: 'pending',
    },
    {
        id: '2',
        type: 'turbidity',
        value: '3.2',
        timestamp: 'May 19, 07:50 AM',
        source: 'Borehole B',
        status: 'synced',
    },
    {
        id: '3',
        type: 'chlorine',
        value: '0.6',
        timestamp: 'May 18, 02:00 PM',
        source: 'Borehole A',
        status: 'error',
    },
];

const statusBadge = {
    pending: { label: '⏳ Pending', color: '#facc15' },
    synced: { label: '✅ Synced', color: '#22c55e' },
    error: { label: '⚠️ Error', color: '#ef4444' },
};

export default function HistoryScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('all');

    const filteredData =
        selectedTab === 'all' ? mockData : mockData.filter((item) => item.status === selectedTab);

    const renderRightActions = (item: any) => (
        <Pressable
            onPress={() => Alert.alert('Edit', `Edit ${item.type} reading`)}
            className="justify-center px-4"
        >
            <Text className="text-white">Edit</Text>
        </Pressable>
    );

    const renderLeftActions = (item: any) => (
        <HStack>
            {item.status === 'error' ? (
                <Pressable
                    onPress={() => Alert.alert('Retry', `Retry ${item.type} reading`)}
                    className="bg-yellow-500 justify-center px-4"
                >
                    <Text className="text-white">Retry</Text>
                </Pressable>
            ) : null}
            <Pressable
                onPress={() => Alert.alert('Deleted', `Deleted ${item.type} reading`)}
                className="bg-red-500 justify-center px-4"
            >
                <Text className="text-white">Delete</Text>
            </Pressable>
        </HStack>
    );

    return (
        <Box className="flex-1 bg-white px-4 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">History</Text>
                <Pressable onPress={ ()=>{router.back();} }>Back</Pressable>
            </HStack>


            <Tabs
                tabs={['all', 'pending', 'synced', 'error']}
                selected={selectedTab}
                onChange={setSelectedTab}
            />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Swipeable
                        renderLeftActions={() => renderLeftActions(item)}
                        renderRightActions={() => renderRightActions(item)}
                    >
                        <Box className="border-b border-gray-200 py-4">
                            <HStack className="justify-between items-center">
                                <VStack>
                                    <Text className="text-base font-semibold">
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} – {item.value} ppm
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        {item.timestamp} · {item.source}
                                    </Text>
                                </VStack>
                                <Box
                                    className="px-2 py-1 rounded-full"
                                    style={{ backgroundColor: statusBadge[item.status].color }}
                                >
                                    <Text className="text-xs text-white">
                                        {statusBadge[item.status].label}
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    </Swipeable>
                )}
            />

            <Text className="text-xs text-center text-gray-400 mt-4">
                Last synced on May 19, 08:00 AM
            </Text>
        </Box>
    );
}
