import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConfigURL } from "./configuration";
import { getRefreshToken, parseRefreshToken } from "./jwt";

export async function createJob(newJob?: any) {
    try {
        if (!newJob) {
            console.error('No job provided');
            return false;
        }
        const jobs = await getJobs();

        jobs.push(newJob)

        await AsyncStorage.setItem('jobs', JSON.stringify(jobs));

        return true;
    } catch (error) {
        console.error('Error creating job:', error);
        return false;
    }
}

export async function getJobs() {
    const jobs = await AsyncStorage.getItem('jobs');

    return jobs ? JSON.parse(jobs) : [];
}

export async function clearJob() {
    await AsyncStorage.removeItem('jobs');
    console.log('Jobs cleared')
}
export async function syncJobs() {
    try {
        const API_URL = await getConfigURL();
        const user = await parseRefreshToken()
        const jobs = await getJobs();
        if(!jobs || jobs.length <= 0) return false;
        const body = JSON.stringify({
            jobs: await getJobs(),
            sync_at: new Date().toISOString(),
            sync_by: user?.id,
        })
        const request = await fetch(API_URL + "/job/sync", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getRefreshToken()}`,
            },
            body:body,
        });
        // console.log(body)
        const jobsInfo = await request.json();
        await clearJob()
        return true
    } catch (error) {
        return error;
    }

}