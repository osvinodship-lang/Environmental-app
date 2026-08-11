import React from 'react';
import { Key, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, hasKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            hasKey ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
          }`}>
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Google Maps Platform API Key</h3>
            <p className="text-xs text-slate-400">
              {hasKey ? 'Key active in environment' : 'Setup required for full Google Maps Platform features'}
            </p>
          </div>
        </div>

        {hasKey ? (
          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4 mb-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-200">Google Maps Platform Key detected!</p>
              <p className="text-xs text-slate-300 mt-1">
                Your environment key is configured via <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400">process.env.GOOGLE_MAPS_PLATFORM_KEY</code>. You can view maps in full Google 2D/3D mode.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>How to add your API Key:</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Get a Google Maps API Key from the{' '}
                <a
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline inline-flex items-center gap-1 hover:text-emerald-300"
                >
                  Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Open <strong>Settings</strong> (⚙️ gear icon in top-right of AI Studio) → <strong>Secrets</strong>
              </li>
              <li>
                Create secret name: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">GOOGLE_MAPS_PLATFORM_KEY</code>
              </li>
              <li>Paste your API Key and press <strong>Enter</strong></li>
            </ol>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-700/60">
              Note: The app also provides a high-performance Leaflet/OpenStreetMap fallback engine so you can use all map features immediately without delay!
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Got it, Continue
          </button>
        </div>
      </div>
    </div>
  );
};
