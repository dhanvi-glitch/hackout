import React from 'react';

export const KPICard = ({ title, value, unit, subtitle, icon: Icon, color = 'cyan', badgeText, badgeVariant = 'default' }) => {
  const colorStyles = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="bg-[#131B29] border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-medium">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${colorStyles[color] || colorStyles.cyan}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{value}</span>
          {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
        </div>

        {badgeText && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded border bg-slate-900 border-slate-800 text-slate-300">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-mono">{subtitle}</p>}
    </div>
  );
};
