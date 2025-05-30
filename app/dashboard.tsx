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
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, useWindowDimensions, View } from 'react-native';

const items = [
    { name: 'Add Reading', icon: 'add', route: '/reading' },
    { name: 'History', icon: 'history', route: '/history' },
    { name: 'Tips', icon: 'lightbulb', route: '/tips' },
    { name: 'Sync Settings', icon: 'settings', route: '/settings' },
];

export default function DashboardScreen() {
    const { width } = useWindowDimensions();
    const iconSize = width >= 1024 ? 60 : width >= 768 ? 50 : 40;
    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Top Bar */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialIcons name="account-circle" color="#3b82f6" size={32} />
                        <Text className="font-semibold">Jose Faelman</Text>
                    </Pressable>
                </View>

                {/* Title + Sync */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text className="text-3xl font-semibold">Home</Text>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                        <MaterialIcons name="sync" size={28} color="#3b82f6" />
                        <Text className="text-blue-600 font-medium">Sync Locally</Text>
                    </Pressable>
                </View>

                {/* Dropdown */}
                <Box className="w-full mb-6">
                    <Select>
                        <SelectTrigger className="border border-gray-300 bg-white rounded-lg pr-4 py-3">
                            <SelectInput placeholder="Select Borehole" className="text-base font-semibold" />
                            <SelectIcon as={MaterialIcons} name="keyboard-arrow-down" size={20} color="#000" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="Borehole A" value="a" />
                                <SelectItem label="Borehole B" value="b" />
                                <SelectItem label="Borehole C" value="c" />
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </Box>

                {/* Grid Layout */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {items.map((label, idx) => (
                        <Pressable
                            onPress={() => { 
                                router.push(label.route) 
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
