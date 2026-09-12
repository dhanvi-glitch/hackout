import React, { useState } from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { KPICard } from '../components/dashboard/KPICard';
import { EnergyFlow } from '../components/dashboard/EnergyFlow';
import { CurrentDispatchPanel } from '../components/dashboard/CurrentDispatchPanel';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import {
  Zap,
  Sun,
  BatteryCharging,
  Flame,
  PieChart,
  Leaf,
  Fuel,
  ShieldCheck,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import {
  formatPower,
  formatPercent,
  formatFuel,
  formatCO2,
} from '../utils/formatters';
import { DEMO_LOCATION } from '../utils/constants';
import { LocationSelectorModal } from '../components/common/LocationSelectorModal';

export const Dashboard = () => {
  const { status, activeLocation, loading, error, refetch } = useSystemStatus();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  if (loading && !status) {
    return <LoadingSpinner label="Connecting to OptiGrid Microgrid Telemetry..." />;
  }

  if (error && !status) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const m = status?.metrics || {};
  const activeLoc = activeLocation || status?.location || DEMO_LOCATION;
  const locName = activeLoc.name || DEMO_LOCATION.name;
  const shortName = activeLoc.shortName || DEMO_LOCATION.shortName;
  const commName = activeLoc.community || DEMO_LOCATION.community;
  const lat = activeLoc.latitude ?? DEMO_LOCATION.latitude;
  const lon = activeLoc.longitude ?? DEMO_LOCATION.longitude;
  const weatherSource = status?.weather?.weatherSource || DEMO_LOCATION.weatherSource;
  const dataMode = (status?.weather?.dataMode || 'LIVE').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Command Center</h2>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm group"
              title="Click to select another rural location in India"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{shortName}</span>
              <ChevronDown className="w-3 h-3 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {commName} — {locName} ({lat}°N, {lon}°E)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            Weather Source: <span className="text-cyan-400 font-bold">{weatherSource}</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
              {dataMode}
            </span>
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            Historical: <span className="text-amber-400 font-bold">{DEMO_LOCATION.historicalSource}</span>
          </span>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Current Demand */}
        <KPICard
          title="Current Demand"
          value={formatPower(m.currentDemandKw || 48.2)}
          subtitle={`${shortName || 'Community'} Peak Demand`}
          icon={Zap}
          color="cyan"
        />

        {/* 2. Renewable Generation */}
        <KPICard
          title="Renewable Generation"
          value={formatPower(m.renewableGenKw || 41.7)}
          subtitle={`Solar: ${m.solarGenKw || 26.4}kW | Wind: ${m.windGenKw || 15.3}kW`}
          icon={Sun}
          color="amber"
        />

        {/* 3. Battery SOC */}
        <KPICard
          title="Battery SOC"
          value={formatPercent(m.batterySocPercent || 68)}
          subtitle={`Health: ${m.batteryHealthPercent || 91}%`}
          icon={BatteryCharging}
          color="emerald"
          badgeText="Healthy"
        />

        {/* 4. Diesel Status */}
        <KPICard
          title="Diesel Generator"
          value={m.dieselStatus || 'OFF'}
          subtitle={m.dieselPowerKw > 0 ? formatPower(m.dieselPowerKw) : 'Standby / 0 kW'}
          icon={Flame}
          color={m.dieselPowerKw > 0 ? 'rose' : 'slate'}
          badgeText={m.dieselPowerKw > 0 ? 'RUNNING' : 'STANDBY'}
        />

        {/* 5. Renewable Percentage */}
        <KPICard
          title="Renewable Share"
          value={formatPercent(m.renewablePercent || 86.5)}
          subtitle="Target: >80%"
          icon={PieChart}
          color="cyan"
        />

        {/* 6. CO2 Avoided */}
        <KPICard
          title="CO2 Avoided"
          value={formatCO2(m.co2AvoidedKgDay || 142.8)}
          subtitle="Daily Offset"
          icon={Leaf}
          color="emerald"
        />

        {/* 7. Fuel Remaining */}
        <KPICard
          title="Fuel Remaining"
          value={formatFuel(m.fuelRemainingLiters || 360)}
          subtitle={`${m.fuelDaysRemaining || 20} Days Autonomy`}
          icon={Fuel}
          color="blue"
        />

        {/* 8. Critical Load Reliability */}
        <KPICard
          title="Critical Reliability"
          value={formatPercent(m.criticalLoadReliabilityPercent || 100)}
          subtitle={`${shortName} Health Centre Protected`}
          icon={ShieldCheck}
          color="emerald"
          badgeText="P0 Protected"
        />
      </div>

      {/* Main Grid: Live Energy Flow (2 cols) & Current Dispatch Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyFlow metrics={m} />
        </div>
        <div className="lg:col-span-1">
          <CurrentDispatchPanel dispatch={status?.liveDispatch} />
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={activeLoc}
        onLocationChanged={() => refetch()}
      />
    </div>
  );
};
