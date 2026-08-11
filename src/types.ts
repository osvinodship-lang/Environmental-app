export type EnvCategory = 'aqi' | 'canopy' | 'renewable' | 'waste' | 'hazard' | 'report';

export interface AQIData {
  index: number; // 0-500
  label: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  o3: number; // ppb
  no2: number; // ppb
  co: number; // ppm
  so2: number; // ppb
  mainPollutant: string;
  statusColor: string;
}

export interface CanopyData {
  coveragePercent: number; // %
  treeCountEstimate: number;
  nativeSpecies: string[];
  carbonOffsetTonsYear: number;
  heatIslandMitigationScore: number; // 1-10
}

export interface RenewableData {
  facilityType: 'solar' | 'wind' | 'hydro' | 'ev_charging';
  capacityMW: number;
  cleanEnergyOutputGWh: number;
  homesPowered: number;
  operator: string;
}

export interface HazardData {
  hazardType: 'wildfire' | 'deforestation' | 'water_pollution' | 'noise' | 'smog_alert' | 'toxic_spill';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  reportedDate: string;
  impactRadiusKm: number;
  activeStatus: 'active' | 'contained' | 'monitored';
  description: string;
}

export interface WasteData {
  wasteType: 'recycling' | 'e_waste' | 'compost' | 'hazardous';
  openHours: string;
  acceptedItems: string[];
  monthlyTonsProcessed: number;
}

export interface CommunityReport {
  id: string;
  title: string;
  category: EnvCategory;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lat: number;
  lng: number;
  address: string;
  timestamp: string;
  upvotes: number;
  status: 'pending' | 'under_review' | 'resolved';
  reporterName: string;
}

export interface EnvLocation {
  id: string;
  title: string;
  category: EnvCategory;
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
  country: string;
  summary: string;
  aqi?: AQIData;
  canopy?: CanopyData;
  renewable?: RenewableData;
  hazard?: HazardData;
  waste?: WasteData;
  verified: boolean;
  updatedAt: string;
  userReports?: CommunityReport[];
}

export interface AIEcoAnalysis {
  locationName: string;
  coordinates: { lat: number; lng: number };
  ecoScore: number; // 0-100
  scoreBreakdown: {
    airQuality: number;
    greenCanopy: number;
    cleanEnergy: number;
    wasteManagement: number;
    climateResilience: number;
  };
  summary: string;
  keyEnvironmentalRisks: string[];
  positiveEcoHighlights: string[];
  actionableRecommendations: {
    forCitizens: string[];
    forCityPlanners: string[];
  };
  forecast30Day: string;
  generatedAt: string;
}

export interface GreenRoute {
  mode: 'walking' | 'bicycling' | 'transit' | 'ev' | 'gas_car';
  distanceKm: number;
  durationMins: number;
  co2EmissionsKg: number;
  co2SavedKg: number;
  avgAQIAlongRoute: number;
  greeneryExposureScore: number; // 0-100
  recommendation: string;
}

export interface FilterState {
  categories: EnvCategory[];
  minAQI: number;
  maxAQI: number;
  hazardSeverity: string[];
  searchQuery: string;
  activeRegion: string;
}

export type MapViewMode = 'all' | 'aqi' | 'canopy' | 'renewable' | 'hazards';
export type MapEngineMode = 'google' | 'leaflet';
