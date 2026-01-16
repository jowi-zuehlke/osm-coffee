/**
 * Geolocation functionality for user location tracking
 */

import { CONFIG } from './config.js';

let userLocationMarker = null;
let mapInstance = null;

/**
 * Initializes the geolocation module with the map instance
 * @param {L.Map} map - The Leaflet map instance
 * @param {L.DivIcon} userIcon - The icon to use for user location marker
 */
export function initGeolocation(map, userIcon) {
    mapInstance = map;
    
    // Try to get user's location on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                mapInstance.setView([latitude, longitude], CONFIG.DEFAULT_ZOOM);
            },
            error => {
                console.log('Geolocation not available, using default location');
            }
        );
    }
}

/**
 * Creates and displays a marker for the user's location
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} accuracy - Location accuracy in meters
 * @param {L.DivIcon} userIcon - The icon to use for the marker
 */
function showUserLocationMarker(latitude, longitude, accuracy, userIcon) {
    // Remove existing user location marker if any
    if (userLocationMarker) {
        mapInstance.removeLayer(userLocationMarker);
    }
    
    // Add marker at user's location
    const accuracyText = accuracy ? `<br>Accuracy: ${Math.round(accuracy)} meters` : '';
    userLocationMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(mapInstance)
        .bindPopup(`<strong>Your Location</strong>${accuracyText}`)
        .openPopup();
    
    // Center map on user's location
    mapInstance.setView([latitude, longitude], CONFIG.USER_LOCATION_ZOOM);
}

/**
 * Handles errors from geolocation requests
 * @param {GeolocationPositionError} error - The geolocation error
 * @returns {string} User-friendly error message
 */
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return 'Location access denied. Please allow location access in your browser.';
        case error.POSITION_UNAVAILABLE:
            return 'Location information is unavailable.';
        case error.TIMEOUT:
            return 'Location request timed out.';
        default:
            return 'Unable to retrieve your location';
    }
}

/**
 * Handles the user location button click event
 * @param {L.DivIcon} userIcon - The icon to use for the marker
 */
export function showUserLocation(userIcon) {
    const locationBtn = document.getElementById('locationBtn');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }
    
    // Disable button and show loading state
    locationBtn.disabled = true;
    locationBtn.textContent = '⏳';
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude, accuracy } = position.coords;
            showUserLocationMarker(latitude, longitude, accuracy, userIcon);
            
            // Re-enable button
            locationBtn.disabled = false;
            locationBtn.textContent = '📍';
        },
        error => {
            const message = getGeolocationErrorMessage(error);
            alert(message);
            
            // Re-enable button
            locationBtn.disabled = false;
            locationBtn.textContent = '📍';
        },
        {
            enableHighAccuracy: true,
            timeout: CONFIG.GEOLOCATION_TIMEOUT,
            maximumAge: 0
        }
    );
}
