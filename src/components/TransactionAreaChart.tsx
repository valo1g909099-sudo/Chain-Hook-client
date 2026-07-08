import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 5390 },
  { name: 'Sun', value: 6000 },
];

export default function TransactionAreaChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
        <XAxis dataKey="name" stroke="#9A9AA5" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis stroke="#9A9AA5" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1C1C24', border: 'none', fontSize: '10px', borderRadius: '8px' }} 
          itemStyle={{ color: '#D4AF37' }}
        />
        <Area type="monotone" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
