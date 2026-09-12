import React from 'react';
import { Fuel, Calendar, Clock, AlertTriangle, Droplet } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const FuelGauge = ({ fuel }) => {
  const f = fuel || {
    tankCapacityLiters: 500,
    fuelRemainingLiters: 360,
    tankLevelPercent: 72,
    currentBurnRateLitersPerDay: 18,
    daysRemaining: 20,
    estimatedDepletionDate: "2026-10-02",
    status: "NORMAL",
  };

  return (
    <Card title="Diesel Tank Logistics & Autonomy" icon={Fuel}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tank Level Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="w-full max-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>Diesel Tank Level</span>
              <span className="font-bold text-cyan-400">{f.tankLevelPercent}%</span>
            </div>
            
            {/* Visual Tank Bar */}
            <div className="w-full h-16 bg-slate-950 rounded-xl border border-slate-800 p-1 relative overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-lg transition-all duration-700 flex items-center justify-center text-white font-mono font-bold text-xs shadow-inner"
                style={{ height: `${f.tankLevelPercent}%` }}
              >
                {f.fuelRemainingLiters} L / {f.tankCapacityLiters} L
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Badge variant={f.status === 'NORMAL' ? 'success' : f.status === 'WARNING' ? 'warning' : 'danger'}>
              STATUS: {f.status}
            </Badge>
          </div>
        </div>

        {/* Tank Logistics Stats */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Fuel Remaining</span>
            <span className="text-xl font-bold font-mono text-slate-100">{f.fuelRemainingLiters} L</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Avg Burn Rate</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{f.currentBurnRateLitersPerDay} L/day</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Autonomy Remaining</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{f.daysRemaining} Days</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg col-span-2 sm:col-span-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Estimated Tank Depletion Date</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{f.estimatedDepletionDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
