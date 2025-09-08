import AsyncStorage from "@react-native-async-storage/async-storage";
import { DashboardInfo } from "../interface/dashboard";
import { getUserInformation } from "./auth";
import { getConfigURL } from "./configuration";
import { getToken } from "./jwt";

export async function fetchDashboard() {
    try {
        const API_URL = await getConfigURL();
        if(!API_URL) throw new Error('Missing configuration_url');
        const token = await getToken();
        const request = await fetch(API_URL + "/dashboard", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const dashboardInfo = await request.json();
        return dashboardInfo;
    } catch (error) {
        return error;
    }
}

export async function loadDashboardInfo(isSync:boolean = false) {
    const dashboardInfo = await AsyncStorage.getItem('dashboardInfo');

    if (!isSync && dashboardInfo) {
        return JSON.parse(dashboardInfo);
    } else {
        const firstName = await getUserInformation('firstname');
        const lastName = await getUserInformation('lastname');

        const result = await fetchDashboard();

        const dashboard:DashboardInfo = {
            firstName: firstName,
            lastName: lastName,
            locations: result?.dashboard?.locations,
            contaminants: result?.dashboard?.contaminants
        };

        saveDashboardInfo(dashboard);

        return dashboard;
    }

}

async function saveDashboardInfo(dashboard: DashboardInfo) {
    try {
        await AsyncStorage.setItem('dashboardInfo', JSON.stringify(dashboard));
        return true;
    } catch (error) {
        console.error("Error: " + error)
        return false;
    }
} 