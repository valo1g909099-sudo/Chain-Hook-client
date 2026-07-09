import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_DATA = [
  { name: 'Mon', value: 3000 },
  { name: 'Tue', value: 3200 },
  { name: 'Wed', value: 2800 },
  { name: 'Thu', value: 3500 },
  { name: 'Fri', value: 4000 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4500 },
];

export default function TransactionTrendChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
        <XAxis dataKey="name" stroke="#9A9AA5" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis 
          stroke="#9A9AA5" 
          fontSize={10} 
          axisLine={false} 
          tickLine={false} 
          domain={['auto', 'auto']} 
          width={40}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1C1C24', border: 'none', fontSize: '10px', borderRadius: '8px' }} 
          itemStyle={{ color: '#3EC6C0' }}
        />
        <Line type="monotone" dataKey="value" stroke="#3EC6C0" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}