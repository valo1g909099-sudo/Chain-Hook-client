import React, { useState, useEffect } from 'react';
import { walletService } from '@/services/walletService';

export default function LiveRates() {
  const [rates, setRates] = useState([
    { pair: 'USD/EUR', rate: '0.9250' },
    { pair: 'USD/GBP', rate: '0.7820' },
    { pair: 'USD/JPY', rate: '150.32' },
  ]);

  useEffect(() => {
    let active = true;
    const fetchRates = async () => {
      try {
        const history = await walletService.getPriceHistory();
        if (!active || !history || history.length === 0) return;
        const latest = history[0];
        setRates([
          { pair: 'USD/EUR', rate: parseFloat(latest.EUR as string).toFixed(4) },
          { pair: 'USD/GBP', rate: parseFloat(latest.GBP as string).toFixed(4) },
          { pair: 'USD/JPY', rate: parseFloat(latest.JPY as string).toFixed(2) },
        ]);
      } catch (err) {
        console.warn('Failed to fetch live rates from backend:', err);
      }
    };
    fetchRates();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
      <h3 className="text-xs font-semibold text-white mb-3">Live Market Rates</h3>
      <div className="grid grid-cols-1 gap-2">
        {rates.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2 bg-[#0D0D12] rounded-lg">
            <span className="text-[10px] text-[#A1A1AA] font-mono">{item.pair}</span>
            <span className="text-[10px] text-white font-mono">{item.rate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
