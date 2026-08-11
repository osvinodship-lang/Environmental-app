import React, { useState } from 'react';
import { 
  Globe2, 
  Map, 
  BarChart3, 
  AlertTriangle, 
  Navigation, 
  Sparkles, 
  Key, 
  Search,
  MapPin,
  Leaf
} from 'lucide-react';
import { GLOBAL_CITIES } from '../data/environmentalData';
import { MapEngineMode } from '../types';

interface NavbarProps {
  activeTab: 'map' | 'analytics' | 'reports' | 'route';
  setActiveTab: (tab: 'map' | 'analytics' | 'reports' | 'route') => void;
  onSelectCity: (city: typeof GLOBAL_CITIES[0]) => void;
  onOpenApiKeyModal: () => void;
  onOpenAIModal: () => void;
  onOpenReportModal: () => void;
  mapEngine: MapEngineMode;
  setMapEngine: (engine: MapEngineMode) => void;
  hasGoogleMapsKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectCity,
  onOpenApiKeyModal,
  onOpenAIModal,
  onOpenReportModal,
  mapEngine,
  setMapEngine,
  hasGoogleMapsKey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredCities = GLOBAL_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">EcoMap</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-medium border border-emerald-800/50">
                  Global Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Real-Time Environmental & Climate Monitor</p>
            </div>
          </div>

          {/* Quick Location Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city (e.g. San Francisco, Tokyo...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-lg pl-9 pr-4 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        onSelectCity(city);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700/80 text-xs flex items-center justify-between transition border-b border-slate-700/50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-medium text-slate-200">{city.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900/60">
                        {city.region}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400 text-center">
                    No matching major cities found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation View Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('route')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'route'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Green Route</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Incidents</span>
            </button>
          </nav>

          {/* Actions & Settings */}
          <div className="flex items-center gap-2">
            
            {/* AI Eco Assessment Launcher */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-900/30 transition border border-emerald-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden lg:inline">AI Eco Health Analysis</span>
              <span className="lg:hidden">AI Eco</span>
            </button>

            {/* Map Engine Toggle (Google vs Leaflet) */}
            <div className="hidden xl:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
              <button
                onClick={() => setMapEngine('google')}
                className={`px-2 py-1 rounded-md transition font-medium ${
                  mapEngine === 'google' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Google Maps JS SDK"
              >
                Google Maps
              </button>
              <button
                onClick={() => setMapEngine('leaflet')}
                className={`px-2 py-1 rounded-md transition font-medium ${
                  mapEngine === 'leaflet' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Interactive Leaflet / OpenStreetMap"
              >
                Leaflet / OSM
              </button>
            </div>

            {/* API Key Status / Setup Modal Trigger */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                hasGoogleMapsKey
                  ? 'bg-slate-800 border-emerald-500/50 text-emerald-400 hover:bg-slate-700'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
              }`}
              title="Google Maps Platform API Key Setup"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {hasGoogleMapsKey ? 'Maps Key Active' : 'Configure Maps Key'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
