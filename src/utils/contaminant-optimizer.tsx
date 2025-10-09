import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OptimizedContaminant {
    id: number;
    key: string;
    name: string;
    units: string;
    access_tags?: string;
    type?: string;
    description?: string;
    priority?: number; // Higher number = more commonly used
    lastUsed?: number; // Timestamp of last usage
}

export interface ContaminantCache {
    contaminants: OptimizedContaminant[];
    lastUpdated: number;
    version: string;
}

const CACHE_KEY = 'contaminant_cache';
const CACHE_VERSION = '1.0';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Smart contaminant caching and optimization
 */
export class ContaminantOptimizer {
    private static instance: ContaminantOptimizer;
    private cache: ContaminantCache | null = null;

    static getInstance(): ContaminantOptimizer {
        if (!ContaminantOptimizer.instance) {
            ContaminantOptimizer.instance = new ContaminantOptimizer();
        }
        return ContaminantOptimizer.instance;
    }

    /**
     * Get optimized contaminants with smart caching
     */
    async getOptimizedContaminants(allContaminants: OptimizedContaminant[]): Promise<OptimizedContaminant[]> {
        try {
            // Try to load from cache first
            const cached = await this.loadFromCache();
            
            if (cached && this.isCacheValid(cached)) {
                // Update usage statistics
                await this.updateUsageStats(cached.contaminants);
                return cached.contaminants;
            }

            // Cache is invalid or doesn't exist, create optimized list
            const optimized = await this.optimizeContaminants(allContaminants);
            
            // Save to cache
            await this.saveToCache(optimized);
            
            return optimized;
        } catch (error) {
            console.error('Error optimizing contaminants:', error);
            // Fallback to original list
            return allContaminants;
        }
    }

    /**
     * Get frequently used contaminants (top 50)
     */
    async getFrequentContaminants(): Promise<OptimizedContaminant[]> {
        const cached = await this.loadFromCache();
        if (cached) {
            return cached.contaminants
                .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                .slice(0, 50);
        }
        return [];
    }

    /**
     * Search contaminants with optimized filtering
     */
    async searchContaminants(query: string, limit: number = 100): Promise<OptimizedContaminant[]> {
        const cached = await this.loadFromCache();
        if (!cached) return [];

        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return cached.contaminants.slice(0, limit);

        return cached.contaminants
            .filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                (item.type && item.type.toLowerCase().includes(searchTerm))
            )
            .sort((a, b) => {
                // Prioritize exact matches and frequently used items
                const aExact = a.name.toLowerCase() === searchTerm ? 1000 : 0;
                const bExact = b.name.toLowerCase() === searchTerm ? 1000 : 0;
                const aPriority = a.priority || 0;
                const bPriority = b.priority || 0;
                
                return (bExact + bPriority) - (aExact + aPriority);
            })
            .slice(0, limit);
    }

    /**
     * Update usage statistics when a contaminant is selected
     */
    async recordUsage(contaminantId: number): Promise<void> {
        try {
            const cached = await this.loadFromCache();
            if (cached) {
                const contaminant = cached.contaminants.find(c => c.id === contaminantId);
                if (contaminant) {
                    contaminant.lastUsed = Date.now();
                    contaminant.priority = (contaminant.priority || 0) + 1;
                    await this.saveToCache(cached.contaminants);
                }
            }
        } catch (error) {
            console.error('Error recording usage:', error);
        }
    }

    /**
     * Clear cache and force refresh
     */
    async clearCache(): Promise<void> {
        try {
            await AsyncStorage.removeItem(CACHE_KEY);
            this.cache = null;
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    private async loadFromCache(): Promise<ContaminantCache | null> {
        if (this.cache) return this.cache;

        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                this.cache = JSON.parse(cached);
                return this.cache;
            }
        } catch (error) {
            console.error('Error loading cache:', error);
        }
        
        return null;
    }

    private async saveToCache(contaminants: OptimizedContaminant[]): Promise<void> {
        try {
            const cache: ContaminantCache = {
                contaminants,
                lastUpdated: Date.now(),
                version: CACHE_VERSION
            };
            
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            this.cache = cache;
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }

    private isCacheValid(cache: ContaminantCache): boolean {
        const now = Date.now();
        const age = now - cache.lastUpdated;
        return age < CACHE_DURATION && cache.version === CACHE_VERSION;
    }

    private async optimizeContaminants(contaminants: OptimizedContaminant[]): Promise<OptimizedContaminant[]> {
        // Add priority based on common patterns
        return contaminants.map(contaminant => ({
            ...contaminant,
            priority: this.calculatePriority(contaminant),
            lastUsed: 0
        }));
    }

    private calculatePriority(contaminant: OptimizedContaminant): number {
        let priority = 0;
        
        // Common water quality parameters get higher priority
        const commonTerms = ['ph', 'temperature', 'turbidity', 'chlorine', 'bacteria', 'coliform'];
        const name = contaminant.name.toLowerCase();
        
        commonTerms.forEach(term => {
            if (name.includes(term)) priority += 10;
        });

        // Shorter names (likely more common) get slight priority
        if (name.length < 20) priority += 2;
        
        // Type-based priority
        if (contaminant.type === 'chemical') priority += 5;
        if (contaminant.type === 'biological') priority += 3;
        
        return priority;
    }

    private async updateUsageStats(contaminants: OptimizedContaminant[]): Promise<void> {
        // This could be expanded to track more sophisticated usage patterns
        // For now, we'll just ensure the cache is marked as recently accessed
        try {
            const cached = await this.loadFromCache();
            if (cached) {
                cached.lastUpdated = Date.now();
                await this.saveToCache(cached.contaminants);
            }
        } catch (error) {
            console.error('Error updating usage stats:', error);
        }
    }
}

// Export singleton instance
export const contaminantOptimizer = ContaminantOptimizer.getInstance();

