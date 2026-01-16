/**
 * Unit tests for cache.js
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { getCacheKey, getFromCache, setCache, clearCache, getCacheStats } from '../js/cache.js';

// Mock config
const mockConfig = {
    CACHE_TTL: 1000, // 1 second for testing
    CACHE_MAX_SIZE: 5
};

// Import and override CONFIG for testing
import * as configModule from '../js/config.js';
Object.assign(configModule.CONFIG, mockConfig);

describe('cache.js', () => {
    beforeEach(() => {
        clearCache();
    });

    describe('getCacheKey', () => {
        test('should generate consistent keys for same bounds and filters', () => {
            const bounds = {
                getSouth: () => 48.8566,
                getWest: () => 2.3522,
                getNorth: () => 48.8666,
                getEast: () => 2.3622
            };
            const filters = { cafe: true, shop: true, roastery: false };
            
            const key1 = getCacheKey(bounds, filters);
            const key2 = getCacheKey(bounds, filters);
            
            assert.strictEqual(key1, key2);
        });

        test('should generate different keys for different bounds', () => {
            const bounds1 = {
                getSouth: () => 48.8566,
                getWest: () => 2.3522,
                getNorth: () => 48.8666,
                getEast: () => 2.3622
            };
            const bounds2 = {
                getSouth: () => 48.9566,
                getWest: () => 2.3522,
                getNorth: () => 48.9666,
                getEast: () => 2.3622
            };
            const filters = { cafe: true, shop: true, roastery: true };
            
            const key1 = getCacheKey(bounds1, filters);
            const key2 = getCacheKey(bounds2, filters);
            
            assert.notStrictEqual(key1, key2);
        });

        test('should generate different keys for different filters', () => {
            const bounds = {
                getSouth: () => 48.8566,
                getWest: () => 2.3522,
                getNorth: () => 48.8666,
                getEast: () => 2.3622
            };
            const filters1 = { cafe: true, shop: true, roastery: false };
            const filters2 = { cafe: true, shop: false, roastery: false };
            
            const key1 = getCacheKey(bounds, filters1);
            const key2 = getCacheKey(bounds, filters2);
            
            assert.notStrictEqual(key1, key2);
        });

        test('should round coordinates to 3 decimal places', () => {
            const bounds = {
                getSouth: () => 48.856612345,
                getWest: () => 2.352298765,
                getNorth: () => 48.866612345,
                getEast: () => 2.362298765
            };
            const filters = { cafe: true, shop: true, roastery: true };
            
            const key = getCacheKey(bounds, filters);
            
            // Should contain rounded coordinates
            assert.ok(key.includes('48.857'));
            assert.ok(key.includes('2.352'));
        });

        test('should sort filter keys consistently', () => {
            const bounds = {
                getSouth: () => 48.8566,
                getWest: () => 2.3522,
                getNorth: () => 48.8666,
                getEast: () => 2.3622
            };
            // Filters with different object property order
            const filters1 = { roastery: true, cafe: true, shop: true };
            const filters2 = { cafe: true, shop: true, roastery: true };
            
            const key1 = getCacheKey(bounds, filters1);
            const key2 = getCacheKey(bounds, filters2);
            
            assert.strictEqual(key1, key2);
        });
    });

    describe('setCache and getFromCache', () => {
        test('should store and retrieve data', () => {
            const key = 'test-key';
            const data = [{ id: 1, name: 'Cafe' }];
            
            setCache(key, data);
            const retrieved = getFromCache(key);
            
            assert.deepStrictEqual(retrieved, data);
        });

        test('should return null for non-existent key', () => {
            const retrieved = getFromCache('non-existent-key');
            assert.strictEqual(retrieved, null);
        });

        test('should return null for expired entries', async () => {
            const key = 'test-key';
            const data = [{ id: 1, name: 'Cafe' }];
            
            setCache(key, data);
            
            // Wait for cache to expire (TTL is 1 second in test config)
            await new Promise(resolve => setTimeout(resolve, 1100));
            
            const retrieved = getFromCache(key);
            assert.strictEqual(retrieved, null);
        });

        test('should handle multiple cache entries', () => {
            const data1 = [{ id: 1 }];
            const data2 = [{ id: 2 }];
            const data3 = [{ id: 3 }];
            
            setCache('key1', data1);
            setCache('key2', data2);
            setCache('key3', data3);
            
            assert.deepStrictEqual(getFromCache('key1'), data1);
            assert.deepStrictEqual(getFromCache('key2'), data2);
            assert.deepStrictEqual(getFromCache('key3'), data3);
        });

        test('should limit cache size to CACHE_MAX_SIZE', () => {
            // Add more entries than max size
            for (let i = 0; i < 10; i++) {
                setCache(`key${i}`, [{ id: i }]);
            }
            
            const stats = getCacheStats();
            assert.ok(stats.totalEntries <= mockConfig.CACHE_MAX_SIZE);
        });
    });

    describe('clearCache', () => {
        test('should remove all cache entries', () => {
            setCache('key1', [{ id: 1 }]);
            setCache('key2', [{ id: 2 }]);
            
            clearCache();
            
            assert.strictEqual(getFromCache('key1'), null);
            assert.strictEqual(getFromCache('key2'), null);
            
            const stats = getCacheStats();
            assert.strictEqual(stats.totalEntries, 0);
        });
    });

    describe('getCacheStats', () => {
        test('should return correct statistics', () => {
            setCache('key1', [{ id: 1 }]);
            setCache('key2', [{ id: 2 }]);
            
            const stats = getCacheStats();
            
            assert.strictEqual(stats.totalEntries, 2);
            assert.strictEqual(stats.validEntries, 2);
            assert.strictEqual(stats.expiredEntries, 0);
            assert.strictEqual(stats.maxSize, mockConfig.CACHE_MAX_SIZE);
            assert.strictEqual(stats.ttl, mockConfig.CACHE_TTL);
        });

        test('should count expired entries correctly', async () => {
            setCache('key1', [{ id: 1 }]);
            
            // Wait for cache to expire
            await new Promise(resolve => setTimeout(resolve, 1100));
            
            setCache('key2', [{ id: 2 }]);
            
            const stats = getCacheStats();
            
            // After cleanup, expired entries are removed, so we should only have the valid entry
            assert.strictEqual(stats.totalEntries, 1);
            assert.strictEqual(stats.validEntries, 1);
            assert.strictEqual(stats.expiredEntries, 0);
        });
    });
});
