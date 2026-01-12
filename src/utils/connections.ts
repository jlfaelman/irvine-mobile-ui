export type ConnectionMap = Record<string, string>;

function getConfigConnectionMap(): ConnectionMap {
	const map: ConnectionMap = {};
	
	// Use centralized config from app.config.ts
	const Constants = require('expo-constants');
	// Try multiple ways to access constants (for compatibility)
	const extra = Constants.default?.expoConfig?.extra || 
	              Constants.expoConfig?.extra || 
	              Constants.manifest?.extra;
	
	if (extra) {
		if (extra.CONN_abp) map.abp = extra.CONN_abp;
		if (extra.CONN_cantilan) map.cantilan = extra.CONN_cantilan;
		if (extra.CONN_thepalms) map.thepalms = extra.CONN_thepalms;
		if (extra.CONN_infinity) map.infinity = extra.CONN_infinity;
		if (extra.CONN_dev) map.dev = extra.CONN_dev;
	}
	
	// Debug logging (only in development)
	if (__DEV__) {
		console.log('Connection map loaded:', Object.keys(map));
		console.log('Infinity connection:', map.infinity);
	}
	
	return map;
}

export function getUrlForConnectionString(input: string): string | null {
	if (!input) return null;
	const trimmed = input.trim();
	// If user entered a full URL, accept it directly
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	// Otherwise, resolve from config
	const map = getConfigConnectionMap();
	const key = trimmed.toLowerCase();
	const result = map[key] ?? null;
	
	// Debug logging (only in development)
	if (__DEV__) {
		console.log('Resolving connection string:', { input, key, result, availableKeys: Object.keys(map) });
	}
	
	return result;
}

// Fallback for development/testing
export function getDefaultConnectionStrings(): string[] {
	const map = getConfigConnectionMap();
	return Object.values(map);
}
