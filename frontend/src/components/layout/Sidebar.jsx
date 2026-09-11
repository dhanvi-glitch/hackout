import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  TrendingUp,
  BatteryCharging,
  Sliders,
  Fuel,
  BrainCircuit,
  Settings,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Command Center', path: '/', icon: LayoutDashboard },
  { name: 'Energy Optimizer', path: '/optimizer', icon: Zap },
  { name: '24-Hour Forecast', path: '/forecast', icon: TrendingUp },
  { name: 'Battery', path: '/battery', icon: BatteryCharging },
  { name: 'Load Management', path: '/loads', icon: Sliders },
  { name: 'Fuel Intelligence', path: '/fuel', icon: Fuel },
  { name: 'What-If Simulator', path: '/simulator', icon: BrainCircuit },
  { name: 'System / Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#131B29] border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
      <div>
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-900/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-wide flex items-center gap-1.5">
              OptiGrid<span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 bg-cyan-950/60 rounded border border-cyan-500/30">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Microgrid Control</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info badge */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> P0 Priority Protected
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Off-Grid Community Grid #04</p>
        </div>
      </div>
    </aside>
  );
};
