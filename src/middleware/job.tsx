import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createJob(newJob?: any) {
    try {
        if (!newJob) {
            throw new Error('No job provided');
        }
        const jobs = await getJobs();

        jobs.push(newJob)

        AsyncStorage.setItem('jobs', JSON.stringify(jobs));

    } catch (error) {
        console.log(error);

        throw new Error('Error on creating job');


    }
}

export async function getJobs() {
    const jobs = await AsyncStorage.getItem('jobs');

    return jobs ? JSON.parse(jobs) : [];
}

export async function clearJob() {
    await AsyncStorage.removeItem('jobs');
}
export function syncJobs() {

}