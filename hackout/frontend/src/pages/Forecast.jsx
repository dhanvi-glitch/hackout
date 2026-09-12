import React, { useEffect, useState } from 'react';
import { ForecastCharts } from '../components/forecast/ForecastCharts';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { TrendingUp, Clock, MapPin } from 'lucide-react';
import { DEMO_LOCATION } from '../utils/constants';
import { useSystemStatus } from '../hooks/useSystemStatus';

export const Forecast = () => {
  const { activeLocation, status } = useSystemStatus();
  const loc = activeLocation || status?.location || DEMO_LOCATION;

  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const data = await apiService.getForecast();
      setForecastData(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch 24-hour forecast data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast initially and whenever the active location coordinates change
  useEffect(() => {
    fetchForecast();
  }, [loc.latitude, loc.longitude]);

  if (loading && (!forecastData || forecastData.length === 0)) {
    return <LoadingSpinner label={`Generating 24-Hour Microgrid Forecast for ${loc.name}...`} />;
  }

  if (error && (!forecastData || forecastData.length === 0)) {
    return <ErrorState message={error} onRetry={fetchForecast} />;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              24-Hour Predictive Forecast
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              {loc.shortName || loc.village}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {loc.community || loc.name} ({loc.latitude}°N, {loc.longitude}°E) • 96 intervals (15-min) solar, wind, and demand trajectories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{loc.shortName || loc.village}, {loc.state}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>96 Intervals (15-min)</span>
          </div>
        </div>
      </div>

      {/* Forecast Charts */}
      <ForecastCharts data={forecastData} />
    </div>
  );
};

export default Forecast;
