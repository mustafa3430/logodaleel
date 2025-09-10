# LogoDaleel - Saudi Business Directory Project

## Project Overview
A client-side business directory website for Saudi Arabian companies with hover popups, search functionality, and an admin dashboard. Built with vanilla HTML/CSS/JavaScript and localStorage persistence.

## Architecture & Data Flow

### Core Components
- **Main Site**: `index.html` + `script.js` + `styles.css` - Public company directory
- **Admin Dashboard**: `admin.html` + `admin-script.js` + `admin-styles.css` - Company management interface
- **Geographic Data**: `saudi_data.js` - Complete Saudi Arabia location hierarchy (15k+ lines)
- **Test File**: `test_autocomplete.html` - Standalone testing for address autocomplete

### Data Persistence Pattern
```javascript
// Central localStorage keys
localStorage.getItem('logodaleel_companies')     // Company data array
localStorage.getItem('logodaleel_refresh_trigger') // Cross-window sync
localStorage.getItem('siteSettings')             // Site configuration
```

**Critical**: Main site and admin dashboard sync via localStorage polling. Admin changes trigger refresh events that main site listens for.

## Key Implementation Patterns

### Phone Authentication Flow (Add Company)
- Saudi mobile format: `+966` prefix + 9-digit number (`5XXXXXXXX`)
- Two-step modal: Phone input → OTP verification → Company form
- Mock OTP system (development only)

### Multi-Branch Company System
Dynamic branch management with individual Maps URLs and Saudi address autocomplete per branch:
```javascript
// Branch structure in company data
branches: [
  { maps: "https://maps.google.com/...", location: "Riyadh, Riyadh" },
  { maps: "https://maps.google.com/...", location: "Jeddah, Makkah" }
]
```

### Saudi Address Autocomplete
Hierarchical search: Province → City → District using `saudi_data.js`:
```javascript
// Address data structure
{ governorate: "Riyadh", cities: [{ city: "Riyadh", districts: [...] }] }
```

### Cross-Window Synchronization
**Critical Implementation Pattern**:
```javascript
// Admin Dashboard triggers refresh
localStorage.setItem('logodaleel_refresh_trigger', Date.now().toString());

// Main site listens for changes
window.addEventListener('storage', function(e) {
    if (e.key === 'logodaleel_refresh_trigger') {
        reloadCompaniesData();
    }
});
```

### News/Updates Timer System
14-day auto-expiry with visual countdown and manual reset functionality.

### Phone Authentication Flow (Add Company)
- Saudi mobile format: `+966` prefix + 9-digit number (`5XXXXXXXX`)
- Two-step modal: Phone input → OTP verification → Company form
- Mock OTP system (development only)

### Multi-Branch Company System
Dynamic branch management with individual Maps URLs and Saudi address autocomplete per branch:
```javascript
// Branch structure in company data
branches: [
  { maps: "https://maps.google.com/...", location: "Riyadh, Riyadh" },
  { maps: "https://maps.google.com/...", location: "Jeddah, Makkah" }
]
```

### Saudi Address Autocomplete
Hierarchical search: Province → City → District using `saudi_data.js`:
```javascript
// Address data structure
{ governorate: "Riyadh", cities: [{ city: "Riyadh", districts: [...] }] }
```

### News/Updates Timer System
14-day auto-expiry with visual countdown and manual reset functionality.

## Development Workflows

### Local Development
- Open `index.html` directly in browser (no build required)
- Admin dashboard at `admin.html`
- Test address autocomplete at `test_autocomplete.html`

### Data Management
- Companies stored as JSON in localStorage
- Admin dashboard provides full CRUD operations
- Cross-window synchronization via storage events

### File Responsibilities
- `script.js`: Main site logic, search, filtering, modal management
- `admin-script.js`: Company CRUD, site settings, table management  
- `saudi_data.js`: Geographic data (auto-generated from CSV)
- Backup files (`*-backup.js`, `*-clean.js`) for version control

## Styling Conventions
- Mobile-first responsive design
- CSS Grid for company cards layout
- Modal overlays for forms and popups
- Saudi-specific color scheme and Arabic text support

## Integration Points
- **Google Maps**: Dynamic branch locations
- **Social Media**: LinkedIn, Instagram, TikTok, Snapchat, WhatsApp
- **Saudi Geography**: Province/city/district hierarchy with Arabic translations

## Performance Considerations
- Client-side search with instant filtering
- Image lazy loading for company logos
- localStorage size management for large datasets
- Debounced search input to prevent excessive filtering