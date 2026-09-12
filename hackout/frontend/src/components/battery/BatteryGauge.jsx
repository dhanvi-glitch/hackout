import React from 'react';
import { Battery, Zap, Shield, RefreshCw, AlertCircle, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const BatteryGauge = ({ battery }) => {
  const b = battery || {
    capacityKwh: 100,
    currentSocPercent: 68,
    minSocPercent: 20,
    maxSocPercent: 95,
    stormReservePercent: 50,
    healthPercent: 91,
    cycleCount: 1247,
    todayThroughputKwh: 82.4,
    deepDischargeEvents: 0,
  };

  return (
    <Card title="BESS Battery Health & Specifications" icon={Battery}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SOC Visual Circular / Progress Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Battery outer ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 stroke-current"
                strokeDasharray={`${b.currentSocPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-3xl font-bold font-mono text-slate-100">{b.currentSocPercent}%</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Current SOC</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="battery">HEALTHY ({b.healthPercent}%)</Badge>
          </div>
        </div>

        {/* Core Specs Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Total Capacity</span>
            <span className="text-lg font-bold font-mono text-slate-100">{b.capacityKwh} kWh</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Minimum SOC</span>
            <span className="text-lg font-bold font-mono text-rose-400">{b.minSocPercent}%</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Maximum SOC</span>
            <span className="text-lg font-bold font-mono text-cyan-400">{b.maxSocPercent}%</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Storm Reserve Target</span>
            <span className="text-lg font-bold font-mono text-amber-400">{b.stormReservePercent}%</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Cycle Count</span>
            <span className="text-lg font-bold font-mono text-slate-100">{b.cycleCount}</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Today's Throughput</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{b.todayThroughputKwh} kWh</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg col-span-2 sm:col-span-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Deep Discharge Protection Status</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">0 Events (Protected)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
