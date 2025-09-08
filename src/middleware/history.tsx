import AsyncStorage from "@react-native-async-storage/async-storage";
import { History } from "../interface/history";
import { convertToUTC } from "../utils/timestamp";
import { getUserInformation } from "./auth";
import { getConfigURL } from "./configuration";
import { getToken } from "./jwt";

// for adding new history
export async function addHistory(job: object | History, isNew: boolean = false) {
    try {
        if (isNew) {
            let history: Array<History> = await getHistory();

            if (!job) {
                throw new Error('No job provided');
            }

            let newHistory: History = {
                ref_user: await getUserInformation('id'),
                data: job,
                status: 'pending',
                created_at: convertToUTC(new Date().toISOString()),
                finished_at: null
            }

            history.push(newHistory)
           
            AsyncStorage.setItem('history', JSON.stringify(history));


        }
        else {
            let history: Array<any> = await getHistory();
            
            history.push(job)
            
            AsyncStorage.setItem('history', JSON.stringify(history));
        }
        return true;
    } catch (error) {
        console.log(error);

        throw new Error('Error on adding history');
    }

}

// for updating status
export async function syncHistory() {
    const history: History[] = await fetchHistoryFromAPI();

    await clearHistory();

    for (const h of history) {

        await addHistory(h, false);

    }

    console.log('History synced')
    return true;
}

export async function fetchHistoryFromAPI() {

    const API_URL = await getConfigURL();

    const ref_user = await getUserInformation('id');

    if(!API_URL) throw new Error('Missing configuration_url');

    const token = await getToken();
    const request = await fetch(API_URL + "/history/sync", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            ref_user: ref_user,

        }),

    });

    const response = await request.json();

    return response.history;
}

export async function clearHistory() {
    await AsyncStorage.removeItem('history');
    console.log('History cleared')
}

export async function getHistory() {

    const history = await AsyncStorage.getItem('history');

    return history ? JSON.parse(history) : [];
}