import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Settings as SettingsIcon, Server, Wifi, RefreshCw, Database } from 'lucide-react';
import { wsClient } from '../services/websocket';

export const Settings = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api');
  const [wsUrl, setWsUrl] = useState(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws');
  const [isSaved, setIsSaved] = useState(false);

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
          System & API Settings
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Configure backend API integration contracts and WebSocket telemetry parameters
        </p>
      </div>

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
