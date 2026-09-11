import React from 'react';
import { Sun, Wind, BatteryCharging, Flame, Home, Zap } from 'lucide-react';
import { formatPower } from '../../utils/formatters';

export const EnergyFlow = ({ metrics }) => {
  const solarKw = metrics?.solarGenKw ?? 26.4;
  const windKw = metrics?.windGenKw ?? 15.3;
  const batteryKw = metrics?.batteryPowerKw ?? 6.5; // >0 discharging, <0 charging
  const dieselKw = metrics?.dieselPowerKw ?? 0.0;
  const demandKw = metrics?.currentDemandKw ?? 48.2;

  const isBatteryDischarging = batteryKw > 0;
  const isBatteryCharging = batteryKw < 0;

  return (
    <div className="bg-[#131B29] border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-base">Live Microgrid Energy Flow</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Solar
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Wind
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Battery
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Diesel
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative overflow-x-auto py-2">
        <div className="min-w-[680px]">
          <svg className="w-full h-72" viewBox="0 0 800 320" fill="none">
            {/* Background bus glow */}
            <rect x="370" y="40" width="60" height="240" rx="10" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            <text x="400" y="165" textAnchor="middle" fill="#0EA5E9" fontSize="12" fontWeight="bold" fontFamily="monospace">
              BUS
            </text>
            <text x="400" y="180" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
              400V AC
            </text>

            {/* Connecting Flow Lines - Solar */}
            <path d="M 180 60 L 370 100" stroke="#334155" strokeWidth="3" />
            {solarKw > 0 && (
              <path d="M 180 60 L 370 100" stroke="#F59E0B" strokeWidth="3" className="animate-energy-flow" />
            )}

            {/* Connecting Flow Lines - Wind */}
            <path d="M 180 130 L 370 130" stroke="#334155" strokeWidth="3" />
            {windKw > 0 && (
              <path d="M 180 130 L 370 130" stroke="#06B6D4" strokeWidth="3" className="animate-energy-flow" />
            )}

            {/* Connecting Flow Lines - Battery */}
            <path d="M 180 200 L 370 190" stroke="#334155" strokeWidth="3" />
            {isBatteryDischarging && (
              <path d="M 180 200 L 370 190" stroke="#10B981" strokeWidth="3" className="animate-energy-flow" />
            )}
            {isBatteryCharging && (
              <path d="M 370 190 L 180 200" stroke="#10B981" strokeWidth="3" className="animate-energy-flow-reverse" />
            )}

            {/* Connecting Flow Lines - Diesel */}
            <path d="M 180 270 L 370 240" stroke="#334155" strokeWidth="3" />
            {dieselKw > 0 && (
              <path d="M 180 270 L 370 240" stroke="#EF4444" strokeWidth="3" className="animate-energy-flow" />
            )}

            {/* Connecting Flow Lines - Bus to Village Load */}
            <path d="M 430 160 L 620 160" stroke="#334155" strokeWidth="4" />
            <path d="M 430 160 L 620 160" stroke="#0EA5E9" strokeWidth="4" className="animate-energy-flow" />

            {/* SOURCE NODE: SOLAR */}
            <g transform="translate(40, 30)">
              <rect width="140" height="50" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="50" y="24" fill="#F8FAFC" fontSize="12" fontWeight="600">Solar Array</text>
              <text x="50" y="40" fill="#F59E0B" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {formatPower(solarKw)}
              </text>
            </g>

            {/* SOURCE NODE: WIND */}
            <g transform="translate(40, 105)">
              <rect width="140" height="50" rx="8" fill="#1E293B" stroke="#06B6D4" strokeWidth="1.5" />
              <text x="50" y="24" fill="#F8FAFC" fontSize="12" fontWeight="600">Wind Turbine</text>
              <text x="50" y="40" fill="#06B6D4" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {formatPower(windKw)}
              </text>
            </g>

            {/* SOURCE NODE: BATTERY */}
            <g transform="translate(40, 180)">
              <rect width="140" height="50" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <text x="50" y="24" fill="#F8FAFC" fontSize="12" fontWeight="600">BESS Battery</text>
              <text x="50" y="40" fill="#10B981" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {isBatteryCharging ? `-${formatPower(Math.abs(batteryKw))}` : `+${formatPower(batteryKw)}`}
              </text>
            </g>

            {/* SOURCE NODE: DIESEL */}
            <g transform="translate(40, 250)">
              <rect width="140" height="50" rx="8" fill="#1E293B" stroke={dieselKw > 0 ? '#EF4444' : '#475569'} strokeWidth="1.5" />
              <text x="50" y="24" fill="#F8FAFC" fontSize="12" fontWeight="600">Genset Diesel</text>
              <text x="50" y="40" fill={dieselKw > 0 ? '#EF4444' : '#94A3B8'} fontSize="12" fontWeight="bold" fontFamily="monospace">
                {formatPower(dieselKw)}
              </text>
            </g>

            {/* DESTINATION NODE: VILLAGE LOADS */}
            <g transform="translate(620, 130)">
              <rect width="140" height="65" rx="8" fill="#1E293B" stroke="#0EA5E9" strokeWidth="2" />
              <text x="45" y="25" fill="#F8FAFC" fontSize="13" fontWeight="bold">Village Loads</text>
              <text x="45" y="42" fill="#0EA5E9" fontSize="13" fontWeight="bold" fontFamily="monospace">
                {formatPower(demandKw)}
              </text>
              <text x="45" y="56" fill="#94A3B8" fontSize="10" fontStyle="italic">P0/P1/P2 Active</text>
            </g>
          </svg>

          {/* HTML Overlay Icons on Top of SVG Nodes for crisp rendering */}
          <div className="absolute top-[38px] left-[52px] text-amber-400">
            <Sun className="w-6 h-6" />
          </div>
          <div className="absolute top-[113px] left-[52px] text-cyan-400">
            <Wind className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="absolute top-[188px] left-[52px] text-emerald-400">
            <BatteryCharging className="w-6 h-6" />
          </div>
          <div className="absolute top-[258px] left-[52px] text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
          <div className="absolute top-[140px] left-[630px] text-cyan-400">
            <Home className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
