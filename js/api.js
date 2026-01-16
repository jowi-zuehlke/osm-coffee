/**
 * API functions for fetching coffee location data from OpenStreetMap
 */

import { CONFIG, filterState } from './config.js';
import { getLocationType } from './utils.js';

/**
 * Builds the Overpass API query for coffee locations
 * @param {L.LatLngBounds} bounds - The map bounds to query within
 * @returns {string} The Overpass QL query string
 */
function buildOverpassQuery(bounds) {
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const north = bounds.getNorth();
    const east = bounds.getEast();
    
    return `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](${south},${west},${north},${east});
          way["amenity"="cafe"](${south},${west},${north},${east});
          node["shop"="coffee"](${south},${west},${north},${east});
          way["shop"="coffee"](${south},${west},${north},${east});
          node["craft"="roaster"](${south},${west},${north},${east});
          way["craft"="roaster"](${south},${west},${north},${east});
        );
        out center;
    `;
}

/**
 * Extracts coordinates from an OSM element
 * @param {Object} element - The OSM element
 * @returns {Object|null} Object with lat and lon properties, or null if unavailable
 */
export function getElementCoordinates(element) {
    if (element.type === 'node') {
        return { lat: element.lat, lon: element.lon };
    } else if (element.center) {
        return { lat: element.center.lat, lon: element.center.lon };
    }
    return null;
}

/**
 * Fetches coffee locations from Overpass API
 * @param {L.LatLngBounds} bounds - The map bounds to query
 * @returns {Promise<Array>} Array of OSM elements
 */
export async function fetchCoffeeLocations(bounds) {
    const query = buildOverpassQuery(bounds);
    
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.OVERPASS_TIMEOUT);
    
    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter elements based on filter state and return only those with valid coordinates
        const filteredElements = data.elements.filter(element => {
            const coords = getElementCoordinates(element);
            if (!coords) return false;
            
            const tags = element.tags || {};
            const { type } = getLocationType(tags);
            
            return filterState[type];
        });
        
        console.log(`Loaded ${data.elements.length} coffee locations (${filteredElements.length} after filtering)`);
        
        return filteredElements;
    } catch (error) {
        console.error('Error fetching coffee locations:', error);
        
        // Show user-friendly error message
        if (error.name === 'AbortError') {
            console.error('Request timeout - Overpass API took too long to respond');
        } else {
            console.error('Could not load coffee locations. Please try again later.');
        }
        
        throw error;
    }
}
