export type ConnectionMap = Record<string, string>;

function getConfigConnectionMap(): ConnectionMap {
	const map: ConnectionMap = {};
	
	// Use centralized config from app.config.ts
	const Constants = require('expo-constants');
	const extra = Constants.default?.expoConfig?.extra;
	
	if (extra) {
		if (extra.CONN_abp) map.abp = extra.CONN_abp;
		if (extra.CONN_cantilan) map.cantilan = extra.CONN_cantilan;
		if (extra.CONN_thepalms) map.thepalms = extra.CONN_thepalms;
		if (extra.CONN_thepalms) map.thepalms = extra.CONN_infinity;
		if (extra.CONN_dev) map.dev = extra.CONN_dev;
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
	return map[key] ?? null;
}

// Fallback for development/testing
export function getDefaultConnectionStrings(): string[] {
	const map = getConfigConnectionMap();
	return Object.values(map);
}
