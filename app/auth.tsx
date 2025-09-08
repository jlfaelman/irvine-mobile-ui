import { Center } from '@/components/ui/center';
import { FormControl } from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getRefreshToken, getToken } from '@/src/middleware/jwt';
import language from '@/src/utils/language';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import authenticateUser from '../src/middleware/auth';
import { clearConfigURL } from '../src/middleware/configuration';
import useShowAlert from './screens/alert';

const brand = require("../assets/images/ias_logo_black.png");

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const showAlert = useShowAlert();

    useEffect(() => {
        const authUser = async () => {
            const token = await getToken();
            const refreshToken = await getRefreshToken();
            // check if token exists
            if (token && refreshToken) {
                router.push('/dashboard')
            }
        };

        authUser();
    }, [])

    const onAuthSubmit = async () => {

        const isAuthenticated = await authenticateUser(email, password)
        if (isAuthenticated) {
            showAlert(language.english.auth.alert.login_success.title, language.english.auth.alert.login_success.message);
            router.push('/dashboard');
        }
        else {
            showAlert(language.english.auth.alert.login_failed.title, language.english.auth.alert.login_failed.message);
        }

    }

    const onClearConnection = async () => {
        await clearConfigURL();
        router.replace('/');
    };

    return (
        <Center className="flex-1 bg-white">
            <VStack className="w-4/5 px-8 space-y-6" space="lg">
                <Image
                    source={brand}
                    alt="IAS Logo"
                    className="w-[500px] h-32 self-center"
                    resizeMode="contain"
                />

                <FormControl>
                    <Input variant="outline" className="w-full self-center">
                        <InputField value={email} onChangeText={setEmail} placeholder={language.english.auth.placeholder.email} />
                    </Input>
                </FormControl>

                <FormControl>
                    <Input variant="outline" className="w-full self-center">
                        <InputField value={password} onChangeText={setPassword} placeholder={language.english.auth.placeholder.password} type="password" />
                    </Input>
                </FormControl>



                {/* Login Button */}
                <Pressable
                    onPress={onAuthSubmit}
                    className="bg-blue-500 py-2 px-5 rounded-md items-center"
                >
                    <Text className="text-white font-bold">{language.english.auth.button.submit}</Text>
                </Pressable>

                {/* Remember Me & Forgot Password */}
                <HStack className="justify-between flex flex-col gap-5 items-center w-full">
                    {/* <Checkbox
                        value={rememberMe}
                        isChecked={rememberMe}
                        onChange={setRememberMe}
                        className="flex-row items-center"
                    >
                        <CheckboxIndicator>
                            <CheckboxIcon />
                        </CheckboxIndicator>
                        <CheckboxLabel className="ml-2 text-sm">Remember Me?</CheckboxLabel>
                    </Checkbox> */}
                    <Pressable>
                        <Text className="text-sm text-blue-600 font-medium">{language.english.auth.button.forgot_password}</Text>
                    </Pressable>
                    <Pressable onPress={onClearConnection}>
                        <Text className="text-sm text-red-600 font-medium">Clear Connection</Text>
                    </Pressable>

                </HStack>
            </VStack>
        </Center>
    );
}
