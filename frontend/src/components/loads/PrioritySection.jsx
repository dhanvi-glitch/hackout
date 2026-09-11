import React from 'react';
import { ShieldCheck, ArrowRightLeft, Scissors, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const PrioritySection = ({ priorityData }) => {
  const p0 = priorityData?.priorities?.find((p) => p.id === 'p0');
  const p1 = priorityData?.priorities?.find((p) => p.id === 'p1');
  const p2 = priorityData?.priorities?.find((p) => p.id === 'p2');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* P0 - CRITICAL */}
      <Card className="border-rose-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-rose-400 text-sm">P0 — CRITICAL</h3>
              <p className="text-[10px] text-slate-400 font-mono">NON-NEGOTIABLE</p>
            </div>
          </div>
          <Badge variant="danger">PROTECTED (100%)</Badge>
        </div>

        <div className="my-4">
          <div className="flex items-baseline justify-between text-xs text-slate-400 mb-1">
            <span>Served Capacity</span>
            <span className="font-mono text-emerald-400 font-bold">100%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-rose-500 rounded-full w-full"></div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {p0?.items.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{item.name}</p>
                <span className="text-[10px] text-slate-500 font-mono">{item.kw} kW</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PROTECTED
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* P1 - SHIFTABLE */}
      <Card className="border-amber-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-amber-400 text-sm">P1 — SHIFTABLE</h3>
              <p className="text-[10px] text-slate-400 font-mono">FLEXIBLE TIMING</p>
            </div>
          </div>
          <Badge variant="warning">SHIFTABLE (92%)</Badge>
        </div>

        <div className="my-4">
          <div className="flex items-baseline justify-between text-xs text-slate-400 mb-1">
            <span>Served Capacity</span>
            <span className="font-mono text-amber-400 font-bold">92%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-amber-500 rounded-full w-[92%]"></div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {p1?.items.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{item.name}</p>
                <span className="text-[10px] text-slate-500 font-mono">{item.kw} kW</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* P2 - DEFERRABLE */}
      <Card className="border-blue-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-blue-400 text-sm">P2 — DEFERRABLE</h3>
              <p className="text-[10px] text-slate-400 font-mono">FIRST TO CURTAIL</p>
            </div>
          </div>
          <Badge variant="info">CURTAILABLE (61%)</Badge>
        </div>

        <div className="my-4">
          <div className="flex items-baseline justify-between text-xs text-slate-400 mb-1">
            <span>Served Capacity</span>
            <span className="font-mono text-blue-400 font-bold">61%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-blue-500 rounded-full w-[61%]"></div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {p2?.items.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{item.name}</p>
                <span className="text-[10px] text-slate-500 font-mono">{item.kw} kW</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
