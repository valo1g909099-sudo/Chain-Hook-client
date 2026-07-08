import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowLeftRight, RefreshCw, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import LiveRates from './LiveRates';
import ExchangeHistory from './ExchangeHistory';
import CurrencyTrendChart from './CurrencyTrendChart';
import RateAlerts from './RateAlerts';
import FeeCalculator from './FeeCalculator';
import MarketHighlights from './MarketHighlights';
import MarketSentiment from './MarketSentiment';
import QuickCurrencyList from './QuickCurrencyList';
import { walletService } from '@/services/walletService';


interface Balances {
  usd: number;
  eur: number;
  gbp: number;
  jpy: number;
}

interface TransactionItem {
  entity: string;
  date: string;
  method: string;
  amount: string;
  status: string;
}

interface OutletContextType {
  balances: Balances;
  setBalances: React.Dispatch<React.SetStateAction<Balances>>;
  transactions: TransactionItem[];
  setTransactions: React.Dispatch<React.SetStateAction<TransactionItem[]>>;
}

const RATES: Record<string, Record<string, number>> = {
  USD: { USD: 1, EUR: 0.925, GBP: 0.785, JPY: 154.20 },
  EUR: { USD: 1.08, EUR: 1, GBP: 0.85, JPY: 166.70 },
  GBP: { USD: 1.27, EUR: 1.18, GBP: 1, JPY: 196.40 },
  JPY: { USD: 0.0065, EUR: 0.0060, GBP: 0.0051, JPY: 1 }
};

const SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

