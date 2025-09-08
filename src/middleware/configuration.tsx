import AsyncStorage from '@react-native-async-storage/async-storage';

export async function checkConnectionConfiguration() {
    const config_url = await AsyncStorage.getItem('configuration_url')
    const config_secret =  await AsyncStorage.getItem('configuration_secret')
    return Boolean(config_url && config_secret);
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
  return await AsyncStorage.getItem('configuration_url');
} 