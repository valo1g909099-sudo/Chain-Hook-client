import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_DATA = [
  { name: 'Mon', amount: 4000 },
  { name: 'Tue', amount: 3000 },
  { name: 'Wed', amount: 5000 },
  { name: 'Thu', amount: 2780 },
  { name: 'Fri', amount: 6890 },
  { name: 'Sat', amount: 5390 },
  { name: 'Sun', amount: 4000 },
];

export default function TransactionChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
        <XAxis dataKey="name" stroke="#9A9AA5" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis stroke="#9A9AA5" fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1C1C24', border: 'none', fontSize: '10px', borderRadius: '8px' }} 
          itemStyle={{ color: '#D4AF37' }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar dataKey="amount" fill="#D4AF37" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
