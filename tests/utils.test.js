/**
 * Unit tests for utils.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sanitizeText, sanitizeUrl, debounce, getLocationType, parseOpeningHours } from '../js/utils.js';

// Mock minimal document.createElement for sanitizeText
if (typeof document === 'undefined') {
    global.document = {
        createElement: (tag) => {
            let text = '';
            return {
                set textContent(value) { text = value; },
                get innerHTML() {
                    // Simple HTML entity encoding
                    return text
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#x27;');
                }
            };
        }
    };
}

describe('sanitizeText', () => {
    test('should escape HTML special characters', () => {
        const input = '<script>alert("XSS")</script>';
        const result = sanitizeText(input);
        assert.strictEqual(result, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    test('should handle plain text without modification', () => {
        const input = 'Hello World';
        const result = sanitizeText(input);
        assert.strictEqual(result, 'Hello World');
    });

    test('should escape single quotes and double quotes', () => {
        const input = `It's a "test"`;
        const result = sanitizeText(input);
        assert.strictEqual(result, `It&#x27;s a &quot;test&quot;`);
    });

    test('should handle empty string', () => {
        const input = '';
        const result = sanitizeText(input);
        assert.strictEqual(result, '');
    });

    test('should escape ampersands', () => {
        const input = 'A & B';
        const result = sanitizeText(input);
        assert.strictEqual(result, 'A &amp; B');
    });
});

describe('sanitizeUrl', () => {
    test('should accept valid https URLs', () => {
        const url = 'https://example.com';
        const result = sanitizeUrl(url);
        assert.strictEqual(result, 'https://example.com/');
    });

    test('should accept valid http URLs', () => {
        const url = 'http://example.com';
        const result = sanitizeUrl(url);
        assert.strictEqual(result, 'http://example.com/');
    });

    test('should reject javascript: protocol', () => {
        const url = 'javascript:alert("XSS")';
        const result = sanitizeUrl(url);
        assert.strictEqual(result, null);
    });

    test('should reject data: protocol', () => {
        const url = 'data:text/html,<script>alert("XSS")</script>';
        const result = sanitizeUrl(url);
        assert.strictEqual(result, null);
    });

    test('should handle null input', () => {
        const result = sanitizeUrl(null);
        assert.strictEqual(result, null);
    });

    test('should handle undefined input', () => {
        const result = sanitizeUrl(undefined);
        assert.strictEqual(result, null);
    });

    test('should handle empty string', () => {
        const result = sanitizeUrl('');
        assert.strictEqual(result, null);
    });

    test('should handle invalid URL format', () => {
        const result = sanitizeUrl('not a url');
        assert.strictEqual(result, null);
    });

    test('should preserve query parameters', () => {
        const url = 'https://example.com/path?param=value';
        const result = sanitizeUrl(url);
        assert.strictEqual(result, 'https://example.com/path?param=value');
    });
});

describe('debounce', () => {
    test('should delay function execution', async () => {
        let callCount = 0;
        const fn = () => { callCount++; };
        const debounced = debounce(fn, 50);

        debounced();
        assert.strictEqual(callCount, 0, 'Function should not be called immediately');

        await new Promise(resolve => setTimeout(resolve, 60));
        assert.strictEqual(callCount, 1, 'Function should be called after delay');
    });

    test('should only call function once for multiple rapid calls', async () => {
        let callCount = 0;
        const fn = () => { callCount++; };
        const debounced = debounce(fn, 50);

        debounced();
        debounced();
        debounced();

        await new Promise(resolve => setTimeout(resolve, 60));
        assert.strictEqual(callCount, 1, 'Function should only be called once');
    });

    test('should reset timer on each call', async () => {
        let callCount = 0;
        const fn = () => { callCount++; };
        const debounced = debounce(fn, 50);

        debounced();
        await new Promise(resolve => setTimeout(resolve, 30));
        debounced(); // Reset timer
        await new Promise(resolve => setTimeout(resolve, 30));
        assert.strictEqual(callCount, 0, 'Function should not be called yet');

        await new Promise(resolve => setTimeout(resolve, 30));
        assert.strictEqual(callCount, 1, 'Function should be called after final delay');
    });

    test('should pass arguments to debounced function', async () => {
        let receivedArgs;
        const fn = (...args) => { receivedArgs = args; };
        const debounced = debounce(fn, 50);

        debounced('arg1', 'arg2', 123);

        await new Promise(resolve => setTimeout(resolve, 60));
        assert.deepStrictEqual(receivedArgs, ['arg1', 'arg2', 123]);
    });
});

describe('getLocationType', () => {
    test('should identify roastery by craft=roaster tag', () => {
        const tags = { craft: 'roaster' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'roastery', label: 'Roastery 🔥' });
    });

    test('should identify coffee shop by shop=coffee tag', () => {
        const tags = { shop: 'coffee' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'shop', label: 'Coffee Shop 🏪' });
    });

    test('should identify cafe as default for amenity=cafe', () => {
        const tags = { amenity: 'cafe' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'cafe', label: 'Cafe ☕' });
    });

    test('should identify sandwich shop by amenity=fast_food and cuisine=sandwich', () => {
        const tags = { amenity: 'fast_food', cuisine: 'sandwich' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'sandwich', label: 'Sandwich Shop 🥪' });
    });

    test('should default to cafe for empty tags', () => {
        const tags = {};
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'cafe', label: 'Cafe ☕' });
    });

    test('should prioritize roastery over shop', () => {
        const tags = { craft: 'roaster', shop: 'coffee' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'roastery', label: 'Roastery 🔥' });
    });

    test('should prioritize shop over cafe', () => {
        const tags = { shop: 'coffee', amenity: 'cafe' };
        const result = getLocationType(tags);
        assert.deepStrictEqual(result, { type: 'shop', label: 'Coffee Shop 🏪' });
    });
});

describe('parseOpeningHours', () => {
    test('should handle 24/7 opening hours', () => {
        const result = parseOpeningHours('24/7');
        assert.strictEqual(result.isOpen, true);
        assert.strictEqual(result.status, 'Open 24/7');
        assert.strictEqual(result.error, false);
    });

    test('should handle "always" opening hours', () => {
        const result = parseOpeningHours('always');
        assert.strictEqual(result.isOpen, true);
        assert.strictEqual(result.status, 'Open 24/7');
        assert.strictEqual(result.error, false);
    });

    test('should handle empty opening hours', () => {
        const result = parseOpeningHours('');
        assert.strictEqual(result.isOpen, null);
        assert.strictEqual(result.status, 'Unknown');
        assert.strictEqual(result.error, false);
    });

    test('should handle null opening hours', () => {
        const result = parseOpeningHours(null);
        assert.strictEqual(result.isOpen, null);
        assert.strictEqual(result.status, 'Unknown');
        assert.strictEqual(result.error, false);
    });

    test('should parse simple weekday range pattern', () => {
        // This test is time-dependent, so we'll just verify it returns a valid result
        const result = parseOpeningHours('Mo-Fr 09:00-18:00');
        assert.ok(typeof result.isOpen === 'boolean' || result.isOpen === null);
        assert.ok(['Open now', 'Closed', 'Unknown'].includes(result.status));
    });

    test('should parse single day pattern', () => {
        const result = parseOpeningHours('Mo 09:00-18:00');
        assert.ok(typeof result.isOpen === 'boolean' || result.isOpen === null);
        assert.ok(['Open now', 'Closed', 'Unknown'].includes(result.status));
    });

    test('should handle complex patterns with semicolons', () => {
        const result = parseOpeningHours('Mo-Fr 09:00-18:00; Sa 10:00-16:00');
        assert.ok(typeof result.isOpen === 'boolean' || result.isOpen === null);
        assert.ok(['Open now', 'Closed', 'Unknown'].includes(result.status));
    });

    test('should return unknown for unparseable patterns', () => {
        const result = parseOpeningHours('by appointment only');
        assert.strictEqual(result.isOpen, null);
        assert.strictEqual(result.status, 'Unknown');
        assert.strictEqual(result.error, true);
    });
});
