import React, { useState } from 'react';
import { ScenarioControls } from '../components/simulator/ScenarioControls';
import { BeforeAfterComparison } from '../components/simulator/BeforeAfterComparison';
import { ImpactMetrics } from '../components/simulator/ImpactMetrics';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { apiService } from '../services/api';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { BrainCircuit, MapPin } from 'lucide-react';

export const Simulator = () => {
  const { activeLocation, optimizationMode } = useSystemStatus();
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunSimulation = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.runSimulation({
        ...payload,
        latitude: activeLocation?.latitude,
        longitude: activeLocation?.longitude,
        optimizationMode: optimizationMode || 'balanced',
      });
      setSimulationResult(res);
    } catch (err) {
      setError(err.message || 'Simulation execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-rose-400" />
            What-If Crisis Simulator
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Compare unoptimized heuristic dispatch vs. OptiGrid predictive MPC under equipment outages and weather shocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Location:</span>
            <span className="font-semibold text-slate-100">{activeLocation?.name || 'Baramati Rural'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
            <span>Mode:</span>
            <span className="font-semibold uppercase text-cyan-400">
              {optimizationMode?.replace('_', ' ') || 'BALANCED'}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Controls */}
      <ScenarioControls onRunSimulation={handleRunSimulation} loading={loading} />

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Simulation Results Display */}
      {simulationResult && (
        <ErrorBoundary>
          <div className="space-y-6 animate-fadeIn">
            <ImpactMetrics impact={simulationResult.impact} />
            <BeforeAfterComparison
              before={simulationResult.before}
              after={simulationResult.after}
              withoutOptimization={simulationResult.withoutOptimization}
              withOptigrid={simulationResult.withOptigrid}
              comparison={simulationResult.comparison}
              aiExplanation={simulationResult.aiExplanation}
              chartData={simulationResult.chartData}
            />
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};
