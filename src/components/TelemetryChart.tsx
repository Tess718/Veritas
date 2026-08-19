import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface TelemetryChartProps {
  telemetryType: string;
  unit: string;
  currentValue: string;
  verifier: string;
  accentColor?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  telemetryType,
  unit,
  currentValue,
  verifier,
  accentColor = "#00F2FE"
}) => {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    // Generate initial 12 data points
    const baseValue = parseFloat(currentValue.replace(/,/g, '')) || 90;
    const initialData = Array.from({ length: 12 }, (_, i) => {
      const timeStr = `${12 - i}m ago`;
      const variance = (Math.random() - 0.48) * (baseValue * 0.05);
      return {
        time: timeStr,
        value: parseFloat(Math.max(10, baseValue + variance).toFixed(1))
      };
    }).reverse();

    setData(initialData);

    // Live update stream every 3 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const lastVal = prev[prev.length - 1]?.value || baseValue;
        const nextVal = parseFloat(Math.max(10, lastVal + (Math.random() - 0.48) * (baseValue * 0.04)).toFixed(1));
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        return [...prev.slice(1), { time: timeStr, value: nextVal }];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentValue]);

  return (
    <div className="bg-[#0D111D] border border-white/10 rounded-xl p-4 font-mono text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-gray-300 font-bold uppercase tracking-wider">{telemetryType}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Oracle Stream</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2.5">
          <div className="text-[10px] text-gray-400 uppercase">Current Reading</div>
          <div className="text-lg font-bold text-white mt-0.5">
            {data[data.length - 1]?.value.toLocaleString() || currentValue} <span className="text-xs text-cyan-400 font-normal">{unit}</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <div className="text-[10px] text-gray-400 uppercase">Oracle Verifier</div>
          <div className="text-xs font-semibold text-gray-300 truncate mt-1 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{verifier}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-32 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#4B5563" tick={{ fontSize: 9 }} tickLine={false} />
            <YAxis stroke="#4B5563" tick={{ fontSize: 9 }} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#101422', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area type="monotone" dataKey="value" stroke={accentColor} strokeWidth={2} fillOpacity={1} fill="url(#telemetryGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
