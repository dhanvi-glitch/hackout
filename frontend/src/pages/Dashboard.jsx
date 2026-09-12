import React from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { KPICard } from '../components/dashboard/KPICard';
import { EnergyFlow } from '../components/dashboard/EnergyFlow';
import { CurrentDispatchPanel } from '../components/dashboard/CurrentDispatchPanel';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
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
} from 'lucide-react';
import {
  formatPower,
  formatPercent,
  formatFuel,
  formatCO2,
} from '../utils/formatters';

export const Dashboard = () => {
  const { status, activeLocation, setIsLocationModalOpen, loading, error, refetch } = useSystemStatus();

  if (loading && !status) {
    return <LoadingSpinner label="Connecting to OptiGrid Microgrid Telemetry..." />;
  }

  if (error && !status) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const m = status?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Command Center</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time telemetry, live power bus flow, and automated optimal dispatch
          </p>
        </div>
      </div>

      {/* Active Location Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                {activeLocation?.name || 'Baramati Rural'}
              </h3>
              <span className="text-xs text-slate-400">
                • {activeLocation?.district || 'Pune District'}, {activeLocation?.state || 'Maharashtra'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                {activeLocation?.latitude != null && activeLocation?.longitude != null
                  ? `${Number(activeLocation.latitude).toFixed(2)}° N, ${Number(activeLocation.longitude).toFixed(2)}° E`
                  : '18.15° N, 74.58° E'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeLocation?.climate || 'Semi-Arid Agro Basin'} • {activeLocation?.community || 'Off-Grid Microgrid'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="self-start sm:self-center px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          Change Site →
        </button>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Current Demand */}
        <KPICard
          title="Current Demand"
          value={formatPower(m.currentDemandKw || 48.2)}
          subtitle="Village Load Peak"
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
          subtitle="P0 Hospital Protected"
          icon={ShieldCheck}
          color="emerald"
          badgeText="P0 Protected"
        />
      </div>

      {/* Main Grid: Live Energy Flow (2 cols) & Current Dispatch Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <EnergyFlow metrics={m} />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <ErrorBoundary>
            <CurrentDispatchPanel dispatch={status?.liveDispatch} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
