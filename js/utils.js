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
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
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
    } else if (tags.amenity === 'fast_food' && tags.cuisine === 'sandwich') {
        return { type: 'sandwich', label: 'Sandwich Shop 🥪' };
    } else {
        return { type: 'cafe', label: 'Cafe ☕' };
    }
}

/**
 * Parses opening hours to determine if location is currently open
 * @param {string} openingHours - OSM opening_hours string
 * @returns {Object} Object with isOpen (boolean|null), status (string), and error (boolean)
 */
export function parseOpeningHours(openingHours) {
    if (!openingHours) {
        return { isOpen: null, status: 'Unknown', error: false };
    }
    
    // Handle simple cases
    if (openingHours === '24/7' || openingHours.toLowerCase() === 'always') {
        return { isOpen: true, status: 'Open 24/7', error: false };
    }
    
    // Get current day and time
    const now = new Date();
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
    
    try {
        // Simple parser for common patterns like "Mo-Fr 09:00-18:00" or "Mo-Su 08:00-20:00"
        const patterns = openingHours.split(';').map(s => s.trim());
        
        let foundValidPattern = false;
        for (const pattern of patterns) {
            // Match pattern like "Mo-Fr 09:00-18:00" or "Mo 09:00-18:00"
            const match = pattern.match(/([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
            
            if (match) {
                foundValidPattern = true;
                const [, startDay, endDay, startHour, startMin, endHour, endMin] = match;
                const effectiveEndDay = endDay || startDay;
                
                // Check if current day is in range
                const startDayIdx = dayNames.indexOf(startDay);
                const endDayIdx = dayNames.indexOf(effectiveEndDay);
                const currentDayIdx = now.getDay();
                
                let dayInRange = false;
                if (startDayIdx <= endDayIdx) {
                    dayInRange = currentDayIdx >= startDayIdx && currentDayIdx <= endDayIdx;
                } else {
                    // Wraps around week (e.g., Fr-Mo)
                    dayInRange = currentDayIdx >= startDayIdx || currentDayIdx <= endDayIdx;
                }
                
                if (dayInRange) {
                    const openTime = parseInt(startHour) * 100 + parseInt(startMin);
                    const closeTime = parseInt(endHour) * 100 + parseInt(endMin);
                    
                    if (currentTime >= openTime && currentTime < closeTime) {
                        return { isOpen: true, status: 'Open now', error: false };
                    }
                }
            }
        }
        
        // If we parsed at least one valid pattern but didn't match, it's closed
        if (foundValidPattern) {
            return { isOpen: false, status: 'Closed', error: false };
        }
    } catch (e) {
        // If parsing fails, return unknown
        return { isOpen: null, status: 'Unknown', error: true };
    }
    
    // Default: unable to parse
    return { isOpen: null, status: 'Unknown', error: true };
}
