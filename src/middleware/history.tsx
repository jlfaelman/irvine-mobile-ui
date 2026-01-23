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
                console.error('No job provided');
                return false;
            }

            let newHistory: History = {
                ref_user: await getUserInformation('id'),
                data: job,
                status: 'pending',
                created_at: convertToUTC(new Date().toISOString()),
                finished_at: null
            }

            history.push(newHistory)
           
            await AsyncStorage.setItem('history', JSON.stringify(history));


        }
        else {
            let history: Array<any> = await getHistory();
            
            history.push(job)
            
            await AsyncStorage.setItem('history', JSON.stringify(history));
        }
        return true;
    } catch (error) {
        console.error('Error adding history:', error);
        return false;
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

export async function removeHistoryItem(created_at: string) {
    try {
        const raw = await AsyncStorage.getItem('history');
        const history: History[] = raw ? JSON.parse(raw) : [];

        // Find the item to remove so we can also remove any matching job entry
        const itemToRemove = history.find(h => h.created_at === created_at);

        const filtered = history.filter(h => h.created_at !== created_at);
        await AsyncStorage.setItem('history', JSON.stringify(filtered));

        // If the history item references a job id, remove it from the jobs queue as well
        try {
            const jobId = itemToRemove?.data?.id;
            if (jobId) {
                const jobsRaw = await AsyncStorage.getItem('jobs');
                const jobs = jobsRaw ? JSON.parse(jobsRaw) : [];
                const filteredJobs = jobs.filter((j: any) => j.id !== jobId);
                await AsyncStorage.setItem('jobs', JSON.stringify(filteredJobs));
            }

        } catch (innerError) {
            console.error('Error removing associated job:', innerError);
        }
        return true;
    } catch (error) {
        console.error('Error removing history item:', error);
        return false;
    }
}