export default function Convert() {
  const { balances, setBalances, setTransactions } = useOutletContext<OutletContextType>();
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState<'usd' | 'eur' | 'gbp' | 'jpy'>('usd');
  const [toCurrency, setToCurrency] = useState<'usd' | 'eur' | 'gbp' | 'jpy'>('eur');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{
    fromAmount: string;
    toAmount: string;
    rate: string;
  } | null>(null);

  const fromSymbol = SYMBOLS[fromCurrency.toUpperCase()];
  const toSymbol = SYMBOLS[toCurrency.toUpperCase()];
  const currentBalance = balances[fromCurrency];

  const rate = RATES[fromCurrency.toUpperCase()][toCurrency.toUpperCase()];
  const numericAmount = parseFloat(amount) || 0;
  
  // Calculate conversion fee: 0.4% or flat flat flat flat rate (flat 2 units or min 1)
  const feePercent = 0.004;
  const rawConverted = numericAmount * rate;
  const feeAmount = numericAmount * feePercent;
  const finalConverted = Math.max(0, (numericAmount - feeAmount) * rate);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setSuccessState(null);
    setErrorMsg(null);
  };

  const handleConvert = async () => {
    setErrorMsg(null);
    setSuccessState(null);

    if (numericAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than zero.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setErrorMsg('Source and target currencies must be different.');
      return;
    }

    if (currentBalance < numericAmount) {
      setErrorMsg(`Insufficient funds in your ${fromCurrency.toUpperCase()} Wallet.`);
      return;
    }

    try {
      // Process conversion on the backend
      const res = await walletService.convert(fromCurrency.toUpperCase(), toCurrency.toUpperCase(), numericAmount);
      
      // Update front-end balances with the returned wallet balances
      setBalances({
        usd: parseFloat(res.wallet.USD as string) || 0,
        eur: parseFloat(res.wallet.EUR as string) || 0,
        gbp: parseFloat(res.wallet.GBP as string) || 0,
        jpy: parseFloat(res.wallet.JPY as string) || 0,
      });

      // Refetch transactions from backend
      const txs = await walletService.getTransactions();
      setTransactions(txs);

      const formattedFrom = `${fromSymbol}${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const formattedTo = `${toSymbol}${res.converted_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      setSuccessState({
        fromAmount: formattedFrom,
        toAmount: formattedTo,
        rate: `1 ${fromCurrency.toUpperCase()} = ${res.rate.toFixed(4)} ${toCurrency.toUpperCase()}`
      });
      setAmount('0');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete currency conversion.');
    }
  };

  useEffect(() => {
    setErrorMsg(null);
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversion Form Card */}
        <div className="lg:col-span-1 glass p-5 rounded-2xl border border-[#1C1C24] bg-[#1C1C24]/20 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Convert Funds</h3>
                  <p className="text-[10px] text-[#A1A1AA] font-mono">
                    Balance: {fromSymbol}{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
              </div>

              {successState ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-3 my-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Conversion Successful</h4>
                    <p className="text-[10px] text-[#71717A] mt-1">
                      Swapped {successState.fromAmount} to {successState.toAmount}
                    </p>
                    <p className="text-[9px] text-[#D4AF37] font-mono mt-0.5">
                      Rate: {successState.rate}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSuccessState(null)}
                    className="w-full py-1.5 bg-[#1C1C24] hover:bg-[#27272A] rounded-lg text-[10px] font-semibold text-white transition-colors"
                  >
                    Convert More
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-white font-bold text-lg">{fromSymbol}</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      className="w-full bg-[#0D0D12] rounded-xl p-3.5 pl-8 text-lg font-bold text-white border border-[#27272A] focus:border-[#D4AF37]/50 outline-none" 
                    />
                    <button 
                      onClick={() => setAmount(currentBalance.toFixed(2))} 
                      className="absolute right-3.5 top-3.5 text-[9px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
                    >
                      MAX
                    </button>
                  </div>

                  {/* Currency Selectors & Swap Button */}
                  <div className="flex items-center justify-between gap-3 bg-[#0D0D12] border border-[#27272A] p-2 rounded-xl">
                    <div className="relative flex-1">
                      <select 
                        value={fromCurrency} 
                        onChange={(e) => setFromCurrency(e.target.value as any)}
                        className="w-full bg-transparent pl-3 pr-8 py-2 text-xs font-bold text-white appearance-none outline-none cursor-pointer"
                      >
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="gbp">GBP</option>
                        <option value="jpy">JPY</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-3 text-[#71717A] pointer-events-none" />
                    </div>

                    <button 
                      onClick={swapCurrencies}
                      className="p-2 bg-[#1C1C24] hover:bg-[#27272A] rounded-xl text-[#D4AF37] hover:scale-105 active:scale-95 transition-all"
                      title="Swap currencies"
                    >
                      <ArrowLeftRight size={12} />
                    </button>

                    <div className="relative flex-1">
                      <select 
                        value={toCurrency} 
                        onChange={(e) => setToCurrency(e.target.value as any)}
                        className="w-full bg-transparent pl-3 pr-8 py-2 text-xs font-bold text-white appearance-none outline-none cursor-pointer"
                      >
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="gbp">GBP</option>
                        <option value="jpy">JPY</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-3 text-[#71717A] pointer-events-none" />
                    </div>
                  </div>

                  {/* Rate Detail Box */}
                  <div className="bg-[#0D0D12] p-3.5 rounded-xl border border-[#1F1F23]/80 space-y-2.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#9A9AA5]">Exchange Rate</span>
                        <span className="text-white font-mono font-semibold">
                          1 {fromCurrency.toUpperCase()} = {rate.toFixed(4)} {toCurrency.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#9A9AA5]">Fee (0.4%)</span>
                        <span className="text-white font-mono font-semibold">
                          {fromSymbol}{feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] border-t border-[#1F1F23]/80 pt-2">
                        <span className="text-[#D4AF37] font-semibold">You Will Receive</span>
                        <span className="text-[#3EC6C0] font-mono font-bold">
                          {toSymbol}{finalConverted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-xl flex items-start gap-1.5">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button 
                    onClick={handleConvert}
                    className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0A0A0B] py-3 rounded-xl font-bold text-xs hover:bg-[#B8962E] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/10"
                  >
                    <RefreshCw size={12} className="animate-spin-slow" /> Convert Funds
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-[#A1A1AA] pt-2">
                <AlertCircle size={10} className="text-[#D4AF37]"/>
                <span>Real-time instant settlements, average delivery 1-3 seconds.</span>
            </div>
        </div>
        
        {/* Right side content */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiveRates />
            <ExchangeHistory />
            <CurrencyTrendChart />
            <RateAlerts />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FeeCalculator />
        <MarketHighlights />
        <MarketSentiment />
        <QuickCurrencyList />
      </div>
    </div>
  );
}
