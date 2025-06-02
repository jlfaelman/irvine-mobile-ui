import { Center } from '@/components/ui/center';
import { FormControl } from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import authenticateUser from '../src/middleware/auth';
import showAlert from './screens/alert';

const brand = require("../assets/images/ias_logo_black.png");

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const onAuthSubmit = async () => {
        const isAuthenticated = await authenticateUser(email,password)
        if (isAuthenticated) showAlert("Authentication Successful","User Logged In successfully");
        else showAlert("Authentication Failed","Invalid Credentials");

    }

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
                        <InputField value={email} onChangeText={setEmail} placeholder="Email" />
                    </Input>
                </FormControl>

                <FormControl>
                    <Input variant="outline" className="w-full self-center">
                        <InputField value={password} onChangeText={setPassword} placeholder="Password" type="password" />
                    </Input>
                </FormControl>



                {/* Login Button */}
                <Pressable
                    onPress={onAuthSubmit}
                    className="bg-blue-500 py-2 px-5 rounded-md items-center"
                >
                    <Text className="text-white font-bold">Login</Text>
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
                        <Text className="text-sm text-blue-600 font-medium">Forgot Password?</Text>
                    </Pressable>
                </HStack>
            </VStack>
        </Center>
    );
}
