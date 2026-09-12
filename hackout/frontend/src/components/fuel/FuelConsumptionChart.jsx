import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';

export const FuelConsumptionChart = ({ history = [] }) => {
  return (
    <Card title="7-Day Fuel Consumption History" icon={TrendingUp}>
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
            <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} unit=" L" />
            <Tooltip
              contentStyle={{ backgroundColor: '#131B29', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="liters" name="Diesel Consumed (Liters)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
