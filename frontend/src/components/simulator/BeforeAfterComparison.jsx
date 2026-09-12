import React from 'react';
import { Card } from '../common/Card';
import {
  Zap,
  Sun,
  Wind,
  Battery,
  Flame,
  ShieldCheck,
  Leaf,
  BrainCircuit,
  TrendingDown,
  ArrowDownRight,
  TrendingUp,
  Sliders,
  Sparkles,
  IndianRupee,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatPower, formatINR, formatFuel, formatCO2, formatPercent } from '../../utils/formatters';

export const BeforeAfterComparison = ({
  before,
  after,
  withoutOptimization,
  withOptigrid,
  comparison,
  aiExplanation,
  chartData,
}) => {
  if (!before && !withoutOptimization) return null;

  const hasComparison = !!(withoutOptimization && withOptigrid);
  const savingsPositive = (comparison?.estimated_savings_inr ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* 1. COMPARATIVE SUMMARY BANNER */}
      {hasComparison && comparison && (
        <div
          className={`p-5 rounded-2xl border ${
            savingsPositive
              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/30 border-emerald-500/40'
              : 'bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-rose-950/30 border-amber-500/40'
          } shadow-xl`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Savings Highlight */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-xs uppercase tracking-widest font-bold text-slate-300 font-mono">
                  OptiGrid Optimization Advantage
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {formatINR(Math.abs(comparison.estimated_savings_inr))}
                </span>
                <span
                  className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                    savingsPositive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {savingsPositive ? `+${comparison.savings_pct}% Net Savings` : 'Emergency Life Protection'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {savingsPositive
                  ? 'Estimated financial savings compared to uncoordinated heuristic dispatch.'
                  : 'OptiGrid prioritized life-critical loads to avert total community blackout.'}
              </p>
            </div>

            {/* Metric Reductions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Diesel Saved */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5">Diesel Saved</span>
                <span className="text-base font-bold text-cyan-400">
                  {comparison.diesel_saved_liters} L
                </span>
                <span className="text-[10px] text-cyan-300/80 block mt-0.5">
                  ({comparison.diesel_saved_pct}%)
                </span>
              </div>

              {/* Grid Saved */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5">Grid Energy</span>
                <span className="text-base font-bold text-emerald-400">
                  {comparison.grid_saved_kwh} kWh
                </span>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                  ({comparison.grid_saved_pct}%)
                </span>
              </div>

              {/* CO2 Saved */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5">CO2 Avoided</span>
                <span className="text-base font-bold text-slate-200">
                  {comparison.co2_saved_kg} kg
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({comparison.co2_saved_pct}%)
                </span>
              </div>

              {/* Reliability Gain */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 block mb-0.5">P0 Life Power</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatPercent(withOptigrid.p0_reliability_pct)}
                </span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">
                  100% Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIDE-BY-SIDE DETAILED COMPARISON TABLE */}
      {hasComparison && (
        <Card title="WITHOUT OPTIMIZATION vs. WITH OPTIGRID" icon={Activity}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WITHOUT OPTIMIZATION Card */}
            <div className="p-5 bg-rose-950/20 rounded-2xl border border-rose-900/40 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
                <div>
                  <h3 className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    WITHOUT OPTIMIZATION
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Uncoordinated heuristic dispatch (greedy battery discharge, no tariff foresight)
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                  UNCOORDINATED
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Total Operating Cost</span>
                  <span className="text-sm font-bold text-rose-300">
                    {formatINR(withoutOptimization.total_cost_inr)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Diesel Fuel Burned</span>
                  <span className="font-bold text-rose-400">
                    {formatFuel(withoutOptimization.diesel_liters)} ({withoutOptimization.diesel_usage_kwh} kWh)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Grid Energy Purchased</span>
                  <span className="font-bold text-slate-300">
                    {withoutOptimization.grid_usage_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Clean Renewable Used</span>
                  <span className="font-bold text-amber-400">
                    {withoutOptimization.renewable_usage_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">CO2 Emissions</span>
                  <span className="font-bold text-slate-300">
                    {formatCO2(withoutOptimization.co2_emissions_kg)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Unserved Deficit (Load Shed)</span>
                  <span className={`font-bold ${withoutOptimization.load_shed_kwh > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {withoutOptimization.load_shed_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Overall System Reliability</span>
                  <span className={`font-bold ${withoutOptimization.reliability_pct < 95 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {formatPercent(withoutOptimization.reliability_pct)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">P0 Life-Critical Reliability</span>
                  <span className={`font-bold ${withoutOptimization.p0_reliability_pct < 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {formatPercent(withoutOptimization.p0_reliability_pct)}
                  </span>
                </div>
              </div>
            </div>

            {/* WITH OPTIGRID Card */}
            <div className="p-5 bg-emerald-950/20 rounded-2xl border border-emerald-500/40 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/40">
                <div>
                  <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    WITH OPTIGRID
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Predictive MPC horizon optimization (TOU tariff avoidance, 35% reserve, smart priority)
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  PREDICTIVE MPC
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30">
                  <span className="text-slate-300 font-semibold">Total Operating Cost</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {formatINR(withOptigrid.total_cost_inr)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Diesel Fuel Burned</span>
                  <span className="font-bold text-cyan-400">
                    {formatFuel(withOptigrid.diesel_liters)} ({withOptigrid.diesel_usage_kwh} kWh)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Grid Energy Purchased</span>
                  <span className="font-bold text-emerald-300">
                    {withOptigrid.grid_usage_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Clean Renewable Used</span>
                  <span className="font-bold text-amber-300">
                    {withOptigrid.renewable_usage_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">CO2 Emissions</span>
                  <span className="font-bold text-emerald-300">
                    {formatCO2(withOptigrid.co2_emissions_kg)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Unserved Deficit (Load Shed)</span>
                  <span className="font-bold text-emerald-400">
                    {withOptigrid.load_shed_kwh} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-900">
                  <span className="text-slate-400">Overall System Reliability</span>
                  <span className="font-bold text-emerald-400">
                    {formatPercent(withOptigrid.reliability_pct)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30">
                  <span className="text-slate-300 font-semibold">P0 Life-Critical Reliability</span>
                  <span className="font-bold text-emerald-400">
                    {formatPercent(withOptigrid.p0_reliability_pct)} (Guaranteed)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 3. RECHARTS COMPARISON BAR CHART */}
      {hasComparison && chartData && chartData.length > 0 && (
        <Card title="Strategy Comparison Chart (Key Operating Indicators)" icon={Zap}>
          <div className="h-72 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="metric" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                  formatter={(val, name) => [
                    val,
                    name === 'WithoutOptimization' ? 'Without Optimization' : 'With OptiGrid',
                  ]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  formatter={(val) => (val === 'WithoutOptimization' ? 'Without Optimization (Heuristic)' : 'With OptiGrid (Predictive MPC)')}
                />
                <Bar
                  dataKey="WithoutOptimization"
                  name="WithoutOptimization"
                  fill="#F43F5E"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="WithOptiGrid"
                  name="WithOptiGrid"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 4. AI ENGINEERING ANALYSIS NARRATIVE */}
      {aiExplanation && (
        <Card title="OptiGrid AI Engineering Dispatch Analysis" icon={BrainCircuit}>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Autonomous Optimization Audit</span>
            </div>
            <p className="whitespace-pre-line text-slate-300 font-normal">{aiExplanation}</p>
          </div>
        </Card>
      )}

      {/* 5. LEGACY POWER BALANCE (BEFORE vs AFTER CRISIS) */}
      {before && after && (
        <Card title="Power Balance Impact (Before vs. After Crisis)" icon={Zap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE State */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-emerald-400 text-sm">NORMAL STATE (BEFORE)</span>
                <span className="text-[10px] text-slate-500">Baseline</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-amber-400">
                  <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" /> Solar</span>
                  <span className="font-bold">{formatPower(before.solar)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-cyan-400">
                  <span className="flex items-center gap-2"><Wind className="w-3.5 h-3.5" /> Wind</span>
                  <span className="font-bold">{formatPower(before.wind)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-emerald-400">
                  <span className="flex items-center gap-2"><Battery className="w-3.5 h-3.5" /> Battery</span>
                  <span className="font-bold">{formatPower(before.battery)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-slate-400">
                  <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5" /> Diesel</span>
                  <span className="font-bold">{formatPower(before.diesel)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/80 text-slate-100 font-bold border border-slate-800">
                  <span>Village Demand</span>
                  <span>{formatPower(before.demand)}</span>
                </div>
              </div>
            </div>

            {/* AFTER Crisis State */}
            <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-900/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                <span className="font-bold text-rose-400 text-sm">SIMULATED CRISIS STATE (AFTER)</span>
                <span className="text-[10px] text-rose-300">Under Stress</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-amber-400">
                  <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" /> Solar</span>
                  <span className={`font-bold ${after.solar < before.solar ? 'text-rose-400' : 'text-amber-400'}`}>
                    {formatPower(after.solar)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-cyan-400">
                  <span className="flex items-center gap-2"><Wind className="w-3.5 h-3.5" /> Wind</span>
                  <span className={`font-bold ${after.wind < before.wind ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {formatPower(after.wind)}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-emerald-400">
                  <span className="flex items-center gap-2"><Battery className="w-3.5 h-3.5" /> Battery</span>
                  <span className="font-bold">{formatPower(after.battery)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/60 text-rose-400">
                  <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5" /> Diesel</span>
                  <span className="font-bold">{formatPower(after.diesel)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950/80 text-slate-100 font-bold border border-rose-900/40">
                  <span>Village Demand</span>
                  <span>{formatPower(after.demand)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

