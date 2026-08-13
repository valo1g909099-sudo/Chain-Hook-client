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
    <div className="glass p-3.5 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-end mb-3 sm:mb-4 min-w-0">
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-[#9A9AA5] tracking-wider truncate">{title}</p>
          {value && <p className="text-lg sm:text-xl font-semibold text-white truncate">{value}</p>}
        </div>
        {change && <p className={`text-[10px] font-medium shrink-0 ml-2 ${change.startsWith('+') ? 'text-[#3EC6C0]' : 'text-[#FF6B6B]'}`}>{change}</p>}
      </div>
      <div className="h-36 sm:h-40 w-full overflow-hidden">
        {children}
      </div>
      {footer && <p className="text-[10px] text-[#9A9AA5] mt-2.5 sm:mt-3">{footer}</p>}
    </div>
  );
}
