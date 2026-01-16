/**
 * Unit tests for filters.js
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { toggleFilter } from '../js/filters.js';

// Mock document for filters.js
if (typeof document === 'undefined') {
    const mockElements = new Map();
    
    global.document = {
        querySelector: (selector) => {
            return mockElements.get(selector) || null;
        },
        querySelectorAll: (selector) => {
            const results = [];
            if (selector === '.legend-item') {
                // Return mock legend items for all types
                ['cafe', 'shop', 'roastery'].forEach(type => {
                    const element = {
                        getAttribute: (attr) => attr === 'data-type' ? type : null,
                        addEventListener: () => {},
                        classList: {
                            classes: new Set(),
                            add: function(className) { this.classes.add(className); },
                            remove: function(className) { this.classes.delete(className); },
                            contains: function(className) { return this.classes.has(className); }
                        }
                    };
                    mockElements.set(`.legend-item[data-type="${type}"]`, element);
                    results.push(element);
                });
            }
            return results;
        },
        _reset: () => {
            mockElements.clear();
        }
    };
}

describe('filters.js', () => {
    let updateMarkersCallCount;
    let updateMarkersCallback;
    let filterState;
    
    beforeEach(async () => {
        // Reset DOM mock
        document._reset?.();
        
        // Reset filter state
        const configModule = await import('../js/config.js');
        filterState = configModule.filterState;
        filterState.cafe = true;
        filterState.shop = true;
        filterState.roastery = true;
        
        // Reset callback
        updateMarkersCallCount = 0;
        updateMarkersCallback = () => { updateMarkersCallCount++; };
    });

    describe('toggleFilter', () => {
        test('should toggle filter state from true to false', () => {
            assert.strictEqual(filterState.cafe, true);
            
            toggleFilter('cafe', updateMarkersCallback);
            
            assert.strictEqual(filterState.cafe, false);
        });

        test('should toggle filter state from false to true', () => {
            filterState.cafe = false;
            
            toggleFilter('cafe', updateMarkersCallback);
            
            assert.strictEqual(filterState.cafe, true);
        });

        test('should call updateMarkers callback', () => {
            toggleFilter('cafe', updateMarkersCallback);
            
            assert.strictEqual(updateMarkersCallCount, 1);
        });

        test('should add disabled class when toggling off', () => {
            // Setup mock element
            const mockElement = {
                classList: {
                    classes: new Set(),
                    add: function(className) { this.classes.add(className); },
                    remove: function(className) { this.classes.delete(className); },
                    contains: function(className) { return this.classes.has(className); }
                }
            };
            const originalQuerySelector = document.querySelector;
            document.querySelector = (selector) => {
                if (selector === '.legend-item[data-type="cafe"]') {
                    return mockElement;
                }
                return originalQuerySelector.call(document, selector);
            };
            
            toggleFilter('cafe', updateMarkersCallback);
            
            assert.strictEqual(mockElement.classList.contains('disabled'), true);
            
            // Restore
            document.querySelector = originalQuerySelector;
        });

        test('should remove disabled class when toggling on', () => {
            filterState.cafe = false;
            
            // Setup mock element with disabled class
            const mockElement = {
                classList: {
                    classes: new Set(['disabled']),
                    add: function(className) { this.classes.add(className); },
                    remove: function(className) { this.classes.delete(className); },
                    contains: function(className) { return this.classes.has(className); }
                }
            };
            const originalQuerySelector = document.querySelector;
            document.querySelector = (selector) => {
                if (selector === '.legend-item[data-type="cafe"]') {
                    return mockElement;
                }
                return originalQuerySelector.call(document, selector);
            };
            
            toggleFilter('cafe', updateMarkersCallback);
            
            assert.strictEqual(mockElement.classList.contains('disabled'), false);
            
            // Restore
            document.querySelector = originalQuerySelector;
        });

        test('should handle toggling different location types', () => {
            toggleFilter('cafe', updateMarkersCallback);
            toggleFilter('shop', updateMarkersCallback);
            toggleFilter('roastery', updateMarkersCallback);
            
            assert.strictEqual(filterState.cafe, false);
            assert.strictEqual(filterState.shop, false);
            assert.strictEqual(filterState.roastery, false);
            assert.strictEqual(updateMarkersCallCount, 3);
        });

        test('should handle missing legend item gracefully', () => {
            // querySelector returns null
            const originalQuerySelector = document.querySelector;
            document.querySelector = () => null;
            
            // Should not throw
            toggleFilter('cafe', updateMarkersCallback);
            
            // Should still update filter state
            assert.strictEqual(filterState.cafe, false);
            
            // Restore
            document.querySelector = originalQuerySelector;
        });
    });
});
