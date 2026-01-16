/**
 * Filter functionality for toggling location types
 */

import { filterState } from './config.js';
import { clearCache } from './cache.js';

/**
 * Toggles the filter for a specific location type
 * @param {string} type - The type to toggle ('cafe', 'shop', or 'roastery')
 * @param {Function} updateMarkersCallback - Callback to refresh markers after filter change
 */
export function toggleFilter(type, updateMarkersCallback) {
    filterState[type] = !filterState[type];
    
    // Clear cache when filters change since cached data is filter-specific
    clearCache();
    
    // Update legend item visual state
    const legendItem = document.querySelector(`.legend-item[data-type="${type}"]`);
    if (legendItem) {
        if (filterState[type]) {
            legendItem.classList.remove('disabled');
        } else {
            legendItem.classList.add('disabled');
        }
    }
    
    // Refresh markers on map
    updateMarkersCallback();
}

/**
 * Initializes filter event listeners
 * @param {Function} updateMarkersCallback - Callback to refresh markers after filter change
 */
export function initFilters(updateMarkersCallback) {
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            if (type) {
                toggleFilter(type, updateMarkersCallback);
            }
        });
    });
}
