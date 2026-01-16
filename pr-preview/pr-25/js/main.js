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
import { initHeatmap, toggleHeatmap, updateHeatmapData } from './heatmap.js';

/**
 * Initializes the application
 * Sets up the map, geolocation, filters, favorites, and event handlers
 */
function init() {
    // Initialize map
    const { map, updateCoffeeMarkers, icons, getLastFetchedElements } = initMap();
    
    // Initialize heatmap
    initHeatmap(map);
    
    // Initialize geolocation
    initGeolocation(map, icons.userLocation);
    
    // Initial data load - this is async but we don't need to wait
    updateCoffeeMarkers();
    
    // Debounced function to prevent excessive API calls during map movement
    const debouncedUpdate = debounce(async () => {
        await updateCoffeeMarkers();
        // Update heatmap with the same data (after markers are updated)
        const elements = getLastFetchedElements();
        if (elements && elements.length > 0) {
            updateHeatmapData(elements);
        }
    }, CONFIG.MAP_MOVE_DEBOUNCE);
    
    // Reload coffee locations when map is moved
    map.on('moveend', debouncedUpdate);
    
    // Initialize filters with callback that updates both markers and heatmap
    initFilters(async () => {
        await updateCoffeeMarkers();
        // Update heatmap with filtered data (after markers are updated)
        const elements = getLastFetchedElements();
        if (elements && elements.length > 0) {
            updateHeatmapData(elements);
        }
    });
    
    // Add click event listener to location button
    document.getElementById('locationBtn').addEventListener('click', () => {
        showUserLocation(icons.userLocation);
    });
    
    // Add click event listener to heatmap toggle button
    const heatmapToggleBtn = document.getElementById('heatmapToggle');
    if (heatmapToggleBtn) {
        heatmapToggleBtn.addEventListener('click', () => {
            // Toggle visibility first to know the new state
            const isActive = toggleHeatmap();
            
            if (isActive) {
                heatmapToggleBtn.classList.add('active');
                // Update heatmap data after it's been added to the map
                const elements = getLastFetchedElements();
                if (elements && elements.length > 0) {
                    updateHeatmapData(elements);
                } else {
                    // If no data, show a console message for debugging
                    console.log('Heatmap activated but no data available yet. Pan/zoom the map to load data.');
                }
            } else {
                heatmapToggleBtn.classList.remove('active');
            }
        });
    }
    
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
