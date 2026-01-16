/**
 * UI functions for displaying cafe details in the sidebar
 */

import { sanitizeText, sanitizeUrl } from './utils.js';

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
 * Generates HTML for address information
 * @param {Object} tags - OSM tags containing address information
 * @returns {string} HTML string for address details
 */
function generateAddressHTML(tags) {
    if (!tags['addr:street'] && !tags['addr:city']) {
        return '';
    }
    
    let address = '';
    if (tags['addr:street']) {
        address += sanitizeText(tags['addr:street']);
        if (tags['addr:housenumber']) {
            address += ` ${sanitizeText(tags['addr:housenumber'])}`;
        }
    }
    if (tags['addr:city']) {
        address += `, ${sanitizeText(tags['addr:city'])}`;
    }
    if (tags['addr:postcode']) {
        address += ` ${sanitizeText(tags['addr:postcode'])}`;
    }
    
    return createDetailRow('📍 Address', address);
}

/**
 * Generates HTML for contact information (phone, email, website)
 * @param {Object} tags - OSM tags containing contact information
 * @returns {string} HTML string for contact details
 */
function generateContactHTML(tags) {
    let html = '';
    
    // Phone
    if (tags.phone) {
        const phoneText = sanitizeText(tags.phone);
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
    
    // Email
    if (tags.email) {
        const emailText = sanitizeText(tags.email);
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
    
    // Website
    if (tags.website) {
        const safeUrl = sanitizeUrl(tags.website);
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
 * Generates HTML for amenities information (outdoor seating, takeaway, delivery, wifi)
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
    
    return html;
}

/**
 * Generates HTML for additional details (cuisine, diet, capacity, accessibility, payment)
 * @param {Object} tags - OSM tags containing additional information
 * @returns {string} HTML string for additional details
 */
function generateAdditionalDetailsHTML(tags) {
    let html = '';
    
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
    
    let html = '<div id="details-content">';
    html += `<h2>${sanitizeText(name)}</h2>`;
    html += createDetailRow('Type', typeLabel);
    
    // Add all sections
    html += generateAddressHTML(tags);
    
    if (tags.opening_hours) {
        html += createDetailRow('🕒 Hours', sanitizeText(tags.opening_hours));
    }
    
    html += generateContactHTML(tags);
    html += generateAmenitiesHTML(tags);
    html += generateAdditionalDetailsHTML(tags);
    html += generateOSMReferenceHTML(element);
    
    html += '</div>';
    
    detailsDiv.innerHTML = html;
}
