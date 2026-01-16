/**
 * UI functions for displaying cafe details in the sidebar
 */

import { sanitizeText, sanitizeUrl, parseOpeningHours } from './utils.js';
import { isFavorite, toggleFavorite } from './favorites.js';

// Store current element for reference
let currentElement = null;

/**
 * Gets the current element being displayed
 * @returns {Object|null} The current OSM element
 */
export function getCurrentElement() {
    return currentElement;
}

/**
 * Creates a detail row HTML string for the sidebar
 * @param {string} label - The label for the detail (e.g., "📍 Address")
 * @param {string} value - The value to display
 * @param {boolean} isLink - Whether the value should be a link
 * @param {string} linkHref - The href for the link (if isLink is true)
 * @returns {string} HTML string for the detail row
 */
function createDetailRow(label, value, isLink = false, linkHref = '') {
    let html = '<div class="detail-row">';
    html += `<span class="detail-label">${label}:</span>`;
    if (isLink && linkHref) {
        html += `<span class="detail-value"><a href="${linkHref}" target="_blank" rel="noopener noreferrer">${value}</a></span>`;
    } else {
        html += `<span class="detail-value">${value}</span>`;
    }
    html += '</div>';
    return html;
}

/**
 * Generates HTML for address information with fallback to contact:* tags
 * @param {Object} tags - OSM tags containing address information
 * @returns {string} HTML string for address details
 */
function generateAddressHTML(tags) {
    // Try addr:* tags first
    const street = tags['addr:street'] || tags['contact:street'];
    const housenumber = tags['addr:housenumber'] || tags['contact:housenumber'];
    const city = tags['addr:city'] || tags['contact:city'];
    const postcode = tags['addr:postcode'] || tags['contact:postcode'];
    
    // Return empty if no address information available
    if (!street && !city) {
        return '';
    }
    
    let address = '';
    if (street) {
        address += sanitizeText(street);
        if (housenumber) {
            address += ` ${sanitizeText(housenumber)}`;
        }
    }
    if (city) {
        address += (address ? ', ' : '') + sanitizeText(city);
    }
    if (postcode) {
        address += ` ${sanitizeText(postcode)}`;
    }
    
    return createDetailRow('📍 Address', address);
}

/**
 * Generates HTML for contact information (phone, email, website) with fallback to contact:* tags
 * @param {Object} tags - OSM tags containing contact information
 * @returns {string} HTML string for contact details
 */
function generateContactHTML(tags) {
    let html = '';
    
    // Phone (with fallback to contact:phone)
    const phone = tags.phone || tags['contact:phone'];
    if (phone) {
        const phoneText = sanitizeText(phone);
        const phoneHref = phoneText.replace(/[^0-9+]/g, '');
        const digitCount = (phoneHref.match(/\d/g) || []).length;
        
        if (digitCount >= 3) {
            html += '<div class="detail-row">';
            html += '<span class="detail-label">📞 Phone:</span>';
            html += `<span class="detail-value"><a href="tel:${phoneHref}">${phoneText}</a></span>`;
            html += '</div>';
        } else {
            html += createDetailRow('📞 Phone', phoneText);
        }
    }
    
    // Email (with fallback to contact:email)
    const email = tags.email || tags['contact:email'];
    if (email) {
        const emailText = sanitizeText(email);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
        
        if (emailRegex.test(emailText)) {
            html += '<div class="detail-row">';
            html += '<span class="detail-label">✉️ Email:</span>';
            html += `<span class="detail-value"><a href="mailto:${emailText}">${emailText}</a></span>`;
            html += '</div>';
        } else {
            html += createDetailRow('✉️ Email', emailText);
        }
    }
    
    // Website (with fallback to contact:website)
    const website = tags.website || tags['contact:website'];
    if (website) {
        const safeUrl = sanitizeUrl(website);
        if (safeUrl) {
            html += '<div class="detail-row">';
            html += '<span class="detail-label">🌐 Website:</span>';
            html += `<span class="detail-value"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Visit</a></span>`;
            html += '</div>';
        }
    }
    
    return html;
}

/**
 * Generates HTML for amenities information (outdoor seating, takeaway, delivery, wifi, toilets)
 * @param {Object} tags - OSM tags containing amenity information
 * @returns {string} HTML string for amenity details
 */
