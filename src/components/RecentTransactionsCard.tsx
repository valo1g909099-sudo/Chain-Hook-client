import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { walletService, BackendTransaction } from '@/services/walletService';

export default function RecentTransactionsCard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const txs = await walletService.getTransactions();
        setTransactions(txs.slice(0, 3));
      } catch (err) {
        console.warn(err);
      }
    };
    fetchTxs();
  }, []);

  return (
    <div className="glass p-6 rounded-3xl border border-[#1C1C24] bg-[#0D0D12] shadow-xl space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
            <button 
                onClick={() => navigate('/transactions')}
                className="flex items-center text-[10px] uppercase font-bold text-[#D4AF37] hover:text-[#D4AF37]/80"
            >
                View All <ChevronRight size={12} />
            </button>
        </div>
        
        <div className="space-y-4">
            {transactions.length === 0 ? (
                <p className="text-[10px] text-[#71717A] italic text-center py-4">No recent transactions found.</p>
            ) : (
                transactions.map(t => {
                    const isDebit = t.amount.startsWith('-');
                    return (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${!isDebit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {!isDebit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">{t.entity}</p>
                                    <p className="text-[9px] text-[#71717A] uppercase">{t.method} • {t.date}</p>
                                </div>
                            </div>
                            <p className={`text-xs font-mono font-semibold ${!isDebit ? 'text-green-400' : 'text-white'}`}>{t.amount}</p>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
}
