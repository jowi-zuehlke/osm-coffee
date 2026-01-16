# OSM Coffee - Application Specification

## Table of Contents
1. [Overview](#overview)
2. [Functional Requirements](#functional-requirements)
3. [Technical Specifications](#technical-specifications)
4. [User Interface Specifications](#user-interface-specifications)
5. [Data Sources and Integration](#data-sources-and-integration)
6. [Architecture](#architecture)
7. [Performance Requirements](#performance-requirements)
8. [Security Requirements](#security-requirements)
9. [Browser Compatibility](#browser-compatibility)
10. [Deployment](#deployment)
11. [Testing](#testing)
12. [Future Enhancements](#future-enhancements)

---

## Overview

**Application Name:** OSM Coffee  
**Version:** 1.0  
**Type:** Single Page Application (SPA)  
**Purpose:** Interactive map application for discovering cafes, coffee shops, and roasteries using OpenStreetMap data  
**Live URL:** https://jowi-zuehlke.github.io/osm-coffee/

### Mission Statement
Provide coffee enthusiasts with an easy-to-use, privacy-friendly tool to discover coffee locations worldwide, leveraging community-maintained OpenStreetMap data.

### Key Principles
- **Zero Build Dependencies**: Uses vanilla JavaScript with ES6 modules - no bundlers or build tools required
- **Privacy First**: No tracking, cookies, or user data collection
- **Open Data**: Powered entirely by OpenStreetMap, a free and open geographic database
- **Modular Architecture**: Clean separation of concerns for maintainability
- **Mobile First**: Responsive design that works seamlessly on all devices

---

## Functional Requirements

### FR1: Interactive Map Display
**Priority:** Critical  
**Description:** Display an interactive, pannable, and zoomable map showing coffee-related locations.

**Features:**
- Interactive map using Leaflet.js and OpenStreetMap tiles
- Pan and zoom controls
- Touch gestures support on mobile devices
- Smooth animations during pan/zoom operations
- Default view centered on Paris, France (configurable)
- Default zoom level: 13

**Acceptance Criteria:**
- Map loads within 3 seconds on standard broadband connection
- Pan and zoom operations are smooth (60 fps)
- Map tiles load progressively
- Map is responsive to window resizing

---

### FR2: Location Markers
**Priority:** Critical  
**Description:** Display custom markers for different types of coffee locations.

**Location Types:**
1. **Cafes** (amenity=cafe)
   - Icon: ☕ (coffee cup emoji)
   - Color: #8B4513 (saddle brown)
   - Description: Places to sit and consume beverages

2. **Coffee Shops** (shop=coffee)
   - Icon: 🏪 (shop emoji)
   - Color: #228B22 (forest green)
   - Description: Retail stores selling coffee products

3. **Roasteries** (craft=roaster)
   - Icon: 🔥 (fire emoji)
   - Color: #D2691E (chocolate)
   - Description: Coffee roasting facilities

**Features:**
- Custom div-based markers (32x32 pixels)
- Emoji icons for visual distinction
- Colored circular backgrounds
- Clickable markers for details
- Hover effects (desktop)
- Markers update dynamically when map moves

**Acceptance Criteria:**
- Markers are clearly visible on all zoom levels
- Marker colors match specification
- Clicking a marker displays location details
- Multiple markers in same area are distinguishable

---

### FR3: Dynamic Data Loading
**Priority:** Critical  
**Description:** Fetch and display coffee locations based on current map viewport.

**Features:**
- Query OpenStreetMap Overpass API for current map bounds
- Debounced updates (500ms) to reduce API calls
- Loading indicator during data fetch
- Automatic refresh when panning/zooming
- Filters applied to API query
- Maximum 25-second timeout for API requests
- Error handling with user-friendly messages

**Query Coverage:**
- Nodes and ways with `amenity=cafe`
- Nodes and ways with `shop=coffee`
- Nodes and ways with `craft=roaster`

**Acceptance Criteria:**
- Locations load within 5 seconds under normal conditions
- Markers update after map movement stops for 500ms
- Loading indicator appears during fetch
- Error messages display when API fails
- No duplicate markers for same location

---

### FR4: Location Details Sidebar
**Priority:** Critical  
**Description:** Display detailed information about selected locations in a sidebar panel.

**Information Displayed:**

**Basic Information:**
- Name (or "Unnamed" if not available)
- Type (Cafe ☕, Coffee Shop 🏪, or Roastery 🔥)

**Address Information (if available):**
- 📍 Street address with house number
- City and postal code
- Fallback support for contact:* tags (contact:street, contact:housenumber, contact:city, contact:postcode)

**Opening Hours (if available):**
- 🕒 Opening hours with intelligent status indicator:
  - 🟢 Open now (for locations currently open)
  - 🔴 Closed (for locations currently closed)
  - ⚪ Status unknown (for complex or unparseable hours)
- Support for common patterns: "Mo-Fr 09:00-18:00", "24/7", etc.
- Link to OpenStreetMap for detailed opening hours information
- Visual status badges with color-coded backgrounds

**Contact Information (if available):**
- 📞 Phone number (clickable tel: link, with fallback to contact:phone)
- ✉️ Email address (clickable mailto: link, with fallback to contact:email)
- 🌐 Website (opens in new tab with rel="noopener noreferrer", with fallback to contact:website)

**Amenities (if available):**
- 🪑 Outdoor seating (Yes/No)
- 🥤 Takeaway (Yes/No)
- 🚚 Delivery (Yes/No)
- 📶 WiFi availability
- 💰 WiFi fee status (Free/Paid)
- 🚻 Toilets (Yes/No)

**Coffee & Roastery Information (if available):**
- ☕ Coffee roaster brand/name (coffee:roaster tag)
- 🔥 Roastery name/details (roastery tag)

**Additional Details (if available):**
- 🍽️ Cuisine type
- 🥗 Vegetarian options
- 🌱 Vegan options
- 🌾 Gluten-free options
- 🥙 Halal options
- ✡️ Kosher options
- ♿ Wheelchair accessibility
- 💵 Cash payment accepted
- 💳 Card payment accepted
- 🏦 Credit card payment accepted
- 💳 Debit card payment accepted
- 📱 Contactless payment accepted
- ₿ Bitcoin payment accepted
- 💎 Cryptocurrency payment accepted
- 👥 Capacity
- 🚬 Smoking policy

**Reference:**
- OSM link to view/edit on OpenStreetMap.org

**Features:**
- Sanitized output to prevent XSS attacks
- Clickable links open in new tabs
- Empty state with call-to-action when no marker selected
- Scrollable content area for long details

**Acceptance Criteria:**
- Details display within 100ms of marker click
- All user-provided content is sanitized
- Links are validated and safe
- Empty fields are not displayed
- Sidebar is scrollable on mobile devices

---

### FR5: User Geolocation
**Priority:** High  
**Description:** Detect and display user's current location with permission.

**Features:**
- Automatic location detection on page load (optional)
- Manual location button in map controls
- User location marker with custom icon (📍)
- Blue colored marker (#4285F4)
- Accuracy radius display in popup
- Map centers on user location (zoom 15)
- Fallback to default location if denied
- Permission request follows browser standards

**Button States:**
- Default: 📍 (location pin)
- Loading: ⏳ (hourglass)
- After success: 📍 (location pin)

**Error Handling:**
- Permission denied: "Location access denied. Please allow location access in your browser."
- Position unavailable: "Location information is unavailable."
- Timeout: "Location request timed out."
- Not supported: "Geolocation is not supported by your browser."

**Acceptance Criteria:**
- Location detection completes within 10 seconds
- User is prompted for permission only once per session
- Error messages are user-friendly
- Map centers on detected location
- User location marker displays accuracy

---

### FR6: Location Type Filters
**Priority:** High  
**Description:** Toggle visibility of different location types using interactive legend.

**Features:**
- Legend panel with three location types
- Click to toggle each type on/off
- Visual feedback (opacity + strikethrough when disabled)
- All types enabled by default
- Immediate marker refresh when toggling
- Filter state persists during session
- Smooth transitions (200ms opacity)

**Legend Items:**
1. Cafe ☕ (brown circle)
2. Coffee Shop 🏪 (green circle)
3. Roastery 🔥 (orange circle)

**Visual States:**
- Active: Full opacity, normal text
- Disabled: 40% opacity, strikethrough text

**Acceptance Criteria:**
- Clicking legend item toggles filter
- Visual feedback is immediate
- Markers update within 500ms
- Multiple types can be disabled simultaneously
- State persists during map navigation

---

### FR7: Responsive Design
**Priority:** High  
**Description:** Provide optimal viewing experience across all device sizes.

**Desktop Layout (>768px width):**
- Sidebar: 35% width, left side, full height
- Map: 65% width, right side, full height
- Legend: Bottom right corner
- Location button: Top right of map

**Mobile/Tablet Layout (≤768px width):**
- Sidebar: 100% width, top, 40% height
- Map: 100% width, bottom, 60% height
- Legend: Bottom right, smaller font
- Location button: Top right of map

**Touch Optimizations:**
- Minimum 34x34px touch targets
- Touch gesture support for pan/zoom
- No hover-dependent functionality
- Larger legend items on mobile
- Scrollable sidebar content

**Acceptance Criteria:**
- Layout adapts at 768px breakpoint
- All interactive elements are touch-friendly
- Content is readable on 320px width screens
- Sidebar is scrollable on small screens
- Map controls remain accessible

---

### FR8: Loading States and Feedback
**Priority:** Medium  
**Description:** Provide visual feedback for asynchronous operations.

**Loading Indicators:**
1. **Data Loading**
   - Position: Top right of map
   - Style: White card with shadow
   - Text: "Loading coffee locations..."
   - Display: During API fetch

2. **Location Button**
   - Changes to ⏳ during geolocation
   - Disabled state during operation
   - Re-enabled after completion/error

**Acceptance Criteria:**
- Loading indicator appears immediately on fetch start
- Loading indicator disappears after data loads
- Button states prevent double-clicks
- User can cancel operations (close browser tab)

---

## Technical Specifications

### Tech Stack

**Frontend Technologies:**
- HTML5 (semantic markup)
- CSS3 (flexbox, transitions, media queries)
- JavaScript ES6+ (native modules)
- No frameworks or libraries (except Leaflet.js)

**External Libraries:**
- **Leaflet.js v1.9.4** (MIT License)
  - Loaded via CDN: https://unpkg.com/leaflet@1.9.4/
  - Integrity hash: sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=
  - Purpose: Interactive map rendering

**APIs:**
- **Overpass API** (OpenStreetMap)
  - Endpoint: https://overpass-api.de/api/interpreter
  - Method: POST
  - Format: Overpass QL
  - Timeout: 25 seconds (query) + 30 seconds (fetch)

**Development Tools:**
- HTTP server (Python/Node.js) for local testing
- Modern text editor
- Git for version control

---

### Configuration Constants

**Location:** `js/config.js`

```javascript
CONFIG = {
    DEFAULT_LOCATION: [48.8566, 2.3522],  // Paris, France
    DEFAULT_ZOOM: 13,
    USER_LOCATION_ZOOM: 15,
    OVERPASS_TIMEOUT: 30000,              // 30 seconds
    GEOLOCATION_TIMEOUT: 10000,           // 10 seconds
    MAP_MOVE_DEBOUNCE: 500,               // 500ms
    MARKER_SIZE: 32,                      // 32x32 pixels
    COLORS: {
        CAFE: '#8B4513',
        ROASTERY: '#D2691E',
        SHOP: '#228B22',
        USER_LOCATION: '#4285F4'
    }
}

filterState = {
    cafe: true,
    shop: true,
    roastery: true
}
```

---

### Module Structure

**Total Files:** 8 JavaScript modules

1. **config.js** - Configuration constants and mutable state
2. **utils.js** - Pure utility functions (sanitization, debouncing, type detection, opening hours parsing)
3. **ui.js** - UI functions for sidebar and detail display (including opening hours status indicator)
4. **api.js** - Overpass API communication
5. **map.js** - Leaflet map and marker management
6. **geolocation.js** - Browser geolocation features
7. **filters.js** - Location type filtering logic
8. **main.js** - Application initialization and event wiring

**Dependency Graph:**
```
main.js
├── config.js
├── utils.js
├── map.js
│   ├── config.js
│   ├── utils.js
│   ├── ui.js (uses utils.js)
│   └── api.js (uses config.js, utils.js)
├── geolocation.js (uses config.js)
└── filters.js (uses config.js)
```

---

### API Integration

**Overpass API Query Structure:**

```
[out:json][timeout:25];
(
  node["amenity"="cafe"](south,west,north,east);
  way["amenity"="cafe"](south,west,north,east);
  node["shop"="coffee"](south,west,north,east);
  way["shop"="coffee"](south,west,north,east);
  node["craft"="roaster"](south,west,north,east);
  way["craft"="roaster"](south,west,north,east);
);
out center;
```

**Query Parameters:**
- Bounds: Calculated from current map viewport
- Timeout: 25 seconds
- Output: JSON with center coordinates for ways
- Elements: Nodes and ways (not relations)

**Response Processing:**
1. Parse JSON response
2. Extract elements array
3. Filter by active filter state
4. Validate coordinates exist
5. Determine location type from tags
6. Create markers for valid elements

**Error Handling:**
- Network errors: Log to console, show error message
- Timeout errors: Specific timeout message
- Malformed responses: Silently skip invalid elements
- Missing coordinates: Skip element
- Server errors (4xx/5xx): Log and alert user

---

### Opening Hours Parsing

**Feature:** Intelligent parsing of OSM `opening_hours` tag to determine current open/closed status.

**Parser Implementation:**
- Location: `utils.js` - `parseOpeningHours()` function
- Input: OSM opening_hours string
- Output: `{ isOpen: boolean|null, status: string, error: boolean }`

**Supported Patterns:**
1. **24/7 Hours:** "24/7", "always" → Always open
2. **Simple Weekday Ranges:** "Mo-Fr 09:00-18:00" → Open Monday through Friday, 9am to 6pm
3. **Single Days:** "Mo 09:00-18:00" → Open Monday only
4. **Multiple Periods:** "Mo-Fr 09:00-18:00; Sa 10:00-16:00" → Different hours on different days
5. **Week Wrapping:** "Fr-Mo 10:00-20:00" → Handles week boundary crossing

**Status Indicators:**
- 🟢 **Open now** (Green badge) - Location is currently open based on parsed hours
- 🔴 **Closed** (Red badge) - Location is currently closed based on parsed hours
- ⚪ **Status unknown** (Gray badge) - Hours format not parseable or ambiguous

**Parsing Logic:**
1. Check for simple cases (24/7, always)
2. Extract current day and time
3. Parse patterns using regex matching
4. Compare current time against parsed opening hours
5. Return appropriate status

**Limitations:**
- Does not support complex patterns (PH, sunrise/sunset, conditional hours)
- Does not handle exceptions or holidays
- Basic time zone handling (uses browser local time)
- Unparseable patterns default to "Unknown" status

**User Experience:**
- Status badge displayed prominently in location details
- Link to OpenStreetMap provided for detailed/complex hours
- Color-coded visual feedback for quick scanning
- CSS styling in `main.css` with `.open-status` classes

---

### Browser APIs Used

1. **Fetch API**
   - Purpose: HTTP requests to Overpass API
   - Features: POST requests, AbortController for timeout
   - Fallback: None (required for operation)

2. **Geolocation API**
   - Purpose: User location detection
   - Features: getCurrentPosition with high accuracy
   - Fallback: Default location (Paris)

3. **ES6 Modules**
   - Purpose: Code organization
   - Features: import/export statements
   - Requirement: Modern browser support

4. **DOM APIs**
   - Purpose: UI manipulation
   - Features: querySelector, addEventListener, innerHTML
   - Fallback: None (required for operation)

---

### State Management

**Global Mutable State:**
- `filterState` (config.js) - Location type visibility
- `mapInstance` (map.js) - Leaflet map instance
- `coffeeMarkers` (map.js) - Layer group for markers
- `userLocationMarker` (geolocation.js) - User location marker

**State Mutations:**
- Filter toggles update `filterState`
- Map initialization creates `mapInstance`
- Marker updates replace `coffeeMarkers` layer group
- Location detection updates `userLocationMarker`

**State Synchronization:**
- Filter changes trigger marker refresh
- Map movements trigger debounced data fetch
- User location updates trigger map recenter

---

## User Interface Specifications

### Color Palette

**Primary Colors:**
- Coffee Brown: #6F4E37 (headers, links)
- Saddle Brown: #8B4513 (cafe markers)
- Chocolate: #D2691E (roastery markers)
- Forest Green: #228B22 (shop markers)
- Google Blue: #4285F4 (user location)

**Neutral Colors:**
- White: #FFFFFF (backgrounds, cards)
- Light Gray: #F5F5F5 (sidebar background)
- Medium Gray: #999999 (empty state text)
- Dark Gray: #333333 (text)
- Border Gray: #DDDDDD (borders)

**Semantic Colors:**
- Success: Inherited from checkmarks (✓)
- Error: Browser default alert styling
- Loading: Neutral gray tone

---

### Typography

**Font Family:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Font Sizes:**
- Page Title (h1): 24px
- Section Title (h2): 22px
- Legend Title (h3): 16px
- Body Text: 14-16px
- Detail Labels: 14px
- Mobile Text: 12-14px

**Font Weights:**
- Headers: Default (browser default bold)
- Labels: Bold
- Body: Normal (400)

---

### Favicon

**Files:**
- `favicon.svg` - Scalable vector graphic (primary, for modern browsers)
- `favicon.ico` - Bitmap icon (fallback, for older browsers)
- `favicon.png` - PNG source (32x32px, used to generate ICO)

**Design:**
- Icon: Coffee cup with steam
- Primary Color: #6F4E37 (Coffee Brown)
- Dark Color: #3E2723 (Coffee inside cup)
- Steam Color: #8B7355 (Light Brown, semi-transparent)
- Size: 32x32px (standard favicon size)
- Format: SVG for modern browsers with ICO fallback

**HTML Implementation:**
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="alternate icon" href="favicon.ico">
```

**Browser Support:**
- SVG favicon: Modern browsers (Chrome 80+, Firefox 41+, Safari 9+, Edge 79+)
- ICO favicon: All browsers including legacy IE

---

### Layout and Spacing

**Desktop Grid:**
- Sidebar: 35% width
- Map Container: 65% width
- Gutter: 2px border

**Mobile Stack:**
- Sidebar: 40% height
- Map Container: 60% height

**Spacing Scale:**
- xs: 5px
- sm: 8px
- md: 10px
- lg: 15px
- xl: 20px

**Component Spacing:**
- Card Padding: 20px
- Detail Row Margin: 10px
- Legend Item Margin: 8px
- Button Padding: 10px 20px

---

### Component Specifications

**Sidebar:**
- Width: 35% (desktop), 100% (mobile)
- Background: #F5F5F5
- Border: 2px solid #DDD (right/bottom)
- Overflow: Auto (vertical scroll)

**Map Container:**
- Width: 65% (desktop), 100% (mobile)
- Height: 100vh (desktop), 60vh (mobile)
- Position: Relative (for absolute children)

**Legend Card:**
- Position: Absolute (bottom: 20px, right: 20px)
- Background: White
- Border Radius: 8px
- Shadow: 0 2px 10px rgba(0,0,0,0.2)
- Padding: 15px
- Z-index: 1000

**Location Button:**
- Position: Absolute (top: 70px, right: 20px)
- Size: 34x34px
- Background: White
- Border: 2px solid rgba(0,0,0,0.2)
- Border Radius: 4px
- Shadow: 0 2px 5px rgba(0,0,0,0.3)
- Z-index: 1000

**Details Card:**
- Background: White
- Border Radius: 8px
- Padding: 20px
- Shadow: 0 2px 10px rgba(0,0,0,0.1)

**Open Status Badges:**
- Display: Inline-block
- Padding: 2px 8px
- Border Radius: 4px
- Font Size: 0.9em
- Font Weight: Bold
- Margin Bottom: 5px
- **Open (Green):**
  - Color: #2d7a2d
  - Background: #e8f5e9
- **Closed (Red):**
  - Color: #c62828
  - Background: #ffebee
- **Unknown (Gray):**
  - Color: #666
  - Background: #f5f5f5

**Markers:**
- Size: 32x32px
- Shape: Circular background
- Font Size: 16px (emoji)
- Z-index: Default Leaflet

---

### Animations and Transitions

**Filter Toggle:**
```css
transition: opacity 0.2s;
```
- Duration: 200ms
- Property: opacity
- Easing: Default (ease)

**Button Hover:**
```css
transition: background-color 0.2s;
```
- Duration: 200ms
- Property: background-color
- Easing: Default (ease)

**Map Transitions:**
- Pan: Smooth (Leaflet default)
- Zoom: Smooth (Leaflet default)
- Marker Updates: Instant (no fade)

---

### Accessibility

**Keyboard Navigation:**
- Tab order: Sidebar → Location button → Map → Legend
- Enter/Space on legend items toggles filters
- Map controls keyboard accessible (Leaflet default)

**Screen Reader Support:**
- Semantic HTML elements
- Alt text for meaningful images (emojis are decorative)
- ARIA labels on buttons: `title="Show my location"`
- Proper heading hierarchy (h1 → h2 → h3)

**Visual Accessibility:**
- Minimum 4.5:1 contrast ratio for text
- Colorblind-friendly icon system (emojis + colors)
- 34x34px minimum touch targets
- Focus indicators on interactive elements

**Limitations:**
- Map tiles may not have sufficient contrast (OpenStreetMap default)
- Emoji rendering varies by system
- No screen reader announcements for dynamic marker updates

---

## Data Sources and Integration

### OpenStreetMap (OSM)

**Provider:** OpenStreetMap Foundation  
**License:** Open Data Commons Open Database License (ODbL)  
**Data Access:** Overpass API

**Query Endpoint:**
- URL: https://overpass-api.de/api/interpreter
- Method: POST
- Content-Type: application/x-www-form-urlencoded
- Rate Limits: Fair use policy, no authentication required

**OSM Tags Used:**

| Tag | Value | Description |
|-----|-------|-------------|
| amenity | cafe | Cafes and coffee shops (sit-down) |
| shop | coffee | Retail coffee shops |
| craft | roaster | Coffee roasting facilities |

**Additional Tags Displayed:**
- **Basic Info:** name
- **Address:** addr:street, addr:housenumber, addr:city, addr:postcode
- **Address Fallback:** contact:street, contact:housenumber, contact:city, contact:postcode
- **Opening Hours:** opening_hours (with intelligent parsing for "Open now" status)
- **Contact:** phone, email, website
- **Contact Fallback:** contact:phone, contact:email, contact:website
- **Coffee/Roastery:** coffee:roaster, roastery
- **Amenities:** outdoor_seating, takeaway, delivery, toilets
- **Internet:** internet_access, wifi, internet_access:fee
- **Food:** cuisine
- **Diet:** diet:vegetarian, diet:vegan, diet:gluten_free, diet:halal, diet:kosher
- **Accessibility:** wheelchair
- **Payment:** payment:cash, payment:cards, payment:credit_cards, payment:debit_cards, payment:contactless, payment:bitcoin, payment:cryptocurrencies
- **Other:** capacity, smoking

**Data Freshness:**
- Updated in near real-time from OSM database
- No local caching (always fetches latest data)
- Community-maintained data (may have gaps or errors)

---

### Leaflet.js Map Tiles

**Tile Provider:** OpenStreetMap Foundation  
**Tile URL Template:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`  
**Attribution:** © OpenStreetMap contributors  
**License:** CC BY-SA

**Tile Specifications:**
- Format: PNG (256x256 pixels)
- Zoom Levels: 0-19
- Projection: Web Mercator (EPSG:3857)
- Subdomains: a, b, c (load balancing)

**Usage Policy:**
- Free for moderate use
- Tile usage policy compliance required
- No bulk downloading
- Attribution required

---

## Architecture

### Design Patterns

**Module Pattern:**
- Each file exports specific functions
- No global namespace pollution
- Import/export for dependencies

**Observer Pattern:**
- Event listeners for user interactions
- Callbacks for asynchronous operations
- Map events (moveend, click)

**Factory Pattern:**
- `createMarkerIcon()` for marker creation
- `createDetailRow()` for UI generation

**Strategy Pattern:**
- `getLocationType()` determines marker type
- Filter functions modify query results

---

### Data Flow

**Application Initialization:**
1. Browser loads HTML
2. Leaflet.js loads from CDN
3. main.js loads as ES6 module
4. Module dependencies resolve
5. Map initializes with default location
6. Geolocation attempts (optional)
7. Initial data fetch for default view
8. Markers render on map
9. Event listeners attached

**Map Movement:**
1. User pans/zooms map
2. Leaflet fires `moveend` event
3. Debounce timer starts (500ms)
4. Timer completes, update triggered
5. Current bounds calculated
6. API query with new bounds
7. Response parsed and filtered
8. Old markers cleared
9. New markers created and added

**Marker Interaction:**
1. User clicks marker
2. Click handler extracts element data
3. `showCafeDetails()` called with element
4. Detail sections generated
5. HTML sanitized
6. Sidebar content updated
7. Empty state removed

**Filter Toggle:**
1. User clicks legend item
2. `toggleFilter()` called
3. Filter state updated in config
4. Legend item styling updated
5. Marker update callback triggered
6. Existing data re-filtered
7. Markers recreated based on new filter state

---

### Error Handling Strategy

**Levels of Error Handling:**

1. **Silent Failure** (Log only)
   - Invalid coordinates (skip element)
   - Missing optional fields (don't display)
   - Malformed URLs (don't create link)

2. **Console Logging** (Developer feedback)
   - API fetch errors
   - Network timeouts
   - JavaScript errors

3. **User Notification** (Alert/Message)
   - Geolocation denied
   - API timeout
   - Network failure
   - Browser incompatibility

**Error Recovery:**
- API failures: Keep existing markers
- Geolocation failure: Use default location
- Invalid data: Skip and continue
- No graceful degradation for ES6 modules (required)

---

### Performance Optimizations

**Network Optimization:**
- Debounced API calls (500ms delay)
- AbortController for request cancellation
- Single API endpoint (no multiple requests)
- Minimal query scope (viewport only)

**Rendering Optimization:**
- Layer groups for efficient marker management
- Batch DOM updates in sidebar
- CSS transitions instead of JavaScript animations
- No complex computations during scroll

**Memory Management:**
- Old markers removed before creating new ones
- No memory leaks from event listeners
- Layer groups automatically manage marker lifecycle
- No global state accumulation

**Lazy Loading:**
- Data fetched only when needed (viewport change)
- Tiles load progressively (Leaflet default)
- No preloading or prefetching

**Limitations:**
- No service worker or offline support
- No data caching
- No virtual scrolling
- No image optimization (uses emojis)

---

## Security Requirements

### Security Measures Implemented

**1. Cross-Site Scripting (XSS) Prevention**

**sanitizeText() Function:**
```javascript
export function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```
- Escapes all HTML entities
- Used for all user-provided text fields
- Prevents script injection

**sanitizeUrl() Function:**
```javascript
export function sanitizeUrl(url) {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            return urlObj.href;
        }
    } catch (e) {
        return null;
    }
    return null;
}
```
- Validates URL format
- Allows only http/https protocols
- Prevents javascript:, data:, file: schemes
- Returns null for invalid URLs

**Additional XSS Protections:**
- No use of `eval()` or `Function()` constructor
- No innerHTML with unsanitized content
- Email and phone validation before link creation
- OSM element ID validation (numeric only)

**2. Subresource Integrity (SRI)**

External resources loaded with integrity hashes:
```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""></script>
```

**3. Content Security Policy (CSP)**

Recommended CSP headers (not currently implemented):
```
Content-Security-Policy: 
    default-src 'self'; 
    script-src 'self' https://unpkg.com; 
    style-src 'self' https://unpkg.com; 
    img-src 'self' https://*.tile.openstreetmap.org data:; 
    connect-src https://overpass-api.de;
```

**4. Link Security**

All external links use:
```html
target="_blank" rel="noopener noreferrer"
```
- `noopener`: Prevents access to window.opener
- `noreferrer`: Prevents referrer leakage

**5. Data Validation**

- Phone numbers: Minimum 3 digits required for tel: link
- Email addresses: Regex validation before mailto: link
- URLs: Protocol and format validation
- Element IDs: Numeric validation for OSM links
- Element types: Whitelist validation (node, way, relation)

**6. Request Timeout**

- API requests timeout after 30 seconds
- Prevents hung requests
- AbortController for proper cancellation

---

### Security Limitations

**Known Limitations:**
- No HTTPS enforcement on development servers
- No CSP headers (static hosting limitation)
- No rate limiting on API calls (relies on Overpass fair use)
- No authentication (not required for public data)
- Geolocation data exposed to Overpass API (IP-based location)
- No input sanitization on OSM data (trusted source)

**Data Privacy:**
- No cookies used
- No localStorage usage
- No tracking scripts
- No analytics
- No user data collection
- Geolocation requests require explicit permission
- OpenStreetMap may log IP addresses

---

## Browser Compatibility

### Minimum Requirements

**Required Browser Features:**
- ES6 Module support (import/export)
- Fetch API
- Promises and async/await
- Arrow functions
- Template literals
- const/let
- Geolocation API (optional, degrades gracefully)

### Supported Browsers

**Desktop:**
- Chrome 61+ (September 2017)
- Firefox 60+ (May 2018)
- Safari 11+ (September 2017)
- Edge 16+ (October 2017)
- Opera 48+ (September 2017)

**Mobile:**
- Chrome Android 61+
- Safari iOS 11+
- Firefox Android 60+
- Samsung Internet 8+

### Unsupported Browsers

**No Support:**
- Internet Explorer (all versions)
- Edge Legacy (pre-Chromium)
- Safari 10.x and earlier
- Chrome 60 and earlier
- Firefox 59 and earlier

**Reason:** Native ES6 module support is non-negotiable for zero-build architecture.

### Progressive Enhancement

**Core Functionality:**
- Map display (requires JavaScript)
- Marker display (requires JavaScript)
- Location details (requires JavaScript)

**Enhanced Features:**
- Geolocation (degrades to default location)
- Smooth animations (works without transitions)
- Hover effects (desktop only)

**No-JavaScript Fallback:**
Not provided - application requires JavaScript to function.

---

## Deployment

### Hosting Platform

**Platform:** GitHub Pages  
**Repository:** jowi-zuehlke/osm-coffee  
**Branch:** gh-pages  
**URL:** https://jowi-zuehlke.github.io/osm-coffee/

### Deployment Process

**Production Deployment:**
- **Trigger:** Push to `main` branch or manual dispatch
- **Workflow:** `.github/workflows/deploy.yml`
- **Action:** JamesIves/github-pages-deploy-action@v4
- **Target Branch:** gh-pages
- **Deploy Folder:** . (root)
- **Build Step:** None (static files)
- **Clean Exclude:** pr-preview/ (preserves PR previews)

**Preview Deployment:**
- **Trigger:** Pull request opened/updated
- **Workflow:** `.github/workflows/deploy-preview.yml`
- **Action:** JamesIves/github-pages-deploy-action@v4
- **Target Branch:** gh-pages
- **Deploy Folder:** pr-preview/pr-{number}/
- **Automatic Comment:** PR preview URL posted as comment

### Deployment Requirements

**Files Deployed:**
- index.html
- favicon.svg (primary favicon)
- favicon.ico (fallback favicon)
- favicon.png (source image for ICO generation)
- styles/main.css
- js/*.js (8 files)
- README.md (optional)
- ARCHITECTURE.md (optional)

**Not Deployed:**
- .git/
- .github/ (workflow files)
- .gitignore
- node_modules/ (none exist)

### Rollback Procedure

**Manual Rollback:**
1. Identify last good commit on gh-pages branch
2. Force push previous commit to gh-pages
3. Verify deployment at live URL

**Automated Rollback:**
Not implemented - relies on git history for rollback.

### Monitoring

**Availability Monitoring:**
Not implemented - relies on GitHub Pages uptime.

**Error Tracking:**
Not implemented - errors logged to browser console only.

**Performance Monitoring:**
Not implemented - relies on browser DevTools.

### Domain Configuration

**Current Domain:** jowi-zuehlke.github.io/osm-coffee  
**Custom Domain:** Not configured  
**SSL/TLS:** Automatically provided by GitHub Pages (Let's Encrypt)

---

## Testing

### Test Infrastructure

**Test Framework:** Node.js Built-in Test Runner (node:test)  
**Test Type:** Unit Tests  
**Test Location:** `/tests/` directory  
**Test Execution:** `npm test`

### Test Coverage

The application includes comprehensive unit tests for all business logic modules:

#### 1. utils.test.js
Tests for utility functions in `js/utils.js`:
- **sanitizeText()**: HTML entity encoding to prevent XSS attacks
  - Tests escaping of `<`, `>`, `&`, `"`, `'` characters
  - Tests plain text handling
  - Tests empty string handling
- **sanitizeUrl()**: URL validation and sanitization
  - Tests acceptance of http/https protocols
  - Tests rejection of javascript: and data: protocols
  - Tests handling of null/undefined/empty inputs
  - Tests invalid URL format handling
  - Tests preservation of query parameters
- **debounce()**: Function debouncing for performance
  - Tests delayed execution
  - Tests multiple rapid calls (only executes once)
  - Tests timer reset on each call
  - Tests argument passing
- **getLocationType()**: Location type detection from OSM tags
  - Tests roastery identification (craft=roaster)
  - Tests coffee shop identification (shop=coffee)
  - Tests cafe identification (amenity=cafe, default)
  - Tests priority order (roastery > shop > cafe)
- **parseOpeningHours()**: Opening hours parsing and status determination
  - Tests 24/7 and "always" patterns (returns Open 24/7)
  - Tests empty and null input handling (returns Unknown)
  - Tests simple weekday range patterns (Mo-Fr 09:00-18:00)
  - Tests single day patterns (Mo 09:00-18:00)
  - Tests complex patterns with semicolons (multiple periods)
  - Tests unparseable patterns (returns Unknown with error flag)
  - Time-dependent tests verify valid result structure

#### 2. favorites.test.js
Tests for favorites management in `js/favorites.js`:
- **loadFavorites()**: Loading from localStorage
  - Tests empty state
  - Tests valid JSON parsing
  - Tests error handling for invalid JSON
- **addFavorite()**: Adding favorites
  - Tests adding to empty list
  - Tests adding multiple favorites
  - Tests duplicate prevention
  - Tests event dispatching
  - Tests distinction between different types with same ID
- **removeFavorite()**: Removing favorites
  - Tests removal of existing favorites
  - Tests selective removal
  - Tests event dispatching
  - Tests handling of non-existent favorites
- **isFavorite()**: Checking favorite status
  - Tests favorited and non-favorited elements
  - Tests type distinction
- **toggleFavorite()**: Toggle favorite status
  - Tests adding when not favorited
  - Tests removing when favorited
  - Tests multiple toggles

#### 3. api.test.js
Tests for API functions in `js/api.js`:
- **getElementCoordinates()**: Coordinate extraction from OSM elements
  - Tests node type elements (direct lat/lon)
  - Tests way type elements (center property)
  - Tests elements without coordinates (returns null)
  - Tests zero and negative coordinates
  - Tests priority of node lat/lon over center

#### 4. filters.test.js
Tests for filter functionality in `js/filters.js`:
- **toggleFilter()**: Location type filtering
  - Tests toggling from true to false
  - Tests toggling from false to true
  - Tests callback execution
  - Tests DOM class updates (disabled/enabled)
  - Tests multiple filter types
  - Tests handling of missing DOM elements

### Test Execution

**Local Testing:**
```bash
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode
```

**CI/CD Testing:**
Tests run automatically on:
- Every pull request to `main` branch
- Every push to `main` branch

The test workflow (`.github/workflows/test.yml`) uses:
- Node.js 20 (LTS)
- No external dependencies beyond Node.js built-ins
- Fail-fast: PR cannot merge if tests fail

### Test Architecture

**Mocking Strategy:**
- **localStorage**: Custom mock implementation for Node.js environment
- **document/DOM**: Minimal mock objects for DOM-dependent functions
- **window**: Event dispatching mock for CustomEvent testing

**Test Isolation:**
- Each test suite resets state in `beforeEach()` hooks
- localStorage is cleared between tests
- Filter state is reset to defaults
- No shared mutable state between tests

### Coverage Goals

**Current Coverage:**
- Business logic modules: 100% function coverage
- Pure utility functions: 100% branch coverage
- State management: Complete happy path and error path coverage

**Not Covered (Intentionally):**
- UI rendering functions (require browser environment)
- Map integration (Leaflet.js interactions)
- Geolocation API (browser-only feature)
- Network calls (API mocking would require external dependencies)

### Future Testing Enhancements

**Planned Additions:**
1. Integration tests using Playwright
2. Visual regression testing
3. Performance benchmarking
4. Accessibility testing (screen reader compatibility)
5. End-to-end tests in CI/CD

---

## Future Enhancements

### Potential Features

**High Priority:**
1. **Search Functionality**
   - Search by cafe name
   - Search by address/city
   - Geocoding integration
   - Search result markers

2. **Favorites/Bookmarks**
   - Save favorite locations
   - localStorage persistence
   - Export/import favorites
   - Shareable bookmark lists

3. **Routing**
   - Directions to selected cafe
   - Walking/cycling routes
   - Public transport integration
   - Distance calculations

**Medium Priority:**
4. **Clustering**
   - Marker clustering at low zoom levels
   - Performance optimization for dense areas
   - Cluster expand on click
   - Count display in clusters

5. **Enhanced Filters**
   - Filter by amenities (WiFi, outdoor seating)
   - Filter by opening hours (open now)
   - Filter by rating (if available)
   - Multiple filter combinations

6. **Social Features**
   - User reviews and ratings
   - Photo uploads
   - Comments and tips
   - Community contributions

7. **Offline Support**
   - Service worker for offline access
   - Cached map tiles
   - Cached location data
   - Offline indicator

**Low Priority:**
8. **Data Export**
   - Export visible locations as CSV
   - Export as GeoJSON
   - Print-friendly view
   - Share current view URL

9. **Alternative Map Styles**
   - Dark mode map
   - High contrast mode
   - Satellite imagery option
   - Custom tile providers

10. **Advanced Details**
    - User-submitted photos
    - Price range indicators
    - Popular times
    - Menu links

### Technical Improvements

**Code Quality:**
- Implement TypeScript for type safety
- Add ESLint configuration
- Set up pre-commit hooks
- Add integration tests using Playwright

**Performance:**
- Implement service worker
- Add data caching strategy
- Optimize marker rendering
- Lazy load detail sections

**Accessibility:**
- ARIA live regions for dynamic updates
- Keyboard shortcut documentation
- Screen reader testing
- WCAG 2.1 AA compliance audit

**Security:**
- Implement CSP headers
- Add rate limiting client-side
- Security audit of dependencies
- Automated vulnerability scanning

**DevOps:**
- Add staging environment
- Performance monitoring
- Error tracking (Sentry, etc.)
- Automated security vulnerability scanning

### Non-Goals

**Explicitly Out of Scope:**
- User authentication/accounts
- Commercial features (paid listings)
- Native mobile apps
- Real-time chat/messaging
- Payment processing
- Reservation system
- Delivery ordering
- Social network integration

---

## Appendix

### Glossary

**Terms:**
- **OSM:** OpenStreetMap, collaborative mapping project
- **Overpass API:** Read-only API for querying OSM data
- **Leaflet.js:** JavaScript library for interactive maps
- **ES6 Modules:** JavaScript module system using import/export
- **SPA:** Single Page Application
- **CDN:** Content Delivery Network
- **XSS:** Cross-Site Scripting security vulnerability
- **SRI:** Subresource Integrity for resource verification

### References

**Documentation:**
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

**Standards:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

### Version History

**Version 1.0** (Current)
- Initial release with core features
- Interactive map with OpenStreetMap data
- Three location types (cafe, shop, roastery)
- User geolocation
- Location type filters
- Responsive design
- Security hardening

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-16  
**Maintained By:** OSM Coffee Project Team
