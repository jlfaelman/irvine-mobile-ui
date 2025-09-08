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
import { getDBConfig } from '../src/utils/configuration';
import showAlert from './screens/alert';
import LoadingScreen from './screens/loading';
const brand = require("../assets/images/ias_logo_black.png");



export default function ConnectionStringScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [connectionString, setConnectionString] = useState('');
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
        const config = getDBConfig(connectionString);
        if (!config) {
            showAlert('Invalid Connection String', 'The connection string you entered is not recognized.');
            return;

        }
        AsyncStorage.setItem('configuration_url', config.URL);
        AsyncStorage.setItem('configuration_secret', config.SECRET_KEY);
        console.log("Connection String valid. Setting configuration.");

        if (Platform.OS === "web") window.location.reload();
        else router.replace('/');
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
