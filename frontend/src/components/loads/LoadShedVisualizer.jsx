import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Sliders, Shield, Scissors, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export const LoadShedVisualizer = () => {
  const [shortageKw, setShortageKw] = useState(12);

  // Shortage distribution calculation
  // P2 capacity is 24.2 kW
  // P1 capacity is 20.0 kW
  // P0 capacity is 15.0 kW
  const p2Curtailed = Math.min(shortageKw, 24.2);
  const p2Served = Math.max(0, 24.2 - p2Curtailed);

  const remAfterP2 = Math.max(0, shortageKw - 24.2);
  const p1Shifted = Math.min(remAfterP2, 20.0);
  const p1Served = Math.max(0, 20.0 - p1Shifted);

  const remAfterP1 = Math.max(0, remAfterP2 - 20.0);
  const p0Cut = Math.min(remAfterP1, 15.0);
  const p0Served = Math.max(0, 15.0 - p0Cut);

  return (
    <Card title="Interactive Load Shedding & Shortage Simulator" icon={Sliders}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">
              Simulate Grid Power Deficit (Shortage):
            </label>
            <span className="font-mono text-sm font-bold text-rose-400">-{shortageKw} kW Deficit</span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={shortageKw}
            onChange={(e) => setShortageKw(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Dynamic Load Shedding Logic Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Step 1: P2 Curtailment */}
          <div className={`p-4 rounded-xl border transition-all ${p2Curtailed > 0 ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">STEP 1: P2 CURTAIL</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Deferrable domestic & high power loads reduced first.</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Curtailed:</span>
                <span className="font-bold text-cyan-400">{p2Curtailed.toFixed(1)} kW</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Served:</span>
                <span className="font-bold">{p2Served.toFixed(1)} kW ({Math.round((p2Served/24.2)*100)}%)</span>
              </div>
            </div>
          </div>

          {/* Step 2: P1 Shift */}
          <div className={`p-4 rounded-xl border transition-all ${p1Shifted > 0 ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span className="font-bold">STEP 2: P1 SHIFT</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Agricultural & water pumps delayed to off-peak hours.</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Shifted:</span>
                <span className="font-bold text-amber-400">{p1Shifted.toFixed(1)} kW</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Served:</span>
                <span className="font-bold">{p1Served.toFixed(1)} kW ({Math.round((p1Served/20.0)*100)}%)</span>
              </div>
            </div>
          </div>

          {/* Step 3: P0 Protection */}
          <div className={`p-4 rounded-xl border transition-all ${p0Cut > 0 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">STEP 3: P0 PROTECT</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Hospital, vaccines & emergency tower shielded.</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>P0 Compromised:</span>
                <span className={`font-bold ${p0Cut > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{p0Cut.toFixed(1)} kW</span>
              </div>
              <div className="flex justify-between">
                <span>P0 Served:</span>
                <span className="font-bold text-emerald-400">{p0Served.toFixed(1)} kW ({Math.round((p0Served/15.0)*100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
