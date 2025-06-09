import AsyncStorage from "@react-native-async-storage/async-storage";
import { DashboardInfo } from "../interface/dashboard";
import { getUserInformation } from "./auth";
import { getToken } from "./jwt";

export async function fetchDashboard() {
    try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL;  // to be changed to use utils/configuration for handling environment variables
        const request = await fetch(API_URL + "/dashboard", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Berear ${getToken()}`,
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