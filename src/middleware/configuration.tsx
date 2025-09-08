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
  // Fallback to env if no stored URL
  // Note: Only EXPO_PUBLIC_* are exposed to client
  return process.env.EXPO_PUBLIC_API_URL ?? null;
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