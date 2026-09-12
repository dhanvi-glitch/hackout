import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card } from '../common/Card';
import { Sun, Wind, Zap, Battery, Flame, TrendingUp } from 'lucide-react';

export const ForecastCharts = ({ data = [] }) => {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, GEN, DEMAND, BATTERY

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#131B29] border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="font-bold text-cyan-400 mb-1 border-b border-slate-800 pb-1">Interval Time: {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">
                {entry.name.includes('SOC') ? `${entry.value}%` : `${entry.value} kW`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Visual Section Selection Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit text-xs">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'ALL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Combined Overview
        </button>
        <button
          onClick={() => setActiveTab('GEN')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'GEN' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Generation Forecast
        </button>
        <button
          onClick={() => setActiveTab('DEMAND')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'DEMAND' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Demand Forecast
        </button>
        <button
          onClick={() => setActiveTab('BATTERY')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'BATTERY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Battery SOC Forecast
        </button>
      </div>

      {/* Main 24-Hour (96 intervals) Power Generation & Demand Chart */}
      {(activeTab === 'ALL' || activeTab === 'GEN' || activeTab === 'DEMAND') && (
        <Card title="Power Supply & Demand Balance (24 Hours / 96 Intervals)" icon={TrendingUp}>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} interval={7} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} unit=" kW" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                
                {/* Current Time Indicator line at ~10:45 AM (interval 43) */}
                <ReferenceLine x="10:45" stroke="#EC4899" strokeDasharray="3 3" label={{ value: "NOW", fill: "#EC4899", fontSize: 10 }} />

                {(activeTab === 'ALL' || activeTab === 'GEN') && (
                  <>
                    <Area type="monotone" dataKey="solar" name="Solar Forecast" stroke="#F59E0B" fillOpacity={1} fill="url(#colorSolar)" />
                    <Area type="monotone" dataKey="wind" name="Wind Forecast" stroke="#06B6D4" fillOpacity={1} fill="url(#colorWind)" />
                    <Bar dataKey="diesel" name="Diesel Dispatch" fill="#EF4444" radius={[2, 2, 0, 0]} />
                  </>
                )}

                {(activeTab === 'ALL' || activeTab === 'DEMAND') && (
                  <Line type="monotone" dataKey="demand" name="Dhordo Demand Forecast" stroke="#38BDF8" strokeWidth={2.5} dot={false} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Battery SOC Forecast Chart */}
      {(activeTab === 'ALL' || activeTab === 'BATTERY') && (
        <Card title="State of Charge (SOC) Forecast (24 Hours)" icon={Battery}>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} interval={7} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                <ReferenceLine y={20} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Min SOC (20%)", fill: "#EF4444", fontSize: 10 }} />
                <ReferenceLine y={50} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Storm Reserve (50%)", fill: "#F59E0B", fontSize: 10 }} />

                <Line type="monotone" dataKey="batterySoc" name="Battery SOC (%)" stroke="#10B981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};
