import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const styles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    solar: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    wind: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    battery: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${styles[variant] || styles.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export const LoadingSpinner = ({ label = 'Loading microgrid telemetry...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="relative w-12 h-12 mb-3">
      <div className="absolute inset-0 rounded-full border-2 border-slate-800"></div>
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
    </div>
    <p className="text-sm text-slate-400 font-medium">{label}</p>
  </div>
);

export const EmptyState = ({ title = 'No Data Available', description = 'No telemetry or optimization results to display at this time.', icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
    {Icon && (
      <div className="p-3 bg-slate-800/80 rounded-full text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
    )}
    <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
    <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
  </div>
);

export const ErrorState = ({ title = 'Connection Issue', message = 'Unable to connect to microgrid telemetry service.', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-xl">
    <div className="p-3 bg-rose-900/30 rounded-full text-rose-400 mb-3">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h4 className="text-sm font-semibold text-rose-300">{title}</h4>
    <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 rounded-lg transition-colors cursor-pointer"
      >
        Retry Connection
      </button>
    )}
  </div>
);
