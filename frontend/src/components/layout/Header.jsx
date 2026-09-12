import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Wind,
  Bell,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  MapPin,
} from 'lucide-react';
import { formatTime, formatCountdown } from '../../utils/formatters';
import { apiService } from '../../services/api';
import { useSystemStatus } from '../../hooks/useSystemStatus';
import { LocationSelectorModal } from '../common/LocationSelectorModal';

export const Header = ({ systemStatus: propStatus, onRefreshStatus }) => {
  const {
    status: contextStatus,
    activeLocation,
    weatherSource,
    setIsLocationModalOpen,
  } = useSystemStatus();

  const systemStatus = propStatus || contextStatus;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(systemStatus?.nextOptimizationInSeconds || 485);
  const [alerts, setAlerts] = useState([]);
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Optimization countdown ticker (re-optimizes approx every 15 mins)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch alerts
  useEffect(() => {
    apiService.getAlerts().then((data) => setAlerts(data || []));
  }, []);

  const handleRefreshWeather = async () => {
    setIsRefreshingWeather(true);
    await apiService.refreshWeather();
    if (onRefreshStatus) {
      await onRefreshStatus();
    }
    setTimeout(() => setIsRefreshingWeather(false), 600);
  };

  const isOnline = systemStatus?.isOnline ?? true;
  const weather = systemStatus?.weather || {
    condition: 'Partly Cloudy',
    temperatureC: 28.5,
    solarIrradianceWm2: 820,
    windSpeedMs: 7.2,
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="h-16 bg-[#131B29]/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: System Online/Offline Indicator & Quick Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-mono font-medium text-slate-200">
            {isOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
          </span>
        </div>

        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(currentTime)}</span>
        </div>

        {/* Active Location Selector Button */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          title="Click to switch rural microgrid location"
          className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-cyan-950/50 hover:to-cyan-900/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 text-xs transition-all cursor-pointer shadow-sm group"
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
          <div className="text-left leading-tight">
            <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
              {activeLocation?.name || 'Baramati Rural'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden xl:inline ml-1">
              ({activeLocation?.state || 'Maharashtra'})
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Switch
          </span>
        </button>
      </div>

      {/* Center/Right: Optimization Timers & Weather & Alerts */}
      <div className="flex items-center gap-4">
        {/* Optimization Timers */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 text-[11px] block">Last Run</span>
            <span className="font-mono text-slate-200 font-medium">
              {systemStatus?.lastOptimizationTime || '10:45:00'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 text-[11px] block">Next Re-Opt</span>
            <span className="font-mono text-cyan-400 font-semibold">
              {formatCountdown(countdown)}
            </span>
          </div>
        </div>

        {/* Weather Status */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="hidden sm:block">
            <span className="text-slate-200 font-medium">{weather.temperatureC}°C</span>
            <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
              {weather.solarIrradianceWm2} W/m²
            </span>
          </div>

          {/* Weather Source Badge */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              weatherSource === 'LIVE'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : weatherSource === 'CACHED'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                : 'bg-indigo-950/80 text-indigo-400 border border-indigo-500/30'
            }`}
          >
            {weatherSource}
          </span>

          <button
            onClick={handleRefreshWeather}
            title="Refresh weather data"
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWeather ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Alert Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPopover(!showAlertsPopover)}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Alerts Popover */}
          {showAlertsPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-[#131B29] border border-slate-800 rounded-xl shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" /> System Alerts
                </h4>
                <button
                  onClick={() => setShowAlertsPopover(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active alerts</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg text-xs"
                    >
                      <div className="flex items-start gap-2">
                        {alert.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                        {alert.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                        {alert.type === 'INFO' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-medium text-slate-200">{alert.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{alert.message}</p>
                          <span className="text-[10px] text-slate-500 font-mono block mt-1">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Rural Location Selector Modal */}
      <LocationSelectorModal />
    </header>
  );
};
