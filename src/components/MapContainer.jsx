import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Import leaflet assets manually if needed, but since we use L.divIcon, we don't depend on default leaflet asset urls which often break in build!
// This is another reason raw divIcon is superior.

const createCustomIcon = (category) => {
  let color = 'var(--accent-primary)';
  let iconHtml = '';

  if (category === 'temple') {
    color = 'var(--color-temple)';
    iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 22h20L12 2z"/>
        <path d="M12 18v-4"/>
        <path d="M9 18h6"/>
      </svg>
    `;
  } else if (category === 'namahatta') {
    color = 'var(--color-namahatta)';
    iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
        <path d="M6 6h10"/><path d="M6 10h10"/>
      </svg>
    `;
  } else if (category === 'bhakta') {
    color = 'var(--color-bhakta)';
    iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    `;
  }

  return L.divIcon({
    html: `
      <div class="marker-pin-wrapper">
        <div class="marker-pin" style="--marker-color: ${color}"></div>
        <div class="marker-icon-inner" style="color: ${color}">${iconHtml}</div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38]
  });
};

export default function MapContainer({
  locations = [],
  selectedLocation = null,
  selectedRoute = null,
  onSelectLocation = () => {},
  userLocation = null,
  navigationRoute = null,
  searchResult = null,
  simPosition = null,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const routePolylineRef = useRef(null);
  const routeMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const simMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Start centered at ISKCON Durgapur
    const initialLat = 23.5413;
    const initialLng = 87.3015;
    const initialZoom = 13;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // We'll customize control placements
    }).setView([initialLat, initialLng], initialZoom);

    // Standard OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers based on locations list
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers that are not in the new locations list
    const currentLocIds = new Set(locations.map(loc => loc.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!currentLocIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    locations.forEach(loc => {
      if (markersRef.current[loc.id]) {
        // Already exists, just update position in case
        markersRef.current[loc.id].setLatLng([loc.lat, loc.lng]);
        return;
      }

      // Create new marker
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomIcon(loc.category),
      }).addTo(map);

      // Create rich popup content
      const popupContent = `
        <div style="font-family: var(--font-sans); min-width: 200px; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-family: var(--font-heading); font-size: 14px; font-weight: 600; color: var(--text-primary);">
            ${loc.name}
          </h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
            ${loc.address}
          </p>
          <span style="display: inline-block; font-size: 10px; font-weight: 500; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; color: #fff; background-color: var(--color-${loc.category});">
            ${loc.category}
          </span>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersRef.current[loc.id] = marker;
    });
  }, [locations, onSelectLocation]);

  // Update user/live location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userLocation) {
      const icon = L.divIcon({
        html: `<div class="pulse-marker"></div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon })
          .addTo(map)
          .bindPopup('<strong style="font-size:11px;">Your Location (Mocked)</strong>');
      }
    } else {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    }
  }, [userLocation]);

  // Update geocoded search result marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (searchResult) {
      const { lat, lng } = searchResult;
      
      // Distinctive orange search result pin
      const orangeIcon = L.divIcon({
        html: `
          <div class="marker-pin-wrapper">
            <div class="marker-pin" style="--marker-color: #f97316"></div>
            <div class="marker-icon-inner" style="color: #f97316">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -38]
      });

      if (searchMarkerRef.current) {
        searchMarkerRef.current.setLatLng([lat, lng]);
      } else {
        searchMarkerRef.current = L.marker([lat, lng], { icon: orangeIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: var(--font-sans); min-width: 150px; padding: 4px;">
              <strong style="font-size:12px;color:var(--text-primary);">${searchResult.name}</strong><br/>
              <span style="font-size:10px;color:var(--text-muted);">${searchResult.address}</span>
            </div>
          `);
      }

      setTimeout(() => {
        if (searchMarkerRef.current) {
          searchMarkerRef.current.openPopup();
        }
      }, 300);
      
    } else {
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
    }
  }, [searchResult]);

  // Update live chariot simulation marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (simPosition) {
      // Golden Chariot icon
      const chariotIcon = L.divIcon({
        html: `
          <div class="marker-pin-wrapper">
            <div class="marker-pin" style="--marker-color: #d97706; transform: scale(1.15);"></div>
            <div class="marker-icon-inner" style="color: #ffffff">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 22h20L12 2z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
            </div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [46, 46],
        iconAnchor: [23, 46],
        popupAnchor: [0, -42]
      });

      if (simMarkerRef.current) {
        simMarkerRef.current.setLatLng(simPosition);
      } else {
        simMarkerRef.current = L.marker(simPosition, { icon: chariotIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: var(--font-sans); padding: 4px; text-align: center;">
              <strong style="color: #d97706; font-size:12px;">Procession Chariot</strong><br/>
              <span style="font-size:10px;color:var(--text-muted);">Moving Live along Route</span>
            </div>
          `);
      }

      // Auto-pan viewport to follow the chariot
      map.panTo(simPosition, { animate: true, duration: 0.5 });
      
    } else {
      if (simMarkerRef.current) {
        simMarkerRef.current.remove();
        simMarkerRef.current = null;
      }
    }
  }, [simPosition]);

  // Handle routing display (e.g. Rath Yatra route OR calculated road directions)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old route polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Clear old route stops markers
    routeMarkersRef.current.forEach(marker => marker.remove());
    routeMarkersRef.current = [];

    const activeRoute = navigationRoute || selectedRoute;

    if (activeRoute && activeRoute.coordinates) {
      // Draw polyline
      const polyline = L.polyline(activeRoute.coordinates, {
        color: activeRoute.color || 'var(--accent-primary)',
        weight: 6,
        opacity: 0.8,
        dashArray: activeRoute.id === 'weekly-harinam' ? '10, 10' : null, // dashed for harinam walk
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Draw intermediate stop circles only for festival routes, not navigation path
      if (activeRoute.id !== 'osrm-navigation') {
        activeRoute.coordinates.forEach((coord, idx) => {
          const isStart = idx === 0;
          const isEnd = idx === activeRoute.coordinates.length - 1;
          
          let markerColor = activeRoute.color || 'var(--accent-primary)';
          let size = isStart || isEnd ? 12 : 8;
          
          const circleMarker = L.circleMarker(coord, {
            radius: size,
            fillColor: isStart ? '#22c55e' : (isEnd ? '#ef4444' : '#ffffff'),
            fillOpacity: 1,
            color: markerColor,
            weight: 3,
          }).addTo(map);

          // Bind stop name if it exists in route description or stops list
          if (activeRoute.stops && activeRoute.stops[idx]) {
            const stop = activeRoute.stops[idx];
            circleMarker.bindPopup(`
              <div style="font-family: var(--font-sans); font-size: 11px;">
                <strong>Stop ${idx + 1}: ${stop.name}</strong><br/>
                <span style="color:var(--text-muted)">ETA: ${stop.time}</span>
              </div>
            `);
          } else {
            circleMarker.bindPopup(`<strong>Stop ${idx + 1}</strong>`);
          }

          routeMarkersRef.current.push(circleMarker);
        });
      }

      // Fit map bounds to the route
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [selectedRoute, navigationRoute]);

  // Handle selected location pan/zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocation) return;

    const { lat, lng } = selectedLocation;
    map.setView([lat, lng], 15, {
      animate: true,
      duration: 1.0,
    });

    // Programmatically open popup for selected marker if it exists
    const marker = markersRef.current[selectedLocation.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  }, [selectedLocation]);

  return (
    <div className="map-container-wrapper">
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
