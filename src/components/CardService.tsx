import { useState, useEffect } from 'react';
import { Settings, AlertTriangle, ShieldCheck, FileText, Eye } from 'lucide-react';
import ModernCard from './ModernCard';
import RecentTransactionsCard from './RecentTransactionsCard';
import { walletService } from '@/services/walletService';

export default function CardService() {
    const [cards, setCards] = useState([
        { id: 1, type: 'PREMIUM', advantage: '0% FX fees, high limits', cardNumber: '4111 2222 3333 8842', cardholderName: 'JOHN DOE', expirationDate: '08/28', cvv: '123', isFrozen: false, showDetails: false },
        { id: 2, type: 'STANDARD', advantage: 'Essential features for daily use', cardNumber: '4555 6666 7777 9999', cardholderName: 'JOHN DOE', expirationDate: '12/29', cvv: '456', isFrozen: false, showDetails: false },
        { id: 3, type: 'VIRTUAL', advantage: 'Secure for online shopping', cardNumber: '4999 0000 1111 2222', cardholderName: 'JOHN DOE', expirationDate: '01/27', cvv: '789', isFrozen: true, showDetails: false },
    ]);

    const [useLmt, setUseLmt] = useState(0);
    const [maxLmt, setMaxLmt] = useState(5000);
    const [monthlySpent, setMonthlySpent] = useState(0);

    useEffect(() => {
        const loadLimits = async () => {
            try {
                const balances = await walletService.getBalances();
                if (balances.use_lmt !== undefined) setUseLmt(balances.use_lmt);
                if (balances.max_lmt !== undefined) setMaxLmt(balances.max_lmt);
                
                const analytics = await walletService.getAnalytics();
                if (analytics && analytics.total_volume !== undefined) {
                    setMonthlySpent(analytics.total_volume);
                }
            } catch (err) {
                console.warn(err);
            }
        };
        loadLimits();
    }, []);

    const toggleFrozen = (id: number) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, isFrozen: !c.isFrozen } : c));
    };

    const toggleDetails = (id: number) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, showDetails: !c.showDetails } : c));
    };

    const dailyPercent = Math.min(100, Math.round((useLmt / (maxLmt || 1)) * 100));
    const monthlyPercent = Math.min(100, Math.round((monthlySpent / 10000000) * 100));

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#1C1C24] space-y-6 sm:space-y-8">
            <h3 className="text-sm font-semibold text-white">Usage & Limits</h3>
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-[#9A9AA5]">
                      <span>Daily Limit Usage</span>
                      <span className="text-white font-mono">${useLmt.toLocaleString()} / ${maxLmt.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[#1C1C24] rounded-full overflow-hidden">
                      <div className="h-2 bg-[#D4AF37] rounded-full" style={{width: `${dailyPercent}%`}}></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-[#9A9AA5]">
                      <span>Monthly Spent</span>
                      <span className="text-white font-mono">${monthlySpent.toLocaleString()} / $10,000,000</span>
                    </div>
                    <div className="h-2 bg-[#1C1C24] rounded-full overflow-hidden">
                      <div className="h-2 bg-[#3EC6C0] rounded-full" style={{width: `${monthlyPercent}%`}}></div>
                    </div>
                </div>
                <div className="p-4 bg-[#0D0D12] rounded-2xl text-[10px] text-[#71717A] leading-relaxed">
                    Your daily limit reset occurs in 4 hours. Ensure your upcoming transactions are within this range to avoid issues.
                </div>
            </div>
            <button className="flex items-center gap-2 text-xs text-[#D4AF37] hover:text-white transition-colors">
                <Settings size={14} /> Adjust Limits
            </button>
        </div>

        <RecentTransactionsCard />

        <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#1C1C24] space-y-6 sm:space-y-8">
            <h3 className="text-sm font-semibold text-white">Security & Status</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0D0D12] rounded-2xl">
                    <div className="p-3 bg-[#3EC6C0]/10 rounded-xl text-[#3EC6C0]"><ShieldCheck size={24}/></div>
                    <div>
                        <p className="text-xs text-white font-medium">Card Security</p>
                        <p className="text-[10px] text-[#A1A1AA]">Active | 2FA Enabled</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#0D0D12] rounded-2xl">
                    <div className="p-3 bg-[#FF6B6B]/10 rounded-xl text-[#FF6B6B]"><AlertTriangle size={24}/></div>
                    <div>
                        <p className="text-xs text-white font-medium">Recent Alerts</p>
                        <p className="text-[10px] text-[#A1A1AA]">None in the last 30 days</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#1C1C24]">
            <h3 className="text-sm font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="flex flex-col gap-3 p-6 bg-[#0D0D12] rounded-2xl text-white text-xs hover:bg-[#1C1C24] transition-colors border border-[#27272A] hover:border-[#D4AF37]/30">
                    <div className="flex items-center gap-3 text-[#D4AF37]"><FileText size={20}/> <span className="font-semibold text-sm">Statements</span></div>
                    <span className="text-[10px] text-[#A1A1AA]">Download your monthly transaction history reports. Access up to 24 months of records in PDF or CSV formats.</span>
                </button>
                <button className="flex flex-col gap-3 p-6 bg-[#0D0D12] rounded-2xl text-white text-xs hover:bg-[#1C1C24] transition-colors border border-[#27272A] hover:border-[#D4AF37]/30">
                    <div className="flex items-center gap-3 text-[#D4AF37]"><Eye size={20}/> <span className="font-semibold text-sm">Show PIN</span></div>
                    <span className="text-[10px] text-[#A1A1AA]">Securely view your card PIN for ATM and retail usage. PIN will be visible for 30 seconds only.</span>
                </button>
                <button className="flex flex-col gap-3 p-6 bg-[#0D0D12] rounded-2xl text-white text-xs hover:bg-[#1C1C24] transition-colors border border-[#27272A] hover:border-[#FF6B6B]/30">
                    <div className="flex items-center gap-3 text-[#FF6B6B]"><AlertTriangle size={20}/> <span className="font-semibold text-sm">Report Lost</span></div>
                    <span className="text-[10px] text-[#A1A1AA]">Deactivate card immediately if stolen or lost. This will permanently block the card and start the replacement process.</span>
                </button>
            </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-white">Your Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map(card => (
                <ModernCard 
                    key={card.id}
                    {...card}
                    onToggleFrozen={() => toggleFrozen(card.id)}
                    onToggleDetails={() => toggleDetails(card.id)}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
