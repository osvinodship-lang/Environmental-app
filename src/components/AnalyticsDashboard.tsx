import React from 'react';
import { 
  BarChart3, 
  Wind, 
  Trees, 
  Zap, 
  AlertTriangle, 
  Globe2, 
  PieChart, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { EnvLocation } from '../types';

interface AnalyticsDashboardProps {
  locations: EnvLocation[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ locations }) => {
  const aqiLocations = locations.filter((l) => l.aqi);
  const canopyLocations = locations.filter((l) => l.canopy);
  const renewableLocations = locations.filter((l) => l.renewable);
  const hazardLocations = locations.filter((l) => l.hazard);

  // Total Clean Energy Capacity MW
  const totalCleanMW = renewableLocations.reduce((acc, l) => acc + (l.renewable?.capacityMW || 0), 0);
  // Total Carbon Offset
  const totalCarbonOffset = canopyLocations.reduce((acc, l) => acc + (l.canopy?.carbonOffsetTonsYear || 0), 0);
  // Avg AQI
  const avgAQI = Math.round(
    aqiLocations.reduce((acc, l) => acc + (l.aqi?.index || 0), 0) / (aqiLocations.length || 1)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 space-y-6 animate-fade-in">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Global Average AQI</span>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">{avgAQI}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Across {aqiLocations.length} active monitoring nodes</p>
          </div>
          <div className="p-3 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-xl">
            <Wind className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Clean Energy</span>
            <div className="text-3xl font-black font-mono text-amber-400 mt-1">{totalCleanMW.toFixed(1)} <span className="text-sm font-sans text-slate-400">MW</span></div>
            <p className="text-[10px] text-slate-500 mt-0.5">Solar, Wind, Hydro capacity</p>
          </div>
          <div className="p-3 bg-amber-950 text-amber-400 border border-amber-800/60 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Annual Carbon Offset</span>
            <div className="text-3xl font-black font-mono text-green-400 mt-1">{totalCarbonOffset.toLocaleString()} <span className="text-sm font-sans text-slate-400">Tons</span></div>
            <p className="text-[10px] text-slate-500 mt-0.5">Absorbed by urban canopy</p>
          </div>
          <div className="p-3 bg-green-950 text-green-400 border border-green-800/60 rounded-xl">
            <Trees className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Active Eco Hazards</span>
            <div className="text-3xl font-black font-mono text-rose-400 mt-1">{hazardLocations.length}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Under active environmental watch</p>
          </div>
          <div className="p-3 bg-rose-950 text-rose-400 border border-rose-800/60 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. AQI Comparison Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400" /> Air Quality Index (AQI) by Region
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Lower is cleaner</span>
          </div>

          <div className="space-y-3 pt-2">
            {aqiLocations.slice(0, 8).map((loc) => {
              const aqiVal = loc.aqi?.index || 0;
              const percent = Math.min((aqiVal / 200) * 100, 100);

              return (
                <div key={loc.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{loc.city} ({loc.country})</span>
                    <span className="font-mono font-bold" style={{ color: loc.aqi?.statusColor }}>
                      {aqiVal} AQI - {loc.aqi?.label}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%`, backgroundColor: loc.aqi?.statusColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Urban Forest Canopy & Carbon Offset */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Trees className="w-4 h-4 text-green-400" /> Urban Forest Canopy Coverage (%)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Higher is greener</span>
          </div>

          <div className="space-y-3 pt-2">
            {canopyLocations.map((loc) => {
              const coverage = loc.canopy?.coveragePercent || 0;

              return (
                <div key={loc.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{loc.title}</span>
                    <span className="font-mono font-bold text-green-400">{coverage}% Canopy</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500" 
                      style={{ width: `${coverage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Renewable Energy Assets & Operator Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Renewable Clean Energy Assets Directory
          </h3>
          <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-medium">
            Verified Clean Power
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Facility Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Capacity (MW)</th>
                <th className="p-3">Homes Powered</th>
                <th className="p-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {renewableLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-white">{loc.title}</td>
                  <td className="p-3">
                    <span className="uppercase text-[9px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                      {loc.renewable?.facilityType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{loc.city}, {loc.country}</td>
                  <td className="p-3 font-mono font-bold text-amber-300">{loc.renewable?.capacityMW} MW</td>
                  <td className="p-3 font-mono">{loc.renewable?.homesPowered.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{loc.renewable?.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
