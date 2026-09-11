import React from 'react';
import { Sliders, ShieldCheck, DollarSign, Leaf, Gauge } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CurrentDispatchPanel = ({ dispatch }) => {
  const data = dispatch || {
    solarKw: 30.0,
    windKw: 15.0,
    batteryKw: 5.0,
    dieselKw: 0.0,
    totalSupplyKw: 50.0,
    demandKw: 50.0,
    status: "OPTIMAL",
    costPerHour: 4.25,
    dieselSavedLitersDay: 85,
    co2AvoidedKgDay: 142.8,
    batteryImpact: "Normal Discharge (-5.0 kW)",
    reliability: "100% P0 Protected",
  };

  return (
    <div className="bg-[#131B29] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-base">Current Optimal Dispatch</h3>
          </div>
          <Badge variant="success">{data.status}</Badge>
        </div>

        {/* Dispatch breakdown table */}
        <div className="space-y-2.5 font-mono text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Solar Generation
            </span>
            <span className="font-bold text-amber-400">{data.solarKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Wind Generation
            </span>
            <span className="font-bold text-cyan-400">{data.windKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Battery Discharge
            </span>
            <span className="font-bold text-emerald-400">{data.batteryKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Diesel Output
            </span>
            <span className={`font-bold ${data.dieselKw > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {data.dieselKw.toFixed(1)} kW
            </span>
          </div>
        </div>

        {/* Total Supply vs Demand summary line */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div>
            Total Supply: <span className="text-cyan-400 font-bold">{data.totalSupplyKw.toFixed(1)} kW</span>
          </div>
          <div>
            Village Demand: <span className="text-slate-200 font-bold">{data.demandKw.toFixed(1)} kW</span>
          </div>
        </div>
      </div>

      {/* Impact Indicators */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Operating Cost</span>
            <span className="font-mono font-semibold text-slate-200">${data.costPerHour}/hr</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">CO2 Avoided</span>
            <span className="font-mono font-semibold text-slate-200">{data.co2AvoidedKgDay} kg/day</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Diesel Saved</span>
            <span className="font-mono font-semibold text-slate-200">{data.dieselSavedLitersDay} L/day</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Grid Reliability</span>
            <span className="font-mono font-semibold text-emerald-400">{data.reliability}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
