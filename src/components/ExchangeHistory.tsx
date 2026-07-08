import { useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface OutletContextType {
  transactions: any[];
}

export default function ExchangeHistory() {
  const { transactions } = useOutletContext<OutletContextType>();
  
  // Filter for conversions
  const conversionTxs = (transactions || []).filter(tx => 
    tx.entity.toUpperCase().includes('CONVERSION') || 
    tx.method.toUpperCase().includes('FX SWAP')
  ).slice(0, 3);

  // Helper to parse amount, e.g. "-$1,000.00 (+€996.00)"
  const parseConversionAmount = (amountStr: string) => {
    const match = amountStr.match(/-([^\s]+)\s+\(\+([^\s]+)\)/);
    if (match) {
      return { from: match[1], to: match[2] };
    }
    return { from: amountStr, to: '' };
  };

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
      <h3 className="text-xs font-semibold text-white mb-3">Recent Exchange History</h3>
      <div className="space-y-2">
        {conversionTxs.length === 0 ? (
          <p className="text-[10px] text-[#71717A] italic text-center py-2">No conversion history found.</p>
        ) : (
          conversionTxs.map((tx, i) => {
            const parsed = parseConversionAmount(tx.amount);
            const parts = tx.entity.split(' ');
            const fromCur = parts[0] || '';
            const toCur = parts[2] || '';

            return (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[#0D0D12] rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-[#A1A1AA] font-mono">{parsed.from} {fromCur}</p>
                  <ArrowRight size={12} className="text-[#D4AF37]" />
                  <p className="text-[10px] text-white font-mono">{parsed.to} {toCur}</p>
                </div>
                <p className="text-[9px] text-[#9A9AA5]">{tx.date}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
