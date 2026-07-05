import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Compass, 
  BookOpen, 
  Home, 
  User, 
  Moon, 
  Sun, 
  Route, 
  Plus, 
  X, 
  Calendar, 
  Navigation, 
  ChevronRight,
  Info,
  Star,
  Edit,
  Trash2,
  Play
} from 'lucide-react';
import { categories } from '../data/mockData';

export default function Sidebar({
  locations = [],
  routes = [],
  selectedLocation = null,
  selectedRoute = null,
  activeFilters = {},
  toggleFilter = () => {},
  onSelectLocation = () => {},
  onSelectRoute = () => {},
  onAddLocation = () => {},
  userLocation = null,
  toggleUserLocation = () => {},
  navigationRoute = null,
  onGetDirections = () => {},
  theme = 'dark',
  toggleTheme = () => {},
  token = null,
  user = null,
  onLogin = () => {},
  onRegister = () => {},
  onLogout = () => {},
  favorites = [],
  onToggleFavorite = () => {},
  onDeleteLocation = () => {},
  searchResult = null,
  setSearchResult = () => {},
  simActive = false,
  simPosition = null,
  simIndex = 0,
  simPath = [],
  onStartSimulation = () => {},
  onPauseSimulation = () => {},
  onResumeSimulation = () => {},
  onResetSimulation = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'favorites', 'routes', 'admin'
  
  // Geocoding states
  const [geocodeResults, setGeocodeResults] = useState([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  
  // Edit place local states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState(categories.BHAKTA);
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTimings, setEditTimings] = useState('');
  const [editPresident, setEditPresident] = useState('');
  const [editLeader, setEditLeader] = useState('');
  const [editActiveMembers, setEditActiveMembers] = useState('');

  // Reset editing mode when selection changes
  React.useEffect(() => {
    setIsEditing(false);
  }, [selectedLocation]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedLocation = {
      ...selectedLocation,
      name: editName,
      category: editCategory,
      lat: parseFloat(editLat),
      lng: parseFloat(editLng),
      address: editAddress,
      description: editDescription || null,
      phone: editPhone || null,
      timings: editCategory === categories.TEMPLE ? editTimings : null,
      president: editCategory === categories.TEMPLE ? editPresident : null,
      leader: editCategory === categories.NAMAHATTA ? editLeader : null,
      active_members: editCategory === categories.NAMAHATTA && editActiveMembers ? parseInt(editActiveMembers) : null,
    };
    onAddLocation(updatedLocation);
    onSelectLocation(updatedLocation);
    setIsEditing(false);
  };

  const handleGeocodeSearch = () => {
    if (!searchQuery.trim()) return;
    setGeocodeLoading(true);
    setGeocodeResults([]);

    const query = encodeURIComponent(searchQuery);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}+Durgapur&format=json&limit=5`;

    fetch(url, {
      headers: {
        'Accept-Language': 'en',
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGeocodeResults(data);
          if (data.length === 0) {
            alert('No real-world locations matching "' + searchQuery + '" found in Durgapur.');
          }
        }
      })
      .catch(err => {
        console.error('Nominatim Geocoding error:', err);
        alert('Failed to connect to OpenStreetMap Geocoding API.');
      })
      .finally(() => {
        setGeocodeLoading(false);
      });
  };

  const handleSaveToDatabase = () => {
    if (!selectedLocation) return;
    setNewName(selectedLocation.name);
    setNewLat(String(selectedLocation.lat));
    setNewLng(String(selectedLocation.lng));
    setNewAddress(selectedLocation.address);
    setNewCategory(categories.BHAKTA); // Default to devotee home
    setActiveTab('admin');
  };
  
  // Auth local states
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Add form fields state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories.BHAKTA);
  const [newLat, setNewLat] = useState('23.5413');
  const [newLng, setNewLng] = useState('87.3015');
  const [newAddress, setNewAddress] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Filter locations by search query and category filters
  const filteredLocations = locations.filter(loc => {
    // Category filter matching
    if (!activeFilters[loc.category]) return false;
    
    // Search query matching
    const matchName = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAddress = loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDesc = loc.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    return matchName || matchAddress || matchDesc;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const newLoc = {
      id: `custom-${Date.now()}`,
      name: newName,
      category: newCategory,
      lat: parseFloat(newLat),
      lng: parseFloat(newLng),
      address: newAddress,
      description: newDescription,
    };

    onAddLocation(newLoc);
    
    // Reset form
    setNewName('');
    setNewAddress('');
    setNewDescription('');
    setShowAddForm(false);
    
    // Auto-select the newly added location to pan to it
    onSelectLocation(newLoc);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case categories.TEMPLE: return 'var(--color-temple)';
      case categories.NAMAHATTA: return 'var(--color-namahatta)';
      case categories.BHAKTA: return 'var(--color-bhakta)';
      case 'search-result': return '#f97316';
      default: return 'var(--accent-primary)';
    }
  };

  const getCategoryIcon = (cat, size = 16) => {
    switch (cat) {
      case categories.TEMPLE: return <Compass size={size} />;
      case categories.NAMAHATTA: return <BookOpen size={size} />;
      case categories.BHAKTA: return <Home size={size} />;
      case 'search-result': return <MapPin size={size} />;
      default: return <MapPin size={size} />;
    }
  };

  return (
    <div className="sidebar-container glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Title / Brand Header */}
      <div style={{ padding: '20px 20px 16px 20px', borderBottom: '1px solid var(--border-panel)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-primary)', margin: 0 }}>
            ISKCON Durgapur
          </h1>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Live Location Toggle */}
            <button 
              className="clickable"
              onClick={toggleUserLocation}
              title="Toggle Simulated Live Location"
              style={{
                background: userLocation ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-item-hover)',
                border: '1px solid ' + (userLocation ? '#22c55e' : 'var(--border-panel)'),
                borderRadius: '8px',
                padding: '6px',
                color: userLocation ? '#22c55e' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Navigation size={16} fill={userLocation ? '#22c55e' : 'none'} style={{ transform: 'rotate(45deg)' }} />
            </button>

            {/* Theme Toggle */}
            <button 
              className="clickable"
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-item-hover)',
                border: '1px solid var(--border-panel)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
          Community & Devotee Mapping Platform
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border-panel)', padding: '4px 4px' }}>
        <button 
          onClick={() => { setActiveTab('explore'); onSelectRoute(null); }}
          className="clickable"
          style={{
            flex: 1,
            padding: '10px 2px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'explore' ? '2px solid var(--accent-primary)' : 'none',
            color: activeTab === 'explore' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'explore' ? '600' : '400',
            fontSize: '11px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Explore
        </button>
        <button 
          onClick={() => { setActiveTab('favorites'); onSelectLocation(null); onSelectRoute(null); }}
          className="clickable"
          style={{
            flex: 1,
            padding: '10px 2px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'favorites' ? '2px solid var(--accent-primary)' : 'none',
            color: activeTab === 'favorites' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'favorites' ? '600' : '400',
            fontSize: '11px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Favorites
        </button>
        <button 
          onClick={() => { setActiveTab('routes'); onSelectLocation(null); }}
          className="clickable"
          style={{
            flex: 1,
            padding: '10px 2px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'routes' ? '2px solid var(--accent-primary)' : 'none',
            color: activeTab === 'routes' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'routes' ? '600' : '400',
            fontSize: '11px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Routes
        </button>
        <button 
          onClick={() => { setActiveTab('admin'); onSelectLocation(null); onSelectRoute(null); }}
          className="clickable"
          style={{
            flex: 1,
            padding: '10px 2px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'admin' ? '2px solid var(--accent-primary)' : 'none',
            color: activeTab === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'admin' ? '600' : '400',
            fontSize: '11px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Add Place
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* TAB 1: EXPLORE PLACES */}
        {activeTab === 'explore' && !selectedLocation && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
            
            {/* Search Box */}
            <div style={{ padding: '16px 20px 12px 20px', position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  placeholder="Search temples, devotees, areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-panel)',
                    backgroundColor: 'var(--bg-panel-solid)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                {searchQuery && (
                  <X 
                    size={16} 
                    className="clickable"
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)' }}
                  />
                )}
              </div>
            </div>

            {searchQuery && (
              <div style={{ padding: '0 20px 12px 20px' }}>
                <button
                  onClick={handleGeocodeSearch}
                  disabled={geocodeLoading}
                  className="clickable"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    color: '#f97316',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Search size={12} /> 
                  {geocodeLoading ? 'Searching Addresses...' : 'Search Addresses for "' + searchQuery + '"'}
                </button>
              </div>
            )}

            {geocodeResults.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--border-panel)' }}>
                <div style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid var(--border-panel)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Address Results
                  </span>
                  <button
                    onClick={() => setGeocodeResults([])}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10px', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </div>
                {geocodeResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="clickable"
                    onClick={() => {
                      const virtualLoc = {
                        id: 'geocode-result',
                        name: result.display_name.split(',')[0],
                        address: result.display_name,
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        category: 'search-result',
                        description: 'Address found via OpenStreetMap Nominatim geocoding.',
                      };
                      setSearchResult(virtualLoc);
                      onSelectLocation(virtualLoc);
                    }}
                    style={{
                      padding: '14px 20px',
                      borderBottom: idx === geocodeResults.length - 1 ? 'none' : '1px solid var(--border-panel)',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-item-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MapPin size={16} style={{ color: '#f97316', flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 2px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {result.display_name.split(',')[0]}
                      </h4>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {result.display_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category Filter Toggles */}
            <div style={{ display: 'flex', gap: '8px', padding: '0 20px 14px 20px', overflowX: 'auto', flexShrink: 0 }}>
              {Object.keys(categories).map(key => {
                const catVal = categories[key];
                const isActive = activeFilters[catVal];
                const color = getCategoryColor(catVal);
                return (
                  <button
                    key={catVal}
                    className="clickable"
                    onClick={() => toggleFilter(catVal)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: '1px solid ' + (isActive ? color : 'var(--border-panel)'),
                      background: isActive ? `rgba(${catVal === categories.TEMPLE ? '249, 115, 22' : catVal === categories.NAMAHATTA ? '59, 130, 246' : '168, 85, 247'}, 0.12)` : 'var(--bg-panel-solid)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    <span style={{ color: color, display: 'flex' }}>
                      {getCategoryIcon(catVal, 12)}
                    </span>
                    {catVal.charAt(0).toUpperCase() + catVal.slice(1)}s
                  </button>
                );
              })}
            </div>

            {/* Locations List */}
            <div style={{ flex: 1, borderTop: '1px solid var(--border-panel)', overflowY: 'auto' }}>
              {filteredLocations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Info size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  <p style={{ fontSize: '13px' }}>No locations found matching your filters.</p>
                </div>
              ) : (
                filteredLocations.map(loc => (
                  <div
                    key={loc.id}
                    className="clickable"
                    onClick={() => onSelectLocation(loc)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-panel)',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-item-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: `rgba(${loc.category === categories.TEMPLE ? '249, 115, 22' : loc.category === categories.NAMAHATTA ? '59, 130, 246' : '168, 85, 247'}, 0.1)`,
                      color: getCategoryColor(loc.category),
                      marginTop: '2px',
                      display: 'flex',
                    }}>
                      {getCategoryIcon(loc.category, 18)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {loc.name}
                      </h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {loc.address}
                      </p>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: getCategoryColor(loc.category),
                        color: '#ffffff',
                      }}>
                        {loc.category}
                      </span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)', selfAlign: 'center', marginTop: '12px' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FAVORITES */}
        {activeTab === 'favorites' && !selectedLocation && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Your Saved Bookmarks
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Frequently visited devotee households, Namahatta centers, or temples you have bookmarked.
            </p>

            {locations.filter(loc => favorites.includes(loc.id)).length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                fontSize: '12px',
                border: '1px dashed var(--border-panel)',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Star size={24} style={{ opacity: 0.3 }} />
                <span>No bookmarked places yet. Click the star icon on any place to add it to your favorites.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {locations
                  .filter(loc => favorites.includes(loc.id))
                  .map(loc => (
                    <div
                      key={loc.id}
                      className="clickable"
                      onClick={() => {
                        onSelectLocation(loc);
                        setActiveTab('explore'); // transition back to explore tab to see details
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-panel)',
                        background: 'var(--bg-panel-solid)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                        <div style={{ color: `var(--color-${loc.category})`, flexShrink: 0 }}>
                          {getCategoryIcon(loc.category, 16)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {loc.name}
                          </h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {loc.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(loc.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#eab308', // gold/yellow
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Star size={16} fill="#eab308" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* DETAILS VIEW (Triggered when location selected) */}
        {selectedLocation && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  Edit Community Point
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Point Name</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }}>
                    <option value={categories.TEMPLE}>Temple / Main Center</option>
                    <option value={categories.NAMAHATTA}>Namahatta Center</option>
                    <option value={categories.BHAKTA}>Bhakta House (Devotee)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Latitude</label>
                    <input type="number" step="0.000001" required value={editLat} onChange={(e) => setEditLat(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Longitude</label>
                    <input type="number" step="0.000001" required value={editLng} onChange={(e) => setEditLng(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Address</label>
                  <input type="text" required value={editAddress} onChange={(e) => setEditAddress(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone</label>
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                </div>

                {editCategory === categories.TEMPLE && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Temple President</label>
                      <input type="text" value={editPresident} onChange={(e) => setEditPresident(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Opening Hours / Timings</label>
                      <input type="text" value={editTimings} onChange={(e) => setEditTimings(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                    </div>
                  </>
                )}

                {editCategory === categories.NAMAHATTA && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Namahatta Leader</label>
                      <input type="text" value={editLeader} onChange={(e) => setEditLeader(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active Members Count</label>
                      <input type="number" value={editActiveMembers} onChange={(e) => setEditActiveMembers(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none' }} />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description / Notes</label>
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-panel)', backgroundColor: 'var(--bg-panel-solid)', color: 'var(--text-primary)', fontSize: '12px', width: '100%', outline: 'none', height: '60px', resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setIsEditing(false)} className="clickable" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-panel)', color: 'var(--text-secondary)', background: 'none', fontSize: '12px', fontWeight: '600' }}>
                    Cancel
                  </button>
                  <button type="submit" className="clickable" style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--accent-primary)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Back Button */}
                <button 
                  className="clickable"
                  onClick={() => onSelectLocation(null)}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-panel)',
                    background: 'var(--bg-panel-solid)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  <X size={12} /> Back to List
                </button>

                {/* Thumbnail Image if Temple */}
                {selectedLocation.image && (
                  <img 
                    src={selectedLocation.image} 
                    alt={selectedLocation.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-panel)' }}
                  />
                )}

                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '9px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: getCategoryColor(selectedLocation.category),
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    {selectedLocation.category}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {selectedLocation.name}
                    </h2>
                    <button
                      onClick={() => onToggleFavorite(selectedLocation.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: favorites.includes(selectedLocation.id) ? '#eab308' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Star size={20} fill={favorites.includes(selectedLocation.id) ? '#eab308' : 'none'} />
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedLocation.address}
                  </p>
                </div>

                {/* Custom attributes based on category */}
                <div style={{
                  background: 'var(--bg-item-hover)',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid var(--border-panel)'
                }}>
                  {selectedLocation.phone && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Contact: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.phone}</span>
                    </div>
                  )}
                  {selectedLocation.timings && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Timings: </strong><br/>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.timings}</span>
                    </div>
                  )}
                  {selectedLocation.president && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Temple President: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.president}</span>
                    </div>
                  )}
                  {selectedLocation.leader && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Namahatta Leader: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.leader}</span>
                    </div>
                  )}
                  {selectedLocation.active_members && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Active Members: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.active_members}</span>
                    </div>
                  )}
                  {selectedLocation.occupation && (
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Occupation: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation.occupation}</span>
                    </div>
                  )}
                </div>

                {selectedLocation.description && (
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      About
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {selectedLocation.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button 
                    className="clickable"
                    onClick={() => {
                      if (!userLocation) {
                        toggleUserLocation(true);
                        setTimeout(() => {
                          onGetDirections(selectedLocation);
                        }, 200);
                      } else {
                        onGetDirections(selectedLocation);
                      }
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}
                  >
                    <Navigation size={14} style={{ transform: 'rotate(45deg)' }} /> Directions
                  </button>
                  <button 
                    className="clickable"
                    onClick={() => {
                      const lat = selectedLocation.latitude || selectedLocation.lat;
                      const lng = selectedLocation.longitude || selectedLocation.lng;
                      navigator.clipboard.writeText(`${lat}, ${lng}`);
                      alert('Coordinates copied to clipboard!');
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'var(--bg-panel-solid)',
                      border: '1px solid var(--border-panel)',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}
                  >
                    Share
                  </button>
                </div>

                {/* Admin Actions */}
                {token && selectedLocation.category !== 'search-result' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      className="clickable"
                      onClick={() => {
                        setIsEditing(true);
                        setEditName(selectedLocation.name);
                        setEditCategory(selectedLocation.category);
                        setEditLat(selectedLocation.lat || selectedLocation.latitude);
                        setEditLng(selectedLocation.lng || selectedLocation.longitude);
                        setEditAddress(selectedLocation.address);
                        setEditDescription(selectedLocation.description || '');
                        setEditPhone(selectedLocation.phone || '');
                        setEditTimings(selectedLocation.timings || '');
                        setEditPresident(selectedLocation.president || '');
                        setEditLeader(selectedLocation.leader || '');
                        setEditActiveMembers(selectedLocation.active_members || '');
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      <Edit size={12} /> Edit Place
                    </button>
                    <button
                      className="clickable"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedLocation.name} permanently?`)) {
                          onDeleteLocation(selectedLocation.id);
                        }
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      <Trash2 size={12} /> Delete Place
                    </button>
                  </div>
                )}

                {/* Save Geocode Result to Database (Admin only) */}
                {token && selectedLocation.category === 'search-result' && (
                  <div style={{ display: 'flex', marginTop: '4px' }}>
                    <button
                      className="clickable"
                      onClick={handleSaveToDatabase}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}
                    >
                      <Plus size={14} /> Save this Place to Map
                    </button>
                  </div>
                )}

                {/* Navigation Road Directions */}
                {navigationRoute && navigationRoute.steps && (
                  <div style={{
                    marginTop: '16px',
                    borderTop: '1px solid var(--border-panel)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-panel)',
                      textAlign: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '10px' }}>Distance</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{navigationRoute.distance}</strong>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-panel)' }}></div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '10px' }}>Est. Time</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{navigationRoute.duration}</strong>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Road Directions
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                        paddingRight: '4px'
                      }}>
                        {navigationRoute.steps.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '11px', lineHeight: '1.4' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{idx + 1}.</span>
                            <div style={{ flex: 1, color: 'var(--text-primary)' }}>
                              {step.instruction}
                            </div>
                            {step.distance > 0 && (
                              <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {step.distance < 1000 ? `${Math.round(step.distance)}m` : `${(step.distance/1000).toFixed(1)}km`}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: FESTIVAL ROUTES */}
        {activeTab === 'routes' && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            
            {!selectedRoute ? (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Active Festival Processes
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {routes.map(route => (
                    <div
                      key={route.id}
                      className="clickable"
                      onClick={() => onSelectRoute(route)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-panel)',
                        background: 'var(--bg-panel-solid)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = route.color}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-panel)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {route.name}
                        </h3>
                        <Route size={16} style={{ color: route.color, flexShrink: 0, marginLeft: '8px' }} />
                      </div>
                      
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px' }}>
                        {route.description}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        <span>Distance: {route.distance}</span>
                        <span>•</span>
                        <span>Duration: {route.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Back Button */}
                <button 
                  className="clickable"
                  onClick={() => onSelectRoute(null)}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-panel)',
                    background: 'var(--bg-panel-solid)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  <X size={12} /> Back to Routes
                </button>

                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {selectedRoute.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedRoute.description}
                  </p>
                </div>

                {/* Route statistics */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-item-hover)',
                  border: '1px solid var(--border-panel)',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  <div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '10px' }}>Distance</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedRoute.distance}</strong>
                  </div>
                  <div style={{ width: '1px', background: 'var(--border-panel)' }}></div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '10px' }}>Duration</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedRoute.duration}</strong>
                  </div>
                </div>

                {/* Stops Timeline */}
                {selectedRoute.stops && (
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Route Timeline & ETA
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', paddingLeft: '8px' }}>
                      {selectedRoute.stops.map((stop, idx) => {
                        const isLast = idx === selectedRoute.stops.length - 1;
                        return (
                          <div key={idx} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
                            {/* Vertical Line */}
                            {!isLast && (
                              <div style={{
                                position: 'absolute',
                                left: '5px',
                                top: '12px',
                                bottom: '-12px',
                                width: '2px',
                                backgroundColor: selectedRoute.color,
                                opacity: 0.4,
                              }}></div>
                            )}
                            
                            {/* Circle Dot Indicator */}
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: idx === 0 ? '#22c55e' : (isLast ? '#ef4444' : '#ffffff'),
                              border: `2px solid ${selectedRoute.color}`,
                              zIndex: 1,
                              marginTop: '3px',
                              flexShrink: 0
                            }}></div>
                            
                            <div style={{ paddingBottom: isLast ? '0' : '20px' }}>
                              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                {stop.name}
                              </h4>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                ETA: {stop.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Procession Simulation Card */}
                <div style={{
                  background: 'rgba(217, 119, 6, 0.05)',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: simActive ? '#22c55e' : '#9ca3af',
                      animation: simActive ? 'pulse 1.5s infinite' : 'none',
                    }}></div>
                    <strong style={{ fontSize: '11px', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Live Procession Chariot
                    </strong>
                  </div>

                  {simPosition ? (
                    // Live Telemetry View
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                        <div style={{ background: 'var(--bg-panel-solid)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-panel)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block' }}>Chariot Speed</span>
                          <strong style={{ color: 'var(--text-primary)' }}>12 km/h</strong>
                        </div>
                        <div style={{ background: 'var(--bg-panel-solid)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-panel)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block' }}>Chariot GPS</span>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '10px' }}>
                            {simPosition[0].toFixed(4)}, {simPosition[1].toFixed(4)}
                          </strong>
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block' }}>Live Status</span>
                        {simActive ? 'Procession moving towards Gundicha Mandap...' : 'Chariot paused.'}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {simActive ? (
                          <button
                            onClick={onPauseSimulation}
                            className="clickable"
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '8px',
                              background: 'var(--bg-panel-solid)',
                              border: '1px solid var(--border-panel)',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}
                          >
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={onResumeSimulation}
                            className="clickable"
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '8px',
                              background: '#d97706',
                              border: 'none',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}
                          >
                            Resume
                          </button>
                        )}
                        <button
                          onClick={onResetSimulation}
                          className="clickable"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Inactive View / Start Trigger
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                        Simulate the chariot position dynamically along the route to showcase real-time telemetry tracking.
                      </p>
                      <button
                        onClick={() => onStartSimulation(selectedRoute)}
                        className="clickable"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          background: '#d97706',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Play size={14} fill="#ffffff" /> Start Live Simulation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN ADD PLACE FORM */}
        {activeTab === 'admin' && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!token ? (
              // Glassmorphic Login/Register card
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-panel)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {authMode === 'login' ? 'Devotee Sign In' : 'Register Account'}
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {authMode === 'login' 
                    ? 'Enter your credentials to manage community map points.' 
                    : 'Create a new devotee account. Admin permission will be granted by default.'}
                </p>

                {authError && (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setAuthError('');
                  setAuthLoading(true);
                  if (authMode === 'login') {
                    onLogin(authEmail, authPassword)
                      .catch(err => setAuthError(err.message))
                      .finally(() => setAuthLoading(false));
                  } else {
                    onRegister(authName, authEmail, authPassword)
                      .catch(err => setAuthError(err.message))
                      .finally(() => setAuthLoading(false));
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {authMode === 'register' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Gouranga Das"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-panel)',
                          backgroundColor: 'var(--bg-panel-solid)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. admin@iskcon.org"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="clickable"
                    style={{
                      marginTop: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '12px',
                      opacity: authLoading ? 0.7 : 1
                    }}
                  >
                    {authLoading 
                      ? 'Processing...' 
                      : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                  </button>

                </form>

                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      setAuthMode(prev => prev === 'login' ? 'register' : 'login');
                      setAuthError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {authMode === 'login' 
                      ? "Don't have an account? Sign Up" 
                      : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            ) : (
              // Form for Logged In User
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  fontSize: '11px'
                }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '10px' }}>Active Session</span>
                    <strong style={{ color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block', whiteSpace: 'nowrap' }}>
                      {user?.name}
                    </strong>
                  </div>
                  <button
                    onClick={onLogout}
                    className="clickable"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-panel-solid)',
                      border: '1px solid var(--border-panel)',
                      color: '#ef4444',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}
                  >
                    Log Out
                  </button>
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Add a New Community Point
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Add a temple, Namahatta center, or devotee household to the active session map. Panning/clicking on the map lets you locate lat/lng.
                </p>

                <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Point Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Radheshyam Bhavan"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Category *
                    </label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    >
                      <option value={categories.TEMPLE}>Temple / Main Center</option>
                      <option value={categories.NAMAHATTA}>Namahatta Center</option>
                      <option value={categories.BHAKTA}>Bhakta House (Devotee)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Latitude *
                      </label>
                      <input 
                        type="number" 
                        step="0.000001"
                        required
                        value={newLat}
                        onChange={(e) => setNewLat(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-panel)',
                          backgroundColor: 'var(--bg-panel-solid)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Longitude *
                      </label>
                      <input 
                        type="number" 
                        step="0.000001"
                        required
                        value={newLng}
                        onChange={(e) => setNewLng(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-panel)',
                          backgroundColor: 'var(--bg-panel-solid)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Address *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Street 4, A-Zone, Durgapur"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Description / Notes
                    </label>
                    <textarea 
                      placeholder="e.g. Weekly study programs held here"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      style={{
                        width: '100%',
                        height: '60px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-panel)',
                        backgroundColor: 'var(--bg-panel-solid)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="clickable"
                    style={{
                      marginTop: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} /> Add to Map
                  </button>

                </form>
              </>
            )}
          </div>
        )}

      </div>

      {/* Sidebar Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-panel)', fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>v1.0.0 (Local Dev Mode)</span>
        <span>ISKCON Durgapur Dev Team</span>
      </div>
    </div>
  );
}
