import React from 'react';
import { ShieldCheck, ArrowRightLeft, Scissors, Fuel, Leaf, DollarSign } from 'lucide-react';
import { formatPercent, formatFuel, formatCO2, formatCurrency } from '../../utils/formatters';

export const ImpactMetrics = ({ impact }) => {
  if (!impact) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
      {/* P0 Reliability */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">P0 Life Reliability</span>
        <span className={`text-xl font-bold ${impact.p0ReliabilityPercent < 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
          {formatPercent(impact.p0ReliabilityPercent)}
        </span>
      </div>

      {/* P1 Served */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <ArrowRightLeft className="w-5 h-5 text-amber-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">P1 Shiftable Served</span>
        <span className="text-xl font-bold text-amber-400">{formatPercent(impact.p1ServedPercent)}</span>
      </div>

      {/* P2 Served */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <Scissors className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">P2 Deferrable Served</span>
        <span className="text-xl font-bold text-cyan-400">{formatPercent(impact.p2ServedPercent)}</span>
      </div>

      {/* Additional Diesel */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <Fuel className="w-5 h-5 text-rose-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">Extra Diesel Used</span>
        <span className="text-xl font-bold text-rose-400">+{formatFuel(impact.additionalDieselLiters)}</span>
      </div>

      {/* Additional CO2 */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <Leaf className="w-5 h-5 text-slate-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">Extra CO2 Emitted</span>
        <span className="text-xl font-bold text-slate-200">+{formatCO2(impact.additionalCo2Kg)}</span>
      </div>

      {/* Cost Difference */}
      <div className="p-4 bg-[#131B29] border border-slate-800 rounded-xl text-center">
        <DollarSign className="w-5 h-5 text-amber-400 mx-auto mb-1" />
        <span className="text-[10px] text-slate-400 block mb-1">Cost Impact</span>
        <span className="text-xl font-bold text-amber-400">+${impact.costDifferenceDollars}</span>
      </div>
    </div>
  );
};
