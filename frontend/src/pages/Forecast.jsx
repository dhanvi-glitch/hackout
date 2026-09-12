import React, { useEffect, useState } from 'react';
import { ForecastCharts } from '../components/forecast/ForecastCharts';
import { apiService } from '../services/api';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { TrendingUp, Clock, MapPin } from 'lucide-react';

export const Forecast = () => {
  const {
    forecast: contextForecast,
    activeLocation,
    weatherSource,
    loading: contextLoading,
  } = useSystemStatus();

  const [localForecast, setLocalForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const forecastData = (contextForecast && contextForecast.length > 0)
    ? contextForecast
    : localForecast;

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const data = await apiService.getForecast({
        latitude: activeLocation?.latitude,
        longitude: activeLocation?.longitude,
      });
      setLocalForecast(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch 24-hour forecast data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contextForecast || contextForecast.length === 0) {
      fetchForecast();
    }
  }, [activeLocation]);

  const isLoading = (loading || contextLoading) && (!forecastData || forecastData.length === 0);

  if (isLoading) return <LoadingSpinner label="Generating 24-Hour (96-Interval) Microgrid Forecast..." />;
  if (error && (!forecastData || forecastData.length === 0)) return <ErrorState message={error} onRetry={fetchForecast} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            24-Hour Predictive Forecast
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            15-minute resolution (96 intervals) solar, wind, load demand, and battery SOC trajectories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{activeLocation?.name || 'Baramati Rural'}</span>
          </div>

          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
              weatherSource === 'LIVE'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : weatherSource === 'CACHED'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                : 'bg-indigo-950/80 text-indigo-400 border border-indigo-500/30'
            }`}
          >
            {weatherSource} TELEMETRY
          </span>

          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>96 Intervals</span>
          </div>
        </div>
      </div>

      {/* Forecast Charts */}
      <ForecastCharts data={forecastData} />
    </div>
  );
};
