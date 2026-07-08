import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TransactionItem {
  entity: string;
  date: string;
  method: string;
  amount: string;
  status: string;
}

export default function TransactionTable({ transactions = [] }: { transactions?: TransactionItem[] }) {
  const [filter, setFilter] = useState('All');

  // Filter transactions based on type (Credit/Debit)
  const filteredTransactions = transactions.filter(t => {
    const isDebit = t.amount.startsWith('-');
    if (filter === 'All') return true;
    if (filter === 'Sent') return isDebit;
    if (filter === 'Received') return !isDebit;
    return true;
  });

  // Limit to most recent 4 for the dashboard view
  const displayedTransactions = filteredTransactions.slice(0, 4);

  const getStatusIcon = (status: string) => {
    const norm = (status || '').toLowerCase();
    switch (norm) {
        case 'success': 
        case 'completed':
            return <CheckCircle2 className="text-[#3EC6C0]" size={10} />;
        case 'pending': 
            return <Clock className="text-[#D4AF37]" size={10} />;
        case 'failed': 
            return <XCircle className="text-red-500" size={10} />;
        default: 
            return null;
    }
  };

  const getStatusClass = (status: string) => {
    const norm = (status || '').toLowerCase();
    switch (norm) {
        case 'success':
        case 'completed':
            return 'text-[#3EC6C0] bg-[#3EC6C0]/10 border border-[#3EC6C0]/20';
        case 'pending':
            return 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20';
        case 'failed':
            return 'text-red-500 bg-red-500/10 border border-red-500/20';
        default:
            return 'text-white bg-white/10';
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Recent Transactions</h3>
            <p className="text-[10px] text-[#52525B]">Overview of your latest financial activity and status.</p>
        </div>
        <select 
          className="bg-[#0D0D12] border border-[#27272A] rounded-lg px-3 py-1 text-[10px] text-white focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Transactions</option>
          <option value="Sent">Sent (Debits)</option>
          <option value="Received">Received (Credits)</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[#9A9AA5]">
              <th className="pb-3 pl-2">Entity</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {displayedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-[#71717A] italic">
                  No transactions found matching this filter.
                </td>
              </tr>
            ) : (
              displayedTransactions.map((t, i) => {
                const isDebit = t.amount.startsWith('-');
                return (
                  <tr key={i} className="border-t border-[#1C1C24] hover:bg-[#D4AF37]/5 transition-colors">
                    <td className="py-3 pl-2 font-semibold flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDebit ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {isDebit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      </div>
                      {t.entity}
                    </td>
                    <td className="py-3 text-[#71717A]">{t.date}</td>
                    <td className="py-3 text-[#A1A1AA]">{t.method}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] inline-flex items-center gap-1 ${getStatusClass(t.status)}`}>
                        {getStatusIcon(t.status)}
                        {t.status}
                      </span>
                    </td>
                    <td className={`py-3 pr-2 text-right font-mono font-bold ${isDebit ? 'text-red-400' : 'text-[#3EC6C0]'}`}>
                      {t.amount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