function generateAmenitiesHTML(tags) {
    let html = '';
    
    if (tags.outdoor_seating) {
        html += createDetailRow('🪑 Outdoor', tags.outdoor_seating === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags.takeaway) {
        html += createDetailRow('🥤 Takeaway', tags.takeaway === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags.delivery) {
        html += createDetailRow('🚚 Delivery', tags.delivery === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags.internet_access || tags.wifi) {
        const wifiValue = tags.internet_access || tags.wifi;
        const wifiText = (wifiValue === 'yes' || wifiValue === 'free' || wifiValue === 'wlan') 
            ? 'Yes ✓' 
            : sanitizeText(wifiValue);
        html += createDetailRow('📶 WiFi', wifiText);
    }
    
    if (tags['internet_access:fee']) {
        html += createDetailRow('💰 WiFi Fee', tags['internet_access:fee'] === 'no' ? 'Free' : 'Paid');
    }
    
    if (tags.toilets) {
        html += createDetailRow('🚻 Toilets', tags.toilets === 'yes' ? 'Yes ✓' : 'No');
    }
    
    return html;
}

/**
 * Generates HTML for additional details (coffee, roastery, cuisine, diet, capacity, accessibility, payment)
 * @param {Object} tags - OSM tags containing additional information
 * @returns {string} HTML string for additional details
 */
function generateAdditionalDetailsHTML(tags) {
    let html = '';
    
    // Coffee roaster information
    if (tags['coffee:roaster']) {
        html += createDetailRow('☕ Roaster', sanitizeText(tags['coffee:roaster']));
    }
    
    if (tags.roastery) {
        html += createDetailRow('🔥 Roastery', sanitizeText(tags.roastery));
    }
    
    // Cuisine and diet
    if (tags.cuisine) {
        html += createDetailRow('🍽️ Cuisine', sanitizeText(tags.cuisine));
    }
    
    if (tags['diet:vegetarian']) {
        const vegText = tags['diet:vegetarian'] === 'yes' ? 'Yes ✓' : sanitizeText(tags['diet:vegetarian']);
        html += createDetailRow('🥗 Vegetarian', vegText);
    }
    
    if (tags['diet:vegan']) {
        const veganText = tags['diet:vegan'] === 'yes' ? 'Yes ✓' : sanitizeText(tags['diet:vegan']);
        html += createDetailRow('🌱 Vegan', veganText);
    }
    
    if (tags['diet:gluten_free']) {
        const gfText = tags['diet:gluten_free'] === 'yes' ? 'Yes ✓' : sanitizeText(tags['diet:gluten_free']);
        html += createDetailRow('🌾 Gluten Free', gfText);
    }
    
    if (tags['diet:halal']) {
        const halalText = tags['diet:halal'] === 'yes' ? 'Yes ✓' : sanitizeText(tags['diet:halal']);
        html += createDetailRow('🥙 Halal', halalText);
    }
    
    if (tags['diet:kosher']) {
        const kosherText = tags['diet:kosher'] === 'yes' ? 'Yes ✓' : sanitizeText(tags['diet:kosher']);
        html += createDetailRow('✡️ Kosher', kosherText);
    }
    
    // Accessibility
    if (tags.wheelchair) {
        const wheelchairText = tags.wheelchair === 'yes' ? 'Yes ✓' : 
                             tags.wheelchair === 'no' ? 'No' : 
                             sanitizeText(tags.wheelchair);
        html += createDetailRow('♿ Wheelchair', wheelchairText);
    }
    
    // Payment methods
    if (tags['payment:cash']) {
        html += createDetailRow('💵 Cash', tags['payment:cash'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:cards']) {
        html += createDetailRow('💳 Cards', tags['payment:cards'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:credit_cards']) {
        html += createDetailRow('🏦 Credit Cards', tags['payment:credit_cards'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:debit_cards']) {
        html += createDetailRow('💳 Debit Cards', tags['payment:debit_cards'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:contactless']) {
        html += createDetailRow('📱 Contactless', tags['payment:contactless'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:bitcoin']) {
        html += createDetailRow('₿ Bitcoin', tags['payment:bitcoin'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    if (tags['payment:cryptocurrencies']) {
        html += createDetailRow('💎 Crypto', tags['payment:cryptocurrencies'] === 'yes' ? 'Yes ✓' : 'No');
    }
    
    // Other details
    if (tags.capacity) {
        html += createDetailRow('👥 Capacity', sanitizeText(tags.capacity));
    }
    
    if (tags.smoking) {
        html += createDetailRow('🚬 Smoking', tags.smoking === 'no' ? 'No' : sanitizeText(tags.smoking));
    }
    
    return html;
}

/**
 * Generates HTML for opening hours with "Open now?" indicator
 * @param {Object} tags - OSM tags containing opening hours information
 * @param {Object} element - The OSM element for linking to OSM
 * @returns {string} HTML string for opening hours details
 */
function generateOpeningHoursHTML(tags, element) {
    if (!tags.opening_hours) {
        return '';
    }
    
    const openingHours = tags.opening_hours;
    const parsed = parseOpeningHours(openingHours);
    
    let html = '<div class="detail-row">';
    html += '<span class="detail-label">🕒 Hours:</span>';
    html += '<span class="detail-value">';
    
    // Add status indicator
    if (parsed.isOpen === true) {
        html += '<span class="open-status open">🟢 Open now</span><br>';
    } else if (parsed.isOpen === false) {
        html += '<span class="open-status closed">🔴 Closed</span><br>';
    } else {
        html += '<span class="open-status unknown">⚪ Status unknown</span><br>';
    }
    
    // Add opening hours text
    html += sanitizeText(openingHours);
    
    // Add link to OSM for detailed info
    const validTypes = ['node', 'way', 'relation'];
    const elementType = validTypes.includes(element.type) ? element.type : 'node';
    const elementId = element.id;
    
    if (/^\d+$/.test(String(elementId))) {
        html += `<br><a href="https://www.openstreetmap.org/${elementType}/${elementId}" target="_blank" rel="noopener noreferrer" style="font-size: 0.9em;">View on OSM</a>`;
    }
    
    html += '</span>';
    html += '</div>';
    
    return html;
}

/**
 * Generates HTML for OSM reference link
 * @param {Object} element - The OSM element
 * @returns {string} HTML string for OSM reference
 */
function generateOSMReferenceHTML(element) {
    const validTypes = ['node', 'way', 'relation'];
    const elementType = validTypes.includes(element.type) ? element.type : 'node';
    
    if (!/^\d+$/.test(String(element.id))) {
        return '';
    }
    
    const elementIdNum = parseInt(element.id, 10);
    if (elementIdNum <= 0) {
        return '';
    }
    
    return createDetailRow(
        'OSM',
        `${elementType}/${elementIdNum}`,
        true,
        `https://www.openstreetmap.org/${elementType}/${elementIdNum}`
    );
}

/**
 * Displays detailed information about a cafe in the sidebar
 * @param {Object} element - The OSM element containing cafe information
 */
export function showCafeDetails(element) {
    currentElement = element;
    const tags = element.tags || {};
    const name = tags.name || 'Unnamed';
    
    // Determine the type label
    let typeLabel;
    if (tags.craft === 'roaster') {
        typeLabel = 'Roastery 🔥';
    } else if (tags.shop === 'coffee') {
        typeLabel = 'Coffee Shop 🏪';
    } else {
        typeLabel = 'Cafe ☕';
    }
    
    const detailsDiv = document.getElementById('details');
    detailsDiv.classList.remove('empty');
    
    const isFav = isFavorite(element);
    const heartIcon = isFav ? '❤️' : '🤍';
    const favClass = isFav ? 'favorited' : '';
    
    let html = '<div id="details-content">';
    html += '<h2>';
    html += `<span>${sanitizeText(name)}</span>`;
    html += `<button class="favorite-btn ${favClass}" id="favorite-toggle" title="Toggle favorite">${heartIcon}</button>`;
    html += '</h2>';
    html += createDetailRow('Type', typeLabel);
    
    // Add all sections
    html += generateAddressHTML(tags);
    html += generateOpeningHoursHTML(tags, element);
    html += generateContactHTML(tags);
    html += generateAmenitiesHTML(tags);
    html += generateAdditionalDetailsHTML(tags);
    html += generateOSMReferenceHTML(element);
    
    html += '</div>';
    
    detailsDiv.innerHTML = html;
    
    // Add event listener to favorite button
    const favoriteBtn = document.getElementById('favorite-toggle');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            const nowFavorited = toggleFavorite(element);
            favoriteBtn.textContent = nowFavorited ? '❤️' : '🤍';
            favoriteBtn.classList.toggle('favorited', nowFavorited);
        });
    }
}

/**
 * Renders the favorites list in the sidebar
 * @param {Array} favorites - Array of favorite cafe elements
 * @param {Function} onFavoriteClick - Callback when a favorite is clicked
 */
export function renderFavoritesList(favorites, onFavoriteClick) {
    const favoritesListDiv = document.getElementById('favorites-list');
    
    if (!favorites || favorites.length === 0) {
        favoritesListDiv.classList.add('empty');
        favoritesListDiv.innerHTML = '<p>No favorites yet. Click the ❤️ button on a cafe to add it here!</p>';
        return;
    }
    
    favoritesListDiv.classList.remove('empty');
    
    let html = '';
    favorites.forEach((element, index) => {
        const tags = element.tags || {};
        const name = tags.name || 'Unnamed';
        
        // Determine the type emoji
        let typeEmoji;
        if (tags.craft === 'roaster') {
            typeEmoji = '🔥';
        } else if (tags.shop === 'coffee') {
            typeEmoji = '🏪';
        } else {
            typeEmoji = '☕';
        }
        
        html += `<div class="favorite-item" data-index="${index}">`;
        html += `<span class="favorite-item-name">${sanitizeText(name)}</span>`;
        html += `<span class="favorite-item-type">${typeEmoji}</span>`;
        html += '</div>';
    });
    
    favoritesListDiv.innerHTML = html;
    
    // Add click handlers to favorite items
    favoritesListDiv.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'), 10);
            onFavoriteClick(favorites[index]);
        });
    });
}
