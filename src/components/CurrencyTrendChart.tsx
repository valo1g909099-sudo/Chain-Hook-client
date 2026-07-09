import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { walletService } from '@/services/walletService';

export default function CurrencyTrendChart() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([
    { name: 'Mon', value: 0.91 },
    { name: 'Tue', value: 0.93 },
    { name: 'Wed', value: 0.92 },
    { name: 'Thu', value: 0.94 },
    { name: 'Fri', value: 0.92 },
  ]);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const history = await walletService.getPriceHistory();
        if (!active || !history || history.length === 0) return;
        
        const mapped = history
          .slice(0, 15)
          .reverse()
          .map((item) => {
            const dt = new Date(item.create_date_time);
            const label = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              name: label,
              value: parseFloat(parseFloat(item.EUR as string).toFixed(4)),
            };
          });
        setChartData(mapped);
      } catch (err) {
        console.warn('Failed to load chart history from backend:', err);
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-3 rounded-2xl border border-[#1C1C24] shadow-lg">
      <h3 className="text-[11px] font-semibold text-white mb-2">USD/EUR Rate (Historical Trend)</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis dataKey="name" fontSize={8} tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} />
            <YAxis domain={['auto', 'auto']} fontSize={8} tick={{fill: '#A1A1AA'}} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1C1C24', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
            <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
