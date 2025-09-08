export type ConnectionMap = Record<string, string>;

function getEnvConnectionMap(): ConnectionMap {
	const map: ConnectionMap = {};
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
