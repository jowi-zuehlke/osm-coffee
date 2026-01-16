/**
 * Favorites management - storing and retrieving favorite cafes
 */

const STORAGE_KEY = 'osmCoffeeFavorites';

/**
 * Loads favorites from localStorage
 * @returns {Array} Array of favorite cafe elements
 */
export function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

/**
 * Saves favorites to localStorage
 * @param {Array} favorites - Array of favorite cafe elements
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

/**
 * Adds a cafe to favorites
 * @param {Object} element - The OSM element to add to favorites
 */
export function addFavorite(element) {
    const favorites = loadFavorites();
    
    // Check if already favorited
    if (favorites.some(fav => fav.id === element.id && fav.type === element.type)) {
        return;
    }
    
    favorites.push(element);
    saveFavorites(favorites);
    
    // Dispatch custom event to notify UI
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
}

/**
 * Removes a cafe from favorites
 * @param {Object} element - The OSM element to remove from favorites
 */
export function removeFavorite(element) {
    const favorites = loadFavorites();
    const filtered = favorites.filter(fav => !(fav.id === element.id && fav.type === element.type));
    saveFavorites(filtered);
    
    // Dispatch custom event to notify UI
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
}

/**
 * Checks if a cafe is in favorites
 * @param {Object} element - The OSM element to check
 * @returns {boolean} True if favorited, false otherwise
 */
export function isFavorite(element) {
    const favorites = loadFavorites();
    return favorites.some(fav => fav.id === element.id && fav.type === element.type);
}

/**
 * Toggles favorite status for a cafe
 * @param {Object} element - The OSM element to toggle
 * @returns {boolean} True if now favorited, false if unfavorited
 */
export function toggleFavorite(element) {
    if (isFavorite(element)) {
        removeFavorite(element);
        return false;
    } else {
        addFavorite(element);
        return true;
    }
}
