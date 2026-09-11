import React from 'react';
import { Card } from '../common/Card';
import { ArrowRight, Sun, Wind, Battery, Flame, Zap } from 'lucide-react';
import { formatPower } from '../../utils/formatters';

export const BeforeAfterComparison = ({ before, after }) => {
  if (!before || !after) return null;

  return (
    <Card title="Power Balance Impact (Before vs. After Crisis)" icon={Zap}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE State */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-emerald-400 text-sm">NORMAL STATE (BEFORE)</span>
            <span className="text-[10px] text-slate-500">Baseline</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-amber-400">
              <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" /> Solar</span>
              <span className="font-bold">{formatPower(before.solar)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-cyan-400">
              <span className="flex items-center gap-2"><Wind className="w-3.5 h-3.5" /> Wind</span>
              <span className="font-bold">{formatPower(before.wind)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-emerald-400">
              <span className="flex items-center gap-2"><Battery className="w-3.5 h-3.5" /> Battery</span>
              <span className="font-bold">{formatPower(before.battery)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-slate-400">
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5" /> Diesel</span>
              <span className="font-bold">{formatPower(before.diesel)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/80 text-slate-100 font-bold border border-slate-800">
              <span>Village Demand</span>
              <span>{formatPower(before.demand)}</span>
            </div>
          </div>
        </div>

        {/* AFTER Crisis State */}
        <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-900/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
            <span className="font-bold text-rose-400 text-sm">SIMULATED CRISIS STATE (AFTER)</span>
            <span className="text-[10px] text-rose-300">Under Stress</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-amber-400">
              <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" /> Solar</span>
              <span className={`font-bold ${after.solar < before.solar ? 'text-rose-400' : 'text-amber-400'}`}>
                {formatPower(after.solar)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-cyan-400">
              <span className="flex items-center gap-2"><Wind className="w-3.5 h-3.5" /> Wind</span>
              <span className={`font-bold ${after.wind < before.wind ? 'text-rose-400' : 'text-cyan-400'}`}>
                {formatPower(after.wind)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-emerald-400">
              <span className="flex items-center gap-2"><Battery className="w-3.5 h-3.5" /> Battery</span>
              <span className="font-bold">{formatPower(after.battery)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 text-rose-400">
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5" /> Diesel</span>
              <span className="font-bold">{formatPower(after.diesel)}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/80 text-slate-100 font-bold border border-rose-900/40">
              <span>Village Demand</span>
              <span>{formatPower(after.demand)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
