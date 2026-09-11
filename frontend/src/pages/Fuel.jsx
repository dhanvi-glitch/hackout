import React, { useEffect, useState } from 'react';
import { FuelGauge } from '../components/fuel/FuelGauge';
import { GeneratorCard } from '../components/fuel/GeneratorCard';
import { FuelConsumptionChart } from '../components/fuel/FuelConsumptionChart';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { Fuel as FuelIcon } from 'lucide-react';

export const Fuel = () => {
  const [fuelData, setFuelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFuel = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFuelStatus();
      setFuelData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch fuel status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  if (loading) return <LoadingSpinner label="Querying Diesel Fuel & Logistics System..." />;
  if (error) return <ErrorState message={error} onRetry={fetchFuel} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <FuelIcon className="w-6 h-6 text-cyan-400" />
          Fuel Intelligence & Generator Logistics
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Diesel tank capacity monitoring, fuel burn rates, autonomy calculations, and generator status
        </p>
      </div>

      {/* Fuel Tank Gauge */}
      <FuelGauge fuel={fuelData} />

      {/* Generator Details & Consumption Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeneratorCard generator={fuelData?.generator} />
        <FuelConsumptionChart history={fuelData?.consumptionHistory || []} />
      </div>
    </div>
  );
};
