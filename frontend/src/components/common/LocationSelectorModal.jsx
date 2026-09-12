import React, { useState } from 'react';
import {
  MapPin,
  Check,
  X,
  Compass,
  Building2,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const LocationSelectorModal = () => {
  const {
    activeLocation,
    presets,
    updateLocation,
    loading,
    loadingStage,
    isLocationModalOpen,
    setIsLocationModalOpen,
  } = useSystemStatus();

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    district: '',
    state: '',
    latitude: '',
    longitude: '',
    climate: 'Rural Indian Climate',
    community: 'Off-Grid Village Microgrid',
  });
  const [formError, setFormError] = useState(null);

  if (!isLocationModalOpen) return null;

  const handleSelectPreset = async (preset) => {
    if (loading || preset.id === activeLocation?.id) return;
    await updateLocation(preset);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const lat = parseFloat(customForm.latitude);
    const lon = parseFloat(customForm.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setFormError('Please enter valid numeric coordinates.');
      return;
    }

    if (lat < 6.0 || lat > 38.0) {
      setFormError('Latitude must be within India (6.0° N - 38.0° N).');
      return;
    }

    if (lon < 68.0 || lon > 98.0) {
      setFormError('Longitude must be within India (68.0° E - 98.0° E).');
      return;
    }

    const payload = {
      id: `custom_${Date.now()}`,
      name: customForm.name || 'Custom Indian Rural Grid',
      district: customForm.district || 'Rural District',
      state: customForm.state || 'India',
      country: 'India',
      latitude: lat,
      longitude: lon,
      climate: customForm.climate,
      community: customForm.community,
    };

    await updateLocation(payload);
    setShowCustomForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#131B29] border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <MapPin className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Select Indian Rural Microgrid Site
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-8">
              Simulate off-grid community microgrids across distinct Indian climatic zones
            </p>
          </div>
          <button
            type="button"
            onClick={() => !loading && setIsLocationModalOpen(false)}
            disabled={loading}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay / Stage Indicator */}
        {loading && (
          <div className="bg-cyan-950/40 border-b border-cyan-800/60 px-5 py-3 flex items-center gap-3 shrink-0 animate-pulse">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono font-medium text-cyan-300">
              {loadingStage || 'Updating microgrid telemetry...'}
            </span>
          </div>
        )}

        {/* Scrollable Content (max-h-[46vh] internal scroll) */}
        <div className="p-5 space-y-4 max-h-[46vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* Preset Locations */}
          <div className="space-y-3">
            {presets.map((loc) => {
              const isActive = loc.id === activeLocation?.id;
              return (
                <div
                  key={loc.id}
                  className={`p-4 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-100">{loc.name}</h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> CURRENT LOCATION
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {loc.district}, {loc.state}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                          {Number(loc.latitude).toFixed(2)}° N, {Number(loc.longitude).toFixed(2)}° E
                        </span>
                        <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                          {loc.climate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-600" />
                        {loc.community}
                      </p>
                    </div>

                    <div className="shrink-0 self-center">
                      {isActive ? (
                        <span className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectPreset(loc)}
                          disabled={loading}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-cyan-500 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        >
                          Select Location <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Coordinate Form Toggle */}
          <div className="pt-2">
            {!showCustomForm ? (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full py-2.5 border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Enter Custom Indian Coordinates
              </button>
            ) : (
              <form
                onSubmit={handleCustomSubmit}
                className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Custom Indian Site
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="p-2 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Site / Village Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Majuli Island"
                      value={customForm.name}
                      onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">District & State</label>
                    <input
                      type="text"
                      placeholder="e.g., Jorhat, Assam"
                      value={customForm.state}
                      onChange={(e) => setCustomForm({ ...customForm, state: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Latitude (°N, 6.0 - 38.0)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g., 26.95"
                      value={customForm.latitude}
                      onChange={(e) => setCustomForm({ ...customForm, latitude: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Longitude (°E, 68.0 - 98.0)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g., 94.20"
                      value={customForm.longitude}
                      onChange={(e) => setCustomForm({ ...customForm, longitude: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-40"
                >
                  Set Active Site & Cascade Data
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Bounding Box: India (6.0°-38.0° N, 68.0°-98.0° E)
          </span>
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(false)}
            disabled={loading}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorModal;
