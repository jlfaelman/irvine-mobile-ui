import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';

export type TokenPayload = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    ref_company: number;
    ref_role: number;
    exp?: number;
};

export async function parseToken() {
    try {
        const token = await getToken();
        if(!token) throw "Invalid empty token.";
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export async function parseRefreshToken() {
    try {
        const token = await getRefreshToken();
        if(!token) throw "Invalid empty token.";
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export async function getRefreshToken() {
    const token =  await AsyncStorage.getItem('refreshToken');
    if(!token) return false;
    return token;
 }

export async function getToken(){
    const token =  await AsyncStorage.getItem('token');
    if(!token) return false;
    return token;
}

export  async function checkToken(){
    const token =  await AsyncStorage.getItem('token');
    if(!token) return false;
    return token;
}

export  function saveToken(token: string) {
    // Store raw token without prefix
    AsyncStorage.setItem('token', token);
    console.log('Token stored successfully')
    return true;
}
export  function saveRefreshToken(token: string) {
    // Store raw token without prefix
    AsyncStorage.setItem('refreshToken', token);
    console.log('Refresh token stored successfully')
    return true;
}

export async function clearTokens() {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        return true;
    } catch (e) {
        return false;
    }
}