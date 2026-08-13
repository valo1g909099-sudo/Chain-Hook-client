import ChartCard from './ChartCard';
import TransactionChart from './TransactionChart';
import TransactionTrendChart from './TransactionTrendChart';
import TransactionAreaChart from './TransactionAreaChart';
import CurrencyDistributionChart from './CurrencyDistributionChart';
import QuickActions from './QuickActions';
import AnalyticsTable from './AnalyticsTable';
import TransactionTable from './TransactionTable';
import HoldingsTable from './HoldingsTable';

export default function Dashboard({ 
  balances, 
  transactions,
  analytics = null
}: { 
  balances: { usd: number; eur: number; gbp: number; jpy: number }; 
  transactions: any[];
  analytics?: any;
}) {
  const totalAssets = analytics ? analytics.net_balance : (balances.usd + (balances.eur * 1.09) + (balances.gbp * 1.30) + (balances.jpy * 0.0065));
  const maxLmt = analytics ? analytics.max_lmt : 50000.00;
  const useLmt = analytics ? analytics.use_lmt : 0.00;

  return (
    <div className="space-y-6 bg-[#0D0D12] text-white">
      <QuickActions />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-6">
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-md">
          <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider mb-1 sm:mb-2">USD Balance</div>
          <div className="text-lg sm:text-xl font-semibold font-mono text-white truncate">
            ${balances.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#3EC6C0] mt-1">Verified account with instant withdrawal access.</div>
        </div>
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider mb-1 sm:mb-2">EUR Balance</div>
          <div className="text-lg sm:text-xl font-semibold font-mono text-white truncate">
            €{balances.eur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#9A9AA5] mt-1">
            Valued at approx ${(balances.eur * 1.09).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD.
          </div>
        </div>
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider mb-1 sm:mb-2">GBP Balance</div>
          <div className="text-lg sm:text-xl font-semibold font-mono text-white truncate">
            £{balances.gbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#9A9AA5] mt-1">
            Valued at approx ${(balances.gbp * 1.30).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD.
          </div>
        </div>
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider mb-1 sm:mb-2">JPY Balance</div>
          <div className="text-lg sm:text-xl font-semibold font-mono text-white truncate">
            ¥{balances.jpy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#9A9AA5] mt-1">
            Valued at approx ${(balances.jpy * 0.0065).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD.
          </div>
        </div>
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider mb-1 sm:mb-2">Total Assets</div>
          <div className="text-lg sm:text-xl font-semibold font-mono text-white truncate">
            ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#3EC6C0] mt-1">Consolidated value of all holdings across verified sub-accounts.</div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
        <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#3EC6C0]"></div>
             <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Market Sentiment</div>
           </div>
           <div className="text-sm font-medium text-white mb-1">Bullish Trend</div>
           <div className="text-[10px] text-[#9A9AA5]">Market indicators suggest a sustained bullish phase in major pairs for the next 24-48 hours.</div>
         </div>
         <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
             <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Portfolio Health</div>
           </div>
           <div className="text-sm font-medium text-white mb-1">Stable</div>
           <div className="text-[10px] text-[#9A9AA5]">Risk assessment indicates a stable, well-diversified profile across multiple asset classes.</div>
         </div>
         <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]"></div>
             <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Active Limit</div>
           </div>
           <div className="text-sm font-medium text-white mb-1 font-mono truncate">
             ${useLmt.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ${maxLmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
           </div>
           <div className="text-[10px] text-[#9A9AA5]">
             Daily transaction limit status. Remaining: ${(maxLmt - useLmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}.
           </div>
         </div>
         <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#3EC6C0]"></div>
             <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">Recent Alerts</div>
           </div>
           <div className="text-sm font-medium text-white mb-1">Login Alert</div>
           <div className="text-[10px] text-[#9A9AA5]">New login detected on a recognized device in a different region.</div>
         </div>
         <div className="glass p-4 sm:p-5 rounded-2xl border border-[#1C1C24] hover:border-[#D4AF37]/30 transition-all duration-300">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#3EC6C0]"></div>
             <div className="text-[10px] uppercase text-[#9A9AA5] tracking-wider">System Status</div>
           </div>
           <div className="text-sm font-medium text-white mb-1">Operational</div>
           <div className="text-[10px] text-[#9A9AA5]">All systems are currently operational with optimal performance metrics.</div>
         </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Transaction Volume" value={analytics ? `$${analytics.total_volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$26,450"} change="" footer="Daily transaction activity over the last 7 days.">
            <TransactionChart data={analytics?.daily_volumes} />
        </ChartCard>
        <ChartCard title="Market Trend" value={analytics?.market_trend && analytics.market_trend.length > 0 ? `${analytics.market_trend[analytics.market_trend.length - 1].value.toFixed(4)} EUR/USD` : "4,500 pts"} change="" footer="Currency market exchange rate fluctuations.">
            <TransactionTrendChart data={analytics?.market_trend} />
        </ChartCard>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Portfolio Growth" value={analytics ? `$${analytics.net_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$68,900"} change="" footer="Cumulative growth trajectory over the past week.">
            <TransactionAreaChart data={analytics?.portfolio_growth} />
        </ChartCard>
        <ChartCard title="Currency Distribution" footer="Currency diversification breakdown.">
            <CurrencyDistributionChart data={analytics?.currency_distribution} />
        </ChartCard>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionTable transactions={transactions} />
        <HoldingsTable data={analytics?.holdings} />
      </section>
      
      <section className="grid grid-cols-1 gap-6">
        <AnalyticsTable />
      </section>
    </div>
  );
}
