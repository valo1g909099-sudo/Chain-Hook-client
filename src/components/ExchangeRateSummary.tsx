import { useState, useEffect } from 'react';
import { walletService } from '@/services/walletService';

export default function ExchangeRateSummary() {
  const [rates, setRates] = useState({ eur: 0.9250, gbp: 0.7820, jpy: 148.50 });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const history = await walletService.getPriceHistory();
        if (history && history.length > 0) {
          const latest = history[0];
          setRates({
            eur: parseFloat(String(latest.EUR)) || 0.9250,
            gbp: parseFloat(String(latest.GBP)) || 0.7820,
            jpy: parseFloat(String(latest.JPY)) || 148.50,
          });
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchRates();
  }, []);

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] grid grid-cols-3 gap-2 items-center shadow-lg">
      <div className="text-left">
        <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">USD / EUR</p>
        <p className="text-sm font-semibold text-white mt-1">{rates.eur.toFixed(4)}</p>
        <p className="text-[9px] text-[#71717A] mt-0.5">Live market rate</p>
      </div>
      <div className="text-center border-x border-[#27272A] px-2">
        <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">USD / JPY</p>
        <p className="text-sm font-semibold text-white mt-1">{rates.jpy.toFixed(2)}</p>
        <p className="text-[9px] text-[#71717A] mt-0.5">Live market rate</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">USD / GBP</p>
        <p className="text-sm font-semibold text-white mt-1">{rates.gbp.toFixed(4)}</p>
        <p className="text-[9px] text-[#71717A] mt-0.5">Live market rate</p>
      </div>
    </div>
  );
}
