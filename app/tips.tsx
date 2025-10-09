import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Linking, ScrollView } from 'react-native';

export default function TipsScreen() {
    const router = useRouter();

    const tips = [
        {
            icon: 'save',
            title: 'Save Locally First',
            description: 'Always save readings locally before midday. This ensures everything syncs before end-of-day.',
            color: '#3b82f6'
        },
        {
            icon: 'gps-fixed',
            title: 'Use GPS for Accuracy',
            description: 'Enable GPS when taking readings to ensure precise location data for your measurements.',
            color: '#22c55e'
        },
        {
            icon: 'sync',
            title: 'Regular Sync',
            description: 'Sync your data regularly to keep your readings up-to-date and backed up on the server.',
            color: '#f59e0b'
        },
        {
            icon: 'check-circle',
            title: 'Verify Readings',
            description: 'Double-check your readings before saving to ensure data accuracy and quality.',
            color: '#10b981'
        },
        {
            icon: 'battery-full',
            title: 'Battery Management',
            description: 'Keep your device charged during field work to avoid losing unsaved data.',
            color: '#ef4444'
        }
    ];

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@irvineas.com?subject=Mobile App Support');
    };

    const handleOpenDocumentation = () => {
        Linking.openURL('https://docs.irvineas.com');
    };

    const TipCard = ({ tip }: { tip: typeof tips[0] }) => (
        <Box 
            className="p-4 rounded-lg mb-3"
            style={{
                backgroundColor: '#f8fafc',
                borderLeftWidth: 4,
                borderLeftColor: tip.color,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            <HStack className="items-start">
                <Box 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-1"
                    style={{ backgroundColor: tip.color + '20' }}
                >
                    <MaterialIcons name={tip.icon as any} size={20} color={tip.color} />
                </Box>
                <VStack className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                        {tip.title}
                    </Text>
                    <Text className="text-sm text-gray-600 leading-5">
                        {tip.description}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );

    const ActionButton = ({ icon, title, subtitle, onPress, color = '#3b82f6' }: {
        icon: string;
        title: string;
        subtitle: string;
        onPress: () => void;
        color?: string;
    }) => (
        <Pressable 
            onPress={onPress}
            className="flex-row items-center justify-between py-4 px-4 rounded-lg mb-3"
            style={{
                backgroundColor: '#f8fafc',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            <HStack className="items-center flex-1">
                <Box 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: color + '20' }}
                >
                    <MaterialIcons name={icon as any} size={20} color={color} />
                </Box>
                <VStack className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                        {title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                        {subtitle}
                    </Text>
                </VStack>
            </HStack>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
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
                    <Text className="text-2xl font-bold text-gray-900">Help & Tips</Text>
                    <Pressable 
                        onPress={() => router.back()}
                        className="w-8 h-8 items-center justify-center"
                    >
                        <MaterialIcons name="close" size={24} color="#6b7280" />
                    </Pressable>
                </HStack>
            </Box>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Quick Tips Section */}
                <VStack className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Tips</Text>
                    {tips.map((tip, index) => (
                        <TipCard key={index} tip={tip} />
                    ))}
                </VStack>

                {/* Help & Support Section */}
                <VStack className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Help & Support</Text>
                    <ActionButton
                        icon="email"
                        title="Contact Support"
                        subtitle="Get help with technical issues"
                        onPress={handleContactSupport}
                        color="#3b82f6"
                    />
                    <ActionButton
                        icon="book"
                        title="Documentation"
                        subtitle="Read the full user guide"
                        onPress={handleOpenDocumentation}
                        color="#8b5cf6"
                    />
                </VStack>

                {/* App Info */}
                <Box className="items-center py-8">
                    <Text className="text-sm text-gray-400 text-center">
                        Need more help? Contact our support team
                    </Text>
                    <Text className="text-xs text-gray-400 text-center mt-1">
                        support@irvineas.com
                    </Text>
                </Box>
            </ScrollView>
            </Box>
        </LinearGradient>
    );
}