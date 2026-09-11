import React from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const StormModeBanner = ({ isStormModeActive, onToggleStormMode }) => {
  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-300 ${
        isStormModeActive
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          : 'bg-[#131B29] border-slate-800 text-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {isStormModeActive ? (
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <Shield className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-100">
                {isStormModeActive ? 'STORM RESERVE MODE ACTIVE' : 'NORMAL RESERVE MODE'}
              </h3>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  isStormModeActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {isStormModeActive ? 'HIGH PROTECTION' : 'OPTIMAL ECONOMY'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {isStormModeActive
                ? 'Minimum reserve threshold increased from 20% to 50%. Optimization algorithm will prevent battery discharge below 50% to prepare for predicted severe storm.'
                : 'Standard operational limits active. Battery allowed to discharge down to 20% to maximize renewable energy utilization.'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            variant={isStormModeActive ? 'primary' : 'outline'}
            onClick={onToggleStormMode}
            className={isStormModeActive ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500' : ''}
          >
            {isStormModeActive ? 'Deactivate Storm Mode' : 'Activate Storm Reserve Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
};
