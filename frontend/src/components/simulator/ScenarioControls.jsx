import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  AlertOctagon,
  Play,
  RotateCcw,
  Sun,
  Battery,
  Users,
  CloudRain,
  IndianRupee,
  SlidersHorizontal,
} from 'lucide-react';

const scenarios = [
  { id: 'SOLAR_FAILURE', name: '1. Solar Array Sudden Outage / Cloud Cover' },
  { id: 'WIND_FAILURE', name: '2. Wind Turbine Failure / Lull' },
  { id: 'BATTERY_LOW', name: '3. Battery Low SOC / BESS Trip' },
  { id: 'DIESEL_UNAVAILABLE', name: '4. Diesel Generator Outage / Fuel Exhaustion' },
  { id: 'DEMAND_SPIKE', name: '5. Unexpected Surge in Community Demand' },
  { id: 'STORM_48H', name: '6. 48-Hour Severe Cyclonic Storm' },
  { id: 'FUEL_PRICE_INCREASE', name: '7. Diesel Logistics Price Hike (+100%)' },
];

const DEFAULTS = {
  scenario: 'SOLAR_FAILURE',
  severity: 80,
  duration: 12,
  solarCapacity: 100,
  batteryCapacity: 200,
  demand: 80,
  rainProbability: 70,
  gridPrice: 8,
};

export const ScenarioControls = ({ onRunSimulation, loading }) => {
  const [selectedScenario, setSelectedScenario] = useState(DEFAULTS.scenario);
  const [severity, setSeverity] = useState(DEFAULTS.severity);
  const [duration, setDuration] = useState(DEFAULTS.duration);

  // Dynamic Interactive Microgrid Parameters
  const [solarCapacity, setSolarCapacity] = useState(DEFAULTS.solarCapacity);
  const [batteryCapacity, setBatteryCapacity] = useState(DEFAULTS.batteryCapacity);
  const [demand, setDemand] = useState(DEFAULTS.demand);
  const [rainProbability, setRainProbability] = useState(DEFAULTS.rainProbability);
  const [gridPrice, setGridPrice] = useState(DEFAULTS.gridPrice);

  const handleReset = () => {
    setSelectedScenario(DEFAULTS.scenario);
    setSeverity(DEFAULTS.severity);
    setDuration(DEFAULTS.duration);
    setSolarCapacity(DEFAULTS.solarCapacity);
    setBatteryCapacity(DEFAULTS.batteryCapacity);
    setDemand(DEFAULTS.demand);
    setRainProbability(DEFAULTS.rainProbability);
    setGridPrice(DEFAULTS.gridPrice);
  };

  // Validation
  const errors = [];
  if (solarCapacity < 0 || isNaN(solarCapacity)) errors.push('Solar capacity must be ≥ 0 kW');
  if (batteryCapacity < 0 || isNaN(batteryCapacity)) errors.push('Battery capacity must be ≥ 0 kWh');
  if (demand <= 0 || isNaN(demand)) errors.push('Village demand must be > 0 kW');
  if (rainProbability < 0 || rainProbability > 100 || isNaN(rainProbability)) errors.push('Rain probability must be 0–100%');
  if (gridPrice < 0 || isNaN(gridPrice)) errors.push('Grid price must be ≥ 0 ₹/kWh');

  const isValid = errors.length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onRunSimulation({
      scenario: selectedScenario,
      severity: Number(severity),
      durationHours: Number(duration),
      solarCapacityKw: Number(solarCapacity),
      batteryCapacityKwh: Number(batteryCapacity),
      demandKw: Number(demand),
      rainProbability: Number(rainProbability),
      gridPricePerKwh: Number(gridPrice),
    });
  };

  return (
    <Card title="Crisis Scenario & System Configuration" icon={AlertOctagon}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary Event Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-5 border-b border-slate-800/80">
          {/* Scenario Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Crisis Event</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 font-medium focus:border-cyan-500 outline-none"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">Scenario Severity</label>
              <span className="font-mono text-xs font-bold text-amber-400">{severity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">Duration (Hours)</label>
              <span className="font-mono text-xs font-bold text-cyan-400">{duration} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="72"
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Interactive Scenario Parameter Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              Microgrid System Inputs (Interactive Variables)
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Adjust sliders or enter exact values</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. Solar Capacity */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Cap
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="5"
                    value={solarCapacity}
                    onChange={(e) => setSolarCapacity(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-amber-300 focus:border-amber-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">kW</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={solarCapacity}
                onChange={(e) => setSolarCapacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kW</span>
                <span>300 kW</span>
              </div>
            </div>

            {/* 2. Battery Capacity */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-emerald-300 focus:border-emerald-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">kWh</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kWh</span>
                <span>500 kWh</span>
              </div>
            </div>

            {/* 3. Demand */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-cyan-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Demand
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="10"
                    max="400"
                    step="5"
                    value={demand}
                    onChange={(e) => setDemand(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-cyan-300 focus:border-cyan-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">kW</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={demand}
                onChange={(e) => setDemand(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 kW</span>
                <span>250 kW</span>
              </div>
            </div>

            {/* 4. Rain Probability */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-300 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain Prob
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={rainProbability}
                    onChange={(e) => setRainProbability(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-blue-300 focus:border-blue-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rainProbability}
                onChange={(e) => setRainProbability(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 5. Grid Price */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-300 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-purple-400" /> Grid Tariff
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={gridPrice}
                    onChange={(e) => setGridPrice(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-purple-300 focus:border-purple-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">₹/kWh</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={gridPrice}
                onChange={(e) => setGridPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹1</span>
                <span>₹30/kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation error display */}
        {!isValid && (
          <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 font-mono space-y-1">
            {errors.map((err, idx) => (
              <div key={idx}>• {err}</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <Button
            variant="ghost"
            icon={RotateCcw}
            type="button"
            size="sm"
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-200"
          >
            Reset Defaults
          </Button>

          <Button
            variant="danger"
            icon={Play}
            loading={loading}
            disabled={!isValid}
            type="submit"
            size="md"
          >
            RUN CRISIS SIMULATION
          </Button>
        </div>
      </form>
    </Card>
  );
};

