import React from 'react';
import { 
  Layers, 
  Wind, 
  Trees, 
  Zap, 
  Trash2, 
  AlertTriangle, 
  MessageSquare, 
  Filter,
  Check
} from 'lucide-react';
import { EnvCategory, FilterState } from '../types';

interface LayerControlPanelProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  totalLocationsCount: number;
  visibleLocationsCount: number;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  filterState,
  setFilterState,
  totalLocationsCount,
  visibleLocationsCount,
}) => {
  const toggleCategory = (cat: EnvCategory) => {
    setFilterState((prev) => {
      const exists = prev.categories.includes(cat);
      const updated = exists
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: updated };
    });
  };

  const categoriesConfig: { id: EnvCategory; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'aqi', label: 'Air Quality (AQI)', icon: Wind, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    { id: 'canopy', label: 'Green Canopy & Forests', icon: Trees, color: 'text-green-400 bg-green-950/60 border-green-800' },
    { id: 'renewable', label: 'Renewable Energy', icon: Zap, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { id: 'waste', label: 'Waste & Recycling', icon: Trash2, color: 'text-teal-400 bg-teal-950/60 border-teal-800' },
    { id: 'hazard', label: 'Eco Hazards & Risk', icon: AlertTriangle, color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
    { id: 'report', label: 'Community Reports', icon: MessageSquare, color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 text-slate-200 shadow-xl w-72 sm:w-80 space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-white">Environmental Layers</h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          Showing {visibleLocationsCount} / {totalLocationsCount}
        </span>
      </div>

      {/* Category Toggles */}
      <div className="space-y-1.5">
        {categoriesConfig.map(({ id, label, icon: Icon, color }) => {
          const isActive = filterState.categories.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleCategory(id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition ${
                isActive
                  ? 'bg-slate-800 border-slate-700 text-white shadow-sm'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{label}</span>
              </div>
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                isActive ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
              }`}>
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* AQI Legend Bar */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="font-medium text-slate-300">AQI Severity Scale</span>
          <span>0 - 500+</span>
        </div>
        <div className="h-2 rounded-full w-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 shadow-inner" />
        <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
          <span className="text-emerald-400">0 Good</span>
          <span className="text-amber-400">50 Mod</span>
          <span className="text-orange-400">100 Sensi</span>
          <span className="text-rose-400">150+ Hazard</span>
        </div>
      </div>
    </div>
  );
};
