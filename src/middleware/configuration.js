import AsyncStorage from '@react-native-async-storage/async-storage';

export async function checkConnectionConfiguration() {
    const config_url = await AsyncStorage.getItem('configuration_url')
    const config_secret =  await AsyncStorage.getItem('configuration_secret')
    return !config_url && !config_secret ? false : true;
} 

export async function clearAllStorage() {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared.');
  } catch (e) {
    console.error('Failed to clear AsyncStorage:', e);
  }
};