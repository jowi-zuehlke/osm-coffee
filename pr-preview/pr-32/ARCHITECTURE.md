# OSM Coffee - Architecture Documentation

## Overview

This document describes the architecture of the OSM Coffee application, a modular vanilla JavaScript application for displaying coffee locations on an interactive map.

## Design Principles

1. **Modular Structure**: Code is split across focused modules to improve maintainability and enable parallel development
2. **No Build Tools**: Uses native ES6 modules - no bundlers, transpilers, or build steps required
3. **Separation of Concerns**: Each module has a single, well-defined responsibility
4. **Zero Dependencies**: No npm packages - only Leaflet.js loaded from CDN

## Module Architecture

### Dependency Graph

```
main.js
├── config.js
├── utils.js
├── map.js
│   ├── config.js
│   ├── utils.js
│   ├── ui.js
│   │   ├── utils.js
│   └── api.js
│       ├── config.js
│       └── utils.js
├── geolocation.js
│   └── config.js
└── filters.js
    └── config.js
```

### Module Descriptions

#### config.js
**Purpose**: Centralized configuration constants

**Exports**:
- `CONFIG`: Application configuration object
  - Default map location and zoom levels
  - API timeouts
  - UI constants (marker sizes, colors)
  - Debounce delays
- `filterState`: Mutable state for location type filters

**Dependencies**: None

**Notes**: This module should only contain configuration - no logic

---

#### utils.js
**Purpose**: Pure utility functions used across the application

**Exports**:
- `sanitizeText(text)`: Prevents XSS by escaping HTML in user-provided text
- `sanitizeUrl(url)`: Validates and sanitizes URLs (only allows http/https)
- `debounce(func, delay)`: Creates debounced versions of functions
- `getLocationType(tags)`: Determines location type from OSM tags

**Dependencies**: None

**Notes**: All functions are pure (no side effects, no DOM manipulation)

---

#### ui.js
**Purpose**: User interface functions for the sidebar and detail display

**Exports**:
- `showCafeDetails(element)`: Displays location details in the sidebar

**Internal Functions**:
- `createDetailRow()`: Generates HTML for a detail row
- `generateAddressHTML()`: Generates address section
- `generateContactHTML()`: Generates contact info section
- `generateAmenitiesHTML()`: Generates amenities section
- `generateAdditionalDetailsHTML()`: Generates additional details
- `generateOSMReferenceHTML()`: Generates OSM link

**Dependencies**: `utils.js`

**Notes**: Responsible for all HTML generation for the sidebar

---

#### api.js
**Purpose**: Communication with the Overpass API

**Exports**:
- `fetchCoffeeLocations(bounds)`: Fetches coffee locations within map bounds
- `getElementCoordinates(element)`: Extracts coordinates from OSM elements

**Internal Functions**:
- `buildOverpassQuery(bounds)`: Constructs Overpass QL query

**Dependencies**: `config.js`, `utils.js`

**Notes**: Handles all API communication, error handling, and data filtering

---

#### map.js
**Purpose**: Leaflet map initialization and marker management

**Exports**:
- `initMap()`: Initializes the map and returns map instance and functions

**Internal Functions**:
- `createMarkerIcon()`: Creates custom Leaflet div icons
- `getIconForType()`: Returns appropriate icon for location type
- `createCoffeeMarker()`: Creates and adds a marker to the map
- `updateCoffeeMarkers()`: Refreshes all markers on the map

**Dependencies**: `config.js`, `utils.js`, `ui.js`, `api.js`

**Notes**: Manages all map-related functionality and marker lifecycle

---

#### geolocation.js
**Purpose**: Browser geolocation features

**Exports**:
- `initGeolocation(map, userIcon)`: Initializes geolocation with map instance
- `showUserLocation(userIcon)`: Handles location button click

**Internal Functions**:
- `showUserLocationMarker()`: Creates user location marker
- `getGeolocationErrorMessage()`: Formats error messages

**Dependencies**: `config.js`

**Notes**: Handles all browser geolocation API interactions

---

#### filters.js
**Purpose**: Location type filtering functionality

