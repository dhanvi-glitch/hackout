import React, { useEffect, useState } from 'react';
import { PrioritySection } from '../components/loads/PrioritySection';
import { LoadShedVisualizer } from '../components/loads/LoadShedVisualizer';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { Sliders } from 'lucide-react';

export const Loads = () => {
  const [loadData, setLoadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoads = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLoadStatus();
      setLoadData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch load management status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  if (loading) return <LoadingSpinner label="Querying Priority Load Shedding Controller..." />;
  if (error) return <ErrorState message={error} onRetry={fetchLoads} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-amber-400" />
          Load Management & Priority Shedding
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Hierarchical P0/P1/P2 load classification and automated deficit curtailment logic
        </p>
      </div>

      {/* Priority Cards */}
      <PrioritySection priorityData={loadData} />

      {/* Interactive Load Shedding Simulator */}
      <LoadShedVisualizer />
    </div>
  );
};
