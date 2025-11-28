# Find Doctors & Interactive Map Implementation

## Overview
Implemented a comprehensive doctor discovery feature allowing patients to find all available doctors on an interactive map.

## Key Features
- **Interactive Map**: Uses Leaflet.js to display all available doctors and user location.
- **Global Discovery**: Shows **all verified doctors** on the platform, regardless of distance.
- **Real-time Geocoding**: Doctors are placed on the map based on their real city location.
- **Smart Zoom**: Map automatically fits to show all relevant markers.
- **Real-time Filtering**: Filter by specialty, consultation mode (Tele/In-person).
- **Sorting**: Sort by distance, rating, or consultation fee.
- **Responsive Design**: Split view with map and list, optimized for mobile and desktop.

## Technical Details

### Backend
- **Model**: `DoctorOnboarding` schema updated with `clinicLocation` (GeoJSON Point).
- **Index**: `2dsphere` index on `clinicLocation.coordinates` (used for distance calc).
- **API**: `GET /api/doctor/onboarding/nearby`
  - Returns all verified doctors.
  - Calculates distance if `latitude` and `longitude` are provided.
- **Sync Script**: `scripts/syncDoctors.js` fetches real coordinates from OpenStreetMap API.

### Frontend
- **Library**: `react-leaflet` for map components.
- **Service**: `nearbyDoctors.service.ts` handles geolocation and API requests.
- **Component**: `NearbyClinics.tsx` manages state, filtering, and map interaction.
- **FitBounds**: Custom component to automatically zoom the map to fit all markers.

## Setup & Testing

### 1. Dependencies
The following packages were installed:
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### 2. Data Seeding & Sync
To ensure all doctors (including existing ones) appear on the map:

**Option A: Create Mock Doctors**
```bash
cd backend
node scripts/createMockDoctors.js
```

**Option B: Sync Existing Doctors (with Real Geocoding)**
If you already have users with role 'doctor':
```bash
cd backend
node scripts/syncDoctors.js
```
This will:
1. Find all doctors in the User model.
2. Fetch their city from the `location` field.
3. Use OpenStreetMap API to get real latitude/longitude.
4. Update their profile with accurate coordinates.
5. Create onboarding records if they don't exist.

### 3. Usage
1. Navigate to **Patient Dashboard > Nearby Clinics**.
2. Allow location access when prompted (optional).
3. The map will automatically zoom to show all available doctors.
4. Doctors appear as green markers.
5. Click a marker to see doctor details.
6. Use filters to narrow down results.

## Troubleshooting
- **Map tiles not loading**: Check internet connection (uses OpenStreetMap).
- **No doctors found**: Ensure database is seeded or synced.
- **Location error**: Ensure browser location permission is granted (optional, map still works).
