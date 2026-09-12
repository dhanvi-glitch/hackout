import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Settings as SettingsIcon, Server, Wifi, RefreshCw, Database, MapPin, Globe, SunMedium, Edit3 } from 'lucide-react';
import { wsClient } from '../services/websocket';
import { DEMO_LOCATION } from '../utils/constants';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { LocationSelectorModal } from '../components/common/LocationSelectorModal';

export const Settings = () => {
  const { status, activeLocation, refetch } = useSystemStatus();
  const [apiBaseUrl, setApiBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api');
  const [wsUrl, setWsUrl] = useState(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws');
  const [isSaved, setIsSaved] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const activeLoc = activeLocation || status?.location || DEMO_LOCATION;

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReconnectWs = () => {
    wsClient.connect();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
          System & Location Settings
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Demonstration location identity, weather telemetry sources, and backend API integration
        </p>
      </div>

      {/* Active Demonstration Location Card */}
      <Card title="Active Demonstration Location & Microgrid Identity" icon={MapPin}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Official Location</span>
              <span className="text-slate-100 font-semibold text-sm block">{activeLoc.name}</span>
              <span className="text-cyan-400 text-[11px] block">{activeLoc.community || `${activeLoc.shortName} Microgrid`}</span>
            </div>

            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">GPS Coordinates</span>
              <span className="text-slate-100 font-semibold text-sm block">
                {activeLoc.latitude}° N, {activeLoc.longitude}° E
              </span>
              <span className="text-slate-400 text-[11px] block">{activeLoc.district} District, {activeLoc.state}</span>
            </div>

            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Telemetry & Weather APIs</span>
              <div className="flex items-center gap-2 text-slate-200">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>Open-Meteo ({status?.weather?.dataMode || 'LIVE'})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>NASA POWER (Historical)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-4 py-2 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-950/40"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Change Active Rural Location
            </button>
          </div>
        </div>
      </Card>

      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={activeLoc}
        onLocationChanged={() => refetch()}
      />

      <Card title="REST API & WebSocket Contract Configuration" icon={Server}>
        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Backend REST Base URL (VITE_API_BASE_URL)
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-400 font-mono focus:border-cyan-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">Expected REST endpoint provided by Member 2.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              WebSocket Telemetry Stream URL (VITE_WS_URL)
            </label>
            <input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-400 font-mono focus:border-cyan-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">Real-time WebSocket event broadcaster endpoint.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" type="submit">
              Save Settings
            </Button>
            <Button variant="outline" icon={RefreshCw} onClick={handleReconnectWs}>
              Test & Reconnect WebSocket
            </Button>
            {isSaved && <span className="text-xs font-mono text-emerald-400">Settings Saved!</span>}
          </div>
        </form>
      </Card>

      {/* System Information & API Endpoints Table for Member 2 */}
      <Card title="Member 2 Backend Integration Contract Reference" icon={Database}>
        <div className="overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Method</th>
                <th className="py-2 px-3">Endpoint</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-2 px-3 text-cyan-400">/api/system/status</td>
                <td className="py-2 px-3">Microgrid bus power balance & metrics</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-2 px-3 text-cyan-400">/api/forecast</td>
                <td className="py-2 px-3">24-hour (96 intervals) forecast curve</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-2 px-3 text-cyan-400">/api/battery</td>
                <td className="py-2 px-3">BESS capacity, SOC history & health</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-2 px-3 text-cyan-400">/api/fuel</td>
                <td className="py-2 px-3">Diesel tank, burn rates & generator stats</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-2 px-3 text-cyan-400">/api/loads</td>
                <td className="py-2 px-3">P0/P1/P2 load classification status</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">POST</td>
                <td className="py-2 px-3 text-cyan-400">/api/optimize</td>
                <td className="py-2 px-3">Run MILP optimization algorithm</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">POST</td>
                <td className="py-2 px-3 text-cyan-400">/api/simulation/run</td>
                <td className="py-2 px-3">Run What-If crisis simulation</td>
                <td className="py-2 px-3 text-slate-400">Ready / Fallback active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
