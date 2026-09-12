import React, { useEffect, useState } from 'react';
import { BatteryGauge } from '../components/battery/BatteryGauge';
import { SOCChart } from '../components/battery/SOCChart';
import { StormModeBanner } from '../components/battery/StormModeBanner';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorState } from '../components/common/Badge';
import { BatteryCharging } from 'lucide-react';

export const Battery = () => {
  const [batteryData, setBatteryData] = useState(null);
  const [isStormMode, setIsStormMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBattery = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBatteryStatus();
      setBatteryData(data);
      setIsStormMode(data?.isStormModeActive || false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch battery status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattery();
  }, []);

  const handleToggleStormMode = async () => {
    const nextState = !isStormMode;
    setIsStormMode(nextState);
    await apiService.toggleStormMode(nextState);
  };

  if (loading) return <LoadingSpinner label="Querying BESS Battery Management System..." />;
  if (error) return <ErrorState message={error} onRetry={fetchBattery} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <BatteryCharging className="w-6 h-6 text-emerald-400" />
          Battery Energy Storage System (BESS)
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          100 kWh Lithium-ion storage telemetry, SOC limits, and storm reserve mode management
        </p>
      </div>

      {/* Storm Mode Warning / Control Banner */}
      <StormModeBanner isStormModeActive={isStormMode} onToggleStormMode={handleToggleStormMode} />

      {/* Battery Gauge Specs */}
      <BatteryGauge battery={{ ...batteryData, isStormModeActive: isStormMode }} />

      {/* SOC History Chart */}
      <SOCChart history={batteryData?.socHistory || []} isStormModeActive={isStormMode} />
    </div>
  );
};
