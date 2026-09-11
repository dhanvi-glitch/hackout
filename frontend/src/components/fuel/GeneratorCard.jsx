import React from 'react';
import { Flame, Clock, Zap, Gauge, Wrench } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const GeneratorCard = ({ generator }) => {
  const g = generator || {
    status: "STANDBY",
    name: "Caterpillar DE50 50kVA Generator",
    currentOutputKw: 0.0,
    maxCapacityKw: 45.0,
    runtimeTodayHours: 1.5,
    fuelConsumedTodayLiters: 12.4,
    lastMaintenanceDate: "2026-08-15",
  };

  const isRunning = g.status === 'RUNNING';

  return (
    <Card title="Generator Status & Operational Metrics" icon={Flame}>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">{g.name}</h4>
            <p className="text-[10px] text-slate-500 font-mono">50 kVA / 45 kW Standby Unit</p>
          </div>
          <Badge variant={isRunning ? 'danger' : 'default'}>
            {g.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Current Output</span>
            <span className={`font-bold text-sm ${isRunning ? 'text-rose-400' : 'text-slate-500'}`}>
              {g.currentOutputKw.toFixed(1)} kW / {g.maxCapacityKw} kW
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Runtime Today</span>
            <span className="font-bold text-sm text-slate-200">{g.runtimeTodayHours} hours</span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Fuel Consumed Today</span>
            <span className="font-bold text-sm text-cyan-400">{g.fuelConsumedTodayLiters} L</span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Last Serviced</span>
            <span className="font-bold text-sm text-slate-200">{g.lastMaintenanceDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
