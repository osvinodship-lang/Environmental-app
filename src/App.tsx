import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MapContainer } from './components/MapContainer';
import { LayerControlPanel } from './components/LayerControlPanel';
import { LocationDetailDrawer } from './components/LocationDetailDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AIEcoAnalyzerModal } from './components/AIEcoAnalyzerModal';
import { CommunityReportModal } from './components/CommunityReportModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GreenRoutePlanner } from './components/GreenRoutePlanner';
import { 
  INITIAL_LOCATIONS, 
  INITIAL_COMMUNITY_REPORTS, 
  generateDynamicLocationForCoord,
  GLOBAL_CITIES 
} from './data/environmentalData';
import { EnvLocation, CommunityReport, FilterState, AIEcoAnalysis, MapEngineMode } from './types';
import { Sparkles, MapPin, Layers } from 'lucide-react';

const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasGoogleMapsKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [locations, setLocations] = useState<EnvLocation[]>(INITIAL_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<EnvLocation | null>(INITIAL_LOCATIONS[0]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(INITIAL_COMMUNITY_REPORTS);
  
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'reports' | 'route'>('map');
  const [mapEngine, setMapEngine] = useState<MapEngineMode>(hasGoogleMapsKey ? 'google' : 'leaflet');
  
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default SF
  const [zoom, setZoom] = useState(11);

  // Filters
  const [filterState, setFilterState] = useState<FilterState>({
    categories: ['aqi', 'canopy', 'renewable', 'waste', 'hazard', 'report'],
    minAQI: 0,
    maxAQI: 500,
    hazardSeverity: ['low', 'moderate', 'high', 'critical'],
    searchQuery: '',
    activeRegion: 'all',
  });

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<AIEcoAnalysis | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [markdownReport, setMarkdownReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Filtered Locations
  const visibleLocations = locations.filter((loc) => {
    if (!filterState.categories.includes(loc.category)) return false;
    if (filterState.searchQuery && !loc.title.toLowerCase().includes(filterState.searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Select city from Navbar dropdown
  const handleSelectCity = (city: typeof GLOBAL_CITIES[0]) => {
    setCenter({ lat: city.lat, lng: city.lng });
    setZoom(12);
  };

  // Click on map to place or inspect coordinate
  const handleMapClick = (lat: number, lng: number) => {
    const dynLoc = generateDynamicLocationForCoord(lat, lng);
    setLocations((prev) => [dynLoc, ...prev.filter((l) => !l.id.startsWith('dyn-'))]);
    setSelectedLocation(dynLoc);
  };

  // Run AI Environmental Analysis via Express server endpoint
  const handleRunAIAnalysis = async (loc: EnvLocation) => {
    setIsAIModalOpen(true);
    setIsAILoading(true);
    setAiAnalysis(null);
    setMarkdownReport(null);

    try {
      const res = await fetch('/api/gemini/eco-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: loc.title,
          lat: loc.lat,
          lng: loc.lng,
          categoryData: loc.aqi || loc.canopy || loc.renewable || loc.hazard || {},
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiAnalysis(data);
      } else {
        console.error('AI Analysis failed:', data);
      }
    } catch (err) {
      console.error('Error triggering AI analysis:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Generate Markdown Report via Express endpoint
  const handleGenerateMarkdownReport = async (loc: EnvLocation) => {
    setIsAIModalOpen(true);
    setIsReportLoading(true);

    try {
      const res = await fetch('/api/gemini/eco-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: loc.title + ' (' + loc.city + ', ' + loc.country + ')',
          lat: loc.lat,
          lng: loc.lng,
        }),
      });

      const data = await res.json();
      if (data.markdownReport) {
        setMarkdownReport(data.markdownReport);
      }
    } catch (err) {
      console.error('Error generating markdown report:', err);
    } finally {
      setIsReportLoading(false);
    }
  };

  // Submit Community Report
  const handleSubmitReport = (newRep: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'status'>) => {
    const reportObj: CommunityReport = {
      ...newRep,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      upvotes: 1,
      status: 'pending',
    };
    setCommunityReports((prev) => [reportObj, ...prev]);

    // Also add to map as report location
    const reportLocation: EnvLocation = {
      id: reportObj.id,
      title: reportObj.title,
      category: 'report',
      lat: reportObj.lat,
      lng: reportObj.lng,
      address: reportObj.address,
      city: 'Local Area',
      region: 'Community Report',
      country: 'Report',
      summary: reportObj.description,
      verified: false,
      updatedAt: reportObj.timestamp,
    };

    setLocations((prev) => [reportLocation, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectCity={handleSelectCity}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAIModal={() => {
          if (selectedLocation) {
            handleRunAIAnalysis(selectedLocation);
          } else {
            setIsAIModalOpen(true);
          }
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        mapEngine={mapEngine}
        setMapEngine={setMapEngine}
        hasGoogleMapsKey={hasGoogleMapsKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* 1. MAP VIEW */}
        {activeTab === 'map' && (
          <div className="w-full h-[calc(100vh-4rem)] relative p-3 sm:p-4">
            
            {/* Interactive Map */}
            <MapContainer
              locations={visibleLocations}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              center={center}
              zoom={zoom}
              mapEngine={mapEngine}
              onMapClick={handleMapClick}
              hasGoogleMapsKey={hasGoogleMapsKey}
              googleApiKey={GOOGLE_MAPS_KEY}
            />

            {/* Floating Layer Control Panel */}
            <div className="absolute top-6 left-6 z-20 hidden md:block">
              <LayerControlPanel
                filterState={filterState}
                setFilterState={setFilterState}
                totalLocationsCount={locations.length}
                visibleLocationsCount={visibleLocations.length}
              />
            </div>

            {/* Selected Location Side Drawer */}
            <LocationDetailDrawer
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
              onRunAIAnalysis={handleRunAIAnalysis}
              onGenerateReport={handleGenerateMarkdownReport}
            />

          </div>
        )}

        {/* 2. ANALYTICS & TRENDS VIEW */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard locations={locations} />
        )}

        {/* 3. GREEN ROUTE PLANNER VIEW */}
        {activeTab === 'route' && (
          <GreenRoutePlanner />
        )}

        {/* 4. COMMUNITY INCIDENT REPORTS VIEW */}
        {activeTab === 'reports' && (
          <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <CommunityReportModal
              isOpen={true}
              onClose={() => setActiveTab('map')}
              reports={communityReports}
              onSubmitReport={handleSubmitReport}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        hasKey={hasGoogleMapsKey}
      />

      <AIEcoAnalyzerModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        location={selectedLocation}
        analysis={aiAnalysis}
        isLoading={isAILoading}
        onRequestAnalysis={handleRunAIAnalysis}
        markdownReport={markdownReport}
        onGenerateMarkdownReport={() => selectedLocation && handleGenerateMarkdownReport(selectedLocation)}
        isReportLoading={isReportLoading}
      />

    </div>
  );
}
