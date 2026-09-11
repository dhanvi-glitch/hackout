import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';

export const SOCChart = ({ history = [], isStormModeActive = false }) => {
  return (
    <Card title="24-Hour Battery SOC Trajectory" icon={TrendingUp}>
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="hour" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
            <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: '#131B29', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            <ReferenceLine
              y={20}
              stroke="#EF4444"
              strokeDasharray="4 4"
              label={{ value: 'Min Threshold (20%)', fill: '#EF4444', fontSize: 10 }}
            />
            <ReferenceLine
              y={50}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{ value: 'Storm Reserve (50%)', fill: '#F59E0B', fontSize: 10 }}
            />

            <Line
              type="monotone"
              dataKey="soc"
              name="Battery State of Charge (%)"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ fill: '#10B981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
