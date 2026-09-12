import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const OptimizerForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    currentDemand: '48.2',
    solarAvailable: '26.4',
    windAvailable: '15.3',
    batterySoc: '68',
    batteryCapacity: '100',
    dieselAvailable: 'true',
    fuelRemaining: '360',
    dieselPrice: '1.45',
    minSoc: '20',
    maxSoc: '95',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      currentDemand: '48.2',
      solarAvailable: '26.4',
      windAvailable: '15.3',
      batterySoc: '68',
      batteryCapacity: '100',
      dieselAvailable: 'true',
      fuelRemaining: '360',
      dieselPrice: '1.45',
      minSoc: '20',
      maxSoc: '95',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Current Demand */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Current Demand (kW)</label>
          <input
            type="number"
            step="0.1"
            name="currentDemand"
            value={formData.currentDemand}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Solar Available */}
        <div>
          <label className="block text-xs font-medium text-amber-300 mb-1">Solar Available (kW)</label>
          <input
            type="number"
            step="0.1"
            name="solarAvailable"
            value={formData.solarAvailable}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        {/* Wind Available */}
        <div>
          <label className="block text-xs font-medium text-cyan-300 mb-1">Wind Available (kW)</label>
          <input
            type="number"
            step="0.1"
            name="windAvailable"
            value={formData.windAvailable}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-400 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Battery SOC */}
        <div>
          <label className="block text-xs font-medium text-emerald-300 mb-1">Battery SOC (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            name="batterySoc"
            value={formData.batterySoc}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        {/* Battery Capacity */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Battery Capacity (kWh)</label>
          <input
            type="number"
            name="batteryCapacity"
            value={formData.batteryCapacity}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Diesel Available */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Diesel Genset Status</label>
          <select
            name="dieselAvailable"
            value={formData.dieselAvailable}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          >
            <option value="true">Available (Standby)</option>
            <option value="false">Unavailable (Maintenance)</option>
          </select>
        </div>

        {/* Fuel Remaining */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Fuel Remaining (L)</label>
          <input
            type="number"
            name="fuelRemaining"
            value={formData.fuelRemaining}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Diesel Price */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Diesel Price ($/L)</label>
          <input
            type="number"
            step="0.01"
            name="dieselPrice"
            value={formData.dieselPrice}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Minimum SOC */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Minimum SOC Limit (%)</label>
          <input
            type="number"
            min="10"
            max="50"
            name="minSoc"
            value={formData.minSoc}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Maximum SOC */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Maximum SOC Limit (%)</label>
          <input
            type="number"
            min="80"
            max="100"
            name="maxSoc"
            value={formData.maxSoc}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" icon={RotateCcw} onClick={handleReset}>
          Reset Defaults
        </Button>
        <Button variant="primary" icon={Play} loading={loading} type="submit">
          OPTIMIZE NOW
        </Button>
      </div>
    </form>
  );
};
