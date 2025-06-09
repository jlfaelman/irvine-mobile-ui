import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { DashboardInfo } from '@/src/interface/dashboard';
import English from '@/src/language/english';
import { loadDashboardInfo } from '@/src/middleware/dashboard';
import { checkToken, getRefreshToken, getToken } from '@/src/middleware/jwt';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, useWindowDimensions, View } from 'react-native';
import showAlert from './screens/alert';
import Header from './screens/header';
import LoadingScreen from './screens/loading';

const items = [
    { name: English.dashboard.buttons.reading, icon: 'add', route: '/reading' },
    { name: English.dashboard.buttons.history, icon: 'history', route: '/history' },
    { name: English.dashboard.buttons.tips, icon: 'lightbulb', route: '/tips' },
    { name: English.dashboard.buttons.sync, icon: 'settings', route: '/settings' },
];



export default function DashboardScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isUserAuth, setIsUserAuth] = useState(true);
    const { width } = useWindowDimensions();
    const [selectedValue, setSelectedValue] = useState('');
    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>(null);
    const iconSize = width >= 1024 ? 60 : width >= 768 ? 50 : 40;
    const router = useRouter();

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

            const dashboardData = await loadDashboardInfo();
            setDashboardInfo(dashboardData);
            if (token) setIsLoading(false);

        };

        authUser();
        loadDashboard();
    }, []);

    const syncDashboard = async () => {

        // check if user is online first
        if(await loadDashboardInfo(true)){
            console.log('dashboard reloaded');
        }
    }




    if (isLoading) return <LoadingScreen message='Logged In successfully. Loading Dashboard for you.' />
    else return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Header />

                {/* Title + Sync */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text className="text-3xl font-semibold">Home</Text>
                    <Pressable onPress={syncDashboard} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                        <MaterialIcons name="sync" size={28} color="#3b82f6" />
                        <Text className="text-blue-600 font-medium" >Sync Locally</Text>
                    </Pressable>
                </View>

                {/* Dropdown */}
                <Box className="w-full mb-6">
                    <Select
                        selectedValue={selectedValue}
                        onValueChange={(value) => setSelectedValue(value)}
                    >
                        <SelectTrigger className="border border-gray-300 bg-white rounded-lg pr-4 py-3">
                            <SelectInput
                                placeholder="Select Location"
                                className="text-base font-semibold"
                            />
                            <SelectIcon
                                as={MaterialIcons}
                                name="keyboard-arrow-down"
                                size="md"
                                color="$textDark800"
                            />
                        </SelectTrigger>

                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>

                                {dashboardInfo?.locations?.length ? (
                                    dashboardInfo.locations.map(loc => (
                                        <SelectItem key={loc.id} label={loc.name} value={JSON.stringify(loc)} />
                                    ))
                                ) : (
                                    <SelectItem label="No locations found" value="none" isDisabled />
                                )}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </Box>
                {/* Grid Layout */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {items.map((label, idx) => (
                        <Pressable
                            onPress={() => {
                                // validate the location is not empty
                                if (label.route === '/reading' && selectedValue === "__GluestackPlaceholder__" || selectedValue === "") {
                                    showAlert("Invalid Location", "Please choose a valid location first");
                                }
                                else {
                                    router.push({
                                        pathname: label.route,
                                        params: {
                                            parameters: selectedValue,
                                            contaminants:JSON.stringify(dashboardInfo?.contaminants),
                                            from: "dashboard"
                                        }
                                    })
                                }

                            }}
                            key={idx}
                            className="w-[48%] aspect-square bg-white p-5 rounded-md mb-4 items-center justify-center border border-gray-300"
                            style={{
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 3,
                            }}
                        >
                            <MaterialIcons name={label.icon || 'help'} size={iconSize} color="#3b82f6" />
                            <Text className="text-lg mt-2 text-center">{label.name}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
