/**
 * Map initialization and marker management
 */

import { CONFIG } from './config.js';
import { getLocationType } from './utils.js';
import { showCafeDetails } from './ui.js';
import { fetchCoffeeLocations, getElementCoordinates } from './api.js';

// Map and layer variables
let map;
let coffeeMarkers;

/**
 * Creates a custom div icon for map markers
 * @param {string} emoji - The emoji to display in the marker
 * @param {string} backgroundColor - The background color of the marker
 * @param {number} borderWidth - Border width in pixels (default 2)
 * @returns {L.DivIcon} Leaflet div icon
 */
function createMarkerIcon(emoji, backgroundColor, borderWidth = 2) {
    const size = CONFIG.MARKER_SIZE;
    return L.divIcon({
        html: `<div style="background: ${backgroundColor}; color: white; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: ${borderWidth}px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${emoji}</div>`,
        className: 'custom-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
}

// Custom icons for different location types
const icons = {
    cafe: createMarkerIcon('☕', CONFIG.COLORS.CAFE),
    roastery: createMarkerIcon('🔥', CONFIG.COLORS.ROASTERY),
    shop: createMarkerIcon('🏪', CONFIG.COLORS.SHOP),
    userLocation: createMarkerIcon('📍', CONFIG.COLORS.USER_LOCATION, 3)
};

/**
 * Determines the appropriate icon for a location based on type
 * @param {string} type - The type of location ('cafe', 'shop', or 'roastery')
 * @returns {L.DivIcon} The appropriate Leaflet icon
 */
function getIconForType(type) {
    return icons[type] || icons.cafe;
}

/**
 * Creates a marker for a coffee location
 * @param {Object} element - The OSM element
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
function createCoffeeMarker(element, lat, lon) {
    const tags = element.tags || {};
    const { type } = getLocationType(tags);
    const icon = getIconForType(type);
    
    // Add marker to coffee markers layer group with click handler
    L.marker([lat, lon], { icon: icon })
        .addTo(coffeeMarkers)
        .on('click', () => showCafeDetails(element));
}

/**
 * Updates coffee markers on the map
 */
async function updateCoffeeMarkers() {
    const loading = document.getElementById('loading');
    loading.classList.add('active');
    
    try {
        const bounds = map.getBounds();
        const elements = await fetchCoffeeLocations(bounds);
        
        // Clear existing coffee markers
        coffeeMarkers.clearLayers();
        
        // Add markers for each location
        elements.forEach(element => {
            const coords = getElementCoordinates(element);
            if (coords) {
                createCoffeeMarker(element, coords.lat, coords.lon);
            }
        });
    } catch (error) {
        // Error already logged in fetchCoffeeLocations
    } finally {
        loading.classList.remove('active');
    }
}

/**
 * Initializes the map
 * @returns {Object} Object containing map, updateCoffeeMarkers function, and helper functions
 */
export function initMap() {
    // Initialize the map
    map = L.map('map').setView(CONFIG.DEFAULT_LOCATION, CONFIG.DEFAULT_ZOOM);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Layer group for coffee markers
    coffeeMarkers = L.layerGroup().addTo(map);
    
    return {
        map,
        updateCoffeeMarkers,
        getIconForType,
        icons,
        panToLocation,
        showCafeOnMap
    };
}

/**
 * Pans the map to a specific location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} zoom - Optional zoom level (defaults to current zoom or 16)
 */
export function panToLocation(lat, lon, zoom = null) {
    if (!map) return;
    
    const targetZoom = zoom || Math.max(map.getZoom(), 16);
    map.setView([lat, lon], targetZoom, { animate: true });
}

/**
 * Shows a cafe on the map by panning to it and displaying its details
 * @param {Object} element - The OSM element to show
 */
export function showCafeOnMap(element) {
    const coords = getElementCoordinates(element);
    if (!coords) return;
    
    panToLocation(coords.lat, coords.lon);
    showCafeDetails(element);
}
