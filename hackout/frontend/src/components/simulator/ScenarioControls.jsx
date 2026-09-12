import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AlertOctagon, Play } from 'lucide-react';

const scenarios = [
  { id: 'SOLAR_FAILURE', name: '1. Solar Array Sudden Outage / Cloud Cover' },
  { id: 'WIND_FAILURE', name: '2. Wind Turbine Failure / Lull' },
  { id: 'BATTERY_LOW', name: '3. Battery Low SOC / BESS Trip' },
  { id: 'DIESEL_UNAVAILABLE', name: '4. Diesel Generator Outage / Fuel Exhaustion' },
  { id: 'DEMAND_SPIKE', name: '5. Unexpected Surge in Community Demand' },
  { id: 'STORM_48H', name: '6. 48-Hour Severe Cyclonic Storm' },
  { id: 'FUEL_PRICE_INCREASE', name: '7. Diesel Logistics Price Hike (+100%)' },
];

export const ScenarioControls = ({ onRunSimulation, loading }) => {
  const [selectedScenario, setSelectedScenario] = useState('SOLAR_FAILURE');
  const [severity, setSeverity] = useState(80);
  const [duration, setDuration] = useState(12);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunSimulation({
      scenario: selectedScenario,
      severity: severity,
      durationHours: duration,
    });
  };

  return (
    <Card title="Crisis Scenario Configuration" icon={AlertOctagon}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="danger" icon={Play} loading={loading} type="submit" size="md">
            RUN CRISIS SIMULATION
          </Button>
        </div>
      </form>
    </Card>
  );
};
