import React from 'react';
import { Sun, Wind, Battery, Flame, Zap, CheckCircle, ShieldCheck, DollarSign, Leaf, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatPower, formatPercent, formatCurrency, formatCO2 } from '../../utils/formatters';

export const DispatchResult = ({ result }) => {
  if (!result) return null;

  const { dispatch, metrics } = result;

  return (
    <div className="bg-[#131B29] border border-cyan-500/30 rounded-xl p-5 shadow-2xl space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-lg">Optimization Output & Optimal Dispatch</h3>
        </div>
        <Badge variant="success" size="md">MILP CONVERGED</Badge>
      </div>

      {/* Recommended Power Dispatch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Solar */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Solar Dispatch</span>
            <span className="text-xl font-bold font-mono text-amber-400">{formatPower(dispatch.solarKw)}</span>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Wind Dispatch</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{formatPower(dispatch.windKw)}</span>
          </div>
        </div>

        {/* Battery */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Battery className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Battery Dispatch</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{formatPower(dispatch.batteryKw)}</span>
          </div>
        </div>

        {/* Diesel */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Diesel Dispatch</span>
            <span className={`text-xl font-bold font-mono ${dispatch.dieselKw > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {formatPower(dispatch.dieselKw)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Total Supply</span>
          <span className="font-mono font-bold text-slate-100 text-sm">{formatPower(metrics.totalGenerationKw)}</span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Unmet Demand</span>
          <span className={`font-mono font-bold text-sm ${metrics.unmetDemandKw > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatPower(metrics.unmetDemandKw)}
          </span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Renewable %</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">{formatPercent(metrics.renewablePercent)}</span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Est. Hourly Cost</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(metrics.estimatedCostPerHour)}/h</span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Fuel Consumption</span>
          <span className="font-mono font-bold text-slate-200 text-sm">{metrics.fuelConsumptionLitersHour} L/h</span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">CO2 Emissions</span>
          <span className="font-mono font-bold text-slate-200 text-sm">{metrics.co2EmissionsKgHour} kg/h</span>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block mb-1">Grid Reliability</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{formatPercent(metrics.reliabilityPercent)}</span>
        </div>
      </div>
    </div>
  );
};
