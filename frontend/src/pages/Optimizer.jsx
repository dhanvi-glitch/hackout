import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { OptimizerForm } from '../components/energy/OptimizerForm';
import { DispatchResult } from '../components/energy/DispatchResult';
import { apiService } from '../services/api';
import { Sliders, Cpu } from 'lucide-react';

export const Optimizer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.runOptimization(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to run energy mix optimization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" />
          Energy Mix Optimizer (MILP)
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Adjust microgrid parameters and trigger optimal dispatch optimization (Calls backend REST API)
        </p>
      </div>

      {/* Input Parameters Form Card */}
      <Card title="Operator Parameters & Grid Constraints" icon={Sliders}>
        <OptimizerForm onSubmit={handleOptimize} loading={loading} />
      </Card>

      {/* Error state if any */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Results Component */}
      {result && <DispatchResult result={result} />}
    </div>
  );
};
