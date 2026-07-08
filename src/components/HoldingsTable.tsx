import { Coins } from 'lucide-react';

interface HoldingItem {
  asset: string;
  balance: number;
  value_usd: number;
}

export default function HoldingsTable({ data = [] }: { data?: HoldingItem[] }) {
  const defaultHoldings = [
    { asset: 'USD', balance: 42108.45, value_usd: 42108.45 },
    { asset: 'EUR', balance: 12940.10, value_usd: 14021.56 },
    { asset: 'GBP', balance: 8452.00, value_usd: 10800.00 },
  ];

  const holdings = data && data.length > 0 ? data : defaultHoldings;
  const total = holdings.reduce((sum, item) => sum + item.value_usd, 0);

  return (
    <div className="glass p-6 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Currency Holdings</h3>
        <p className="text-[10px] text-[#52525B]">Current distribution of your assets across different currencies.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[#9A9AA5]">
              <th className="pb-3 pl-2">Asset</th>
              <th className="pb-3">Balance</th>
              <th className="pb-3 pr-2 text-right">Value (USD)</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {holdings.map((h, i) => (
              <tr key={i} className="border-t border-[#1C1C24] hover:bg-[#D4AF37]/5 transition-colors">
                <td className="py-3 pl-2 font-semibold text-[#D4AF37] flex items-center gap-2">
                    <Coins size={14}/>
                    {h.asset}
                </td>
                <td className="py-3 font-mono">{h.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-3 pr-2 font-mono text-right">${h.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-[#27272A] text-white font-semibold">
            <tr>
              <td className="py-3 pl-2" colSpan={2}>Total Portfolio</td>
              <td className="py-3 pr-2 text-right font-mono">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
