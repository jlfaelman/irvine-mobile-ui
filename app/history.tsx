import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
    History
} from '@/src/interface/history';
import { clearHistory, getHistory } from '@/src/middleware/history';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
const statusBadge:any = {
    pending: { label: '⏳ Pending', color: '#facc15' },
    synced: { label: '✅ Synced', color: '#22c55e' },
    error: { label: '⚠️ Error', color: '#ef4444' },
};

export default function HistoryScreen() {
    const router = useRouter();
    const { contaminants } = useLocalSearchParams();
    const [c, setC] = useState(Array<any | null>)
    const [selectedTab, setSelectedTab] = useState('all');
    const [historyList, setHistoryList] = useState<History[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            setRefreshing(true);
            const history = await getHistory();
            setHistoryList(history || []);
        } catch (err) {
            Alert.alert('Error', 'Failed to load history.');
        } finally {
            setRefreshing(false);
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
        const parsed_c = JSON.parse(Array.isArray(contaminants) ? contaminants[0] : contaminants)
        setC(parsed_c)

    }, []);

    const filteredData =
        selectedTab === 'all'
            ? historyList
            : historyList.filter((item: History) => item?.status === selectedTab);

    return (
        <Box className="flex-1 bg-white px-4 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">History</Text>
                <Pressable
                    onPress={() => {
                        if (router.canGoBack?.()) {
                            router.back();
                        } else {
                            router.push('/dashboard');
                        }
                        // clearHistory();
                    }}
                >
                    <Text className="text-blue-600">Back</Text>
                </Pressable>
            </HStack>

            <Tabs
                tabs={['all', 'pending', 'synced', 'error']}
                selected={selectedTab}
                onChange={setSelectedTab}
            />

            <FlatList
                data={filteredData}
                keyExtractor={(item: History) => item.created_at} // or combine with ref_user if needed
                onRefresh={fetchHistory}
                refreshing={refreshing}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => {
                    const { data, status, created_at, finished_at }:any = item;


                    return (
                        <Box className="border-b border-gray-200 py-4">
                            <HStack className="justify-between items-center">
                                <VStack>
                                    <HStack className='gap-1 items-center'>
                                        <Text className="text-base font-semibold">
                                            {data?.contaminant} -
                                        </Text>
                                        <Text className="text-base font-semibold">
                                            {data?.value}
                                        </Text>
                                        <Text className="text-xs ">
                                            {getUnitByName(data?.contaminant)}
                                        </Text>
                                    </HStack>

                                    <Text className="text-sm text-gray-500">
                                        Created: {new Date(created_at).toLocaleString()}
                                    </Text>
                                    {finished_at && (
                                        <Text className="text-sm text-gray-400">
                                            Finished: {new Date(finished_at).toLocaleString()}
                                        </Text>
                                    )}
                                    {/* {typedData.source && (
                                        <Text className="text-sm text-gray-400">
                                            Source: {typedData.source}
                                        </Text>
                                    )} */}
                                </VStack>
                                <Box
                                    className="px-2 py-1 rounded-full"
                                    style={{ backgroundColor: statusBadge[status]?.color ?? '#9ca3af' }} // fallback gray
                                >
                                    <Text className="text-xs text-white">
                                        {statusBadge[status]?.label ?? status}
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    );
                }}
            />



            <Text className="text-xs text-center text-gray-400 mt-4">
                Last synced on May 19, 08:00 AM
            </Text>
        </Box>
    );
}
