import React, { useEffect, useState } from 'react';
import { ForecastCharts } from '../components/forecast/ForecastCharts';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { TrendingUp, Clock } from 'lucide-react';

export const Forecast = () => {
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

  useEffect(() => {
    fetchForecast();
  }, []);

  if (loading) return <LoadingSpinner label="Generating 24-Hour (96-Interval) Microgrid Forecast..." />;
  if (error) return <ErrorState message={error} onRetry={fetchForecast} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            24-Hour Predictive Forecast
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            15-minute resolution (96 intervals) solar, wind, load demand, and battery SOC trajectories
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>96 Intervals (15-min step)</span>
        </div>
      </div>

      {/* Forecast Charts */}
      <ForecastCharts data={forecastData} />
    </div>
  );
};
