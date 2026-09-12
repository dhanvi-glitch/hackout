import React, { useState, useEffect } from 'react';
import {
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Search,
  Sparkles,
  Loader2,
  Globe2,
  Check,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const LocationSelectorModal = ({ isOpen, onClose, currentLocation, onLocationChanged }) => {
  const { updateLocation, activeLocation: contextLocation } = useSystemStatus();
  const [presets, setPresets] = useState([]);
  const [activeTab, setActiveTab] = useState('PRESETS'); // 'PRESETS' | 'CUSTOM'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Custom Form State
  const [customForm, setCustomForm] = useState({
    name: '',
    district: '',
    state: '',
    country: 'India',
    latitude: '',
    longitude: '',
    community: '',
  });

  const effectiveLocation = currentLocation || contextLocation;

  useEffect(() => {
    if (isOpen) {
      apiService.getLocationPresets().then((data) => {
        setPresets(data || []);
      });
      setError(null);
      setSuccessMsg(null);
      setLoading(false);
      setCurrentStage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredPresets = presets.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  });

  const handleSelectPreset = async (preset) => {
    // Check if this preset is already active
    const isAlreadyActive =
      effectiveLocation &&
      Math.abs(effectiveLocation.latitude - preset.latitude) < 0.05 &&
      Math.abs(effectiveLocation.longitude - preset.longitude) < 0.05;

    if (isAlreadyActive) {
      setSuccessMsg(`${preset.name} is already the active microgrid location.`);
      setTimeout(() => setSuccessMsg(null), 2000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: preset.name,
        district: preset.district,
        state: preset.state,
        country: preset.country || 'India',
        community: preset.community,
        latitude: preset.latitude,
        longitude: preset.longitude,
        climate: preset.climate,
        description: preset.description,
      };

      const res = await updateLocation(payload, (stageText) => {
        setCurrentStage(stageText);
      });

      setSuccessMsg(`✓ Active location updated to ${preset.name}, ${preset.district}`);
      if (onLocationChanged) {
        onLocationChanged(res?.location || payload);
      }
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const lat = parseFloat(customForm.latitude);
    const lon = parseFloat(customForm.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid numeric latitude and longitude coordinates.');
      setLoading(false);
      return;
    }

    if (lat < 6.0 || lat > 38.0 || lon < 68.0 || lon > 98.0) {
      setError('Please select a rural location within India (Latitude: 6°N - 38°N, Longitude: 68°E - 98°E).');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: customForm.name,
        district: customForm.district || 'Rural District',
        state: customForm.state || 'Rural State',
        country: 'India',
        community: customForm.community || `${customForm.name} Community Microgrid`,
        latitude: lat,
        longitude: lon,
      };

      const res = await updateLocation(payload, (stageText) => {
        setCurrentStage(stageText);
      });

      setSuccessMsg(`✓ Successfully relocated to ${customForm.name} (${lat}°N, ${lon}°E)`);
      if (onLocationChanged) {
        onLocationChanged(res?.location || payload);
      }
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#131B29] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Progression Overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-[#0B0F17]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center mb-3 shadow-lg shadow-cyan-950/50 text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
            <p className="text-sm font-semibold text-slate-100 font-mono mb-1">{currentStage || 'Updating location...'}</p>
            <p className="text-xs text-slate-400 font-mono">Querying Open-Meteo & NASA POWER, recomputing forecast & MILP dispatch...</p>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                Select Microgrid Location
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  India
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Live Open-Meteo weather routing, forecast & MILP dispatch sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Location Banner */}
        {effectiveLocation && (
          <div className="px-5 py-2 bg-cyan-950/30 border-b border-cyan-900/40 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[11px] text-slate-400">Active Location:</span>
              <span className="font-semibold text-cyan-300 truncate">
                {effectiveLocation.name || effectiveLocation.shortName}
              </span>
              <span className="font-mono text-[10px] text-slate-500 shrink-0">
                ({effectiveLocation.latitude}°N, {effectiveLocation.longitude}°E)
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1 shrink-0 ml-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE
            </span>
          </div>
        )}

        {/* Feedback Notifications */}
        {error && (
          <div className="mx-4 mt-2.5 p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-2.5 p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 pt-2.5 flex gap-4 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PRESETS'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated Indian Presets ({presets.length})
          </button>
          <button
            onClick={() => setActiveTab('CUSTOM')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'CUSTOM'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Custom Coordinates
          </button>
        </div>

        {/* Main Scrollable Body */}
        <div className="p-4 overflow-hidden flex-1 flex flex-col min-h-0">
          {activeTab === 'PRESETS' ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
              {/* Search Filter */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by village, district, or Indian state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              {/* Dedicated Internal Scroll Area for Location Cards */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[46vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredPresets.map((preset) => {
                    const isCurrent =
                      effectiveLocation &&
                      Math.abs(effectiveLocation.latitude - preset.latitude) < 0.05 &&
                      Math.abs(effectiveLocation.longitude - preset.longitude) < 0.05;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => !loading && handleSelectPreset(preset)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between select-none ${
                          isCurrent
                            ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/40 shadow-md shadow-cyan-950/50'
                            : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80'
                        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-100 text-xs flex items-center gap-1.5">
                              <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                              {preset.name}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-300 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700/60">
                              {preset.state}
                            </span>
                          </div>
                          <p className="text-[11px] text-cyan-300 font-medium">
                            {preset.district} District
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {preset.climate}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-slate-400 font-medium">
                            {preset.latitude}° N, {preset.longitude}° E
                          </span>
                          
                          {isCurrent ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> CURRENT LOCATION
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectPreset(preset);
                              }}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Select Location <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Custom Form Tab */
            <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs font-mono overflow-y-auto max-h-[46vh] pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1">Village / Town Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pokhran, Baramati"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaisalmer, Pune"
                    value={customForm.district}
                    onChange={(e) => setCustomForm({ ...customForm, district: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">State in India *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan, Maharashtra"
                    value={customForm.state}
                    onChange={(e) => setCustomForm({ ...customForm, state: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Latitude (°N) * (6.0 to 38.0)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="e.g. 26.92"
                    value={customForm.latitude}
                    onChange={(e) => setCustomForm({ ...customForm, latitude: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Longitude (°E) * (68.0 to 98.0)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    placeholder="e.g. 71.91"
                    value={customForm.longitude}
                    onChange={(e) => setCustomForm({ ...customForm, longitude: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-sans text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-sans text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-900/30"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Set Microgrid Location
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Footer Info */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            Open-Meteo & NASA POWER Weather Routing
          </span>
          <span>India Bounds: 6°–38°N, 68°–98°E</span>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorModal;
