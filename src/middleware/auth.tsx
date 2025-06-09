import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseToken, saveRefreshToken, saveToken } from "./jwt";

export async function saveUserInformation() {
    const parsedToken = await parseToken();

    if (!parsedToken) return false;
    for (const [key, value] of Object.entries(parsedToken)) {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    }

    return true;
}

export async function getUserInformation(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value); 
        }
        return null;
    } catch (error) {
        return null;
    }
}

export default async function authenticateUser(email: string, password: string) {
    try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL;
        const isAuthenticated = await fetch(API_URL + "/auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })


        if (isAuthenticated?.status != 200) return false;
        else {
            const response = await isAuthenticated.json();

            const isTokenSaved = await saveToken(response?.token);
            const isRefreshTokenSaved = await saveRefreshToken(response?.token);
            const isInfoSaved = saveUserInformation();
            if (!isTokenSaved || !isRefreshTokenSaved || !isInfoSaved) return false;
            else return true;
        }
    } catch (error) {
        return error
    }
}