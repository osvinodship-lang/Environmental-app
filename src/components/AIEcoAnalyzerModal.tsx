import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Building2, 
  Copy, 
  Check, 
  Loader2,
  FileText
} from 'lucide-react';
import { AIEcoAnalysis, EnvLocation } from '../types';

interface AIEcoAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: EnvLocation | null;
  analysis: AIEcoAnalysis | null;
  isLoading: boolean;
  onRequestAnalysis: (location: EnvLocation) => void;
  markdownReport: string | null;
  onGenerateMarkdownReport: () => void;
  isReportLoading: boolean;
}

export const AIEcoAnalyzerModal: React.FC<AIEcoAnalyzerModalProps> = ({
  isOpen,
  onClose,
  location,
  analysis,
  isLoading,
  onRequestAnalysis,
  markdownReport,
  onGenerateMarkdownReport,
  isReportLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500 bg-emerald-950/60';
    if (score >= 60) return 'text-amber-400 border-amber-500 bg-amber-950/60';
    return 'text-rose-400 border-rose-500 bg-rose-950/60';
  };

  const handleCopyMarkdown = () => {
    if (markdownReport) {
      navigator.clipboard.writeText(markdownReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">AI Environmental Health Diagnosis</h3>
            <p className="text-xs text-slate-400">
              Powered by Gemini 2.5 Flash • Real-Time Climate Intelligence
            </p>
          </div>
        </div>

        {/* Location Selector / Status */}
        {location && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Target Region
              </span>
              <h4 className="font-bold text-sm text-white mt-1">{location.title}</h4>
              <p className="text-xs text-slate-400">{location.address}</p>
            </div>

            {!analysis && !isLoading && (
              <button
                onClick={() => onRequestAnalysis(location)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition"
              >
                Run AI Diagnosis
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">
              Synthesizing environmental telemetry, satellite canopy metrics, & AQI forecasts...
            </p>
            <p className="text-xs text-slate-400">Communicating with Gemini AI Agent...</p>
          </div>
        )}

        {/* AI Results */}
        {analysis && !isLoading && (
          <div className="space-y-6">
            
            {/* Overall Score Gauge & Subscores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Overall Eco Score */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(analysis.ecoScore)}`}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Eco Score</span>
                <span className="text-5xl font-black font-mono my-2">{analysis.ecoScore}</span>
                <span className="text-[10px] font-medium opacity-90">Out of 100</span>
              </div>

              {/* Subscores Breakdown */}
              <div className="sm:col-span-2 bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block mb-1">Ecosystem Subscores</span>
                
                {[
                  { label: 'Air Quality Index', val: analysis.scoreBreakdown.airQuality },
                  { label: 'Green Canopy', val: analysis.scoreBreakdown.greenCanopy },
                  { label: 'Clean Energy Grid', val: analysis.scoreBreakdown.cleanEnergy },
                  { label: 'Waste Management', val: analysis.scoreBreakdown.wasteManagement },
                  { label: 'Climate Resilience', val: analysis.scoreBreakdown.climateResilience },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold">{item.val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Executive Summary */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <h5 className="font-semibold text-xs text-slate-300 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Executive Diagnosis
              </h5>
              <p className="text-xs text-slate-200 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Risks vs Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-4 space-y-2">
                <h5 className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Key Environmental Risks
                </h5>
                <ul className="space-y-1.5 text-slate-300">
                  {analysis.keyEnvironmentalRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-4 space-y-2">
                <h5 className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Eco Strengths & Assets
                </h5>
                <ul className="space-y-1.5 text-slate-300">
                  {analysis.positiveEcoHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-4 text-xs">
              <div>
                <h5 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Users className="w-4 h-4 text-teal-400" /> Citizen Action Items
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {analysis.actionableRecommendations.forCitizens.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-700/60">
                <h5 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Building2 className="w-4 h-4 text-amber-400" /> City Planning & Policy Priorities
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {analysis.actionableRecommendations.forCityPlanners.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 30-Day Forecast */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs">
              <span className="text-slate-400 block mb-1 font-mono">30-Day Trend Forecast</span>
              <p className="text-slate-200 font-medium">{analysis.forecast30Day}</p>
            </div>

            {/* Markdown Report Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={onGenerateMarkdownReport}
                disabled={isReportLoading}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2 rounded-xl border border-slate-700 transition"
              >
                {isReportLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{isReportLoading ? 'Generating Full Report...' : 'Generate Markdown Report'}</span>
              </button>

              {markdownReport && (
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown Report'}</span>
                </button>
              )}
            </div>

            {/* Markdown Preview Area */}
            {markdownReport && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-h-60 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {markdownReport}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
