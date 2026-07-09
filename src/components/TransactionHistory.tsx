import { useState } from 'react';
import { Search, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionSummary from './TransactionSummary';
import TransactionTrendChart from './TransactionTrendChart';

export default function TransactionHistory({ transactions = [], analytics = null }: { transactions?: any[], analytics?: any }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 6;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.entity || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.method || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                          (t.status || '').toLowerCase() === statusFilter.toLowerCase() ||
                          (statusFilter === 'Success' && (t.status || '').toLowerCase() === 'completed');
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      <TransactionSummary analytics={analytics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xs font-semibold tracking-tight text-white uppercase">Transaction History</h3>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {}
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2.5 top-2 text-[#71717A]" size={12}/>
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="pl-8 pr-3 py-1 bg-[#0D0D12] rounded-lg text-white text-[10px] border border-[#27272A] focus:border-[#D4AF37]/50 outline-none w-full sm:w-36"
                      />
                    </div>
                    {}
                    <select 
                      value={statusFilter} 
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="px-2 py-1 bg-[#0D0D12] rounded-lg text-white text-[10px] border border-[#27272A] focus:border-[#D4AF37]/50 outline-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                    {}
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-[#0D0D12] rounded-lg text-white text-[10px] border border-[#27272A] hover:border-[#D4AF37]/50 transition-colors">
                        <FileDown size={12}/> Export
                    </button>
                </div>
            </div>
            
            {}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[500px]">
                <thead className="text-[10px] text-[#52525B] uppercase border-b border-[#1F1F23]">
                    <tr>
                    <th className="px-4 py-3 font-normal">Entity / Bank</th>
                    <th className="px-4 py-3 font-normal">Date</th>
                    <th className="px-4 py-3 font-normal">Method</th>
                    <th className="px-4 py-3 font-normal">Status</th>
                    <th className="px-4 py-3 font-normal text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-[11px]">
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((t, i) => (
                      <tr key={i} className="border-b border-[#1F1F23]/50 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white font-medium">{t.entity}</td>
                          <td className="px-4 py-3 text-[#71717A]">{t.date}</td>
                          <td className="px-4 py-3 text-[#A1A1AA]">{t.method}</td>
                          <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                                  (t.status || '').toLowerCase() === 'success' || (t.status || '').toLowerCase() === 'completed' ? 'bg-[#3EC6C0]/10 text-[#3EC6C0]' :
                                  (t.status || '').toLowerCase() === 'pending' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                                  'bg-red-500/10 text-red-500'
                              }`}>
                                  {t.status}
                              </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-white font-semibold">{t.amount}</td>
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-xs text-[#52525B]">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
            
          {}
          {totalItems > 0 && (
            <div className="flex items-center justify-between border-t border-[#1F1F23] pt-4 mt-6 text-[10px] text-[#71717A]">
              <span>
                Showing <strong className="text-white">{startIndex + 1}</strong> to{' '}
                <strong className="text-white">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
                <strong className="text-white">{totalItems}</strong> entries
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="p-1.5 rounded bg-[#0D0D12] border border-[#27272A] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:hover:border-[#27272A] transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-[#D4AF37] text-[#0A0A0B] font-bold'
                        : 'bg-[#0D0D12] border border-[#27272A] text-white hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded bg-[#0D0D12] border border-[#27272A] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:hover:border-[#27272A] transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="glass rounded-xl p-6">
            <h3 className="text-xs font-medium tracking-tight mb-6">Spending Trend</h3>
            <div className="h-48">
                <TransactionTrendChart />
            </div>
        </div>
      </div>
    </div>
  );
}
