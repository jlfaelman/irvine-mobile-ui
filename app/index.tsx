import { Center } from '@/components/ui/center';
import { FormControl } from '@/components/ui/form-control';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getUrlForConnectionString } from '@/src/utils/connections';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { checkConnectionConfiguration } from '../src/middleware/configuration';
import useShowAlert from './screens/alert';
import LoadingScreen from './screens/loading';
const brand = require("../assets/images/ias_logo_black.png");



export default function ConnectionStringScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [connectionString, setConnectionString] = useState('');
    const showAlert = useShowAlert();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const runInit = async () => {
            try {
                const isConfigured = await checkConnectionConfiguration()
                if (isConfigured) {
                    router.push('/auth');
                } else setLoading(false);
            } catch (e) {
                console.error('Init error:', e);
                setError('Failed to check configuration');
                setLoading(false);
            }
        }
        runInit();
    }, [])
    const submitConnectionString = async () => {
        try {
            setError(null);
            const key = (connectionString || '').trim();
            if (!key) {
                showAlert('Error', 'Please enter a connection string or URL');
                return;
            }
            const resolvedUrl = getUrlForConnectionString(key);
            if (!resolvedUrl) {
                showAlert('Invalid Connection String', 'The connection string you entered is not recognized.');
                return;
            }
            await AsyncStorage.setItem('configuration_url', resolvedUrl);
            console.log("Connection string resolved. Setting configuration.");
            if (Platform.OS === "web") window.location.reload();
            else router.replace('/');
        } catch (e) {
            console.error('Submit error:', e);
            showAlert('Error', 'Failed to save configuration.');
        }
    };

    if (loading) return <LoadingScreen />;
    if (error) {
        return (
            <Center className="flex-1 bg-white">
                <VStack className="w-4/5 px-8 space-y-4" space="lg">
                    <Text className="text-red-600 text-center">{error}</Text>
                    <Pressable onPress={() => setLoading(true)} className="bg-blue-500 py-2 px-5 rounded-md items-center">
                        <Text className="text-white font-bold">Retry</Text>
                    </Pressable>
                </VStack>
            </Center>
        );
    }

    return (
        <Center className="flex-1 bg-white">
            <VStack className="w-4/5 px-8 space-y-2" space="lg">
                <Image
                    source={brand}
                    alt="IAS Logo"
                    className="w-[400px] h-32 self-center"
                    resizeMode="contain"
                />

                <FormControl>
                    <Text className="text-base font-semibold">Connection String</Text>
                    <Input variant="outline" className="w-full">
                        <InputField
                            placeholder="Ex: sample-connection-string"
                            value={connectionString}
                            onChangeText={setConnectionString}
                        />
                    </Input>
                </FormControl>

                <Pressable
                    onPress={submitConnectionString}
                    className="bg-blue-500 py-2 px-5 rounded-md items-center"
                >
                    <Text className="text-white font-bold">Verify Connection String</Text>
                </Pressable>
            </VStack>
        </Center>
    );
}