**Exports**:
- `toggleFilter(type, callback)`: Toggles filter for a location type
- `initFilters(callback)`: Sets up filter event listeners

**Dependencies**: `config.js`

**Notes**: Manages filter state and legend UI updates

---

#### main.js
**Purpose**: Application initialization and event wiring

**Exports**: None (entry point)

**Functions**:
- `init()`: Initializes all modules and wires up events

**Dependencies**: All other modules

**Notes**: This is the entry point that orchestrates the entire application

---

## Data Flow

### Application Initialization
1. `main.js` runs when DOM is ready
2. Map is initialized (`map.js`)
3. Geolocation is initialized (`geolocation.js`)
4. Initial coffee locations are fetched (`api.js`)
5. Markers are created and added to map (`map.js`)
6. Event listeners are attached (`filters.js`, `geolocation.js`)

### Map Movement
1. User pans/zooms map
2. Leaflet fires `moveend` event
3. Debounced update function triggers
4. New bounds are calculated
5. API fetches locations for new bounds (`api.js`)
6. Old markers are cleared
7. New markers are created and added

### Marker Click
1. User clicks marker
2. Click handler fires
3. `showCafeDetails()` is called with OSM element (`ui.js`)
4. Detail sections are generated with sanitized data
5. Sidebar content is updated

### Filter Toggle
1. User clicks legend item
2. `toggleFilter()` is called (`filters.js`)
3. Filter state is updated (`config.js`)
4. Legend item styling is updated
5. `updateCoffeeMarkers()` is triggered
6. Markers are re-fetched and filtered

### Location Button
1. User clicks location button
2. `showUserLocation()` is called (`geolocation.js`)
3. Browser geolocation API is invoked
4. User location marker is created
5. Map is centered on user location

## State Management

### Global State
- `filterState` (config.js): Tracks which location types are enabled
- `map` (map.js): Leaflet map instance
- `coffeeMarkers` (map.js): Layer group for coffee location markers
- `userLocationMarker` (geolocation.js): User location marker instance

### State Mutations
- Filter toggles mutate `filterState`
- Geolocation mutates `userLocationMarker`
- Map movements trigger marker refresh

## Error Handling

- API timeouts: 30 seconds for Overpass API
- Geolocation timeouts: 10 seconds
- Network errors: Logged to console with user-friendly messages
- Invalid data: Silently skipped (e.g., locations without coordinates)
- XSS prevention: All user-provided content is sanitized

## Performance Optimizations

- Debounced map updates (500ms) to reduce API calls
- Efficient marker management (clear/recreate only when needed)
- Minimal DOM manipulation (batch updates in sidebar)
- Layer groups for efficient marker management

## Security Considerations

- All external content is sanitized (`sanitizeText`, `sanitizeUrl`)
- Only http/https protocols allowed in URLs
- External libraries loaded with integrity hashes
- No eval or innerHTML with unsanitized content

## Browser Compatibility

- Requires ES6 module support (all modern browsers)
- Uses native Promise and async/await
- Geolocation API (graceful fallback if unavailable)
- Fetch API for network requests

## Testing Strategy

Since this is a simple static application without build tools:

1. **Manual Testing**: Open in browser and test all features
2. **Syntax Validation**: Use `node --check` for JavaScript files
3. **Cross-Browser Testing**: Test in Chrome, Firefox, Safari, Edge
4. **Mobile Testing**: Test responsive design on various screen sizes
5. **Network Testing**: Test with slow connections and offline scenarios

## Future Extensibility

To add new features:

1. **New Location Type**: 
   - Update Overpass query in `api.js`
   - Add icon and color to `config.js`
   - Update filter logic in `filters.js`
   - Add legend item to `index.html`

2. **New Detail Field**:
   - Add generation function to `ui.js`
   - Call from `showCafeDetails()`

3. **New Map Layer**:
   - Add initialization in `map.js`
   - Export control function if needed

4. **New Module**:
   - Create new `.js` file in `js/` directory
   - Export relevant functions
   - Import in dependent modules
   - Update this documentation

## Deployment

The application is deployed to GitHub Pages:
- No build step required
- All files are served as-is
- ES6 modules work natively in all modern browsers
- CDN resources loaded at runtime
