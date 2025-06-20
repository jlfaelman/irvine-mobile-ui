import AsyncStorage from "@react-native-async-storage/async-storage";
import { History } from "../interface/history";
import { convertToUTC } from "../utils/timestamp";
import { getUserInformation } from "./auth";
import { getConfigURL } from "./configuration";

// for adding new history
export async function addHistory(job: object) {
    try {
        const URL = await getConfigURL();
        let history: Array<History> = await getHistory();

        if (!job) {
            throw new Error('No job provided');
        }
        let newHistory: History = {
            ref_user: await getUserInformation('id'),
            data: job,
            status: 'pending',
            created_at:convertToUTC(new Date().toISOString()),
            finished_at: null
        }
        history.push(newHistory)
        AsyncStorage.setItem('history', JSON.stringify(history));

        return true;
    } catch (error) {
        console.log(error);

        throw new Error('Error on adding history');
    }

}

// for updating status
export async function updateHistory() {

}

export async function clearHistory() {
    await AsyncStorage.removeItem('history');
    console.log('History cleared')
}

export async function getHistory() {
    const history = await AsyncStorage.getItem('history');

    return history ? JSON.parse(history) : [];
}