export type ConnectionMap = Record<string, string>;

function getEnvConnectionMap(): ConnectionMap {
	const map: ConnectionMap = {};
	
	// Try process.env first (development)
	const env = process.env as Record<string, string | undefined>;
	for (const key in env) {
		if (Object.prototype.hasOwnProperty.call(env, key)) {
			if (key.startsWith('EXPO_PUBLIC_CONN_')) {
				const shortKey = key.replace('EXPO_PUBLIC_CONN_', '').toLowerCase();
				const value = env[key];
				if (value) map[shortKey] = value;
			}
		}
	}
	
	// Fallback to Constants.expoConfig.extra (production builds)
	if (Object.keys(map).length === 0) {
		try {
			const Constants = require('expo-constants');
			const extra = Constants.default?.expoConfig?.extra;
			if (extra) {
				if (extra.CONN_abp) map.abp = extra.CONN_abp;
				if (extra.CONN_cantilan) map.cantilan = extra.CONN_cantilan;
				if (extra.CONN_thepalms) map.thepalms = extra.CONN_thepalms;
				if (extra.CONN_dev) map.dev = extra.CONN_dev;
			}
		} catch (e) {
			console.log('Constants not available:', e);
		}
	}
	
	return map;
}

export function getUrlForConnectionString(input: string): string | null {
	if (!input) return null;
	const trimmed = input.trim();
	// If user entered a full URL, accept it directly
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	// Otherwise, resolve from env map
	const map = getEnvConnectionMap();
	const key = trimmed.toLowerCase();
	return map[key] ?? null;
}

// Fallback for development/testing
export function getDefaultConnectionStrings(): string[] {
	return [
		'https://localhost:5000/api',
		'https://abp-api.irvineas.com',
		'https://cantilanwd-api.irvineas.com'
	];
}
