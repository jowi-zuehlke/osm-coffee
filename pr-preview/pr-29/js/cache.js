/**
 * Client-side caching for API responses
 */

import { CONFIG } from './config.js';

/**
 * Cache entry structure
 * @typedef {Object} CacheEntry
 * @property {Array} data - The cached data
 * @property {number} timestamp - When the data was cached
 */

/**
 * In-memory cache for API responses
 */
const cache = new Map();

/**
 * Normalizes a bounding box to a cache key
 * Rounds coordinates to reduce cache fragmentation while maintaining reasonable precision
 * @param {Object} bounds - Leaflet bounds object
 * @param {Object} filters - Filter state object
 * @returns {string} Normalized cache key
 */
export function getCacheKey(bounds, filters) {
    // Round to 3 decimal places (~111m precision) to group nearby requests
    const south = bounds.getSouth().toFixed(3);
    const west = bounds.getWest().toFixed(3);
    const north = bounds.getNorth().toFixed(3);
    const east = bounds.getEast().toFixed(3);
    
    // Include filter state in cache key
    const filterKey = Object.entries(filters)
        .filter(([_, enabled]) => enabled)
        .map(([type]) => type)
        .sort()
        .join(',');
    
    return `${south},${west},${north},${east}|${filterKey}`;
}

/**
 * Checks if a cache entry is still valid based on TTL
 * @param {CacheEntry} entry - The cache entry to check
 * @returns {boolean} True if the entry is still valid
 */
function isEntryValid(entry) {
    const now = Date.now();
    const age = now - entry.timestamp;
    return age < CONFIG.CACHE_TTL;
}

/**
 * Gets data from cache if available and valid
 * @param {string} key - Cache key
 * @returns {Array|null} Cached data or null if not found/expired
 */
export function getFromCache(key) {
    const entry = cache.get(key);
    
    if (!entry) {
        return null;
    }
    
    if (!isEntryValid(entry)) {
        cache.delete(key);
        return null;
    }
    
    console.log('Cache hit:', key);
    return entry.data;
}

/**
 * Stores data in cache
 * @param {string} key - Cache key
 * @param {Array} data - Data to cache
 */
export function setCache(key, data) {
    cache.set(key, {
        data: data,
        timestamp: Date.now()
    });
    
    // Cleanup old entries to prevent memory leaks
    cleanupCache();
}

/**
 * Clears all cache entries
 */
export function clearCache() {
    cache.clear();
    console.log('Cache cleared');
}

/**
 * Removes expired entries from cache
 * Limits cache size to prevent excessive memory usage
 */
function cleanupCache() {
    // Remove expired entries
    for (const [key, entry] of cache.entries()) {
        if (!isEntryValid(entry)) {
            cache.delete(key);
        }
    }
    
    // If cache is still too large, remove oldest entries
    if (cache.size > CONFIG.CACHE_MAX_SIZE) {
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        const toRemove = entries.slice(0, cache.size - CONFIG.CACHE_MAX_SIZE);
        toRemove.forEach(([key]) => cache.delete(key));
        
        console.log(`Cache cleanup: removed ${toRemove.length} old entries`);
    }
}

/**
 * Gets cache statistics for debugging
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const entry of cache.values()) {
        if (isEntryValid(entry)) {
            validEntries++;
        } else {
            expiredEntries++;
        }
    }
    
    return {
        totalEntries: cache.size,
        validEntries,
        expiredEntries,
        maxSize: CONFIG.CACHE_MAX_SIZE,
        ttl: CONFIG.CACHE_TTL
    };
}
