import { BarChart3, Receipt, ArrowRightLeft, Clock, FileDown } from 'lucide-react';
import { WalletAnalytics } from '@/services/walletService';

export default function TransactionSummary({ analytics }: { analytics: WalletAnalytics | null }) {
    const stats = [
        { 
            label: 'Total Volume', 
            value: analytics ? `$${analytics.total_volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$12,850.00', 
            icon: BarChart3, 
            context: 'Sum of all successful outbound fund transfers processed in the last 30 days.' 
        },
        { 
            label: 'Transactions', 
            value: analytics ? String(analytics.tx_count) : '142', 
            icon: Receipt, 
            context: 'Total count of successful transaction events within the current billing cycle.' 
        },
        { 
            label: 'Net Balance', 
            value: analytics ? `$${analytics.net_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$8,420.00', 
            icon: ArrowRightLeft, 
            context: 'Current net liquid balance across all verified accounts and sub-wallets.' 
        },
        { 
            label: 'Pending', 
            value: analytics ? String(analytics.pending_count) : '8', 
            icon: Clock, 
            context: 'Number of transactions currently under active security review or verification.' 
        },
        { 
            label: 'Export Data', 
            value: 'Report', 
            icon: FileDown, 
            action: true, 
            context: 'Generate and download a full activity CSV report for audit purposes.' 
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, i) => (
                <div key={i} className={`bg-[#1C1C24]/20 p-4 rounded-2xl border border-[#1C1C24] ${stat.action ? 'flex flex-col justify-between' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                            <stat.icon size={14} className="text-[#D4AF37]" />
                            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">{stat.label}</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="text-[9px] text-[#71717A] mt-1">{stat.context}</p>
                    {stat.action && <button className="mt-2 text-[9px] text-[#D4AF37] underline">Download CSV</button>}
                </div>
            ))}
        </div>
    );
}
