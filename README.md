# osm-coffee
Map of ☕️ hotspots

**[🌐 Live Preview](https://jowi-zuehlke.github.io/osm-coffee/)**

## Overview
A single page application that displays an interactive map highlighting cafes and roasteries using OpenStreetMap data.

## Features
- 🗺️ Interactive map powered by OpenStreetMap and Leaflet.js
- ☕ Displays cafes with coffee cup markers
- 🔥 Displays roasteries with flame markers
- 📍 Automatically detects user location (with permission)
- 🔄 Updates markers when panning/zooming the map
- 💬 Click markers for detailed information (name, hours, address, website)
- 📱 Responsive design works on mobile and desktop

## How to Use
1. Open `index.html` in a web browser
2. Allow location access (optional) for a personalized starting view
3. Pan and zoom the map to explore coffee locations
4. Click on markers to see details about each cafe or roastery

## Running Locally
Simply open the `index.html` file in your web browser, or serve it with any HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Then open http://localhost:8080 in your browser
```

## Technology Stack
- HTML5
- CSS3
- JavaScript (Vanilla)
- Leaflet.js (OpenStreetMap library)
- Overpass API (OpenStreetMap data query)

## Data Source
Coffee location data is fetched from OpenStreetMap via the Overpass API, querying for:
- `amenity=cafe` - Coffee shops and cafes
- `shop=coffee` - Coffee retailers
- `craft=roaster` - Coffee roasteries
