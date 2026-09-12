import React from 'react';
import { Sliders, ShieldCheck, DollarSign, Leaf, Gauge } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CurrentDispatchPanel = ({ dispatch }) => {
  const d = dispatch || {};
  const solarKw = Number(d.solarKw ?? d.solar_kw ?? 30.0);
  const windKw = Number(d.windKw ?? d.wind_kw ?? 15.0);
  const batteryKw = Number(d.batteryKw ?? d.battery_kw ?? 5.0);
  const dieselKw = Number(d.dieselKw ?? d.diesel_kw ?? 0.0);
  const calculatedTotal = solarKw + windKw + batteryKw + dieselKw;
  const totalSupplyKw = Number(d.totalSupplyKw ?? d.total_supply_kw ?? calculatedTotal);
  const demandKw = Number(d.demandKw ?? d.demand_kw ?? totalSupplyKw);
  const status = (d.status || (demandKw <= totalSupplyKw ? 'OPTIMAL' : 'SUBOPTIMAL')).toUpperCase();
  const costPerHour = d.costPerHour ?? d.cost_per_hour ?? (dieselKw > 0 ? (dieselKw * 0.28 * 1.45 + batteryKw * 0.05).toFixed(2) : '4.25');
  const dieselSavedLitersDay = d.dieselSavedLitersDay ?? d.diesel_saved_liters_day ?? 85;
  const co2AvoidedKgDay = d.co2AvoidedKgDay ?? d.co2_avoided_kg_day ?? 142.8;
  const batteryImpact = d.batteryImpact || (batteryKw > 0 ? `Normal Discharge (-${batteryKw.toFixed(1)} kW)` : batteryKw < 0 ? `Charging (+${Math.abs(batteryKw).toFixed(1)} kW)` : 'Standby / Float (0.0 kW)');
  const reliability = d.reliability || (d.reliability_pct ? `${d.reliability_pct}% P0 Protected` : '100% P0 Protected');

  return (
    <div className="bg-[#131B29] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-base">Current Optimal Dispatch</h3>
          </div>
          <Badge variant="success">{status}</Badge>
        </div>

        {/* Dispatch breakdown table */}
        <div className="space-y-2.5 font-mono text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Solar Generation
            </span>
            <span className="font-bold text-amber-400">{solarKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Wind Generation
            </span>
            <span className="font-bold text-cyan-400">{windKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Battery Discharge
            </span>
            <span className="font-bold text-emerald-400">{batteryKw.toFixed(1)} kW</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Diesel Output
            </span>
            <span className={`font-bold ${dieselKw > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {dieselKw.toFixed(1)} kW
            </span>
          </div>
        </div>

        {/* Total Supply vs Demand summary line */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div>
            Total Supply: <span className="text-cyan-400 font-bold">{totalSupplyKw.toFixed(1)} kW</span>
          </div>
          <div>
            Village Demand: <span className="text-slate-200 font-bold">{demandKw.toFixed(1)} kW</span>
          </div>
        </div>
      </div>

      {/* Impact Indicators */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Operating Cost</span>
            <span className="font-mono font-semibold text-slate-200">${costPerHour}/hr</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">CO2 Avoided</span>
            <span className="font-mono font-semibold text-slate-200">{co2AvoidedKgDay} kg/day</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Diesel Saved</span>
            <span className="font-mono font-semibold text-slate-200">{dieselSavedLitersDay} L/day</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 block">Grid Reliability</span>
            <span className="font-mono font-semibold text-emerald-400">{reliability}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
