import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  value?: string;
  change?: string;
  footer?: string;
  children: ReactNode;
}

export default function ChartCard({ title, value, change, footer, children }: ChartCardProps) {
  return (
    <div className="glass p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">{title}</p>
          {value && <p className="text-xl font-semibold text-white">{value}</p>}
        </div>
        {change && <p className={`text-[10px] font-medium ${change.startsWith('+') ? 'text-[#3EC6C0]' : 'text-[#FF6B6B]'}`}>{change}</p>}
      </div>
      <div className="h-40 w-full">
        {children}
      </div>
      {footer && <p className="text-[10px] text-[#9A9AA5] mt-3">{footer}</p>}
    </div>
  );
}
