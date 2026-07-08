import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DEFAULT_DATA = [
  { name: 'USD', value: 400 },
  { name: 'EUR', value: 300 },
  { name: 'GBP', value: 200 },
  { name: 'JPY', value: 100 },
];

const COLORS = ['#D4AF37', '#3EC6C0', '#2ED573', '#FF6B6B'];

export default function CurrencyDistributionChart({ data = [] }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie 
          data={chartData} 
          cx="50%"
          cy="45%"
          innerRadius="50%" 
          outerRadius="75%" 
          dataKey="value" 
          paddingAngle={5} 
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#1C1C24', border: 'none', fontSize: '10px', borderRadius: '8px' }} 
          itemStyle={{ color: '#FFFFFF' }}
        />
        <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#9A9AA5' }}/>
      </PieChart>
    </ResponsiveContainer>
  );
}
