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
  ChevronDown,
} from 'lucide-react';
import { formatTime, formatCountdown } from '../../utils/formatters';
import { apiService } from '../../services/api';
import { DEMO_LOCATION } from '../../utils/constants';
import { LocationSelectorModal } from '../common/LocationSelectorModal';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const Header = ({ systemStatus: propStatus }) => {
  const { status: contextStatus, activeLocation, refetch } = useSystemStatus();
  const systemStatus = propStatus || contextStatus;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(systemStatus?.nextOptimizationInSeconds || 485);
  const [alerts, setAlerts] = useState([]);
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

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
    setTimeout(() => setIsRefreshingWeather(false), 600);
  };

  const isOnline = systemStatus?.isOnline ?? true;
  const locationName = activeLocation?.name || systemStatus?.location?.name || DEMO_LOCATION.name;
  const lat = activeLocation?.latitude ?? systemStatus?.location?.latitude ?? DEMO_LOCATION.latitude;
  const lon = activeLocation?.longitude ?? systemStatus?.location?.longitude ?? DEMO_LOCATION.longitude;
  const shortLocName = activeLocation?.shortName || systemStatus?.location?.shortName || DEMO_LOCATION.shortName;

  const weather = systemStatus?.weather || {
    condition: 'Partly Cloudy',
    temperatureC: 28.5,
    solarIrradianceWm2: 820,
    windSpeedMs: 7.2,
    weatherSource: DEMO_LOCATION.weatherSource,
    dataMode: 'LIVE',
  };
  const weatherSource = weather.weatherSource || DEMO_LOCATION.weatherSource;
  const dataMode = (weather.dataMode || 'LIVE').toUpperCase();

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="h-16 bg-[#131B29]/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: System Online/Offline Indicator & Interactive Location Selector */}
      <div className="flex items-center gap-3">
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

        {/* Interactive Location Selector Button */}
        <button 
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/60 text-xs text-slate-200 transition-all cursor-pointer group shadow-sm"
          title={`Active Location: ${locationName} (${lat}°N, ${lon}°E) — Click to select another rural location in India`}
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="font-semibold text-slate-100 hidden sm:inline">{locationName}</span>
          <span className="font-semibold text-slate-100 sm:hidden">{shortLocName}</span>
          <ChevronDown className="w-3 h-3 text-cyan-400 group-hover:translate-y-0.5 transition-transform shrink-0 ml-0.5" />
          <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">({lat}°N, {lon}°E)</span>
        </button>

        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Center/Right: Optimization Timers & Weather & Alerts */}
      <div className="flex items-center gap-3">
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

          {/* Data Mode Pill */}
          <span 
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              dataMode === 'LIVE' 
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40' 
                : dataMode === 'CACHED'
                ? 'bg-amber-950/70 text-amber-400 border-amber-500/40'
                : 'bg-sky-950/70 text-sky-400 border-sky-500/40'
            }`}
            title={`Weather Source: ${weatherSource} (Dhordo, Kutch)`}
          >
            {dataMode}
          </span>

          <button
            onClick={handleRefreshWeather}
            title={`Refresh weather from ${weatherSource} for Dhordo`}
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
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={systemStatus?.location || { name: locationName, latitude: lat, longitude: lon }}
      />
    </header>
  );
};
