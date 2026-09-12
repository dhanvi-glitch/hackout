import React, { useEffect, useState } from 'react';
import { PrioritySection } from '../components/loads/PrioritySection';
import { LoadShedVisualizer } from '../components/loads/LoadShedVisualizer';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { Sliders, MapPin } from 'lucide-react';
import { DEMO_LOCATION } from '../utils/constants';
import { useSystemStatus } from '../hooks/useSystemStatus';

export const Loads = () => {
  const { activeLocation, status } = useSystemStatus();
  const loc = activeLocation || status?.location || DEMO_LOCATION;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-amber-400" />
              Load Management & Priority Shedding
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              {loc.shortName || loc.village}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Hierarchical P0/P1/P2 load classification for {loc.community || loc.name} ({loc.latitude}°N, {loc.longitude}°E)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{loc.name}</span>
        </div>
      </div>

      {/* Priority Cards */}
      <PrioritySection priorityData={loadData} />

      {/* Interactive Load Shedding Simulator */}
      <LoadShedVisualizer />
    </div>
  );
};

export default Loads;
