import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action, icon: Icon }) => {
  return (
    <div className={`bg-[#131B29] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-200 ${className}`}>
      {(title || action || Icon) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-2 bg-slate-800/60 rounded-lg text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-100 text-base leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
