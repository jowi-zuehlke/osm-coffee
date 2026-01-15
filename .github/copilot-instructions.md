# OSM Coffee - Copilot Instructions

## Project Overview

OSM Coffee is a single-page application that displays an interactive map highlighting cafes, coffee shops, and roasteries using OpenStreetMap data. The project emphasizes simplicity with a vanilla JavaScript implementation without build tools or dependencies.

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Map Library:** Leaflet.js v1.9.4 (loaded via CDN)
- **Data Source:** OpenStreetMap via Overpass API
- **Deployment:** GitHub Pages (static hosting)

## Development Workflow

### Running Locally

The project can be run directly in a browser or with a simple HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Then open http://localhost:8080 in your browser
```

### Testing

This is a simple static web application. Test manually by:
1. Opening `index.html` in a web browser
2. Checking that the map loads correctly
3. Verifying that location detection works (with user permission)
4. Testing marker interactions (click to see details)
5. Confirming map pan/zoom updates markers dynamically

## Code Conventions

### General Guidelines

- **No Build Tools:** This project intentionally avoids build tools, bundlers, or package managers. Keep it simple.
- **Vanilla JavaScript:** Do not introduce frameworks or libraries beyond Leaflet.js (which is already included).
- **Single File:** The entire application is contained in `index.html`. Keep it that way for simplicity.
- **External Resources:** Load all external libraries from CDN with integrity hashes for security.

### JavaScript Style

- Use modern JavaScript (ES6+) features where appropriate
- Use `const` and `let` instead of `var`
- Prefer arrow functions for callbacks
- Use template literals for string interpolation
- Keep code readable with descriptive variable names
- Add comments for complex logic, especially map interactions and API queries

### CSS Style

- Use embedded `<style>` tags within the HTML file
- Mobile-first responsive design approach
- Use flexbox/grid for layouts where appropriate
- Maintain the existing color scheme (coffee brown: #6F4E37)

### HTML Structure

- Semantic HTML5 elements
- Include proper meta tags for viewport and charset
- Maintain accessibility with proper ARIA labels where needed

## OpenStreetMap Integration

### Data Querying

The application uses the Overpass API to query for:
- `amenity=cafe` - Cafes where you can sit and consume beverages
- `shop=coffee` - Retail shops selling coffee products
- `craft=roaster` - Coffee roasting facilities

### Map Behavior

- Map updates dynamically when panning/zooming
- User location detection with permission prompt
- Custom markers for different location types (cups, shops, flames)
- Popups show detailed information (name, hours, address, website)

## Deployment

### GitHub Pages

The project is deployed automatically via GitHub Actions:
- **Production:** Deploys from `main` branch to GitHub Pages
- **Preview:** Creates preview deployments for pull requests
- No build step required - direct deployment of `index.html`

### Deployment Files

- `.github/workflows/deploy.yml` - Production deployment
- `.github/workflows/deploy-preview.yml` - PR preview deployments

## Important Restrictions

- **Never add package.json or node_modules** - This is intentionally a zero-dependency project
- **Never add build tools** - No webpack, vite, parcel, or similar tools
- **Never require compilation or transpilation** - Code must run directly in browsers
- **Keep the single-file structure** - Do not split into multiple JS/CSS files
- **Maintain CDN integrity hashes** - When updating external libraries, always include integrity attribute
- **Do not commit secrets or API keys** - The Overpass API is public and requires no authentication

## Common Tasks

### Adding a New Map Feature

1. Locate the Leaflet.js initialization code
2. Add new layer or marker logic within the existing map setup
3. Test in multiple browsers for compatibility
4. Ensure mobile responsiveness

### Updating Styles

1. Modify the embedded `<style>` section in `index.html`
2. Test on different screen sizes
3. Maintain existing color scheme and visual consistency

### Modifying OpenStreetMap Queries

1. Find the Overpass API query construction
2. Update query parameters following Overpass QL syntax
3. Test query at https://overpass-turbo.eu/ before implementation
4. Ensure proper error handling for API failures

## Resources

- [Leaflet.js Documentation](https://leafletjs.com/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Live Application](https://jowi-zuehlke.github.io/osm-coffee/)
