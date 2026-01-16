/**
 * Unit tests for api.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getElementCoordinates } from '../js/api.js';

describe('api.js', () => {
    describe('getElementCoordinates', () => {
        test('should extract coordinates from node type element', () => {
            const element = {
                type: 'node',
                lat: 48.8566,
                lon: 2.3522
            };
            
            const result = getElementCoordinates(element);
            assert.deepStrictEqual(result, { lat: 48.8566, lon: 2.3522 });
        });

        test('should extract coordinates from way type element with center', () => {
            const element = {
                type: 'way',
                center: {
                    lat: 48.8566,
                    lon: 2.3522
                }
            };
            
            const result = getElementCoordinates(element);
            assert.deepStrictEqual(result, { lat: 48.8566, lon: 2.3522 });
        });

        test('should return null for way without center', () => {
            const element = {
                type: 'way'
            };
            
            const result = getElementCoordinates(element);
            assert.strictEqual(result, null);
        });

        test('should return null for element without coordinates', () => {
            const element = {
                type: 'relation'
            };
            
            const result = getElementCoordinates(element);
            assert.strictEqual(result, null);
        });

        test('should handle node with zero coordinates', () => {
            const element = {
                type: 'node',
                lat: 0,
                lon: 0
            };
            
            const result = getElementCoordinates(element);
            assert.deepStrictEqual(result, { lat: 0, lon: 0 });
        });

        test('should handle negative coordinates', () => {
            const element = {
                type: 'node',
                lat: -33.8688,
                lon: 151.2093
            };
            
            const result = getElementCoordinates(element);
            assert.deepStrictEqual(result, { lat: -33.8688, lon: 151.2093 });
        });

        test('should prioritize node lat/lon over center', () => {
            const element = {
                type: 'node',
                lat: 48.8566,
                lon: 2.3522,
                center: {
                    lat: 0,
                    lon: 0
                }
            };
            
            const result = getElementCoordinates(element);
            assert.deepStrictEqual(result, { lat: 48.8566, lon: 2.3522 });
        });
    });
});
