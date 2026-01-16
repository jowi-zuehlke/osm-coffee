/**
 * Unit tests for jokes.js
 */

import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { getRandomJoke, displayRandomJoke } from '../js/jokes.js';

describe('getRandomJoke', () => {
    test('should return a string', () => {
        const joke = getRandomJoke();
        assert.strictEqual(typeof joke, 'string');
    });

    test('should return a non-empty string', () => {
        const joke = getRandomJoke();
        assert.ok(joke.length > 0);
    });

    test('should return different jokes on multiple calls (probabilistic)', () => {
        const jokes = new Set();
        // Call it 20 times to collect jokes
        for (let i = 0; i < 20; i++) {
            jokes.add(getRandomJoke());
        }
        // With 15 jokes, we should get at least 2 different ones in 20 tries
        assert.ok(jokes.size >= 2);
    });

    test('should return one of the expected coffee jokes', () => {
        const expectedJokes = [
            "How does a tech guy drink coffee? He installs Java!",
            "What's the best Beatles song? Latte Be!",
            "Why did the coffee file a police report? It got mugged!",
            "How are coffee beans like teenagers? They're always getting grounded!",
            "What do you call sad coffee? Despresso.",
            "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
            "What's the opposite of coffee? Sneezy.",
            "How does Moses make his coffee? Hebrews it!",
            "What do you call it when you walk into a cafe you're sure you've been to before? Déjà brew.",
            "Why should you be wary of 5-cent espresso? It's a cheap shot!",
            "What did the coffee say to its date? Hey there, hot stuff!",
            "Why do coffee shops have bad WiFi? Because they want you to espresso yourself!",
            "What's a barista's favorite morning mantra? Rise and grind!",
            "Why did the coffee bean keep checking his watch? Because he was pressed for time!",
            "What do you call a cow who's just given birth? De-calf-inated!"
        ];
        
        const joke = getRandomJoke();
        assert.ok(expectedJokes.includes(joke));
    });
});

describe('displayRandomJoke', () => {
    test('should set textContent on element', () => {
        const mockElement = {
            textContent: ''
        };
        
        displayRandomJoke(mockElement);
        
        assert.ok(mockElement.textContent.length > 0);
        assert.strictEqual(typeof mockElement.textContent, 'string');
    });

    test('should handle null element gracefully', () => {
        // Should not throw an error
        assert.doesNotThrow(() => {
            displayRandomJoke(null);
        });
    });

    test('should handle undefined element gracefully', () => {
        // Should not throw an error
        assert.doesNotThrow(() => {
            displayRandomJoke(undefined);
        });
    });

    test('should display a valid joke', () => {
        const expectedJokes = [
            "How does a tech guy drink coffee? He installs Java!",
            "What's the best Beatles song? Latte Be!",
            "Why did the coffee file a police report? It got mugged!",
            "How are coffee beans like teenagers? They're always getting grounded!",
            "What do you call sad coffee? Despresso.",
            "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
            "What's the opposite of coffee? Sneezy.",
            "How does Moses make his coffee? Hebrews it!",
            "What do you call it when you walk into a cafe you're sure you've been to before? Déjà brew.",
            "Why should you be wary of 5-cent espresso? It's a cheap shot!",
            "What did the coffee say to its date? Hey there, hot stuff!",
            "Why do coffee shops have bad WiFi? Because they want you to espresso yourself!",
            "What's a barista's favorite morning mantra? Rise and grind!",
            "Why did the coffee bean keep checking his watch? Because he was pressed for time!",
            "What do you call a cow who's just given birth? De-calf-inated!"
        ];
        
        const mockElement = {
            textContent: ''
        };
        
        displayRandomJoke(mockElement);
        
        assert.ok(expectedJokes.includes(mockElement.textContent));
    });
});
