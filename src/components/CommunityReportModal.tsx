import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  MapPin, 
  Upload, 
  Send, 
  MessageSquare, 
  ThumbsUp, 
  ShieldAlert, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { CommunityReport, EnvCategory } from '../types';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: CommunityReport[];
  onSubmitReport: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'upvotes' | 'status'>) => void;
}

export const CommunityReportModal: React.FC<CommunityReportModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSubmitReport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'view' | 'submit'>('view');
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EnvCategory>('hazard');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address) return;

    onSubmitReport({
      title,
      category,
      severity,
      lat: 37.7749 + (Math.random() - 0.5) * 0.05,
      lng: -122.4194 + (Math.random() - 0.5) * 0.05,
      address,
      description,
      reporterName: reporterName || 'Anonymous Citizen',
    });

    setTitle('');
    setDescription('');
    setAddress('');
    setActiveSubTab('view');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800/60">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Community Environmental Watch</h3>
            <p className="text-xs text-slate-400">Report & track local ecological incidents & community green projects</p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 mb-6">
          <button
            onClick={() => setActiveSubTab('view')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'view' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Incident Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveSubTab('submit')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'submit' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            + File New Incident
          </button>
        </div>

        {/* 1. VIEW REPORTS */}
        {activeSubTab === 'view' && (
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      rep.severity === 'critical' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      rep.severity === 'high' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                      'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {rep.severity} severity
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{rep.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" /> {rep.address}
                    </p>
                  </div>

                  <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800 capitalize">
                    Status: {rep.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {rep.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Reported by {rep.reporterName} • {new Date(rep.timestamp).toLocaleDateString()}
                  </span>

                  <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/50">
                    <ThumbsUp className="w-3 h-3" /> {rep.upvotes} Upvotes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. SUBMIT FORM */}
        {activeSubTab === 'submit' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Report Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chemical dumping near creek, Unmapped urban forest..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EnvCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="hazard">Eco Hazard / Pollution</option>
                  <option value="aqi">Air Quality Concern</option>
                  <option value="canopy">Tree / Park Hazard or Need</option>
                  <option value="waste">Illegal Dumping</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="low">Low (Cosmetic/Minor)</option>
                  <option value="medium">Medium (Moderate Concern)</option>
                  <option value="high">High (Urgent Local Risk)</option>
                  <option value="critical">Critical (Immediate Danger)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Street Address or Landmark</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Location address or landmark..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Incident Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, potential causes, and recommended action..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Your Name / Organization (Optional)</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. EcoWatcher Jane, Anonymous..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Incident Report</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
