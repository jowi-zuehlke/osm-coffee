/**
 * Utility functions for sanitization and validation
 */

/**
 * Sanitizes text content to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} HTML-safe text
 */
export function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validates and sanitizes URLs to prevent XSS attacks
 * @param {string} url - The URL to validate and sanitize
 * @returns {string|null} Safe URL or null if invalid
 */
export function sanitizeUrl(url) {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        // Only allow http and https protocols
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            return urlObj.href;
        }
    } catch (e) {
        return null;
    }
    return null;
}

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };
}

/**
 * Determines the type and label of a location based on OSM tags
 * @param {Object} tags - OSM tags for the location
 * @returns {Object} Object with type and label properties
 */
export function getLocationType(tags) {
    if (tags.craft === 'roaster') {
        return { type: 'roastery', label: 'Roastery 🔥' };
    } else if (tags.shop === 'coffee') {
        return { type: 'shop', label: 'Coffee Shop 🏪' };
    } else {
        return { type: 'cafe', label: 'Cafe ☕' };
    }
}
