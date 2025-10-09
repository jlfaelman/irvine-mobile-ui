import AsyncStorage from '@react-native-async-storage/async-storage';

export async function checkConnectionConfiguration() {
    const config_url = await AsyncStorage.getItem('configuration_url')
    return Boolean(config_url);
} 

export async function clearAllStorage() {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared.');
  } catch (e) {
    console.error('Failed to clear AsyncStorage:', e);
  }
};


export async function getConfigURL(){
  const url = await AsyncStorage.getItem('configuration_url');
  if (url) return url;
  // Fallback to config from app.config.ts
  const Constants = require('expo-constants');
  const extra = Constants.default?.expoConfig?.extra;
  return extra?.API_URL ?? 'https://abp-api.irvineas.com/api';
} 

export async function clearConfigURL(){
  try {
    await AsyncStorage.removeItem('configuration_url');
    console.log('Configuration URL cleared.');
    return true;
  } catch (e) {
    console.error('Failed to clear configuration URL:', e);
    return false;
  }
}