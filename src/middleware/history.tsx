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

            const firstname = await getUserInformation('firstname') ?? '';
            const lastname = await getUserInformation('lastname') ?? '';

            let newHistory: History = {
                ref_user: await getUserInformation('id'),
                data: job,
                status: 'pending',
                created_at: convertToUTC(new Date().toISOString()),
                finished_at: null,
                user_name: `${firstname} ${lastname}`.trim() || null
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
    const apiHistory: History[] = await fetchHistoryFromAPI();
    const localHistory: History[] = await getHistory();

    // Build a lookup of API items by the mobile-generated job id stored in data.id
    const apiById = new Map<string, History>();
    for (const h of apiHistory) {
        const jobId = h.data?.id;
        if (jobId != null) apiById.set(String(jobId), h);
    }

    // Update local items — only promote to a terminal status (completed/failed).
    // If the API says 'active' (still processing), keep the local 'pending' so it
    // stays visible in the history list (active items are filtered out of the UI).
    // Also carry forward user_name from the API item when available.
    const TERMINAL = new Set(['completed', 'failed']);
    const merged: History[] = localHistory.map(localItem => {
        const jobId = localItem.data?.id;
        if (jobId != null && apiById.has(String(jobId))) {
            const apiItem = apiById.get(String(jobId))!;
            if (TERMINAL.has(apiItem.status)) return apiItem;
            // Still processing — keep local status but update user_name if API has it
            return { ...localItem, user_name: apiItem.user_name ?? localItem.user_name };
        }
        return localItem;
    });

    // Add API items from other users / other devices not present locally
    for (const apiItem of apiHistory) {
        const jobId = apiItem.data?.id;
        const exists = jobId != null && merged.some(m => String(m.data?.id) === String(jobId));
        if (!exists && apiItem.status !== 'active') merged.push(apiItem);
    }

    await AsyncStorage.setItem('history', JSON.stringify(merged));
    console.log('History synced');
    return true;
}

export async function fetchHistoryFromAPI() {

    const API_URL = await getConfigURL();

    if(!API_URL) throw new Error('Missing configuration_url');

    const token = await getToken();
    const request = await fetch(API_URL + "/history/sync", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),

    });

    const response = await request.json();

    if (!response.history || !Array.isArray(response.history)) return [];
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