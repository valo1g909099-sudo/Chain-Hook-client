import { useState } from 'react';
import { TrendingUp, Activity, BarChart3, Users, DollarSign } from 'lucide-react';

export default function AnalyticsTable() {
  const [timeframe, setTimeframe] = useState('7D');

  const analyticsData = [
    { metric: 'Active Users', value: '12,450', change: '+2.5%', status: 'Healthy', trend: 'Up', source: 'Web', icon: Users },
    { metric: 'Revenue Stream', value: '$85,200', change: '+15.2%', status: 'Healthy', trend: 'Up', source: 'Global', icon: DollarSign },
    { metric: 'Conversion Rate', value: '4.8%', change: '-0.3%', status: 'Warning', trend: 'Down', source: 'Mobile', icon: TrendingUp },
    { metric: 'Session Duration', value: '12m 45s', change: '+1.1%', status: 'Healthy', trend: 'Stable', source: 'Web', icon: ClockIcon },
    { metric: 'Engagement Score', value: '89/100', change: '+5.4%', status: 'Healthy', trend: 'Up', source: 'App', icon: Activity },
    { metric: 'Top Asset Growth', value: '12.8%', change: '+2.1%', status: 'Healthy', trend: 'Up', source: 'Global', icon: BarChart3 },
  ];

  function ClockIcon(props: any) {
    return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }

  return (
    <div className="glass p-6 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Comprehensive Analytics</h3>
            <p className="text-[10px] text-[#52525B]">Performance metrics based on the selected timeframe analysis.</p>
        </div>
        <select 
          className="bg-[#0D0D12] border border-[#27272A] rounded-lg px-3 py-1 text-[10px] text-white focus:outline-none focus:border-[#D4AF37]/50"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option>7D</option>
          <option>30D</option>
          <option>YTD</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[#9A9AA5]">
              <th className="pb-3 pl-2">Metric</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Trend</th>
              <th className="pb-3">Source</th>
              <th className="pb-3 pr-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {analyticsData.map((d, i) => {
              const Icon = d.icon;
              return (
                <tr key={i} className="border-b border-[#1C1C24] hover:bg-[#D4AF37]/5 transition-colors">
                  <td className="py-3 pl-2 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[#1C1C24] text-[#D4AF37]">
                        <Icon size={14} />
                    </div>
                    {d.metric}
                  </td>
                  <td className="py-3 font-semibold">{d.value}</td>
                  <td className={`py-3 ${d.status === 'Healthy' ? 'text-[#3EC6C0]' : 'text-[#FF6B6B]'}`}>{d.status}</td>
                  <td className="py-3">{d.trend}</td>
                  <td className="py-3">{d.source}</td>
                  <td className={`py-3 pr-2 text-right font-medium ${d.change.startsWith('+') ? 'text-[#3EC6C0]' : 'text-[#FF6B6B]'}`}>
                    {d.change}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
