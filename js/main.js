/**
 * Main application initialization and event handlers
 */

import { CONFIG } from './config.js';
import { debounce } from './utils.js';
import { initMap, panToLocation } from './map.js';
import { initGeolocation, showUserLocation } from './geolocation.js';
import { initFilters } from './filters.js';
import { loadFavorites } from './favorites.js';
import { renderFavoritesList, showCafeDetails } from './ui.js';
import { getElementCoordinates } from './api.js';

/**
 * Initializes the application
 * Sets up the map, geolocation, filters, favorites, and event handlers
 */
function init() {
    // Initialize map
    const { map, updateCoffeeMarkers, icons } = initMap();
    
    // Initialize geolocation
    initGeolocation(map, icons.userLocation);
    
    // Initial data load
    updateCoffeeMarkers();
    
    // Debounced function to prevent excessive API calls during map movement
    const debouncedUpdate = debounce(updateCoffeeMarkers, CONFIG.MAP_MOVE_DEBOUNCE);
    
    // Reload coffee locations when map is moved
    map.on('moveend', debouncedUpdate);
    
    // Initialize filters
    initFilters(updateCoffeeMarkers);
    
    // Add click event listener to location button
    document.getElementById('locationBtn').addEventListener('click', () => {
        showUserLocation(icons.userLocation);
    });
    
    /**
     * Shows a cafe on the map by panning to it and displaying its details
     * @param {Object} element - The OSM element to show
     */
    function showCafeOnMap(element) {
        const coords = getElementCoordinates(element);
        if (!coords) return;
        
        panToLocation(coords.lat, coords.lon);
        showCafeDetails(element);
    }
    
    // Initialize favorites
    function updateFavoritesList() {
        const favorites = loadFavorites();
        renderFavoritesList(favorites, showCafeOnMap);
    }
    
    // Initial render of favorites
    updateFavoritesList();
    
    // Listen for favorites changes
    window.addEventListener('favoritesChanged', updateFavoritesList);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
