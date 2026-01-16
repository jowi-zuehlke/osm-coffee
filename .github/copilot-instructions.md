# OSM Coffee - Copilot Instructions

## Project Overview

OSM Coffee is a single-page application that displays an interactive map highlighting cafes, coffee shops, and roasteries using OpenStreetMap data. The project uses vanilla JavaScript with ES6 modules organized into separate files for better maintainability and to enable parallel development by multiple agents.

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules, no frameworks)
- **Map Library:** Leaflet.js v1.9.4 (loaded via CDN)
- **Data Source:** OpenStreetMap via Overpass API
- **Deployment:** GitHub Pages (static hosting)

## Project Structure

```
osm-coffee/
├── index.html              # Main HTML file
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
│   └── filters.js         # Location type filtering
├── README.md              # Project overview and setup instructions
├── ARCHITECTURE.md        # Technical architecture documentation
└── SPECIFICATION.md       # Complete feature and technical specifications
```

## Development Workflow

### Running Locally

The project must be served via HTTP/HTTPS (not opened directly as a file) because it uses ES6 modules:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Then open http://localhost:8080 in your browser
```

### Testing

This is a simple static web application. Test manually by:
1. Serving the application via HTTP server
2. Opening http://localhost:8080 in a web browser
3. Checking that the map loads correctly
4. Verifying that location detection works (with user permission)
5. Testing marker interactions (click to see details)
6. Confirming map pan/zoom updates markers dynamically
7. Testing filter toggles in the legend

## Code Conventions

### General Guidelines

- **No Build Tools:** This project intentionally avoids build tools, bundlers, or package managers. Keep it simple.
- **Vanilla JavaScript:** Do not introduce frameworks or libraries beyond Leaflet.js (which is already included).
- **Modular Structure:** Code is split across multiple JavaScript modules for maintainability and to avoid conflicts when multiple agents work on the code.
- **ES6 Modules:** Use import/export statements for module dependencies.
- **External Resources:** Load all external libraries from CDN with integrity hashes for security.

### JavaScript Style

- Use modern JavaScript (ES6+) features where appropriate
- Use ES6 modules with `import`/`export` for code organization
- Use `const` and `let` instead of `var`
- Prefer arrow functions for callbacks
- Use template literals for string interpolation
- Keep code readable with descriptive variable names
- Add JSDoc comments for functions, especially exported functions
- Group related functions within the same module
- Keep modules focused on a single responsibility

### Module Organization

- **config.js**: Configuration constants only (no logic)
- **utils.js**: Pure utility functions (no DOM manipulation or side effects)
- **ui.js**: UI-related functions (sidebar, detail display, HTML generation)
- **api.js**: API communication (Overpass API queries)
- **map.js**: Map and marker management
- **geolocation.js**: Browser geolocation features
- **filters.js**: Filter state and toggle logic
- **main.js**: Application initialization and event wiring

### CSS Style

- Use separate CSS file in `styles/main.css`
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
- No build step required - direct deployment of all static files

### Deployment Files

- `.github/workflows/deploy.yml` - Production deployment
- `.github/workflows/deploy-preview.yml` - PR preview deployments

## Important Restrictions

- **Never add package.json or node_modules** - This is intentionally a zero-dependency project (except Leaflet via CDN)
- **Never add build tools** - No webpack, vite, parcel, or similar tools
- **Never require compilation or transpilation** - Code must run directly in browsers with native ES6 module support
- **Maintain modular structure** - Keep code organized across separate files as described above
- **Maintain CDN integrity hashes** - When updating external libraries, always include integrity attribute
- **Do not commit secrets or API keys** - The Overpass API is public and requires no authentication

## Common Tasks

### Adding a New Map Feature

1. Identify the appropriate module (likely `map.js`)
2. Add new function(s) following existing patterns
3. Export the function if it needs to be used elsewhere
4. Import and use in `main.js` or the relevant module
5. Test in multiple browsers for compatibility
6. Ensure mobile responsiveness

### Updating Styles

1. Modify `styles/main.css`
2. Test on different screen sizes
3. Maintain existing color scheme and visual consistency

### Modifying OpenStreetMap Queries

1. Edit the query construction in `api.js`
2. Update query parameters following Overpass QL syntax
3. Test query at https://overpass-turbo.eu/ before implementation
4. Ensure proper error handling for API failures

### Adding UI Features

1. Add HTML markup to `index.html` if needed
2. Add styling to `styles/main.css`
3. Add UI logic to `ui.js`
4. Wire up events in `main.js` or relevant module

### Maintaining Documentation

**CRITICAL: Always update SPECIFICATION.md when making changes to the application.**

The `SPECIFICATION.md` file is the authoritative source of truth for all application features, technical details, and specifications. It must be kept in sync with the codebase at all times.

**When to Update SPECIFICATION.md:**

1. **Adding New Features**
   - Add new functional requirement (FR#) with priority, description, features, and acceptance criteria
   - Update relevant technical specifications
   - Update UI specifications if visual changes are made
   - Add to "Future Enhancements" if partially implemented

2. **Modifying Existing Features**
   - Update the corresponding functional requirement section
   - Update acceptance criteria if behavior changes
   - Update technical specifications if implementation changes
   - Document any breaking changes

3. **Changing Configuration**
   - Update "Configuration Constants" section in Technical Specifications
   - Update any affected functional requirements
   - Update deployment configuration if needed

4. **Adding/Removing Modules**
   - Update "Module Structure" section
   - Update dependency graph
   - Update module descriptions in Architecture section
   - Update project structure in README.md as well

5. **Changing UI/Styling**
   - Update "User Interface Specifications" section
   - Update color palette if colors change
   - Update component specifications
   - Update responsive design specifications if breakpoints change

6. **Security Changes**
   - Update "Security Requirements" section
   - Document new security measures
   - Update limitations if applicable

7. **API/Integration Changes**
   - Update "Data Sources and Integration" section
   - Update API query structure
   - Update error handling documentation

8. **Deployment Changes**
   - Update "Deployment" section
   - Update workflow descriptions
   - Update hosting platform details

**How to Update SPECIFICATION.md:**

1. Locate the relevant section(s) affected by your changes
2. Update the specific subsections with accurate, detailed information
3. Maintain consistent formatting and structure
4. Use the same level of detail as existing sections
5. Update version history at the end if it's a major change
6. Commit SPECIFICATION.md changes in the same PR as code changes

**Example Workflow:**
```
1. Make code changes (e.g., add new filter type)
2. Test the changes
3. Update SPECIFICATION.md:
   - Add new filter to FR6: Location Type Filters
   - Update filter list in config.js documentation
   - Update UI specifications for new legend item
4. Commit both code and SPECIFICATION.md together
5. Verify documentation matches implementation
```

**Documentation Quality Standards:**
- Be precise and specific (include exact values, colors, timeouts)
- Use consistent terminology throughout
- Include acceptance criteria for features
- Document both happy path and error cases
- Keep technical accuracy as top priority

## Working with Multiple Agents

The modular structure is designed to minimize conflicts when multiple agents work on the code:

- Each module has a clear, focused responsibility
- Modules communicate through well-defined exports/imports
- Configuration is centralized in `config.js`
- Utility functions are reusable from `utils.js`

When working on a feature:
1. Identify which module(s) need changes
2. Make changes within the appropriate module
3. Add new modules if the feature doesn't fit existing ones
4. Update imports/exports as needed
5. Test the integration

## Resources

- [Leaflet.js Documentation](https://leafletjs.com/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Live Application](https://jowi-zuehlke.github.io/osm-coffee/)
- [MDN ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## Documentation Files

- **README.md** - Quick start guide, features overview, and basic usage
- **ARCHITECTURE.md** - Technical architecture, module design, data flow, and extensibility
- **SPECIFICATION.md** - Complete application specification including all functional requirements, technical specs, UI/UX details, security, and deployment (MUST be kept updated with all changes)
