/**
 * Application configuration constants
 */
export const CONFIG = {
    // Default map location (Paris, France)
    DEFAULT_LOCATION: [48.8566, 2.3522],
    DEFAULT_ZOOM: 13,
    USER_LOCATION_ZOOM: 15,
    
    // Minimum zoom level to load locations (prevents API overload)
    MIN_ZOOM_FOR_LOCATIONS: 13,
    
    // API timeouts (milliseconds)
    OVERPASS_TIMEOUT: 30000,
    GEOLOCATION_TIMEOUT: 10000,
    
    // Debounce delay for map movements (milliseconds)
    MAP_MOVE_DEBOUNCE: 500,
    
    // Cache settings
    CACHE_TTL: 10 * 60 * 1000, // 10 minutes in milliseconds
    CACHE_MAX_SIZE: 50, // Maximum number of cache entries
    
    // Icon sizes
    MARKER_SIZE: 32,
    
    // Marker colors
    COLORS: {
        CAFE: '#8B4513',
        ROASTERY: '#D2691E',
        SHOP: '#228B22',
        USER_LOCATION: '#4285F4'
    }
};

/**
 * Filter state - all types enabled by default
 */
export const filterState = {
    cafe: true,
    shop: true,
    roastery: true
};
