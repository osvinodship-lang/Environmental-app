import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Footprints, 
  Bike, 
  Bus, 
  Zap, 
  Car, 
  Sparkles, 
  Leaf, 
  Loader2, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { GreenRoute } from '../types';

export const GreenRoutePlanner: React.FC = () => {
  const [origin, setOrigin] = useState('San Francisco Downtown');
  const [destination, setDestination] = useState('Golden Gate Park Presidio');
  const [distanceKm, setDistanceKm] = useState(8.5);
  const [routes, setRoutes] = useState<GreenRoute[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateRoute = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/green-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, distanceKm }),
      });
      const data = await res.json();
      if (data.routes) {
        setRoutes(data.routes);
      }
    } catch (error) {
      console.error('Error calculating green route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode: GreenRoute['mode']) => {
    switch (mode) {
      case 'walking': return Footprints;
      case 'bicycling': return Bike;
      case 'transit': return Bus;
      case 'ev': return Zap;
      case 'gas_car': return Car;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-slate-100 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Eco-Route & Carbon Calculator</h2>
            <p className="text-xs text-slate-400">
              Calculate transport carbon footprint, air quality exposure, & optimal green pathways
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Starting Point</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Origin location..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Destination</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Destination location..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Est. Distance (km)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCalculateRoute}
                disabled={isLoading}
                className="shrink-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Calculate</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Results Comparison Grid */}
      {routes && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Transportation Impact Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((rt) => {
              const IconComp = getModeIcon(rt.mode);
              const isZeroEmissions = rt.co2EmissionsKg === 0;

              return (
                <div
                  key={rt.mode}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition relative overflow-hidden ${
                    isZeroEmissions
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        isZeroEmissions ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-white capitalize">{rt.mode.replace('_', ' ')}</span>
                    </div>

                    {isZeroEmissions && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                        Zero Carbon
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                      <span>Travel Duration:</span>
                      <span className="font-bold text-white">{rt.durationMins} mins</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                      <span>CO2 Emissions:</span>
                      <span className={`font-bold font-mono ${isZeroEmissions ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {rt.co2EmissionsKg} kg
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                      <span>CO2 Offset vs Gas Car:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> -{rt.co2SavedKg} kg
                      </span>
                    </div>

                    <div className="flex justify-between py-1 text-slate-300">
                      <span>Greenery Exposure Score:</span>
                      <span className="font-bold text-teal-400">{rt.greeneryExposureScore} / 100</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    "{rt.recommendation}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
