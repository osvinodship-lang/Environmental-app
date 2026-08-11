import React from 'react';
import { 
  X, 
  Wind, 
  Trees, 
  Zap, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  BarChart2, 
  Share2,
  FileText
} from 'lucide-react';
import { EnvLocation } from '../types';

interface LocationDetailDrawerProps {
  location: EnvLocation | null;
  onClose: () => void;
  onRunAIAnalysis: (location: EnvLocation) => void;
  onGenerateReport: (location: EnvLocation) => void;
}

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  location,
  onClose,
  onRunAIAnalysis,
  onGenerateReport,
}) => {
  if (!location) return null;

  return (
    <div className="fixed top-20 right-4 z-30 w-80 sm:w-96 max-h-[calc(100vh-6rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-100 animate-slide-in">
      
      {/* Drawer Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              location.category === 'aqi' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' :
              location.category === 'canopy' ? 'bg-green-950/80 text-green-400 border-green-800' :
              location.category === 'renewable' ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
              location.category === 'hazard' ? 'bg-rose-950/80 text-rose-400 border-rose-800' :
              'bg-teal-950/80 text-teal-400 border-teal-800'
            }`}>
              {location.category.toUpperCase()}
            </span>
            {location.verified && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40 font-medium">
                <ShieldCheck className="w-3 h-3" /> Verified Station
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-white leading-tight">{location.title}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{location.address}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
        {location.summary}
      </p>

      {/* 1. AQI DETAILS */}
      {location.aqi && (
        <div className="space-y-3 mb-5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-emerald-400" /> Air Quality Index
              </span>
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-950"
                style={{ backgroundColor: location.aqi.statusColor }}
              >
                {location.aqi.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold text-white font-mono">{location.aqi.index}</span>
              <span className="text-xs text-slate-400">Main Pollutant: <strong className="text-slate-200">{location.aqi.mainPollutant}</strong></span>
            </div>

            {/* Sub-pollutants grid */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-700/60 font-mono text-xs">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">PM2.5</div>
                <div className="font-bold text-emerald-400">{location.aqi.pm25} <span className="text-[9px] text-slate-500">µg/m³</span></div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">PM10</div>
                <div className="font-bold text-amber-400">{location.aqi.pm10} <span className="text-[9px] text-slate-500">µg/m³</span></div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">NO2</div>
                <div className="font-bold text-teal-400">{location.aqi.no2} <span className="text-[9px] text-slate-500">ppb</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CANOPY DETAILS */}
      {location.canopy && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5"><Trees className="w-4 h-4 text-green-400" /> Tree Canopy & Forest</span>
            <span className="text-green-400 font-bold">{location.canopy.coveragePercent}% Coverage</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Tree Population:</span>
              <span className="font-medium text-white">{location.canopy.treeCountEstimate.toLocaleString()} trees</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Carbon Offset:</span>
              <span className="font-medium text-emerald-400">{location.canopy.carbonOffsetTonsYear} Tons CO2 / Year</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-700/50">
              <span className="text-slate-400">Heat Island Score:</span>
              <span className="font-medium text-white">{location.canopy.heatIslandMitigationScore} / 10</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-400 block mb-1">Native Species:</span>
              <div className="flex flex-wrap gap-1">
                {location.canopy.nativeSpecies.map((s) => (
                  <span key={s} className="bg-green-950/80 text-green-300 border border-green-800/60 text-[10px] px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RENEWABLE ENERGY DETAILS */}
      {location.renewable && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Clean Energy Facility</span>
            <span className="text-amber-400 uppercase text-[10px] font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              {location.renewable.facilityType}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-700/50">
            <span className="text-slate-400">Capacity:</span>
            <span className="font-medium text-white">{location.renewable.capacityMW} MW</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-700/50">
            <span className="text-slate-400">Annual Clean Output:</span>
            <span className="font-medium text-amber-300">{location.renewable.cleanEnergyOutputGWh} GWh</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Homes Powered:</span>
            <span className="font-medium text-white">{location.renewable.homesPowered.toLocaleString()} homes</span>
          </div>
        </div>
      )}

      {/* 4. HAZARD DETAILS */}
      {location.hazard && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-rose-300 mb-1">
            <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-400" /> Hazard Alert</span>
            <span className="uppercase text-[10px] font-bold text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded border border-rose-700">
              {location.hazard.severity} Severity
            </span>
          </div>
          <p className="text-slate-300 text-xs">{location.hazard.description}</p>
          <div className="flex justify-between pt-2 border-t border-rose-900/50 text-[11px]">
            <span className="text-slate-400">Impact Radius: {location.hazard.impactRadiusKm} km</span>
            <span className="text-rose-300 capitalize font-medium">Status: {location.hazard.activeStatus}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => onRunAIAnalysis(location)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-lg transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Ecosystem with AI</span>
        </button>

        <button
          onClick={() => onGenerateReport(location)}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl border border-slate-700 transition"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Generate Regional Markdown Report</span>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {new Date(location.updatedAt).toLocaleTimeString()}</span>
        <span>GPS: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}</span>
      </div>

    </div>
  );
};
