import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import Sidebar from './components/Sidebar';
import { locations as initialLocations, routesData, categories } from './data/mockData';

export default function App() {
  const [locations, setLocations] = useState(initialLocations);

  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      if (window.location.port === '5173') {
        return 'http://localhost:8000';
      }
      return window.location.origin;
    }
    return 'http://localhost:8000';
  };

  const API_URL = `${getBaseUrl()}/api/locations`;
  const AUTH_URL = `${getBaseUrl()}/api`;

  // Load locations from Laravel database on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API response failed');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setLocations(data);
        }
      })
      .catch(err => {
        console.warn('Laravel backend offline. Falling back to static mock data.', err.message);
      });
  }, []);
  const [routes, setRoutes] = useState(routesData);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [navigationRoute, setNavigationRoute] = useState(null);
  const [searchResult, setSearchResult] = useState(null); // Temporary geocoding result

  // Simulation states
  const [simActive, setSimActive] = useState(false);
  const [simPosition, setSimPosition] = useState(null); // [lat, lng]
  const [simIndex, setSimIndex] = useState(0);
  const [simPath, setSimPath] = useState([]);

  // Favorites (bookmarks) state loaded from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('map_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('map_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const [activeFilters, setActiveFilters] = useState({
    [categories.TEMPLE]: true,
    [categories.NAMAHATTA]: true,
    [categories.BHAKTA]: true,
  });
  
  // Simulated user GPS coordinate state (null when off, coordinate object when on)
  const [userLocation, setUserLocation] = useState(null);
  
  // App Theme state
  const [theme, setTheme] = useState('dark');

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle active filter toggling
  const toggleFilter = (category) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle selection of a location (pans map and highlights in sidebar)
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setNavigationRoute(null); // Reset calculated road route when changing locations
    if (location) {
      // Clear active route if exploring a specific place to avoid visual noise
      setSelectedRoute(null);
    }
    // Only clear searchResult if we select a NON-geocode location
    if (location && location.id !== 'geocode-result') {
      setSearchResult(null);
    }
  };

  // Helper for route path coordinate interpolation
  const interpolatePoints = (coords, stepsPerSegment = 15) => {
    const path = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const start = coords[i];
      const end = coords[i + 1];
      for (let step = 0; step < stepsPerSegment; step++) {
        const t = step / stepsPerSegment;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        path.push([lat, lng]);
      }
    }
    path.push(coords[coords.length - 1]);
    return path;
  };

  // Handle selection of a route (draws line on map)
  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setSimActive(false);
    setSimPosition(null);
    setSimIndex(0);
    setSimPath([]);
    if (route) {
      // Clear selected location when viewing a route
      setSelectedLocation(null);
    }
  };

  // Simulation controls
  const handleStartSimulation = (route) => {
    const interpolated = interpolatePoints(route.coordinates, 12);
    setSimPath(interpolated);
    setSimIndex(0);
    setSimPosition(interpolated[0]);
    setSimActive(true);
  };

  const handlePauseSimulation = () => {
    setSimActive(false);
  };

  const handleResumeSimulation = () => {
    setSimActive(true);
  };

  const handleResetSimulation = () => {
    setSimActive(false);
    setSimPosition(null);
    setSimIndex(0);
    setSimPath([]);
  };

  // Animation Loop for live chariot simulation
  useEffect(() => {
    let timer = null;
    if (simActive && simPath.length > 0) {
      timer = setInterval(() => {
        setSimIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= simPath.length) {
            clearInterval(timer);
            setSimActive(false);
            alert('The procession simulation has successfully reached its destination!');
            return prev;
          }
          setSimPosition(simPath[nextIndex]);
          return nextIndex;
        });
      }, 350);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simActive, simPath]);

  // Add new location dynamically and sync with backend
  const handleAddLocation = (newLoc) => {
    // Optimistic update in UI
    setLocations(prev => {
      const idx = prev.findIndex(loc => loc.id === newLoc.id);
      if (idx > -1) {
        // Update existing
        const copy = [...prev];
        copy[idx] = newLoc;
        return copy;
      } else {
        // Insert new
        return [newLoc, ...prev];
      }
    });

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newLoc)
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated or Database error');
        return res.json();
      })
      .then(saved => {
        console.log('Location saved to Laravel API:', saved);
      })
      .catch(err => {
        console.error('Failed to sync location to backend:', err.message);
        // Rollback optimistic update if auth failed
        if (err.message.includes('Unauthenticated')) {
          alert('Failed to save to database. You must be logged in to modify locations.');
          setLocations(prev => prev.filter(loc => loc.id !== newLoc.id));
        }
      });
  };

  // Delete location dynamically and sync with backend
  const handleDeleteLocation = (id) => {
    // Optimistic update in UI
    setLocations(prev => prev.filter(loc => loc.id !== id));
    
    if (selectedLocation && selectedLocation.id === id) {
      setSelectedLocation(null);
    }
    
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(item => item !== id));
    }

    const headers = {
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: headers
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated or Database error');
        console.log('Location deleted from Laravel backend:', id);
      })
      .catch(err => {
        console.error('Failed to sync deletion to backend:', err.message);
        alert('Failed to delete location. You must be logged in as admin.');
        // Restore state from backend
        fetch(API_URL)
          .then(res => res.json())
          .then(data => setLocations(data));
      });
  };

  // Auth Handlers
  const handleLogin = (email, password) => {
    return fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'Login failed') });
        }
        return res.json();
      })
      .then(data => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return data.user;
      });
  };

  const handleRegister = (name, email, password) => {
    return fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'Registration failed') });
        }
        return res.json();
      })
      .then(data => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return data.user;
      });
  };

  const handleLogout = () => {
    if (!token) return;

    fetch(`${AUTH_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .finally(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      });
  };

  // Toggle mock user live location (simulates GPS)
  const toggleUserLocation = (forceOn = false) => {
    if (userLocation && !forceOn) {
      setUserLocation(null);
      setNavigationRoute(null); // Clear routing when user location is turned off
    } else {
      // Start mock position near Gandhi More, Durgapur
      setUserLocation({
        lat: 23.5305,
        lng: 87.3050,
      });
    }
  };

  // Calculate real-time road route via OSRM API
  const calculateDirections = (targetLoc) => {
    if (!userLocation) {
      alert("Please turn on your GPS position (click navigation icon in sidebar header) to calculate directions.");
      return;
    }

    const startLng = userLocation.lng;
    const startLat = userLocation.lat;
    const endLng = parseFloat(targetLoc.lng || targetLoc.longitude);
    const endLat = parseFloat(targetLoc.lat || targetLoc.latitude);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('OSRM API request failed');
        return res.json();
      })
      .then(data => {
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error('No road route found');
        }

        const route = data.routes[0];
        const rawCoords = route.geometry.coordinates;
        // OSRM coordinates are [lng, lat], map to [lat, lng] for Leaflet
        const coordinates = rawCoords.map(coord => [coord[1], coord[0]]);
        
        const distanceStr = (route.distance / 1000).toFixed(1) + ' km';
        const durationStr = Math.round(route.duration / 60) + ' mins';
        
        // Extract turn-by-turn steps
        const steps = route.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction,
          distance: step.distance
        }));

        setNavigationRoute({
          id: 'osrm-navigation',
          name: `Directions to ${targetLoc.name}`,
          coordinates: coordinates,
          color: '#3b82f6', // sleek blue line
          distance: distanceStr,
          duration: durationStr,
          steps: steps
        });
      })
      .catch(err => {
        console.error('OSRM route calculation error:', err);
        alert('Could not compute road directions. Please verify coordinates.');
      });
  };

  // Toggle light/dark theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-layout">
      {/* Interactive Glassmorphism Sidebar overlay */}
      <Sidebar
        locations={locations}
        routes={routes}
        selectedLocation={selectedLocation}
        selectedRoute={selectedRoute}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        onSelectLocation={handleSelectLocation}
        onSelectRoute={handleSelectRoute}
        onAddLocation={handleAddLocation}
        userLocation={userLocation}
        toggleUserLocation={toggleUserLocation}
        theme={theme}
        toggleTheme={toggleTheme}
        token={token}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        navigationRoute={navigationRoute}
        onGetDirections={calculateDirections}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onDeleteLocation={handleDeleteLocation}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        simActive={simActive}
        simPosition={simPosition}
        simIndex={simIndex}
        simPath={simPath}
        onStartSimulation={handleStartSimulation}
        onPauseSimulation={handlePauseSimulation}
        onResumeSimulation={handleResumeSimulation}
        onResetSimulation={handleResetSimulation}
      />

      {/* Leaflet full-screen map wrapper */}
      <MapContainer
        locations={locations.filter(loc => activeFilters[loc.category])}
        selectedLocation={selectedLocation}
        selectedRoute={selectedRoute}
        onSelectLocation={handleSelectLocation}
        userLocation={userLocation}
        navigationRoute={navigationRoute}
        searchResult={searchResult}
        simPosition={simPosition}
      />
    </div>
  );
}
