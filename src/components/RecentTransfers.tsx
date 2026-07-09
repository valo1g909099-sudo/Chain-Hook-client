import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { walletService, BackendTransaction } from '@/services/walletService';

export default function RecentTransfers() {
  const [txs, setTxs] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const data = await walletService.getTransactions();
        setTxs(data || []);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTxs();
  }, []);

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="text-[#D4AF37] animate-spin" size={16} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {txs.map((tx) => {
              const amountStr = String(tx.amount);
              const isNegative = amountStr.startsWith('-');
              return (
                <div key={tx.id} className="flex items-center justify-between p-2.5 bg-[#0D0D12] rounded-lg border border-[#27272A]/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {isNegative ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white font-medium truncate" title={tx.entity}>{tx.entity}</p>
                    </div>
                  </div>
                  <p className={`text-[10px] font-mono font-semibold ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.amount}
                  </p>
                </div>
              );
            })}
            {txs.length === 0 && (
              <p className="text-[10px] text-[#71717A] py-4 col-span-2 text-center">No recent transactions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}