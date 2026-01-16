/**
 * Unit tests for favorites.js
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { loadFavorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } from '../js/favorites.js';

// Mock localStorage for Node.js environment
const mockStorage = {};
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; },
        clear: () => {
            for (const key in mockStorage) {
                delete mockStorage[key];
            }
        }
    };
}

// Mock window for event dispatching
if (typeof window === 'undefined') {
    const events = {};
    global.window = {
        dispatchEvent: (event) => {
            // Store event for verification
            events[event.type] = event;
        },
        _getLastEvent: (type) => events[type]
    };
}

describe('favorites.js', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('loadFavorites', () => {
        test('should return empty array when no favorites exist', () => {
            const favorites = loadFavorites();
            assert.deepStrictEqual(favorites, []);
        });

        test('should load favorites from localStorage', () => {
            const testFavorites = [
                { id: 1, type: 'node', tags: { name: 'Test Cafe' } }
            ];
            localStorage.setItem('osmCoffeeFavorites', JSON.stringify(testFavorites));
            
            const favorites = loadFavorites();
            assert.deepStrictEqual(favorites, testFavorites);
        });

        test('should return empty array on JSON parse error', () => {
            localStorage.setItem('osmCoffeeFavorites', 'invalid json');
            
            const favorites = loadFavorites();
            assert.deepStrictEqual(favorites, []);
        });
    });

    describe('addFavorite', () => {
        test('should add a favorite to empty list', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 1);
            assert.deepStrictEqual(favorites[0], element);
        });

        test('should add multiple favorites', () => {
            const element1 = { id: 1, type: 'node', tags: { name: 'Cafe 1' } };
            const element2 = { id: 2, type: 'node', tags: { name: 'Cafe 2' } };
            
            addFavorite(element1);
            addFavorite(element2);
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 2);
        });

        test('should not add duplicate favorite', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            
            addFavorite(element);
            addFavorite(element); // Try to add again
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 1);
        });

        test('should dispatch favoritesChanged event', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            const lastEvent = window._getLastEvent('favoritesChanged');
            assert.ok(lastEvent, 'Event should be dispatched');
        });

        test('should distinguish between different types with same id', () => {
            const element1 = { id: 1, type: 'node', tags: { name: 'Cafe' } };
            const element2 = { id: 1, type: 'way', tags: { name: 'Cafe' } };
            
            addFavorite(element1);
            addFavorite(element2);
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 2);
        });
    });

    describe('removeFavorite', () => {
        test('should remove an existing favorite', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            removeFavorite(element);
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 0);
        });

        test('should only remove matching favorite', () => {
            const element1 = { id: 1, type: 'node', tags: { name: 'Cafe 1' } };
            const element2 = { id: 2, type: 'node', tags: { name: 'Cafe 2' } };
            
            addFavorite(element1);
            addFavorite(element2);
            removeFavorite(element1);
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 1);
            assert.strictEqual(favorites[0].id, 2);
        });

        test('should dispatch favoritesChanged event', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            removeFavorite(element);
            
            const lastEvent = window._getLastEvent('favoritesChanged');
            assert.ok(lastEvent, 'Event should be dispatched');
        });

        test('should handle removing non-existent favorite', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            
            removeFavorite(element); // Should not throw
            
            const favorites = loadFavorites();
            assert.strictEqual(favorites.length, 0);
        });
    });

    describe('isFavorite', () => {
        test('should return false for non-favorited element', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            
            const result = isFavorite(element);
            assert.strictEqual(result, false);
        });

        test('should return true for favorited element', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            const result = isFavorite(element);
            assert.strictEqual(result, true);
        });

        test('should distinguish between types', () => {
            const element1 = { id: 1, type: 'node', tags: { name: 'Cafe' } };
            const element2 = { id: 1, type: 'way', tags: { name: 'Cafe' } };
            
            addFavorite(element1);
            
            assert.strictEqual(isFavorite(element1), true);
            assert.strictEqual(isFavorite(element2), false);
        });
    });

    describe('toggleFavorite', () => {
        test('should add favorite when not already favorited', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            
            const result = toggleFavorite(element);
            
            assert.strictEqual(result, true);
            assert.strictEqual(isFavorite(element), true);
        });

        test('should remove favorite when already favorited', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            addFavorite(element);
            
            const result = toggleFavorite(element);
            
            assert.strictEqual(result, false);
            assert.strictEqual(isFavorite(element), false);
        });

        test('should toggle multiple times correctly', () => {
            const element = { id: 1, type: 'node', tags: { name: 'Test Cafe' } };
            
            toggleFavorite(element); // Add
            assert.strictEqual(isFavorite(element), true);
            
            toggleFavorite(element); // Remove
            assert.strictEqual(isFavorite(element), false);
            
            toggleFavorite(element); // Add again
            assert.strictEqual(isFavorite(element), true);
        });
    });
});
