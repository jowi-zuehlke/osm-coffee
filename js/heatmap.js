/**
 * Heatmap overlay management
 */

import { CONFIG } from './config.js';

// Heatmap layer variable
let heatmapLayer = null;
let map = null;
let isHeatmapVisible = false;

/**
 * Initializes the heatmap layer
 * @param {L.Map} mapInstance - The Leaflet map instance
 */
export function initHeatmap(mapInstance) {
    map = mapInstance;
    
    // Check if Leaflet.heat plugin is available
    if (typeof L === 'undefined' || typeof L.heatLayer !== 'function') {
        console.warn('Leaflet.heat plugin not loaded. Heatmap feature will not be available.');
        return;
    }
    
    // Initialize heatmap layer with configuration
    // Using empty array initially, will be populated when data is available
    heatmapLayer = L.heatLayer([], {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
            0.0: '#ffffcc',
            0.2: '#ffeda0',
            0.4: '#fed976',
            0.6: '#feb24c',
            0.8: '#fd8d3c',
            1.0: '#fc4e2a'
        }
    });
    
    // Don't add to map initially - user needs to toggle it on
}

/**
 * Updates the heatmap with new data points
 * @param {Array} elements - Array of OSM elements with coordinates
 */
export function updateHeatmapData(elements) {
    if (!heatmapLayer) return;
    
    // Convert elements to lat/lng points for heatmap
    const heatmapPoints = elements
        .map(element => {
            // Get coordinates from element
            let lat, lon;
            if (element.type === 'node') {
                lat = element.lat;
                lon = element.lon;
            } else if (element.center) {
                lat = element.center.lat;
                lon = element.center.lon;
            }
            
            if (lat && lon) {
                // Return [lat, lng, intensity]
                // Using intensity from config
                return [lat, lon, CONFIG.HEATMAP_INTENSITY];
            }
            return null;
        })
        .filter(point => point !== null);
    
    // Update heatmap layer with new points
    heatmapLayer.setLatLngs(heatmapPoints);
}

/**
 * Toggles the heatmap visibility
 * @returns {boolean} New visibility state
 */
export function toggleHeatmap() {
    if (!map || !heatmapLayer) return false;
    
    isHeatmapVisible = !isHeatmapVisible;
    
    if (isHeatmapVisible) {
        heatmapLayer.addTo(map);
    } else {
        map.removeLayer(heatmapLayer);
    }
    
    return isHeatmapVisible;
}

/**
 * Gets the current heatmap visibility state
 * @returns {boolean} Current visibility state
 */
export function isHeatmapActive() {
    return isHeatmapVisible;
}
