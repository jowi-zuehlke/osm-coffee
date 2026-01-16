# osm-coffee
Map of ☕️ hotspots

**[🌐 Live Preview](https://jowi-zuehlke.github.io/osm-coffee/)**

## Overview
A single page application that displays an interactive map highlighting cafes and roasteries using OpenStreetMap data.

## Features
- 🗺️ Interactive map powered by OpenStreetMap and Leaflet.js
- ☕ Displays cafes (places to sit and drink) with coffee cup markers
- 🏪 Displays coffee shops (retail stores selling coffee products) with shop markers
- 🔥 Displays roasteries with flame markers
- 📍 Automatically detects user location (with permission)
- 🔄 Updates markers when panning/zooming the map
- 💬 Click markers for detailed information (name, hours, address, website)
- ⭐ Save favorite cafes for quick access (persists in browser storage)
- 📱 Responsive design works on mobile and desktop
- 😄 Random coffee jokes in the footer for a fun touch

## Project Structure
```
osm-coffee/
├── index.html              # Main HTML file
├── favicon.svg             # Favicon (SVG format)
├── favicon.ico             # Favicon (ICO format, fallback)
├── favicon.png             # Favicon source (PNG, 32x32)
├── styles/
│   └── main.css           # Application styles
├── js/
│   ├── main.js            # Main application initialization
│   ├── config.js          # Configuration constants
│   ├── utils.js           # Utility functions (sanitization, etc.)
│   ├── ui.js              # UI functions (sidebar details display)
│   ├── api.js             # OpenStreetMap API integration
│   ├── map.js             # Map initialization and marker management
│   ├── geolocation.js     # User location tracking
│   ├── filters.js         # Location type filtering
│   ├── favorites.js       # Favorites management (localStorage)
│   └── jokes.js           # Coffee jokes for footer
└── README.md
```

## How to Use
1. Open `index.html` in a web browser
2. Allow location access (optional) for a personalized starting view
3. Pan and zoom the map to explore coffee locations
4. Click on markers to see details about each cafe or roastery
5. Click the ❤️ button in cafe details to save it as a favorite
6. View your favorites in the "⭐ Favorites" section at the top of the sidebar
7. Click on a favorite to pan the map to that location and show its details

## Running Locally
Serve the application with any HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Then open http://localhost:8080 in your browser
```

**Note:** The application must be served via HTTP/HTTPS (not opened directly as a file) because it uses ES6 modules.

## Technology Stack
- HTML5
- CSS3
- JavaScript (ES6 Modules, Vanilla JS)
- Leaflet.js (OpenStreetMap library, loaded via CDN)
- Overpass API (OpenStreetMap data query)

## Code Organization
The codebase is organized into modular JavaScript files to improve maintainability and enable parallel development:

- **config.js**: Centralized configuration (colors, timeouts, default locations)
- **utils.js**: Reusable utility functions (sanitization, debouncing, type detection)
- **ui.js**: All UI-related code (sidebar, detail rows, HTML generation, favorites list)
- **api.js**: API communication with Overpass (query building, data fetching)
- **map.js**: Leaflet map initialization, marker creation and management
- **geolocation.js**: Browser geolocation features
- **filters.js**: Location type filtering logic
- **favorites.js**: Favorites management with localStorage persistence
- **jokes.js**: Collection of coffee jokes displayed randomly in footer
- **main.js**: Application initialization and event wiring

## Data Source
Coffee location data is fetched from OpenStreetMap via the Overpass API, querying for:
- `amenity=cafe` - Cafes and coffee shops where you can sit and consume beverages
- `shop=coffee` - Retail shops selling coffee beans, ground coffee, and equipment
- `craft=roaster` - Coffee roasting facilities

## Testing

The project includes comprehensive unit tests for all business logic modules.

**Run tests:**
```bash
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode (automatic re-run on changes)
```

**Test coverage:**
- `utils.js` - Sanitization, debouncing, location type detection
- `favorites.js` - localStorage operations, add/remove/toggle favorites
- `filters.js` - Filter state management and DOM updates
- `api.js` - Coordinate extraction and data parsing

Tests run automatically in CI/CD on every pull request to ensure code quality.
