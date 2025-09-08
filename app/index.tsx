import { Center } from '@/components/ui/center';
import { FormControl } from '@/components/ui/form-control';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { checkConnectionConfiguration } from '../src/middleware/configuration';
import showAlert from './screens/alert';
import LoadingScreen from './screens/loading';
const brand = require("../assets/images/ias_logo_black.png");



export default function ConnectionStringScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [apiUrl, setApiUrl] = useState('');
    useEffect(() => {
        const runInit = async () => {

            const isConfigured = await checkConnectionConfiguration()
            if (isConfigured) {
                router.push('/auth');
            } else setLoading(false);
        }
        runInit();
    }, [])
    const submitConnectionString = async () => {
        try {
            const url = (apiUrl || '').trim();
            if (!url || !/^https?:\/\//i.test(url)) {
                showAlert('Invalid API URL', 'Please enter a valid http(s) URL.');
                return;
            }
            await AsyncStorage.setItem('configuration_url', url);
            console.log("API URL saved. Setting configuration.");
            if (Platform.OS === "web") window.location.reload();
            else router.replace('/');
        } catch (e) {
            showAlert('Error', 'Failed to save configuration.');
        }
    };

    if (loading) return <LoadingScreen />;

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
                    <Text className="text-base font-semibold">API URL</Text>
                    <Input variant="outline" className="w-full">
                        <InputField
                            placeholder="Ex: https://my-api.example.com/api"
                            value={apiUrl}
                            onChangeText={setApiUrl}
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
