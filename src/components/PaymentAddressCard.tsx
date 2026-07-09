import { useState } from 'react';
import { Copy, Check, QrCode, TrendingUp, Info } from 'lucide-react';

export default function PaymentAddressCard() {
  const [copied, setCopied] = useState(false);
  const paymentAddress = 'CH-WAL-9082-1422-9841';

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-5 rounded-2xl border border-[#1C1C24] shadow-lg flex flex-col justify-between space-y-4">
      {}
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-white tracking-wide uppercase">My Payment Address</h3>
        <span className="text-[9px] text-[#3EC6C0] bg-[#3EC6C0]/10 border border-[#3EC6C0]/20 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {}
      <div className="space-y-2">
        <div className="bg-[#0D0D12] border border-[#27272A] rounded-xl p-3 flex justify-between items-center group hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[9px] text-[#71717A] uppercase tracking-wider block">Wallet Address</span>
            <code className="text-xs font-semibold text-[#D4AF37] font-mono tracking-wider">
              {paymentAddress}
            </code>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-[#1C1C24] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors"
            title="Copy address"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 items-center">
        {}
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl aspect-square shadow-inner relative group cursor-pointer border border-[#1C1C24] hover:scale-[1.02] transition-transform duration-300">
        
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
              <QrCode size={10} /> Expand QR
            </span>
          </div>
        </div>

        {}
        <div className="bg-[#0D0D12] border border-[#27272A] rounded-xl p-3 h-full flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="absolute -right-3 -top-3 w-10 h-10 bg-[#D4AF37]/5 rounded-full blur-md"></div>
          <div className="flex items-center gap-1 text-[9px] text-[#A1A1AA] uppercase tracking-wider">
            <TrendingUp size={10} className="text-[#D4AF37]" />
            <span>USD / JYP</span>
          </div>
          <div className="my-1.5">
            <div className="text-lg font-bold font-mono text-white tracking-tight">0.9250</div>
            <div className="text-[8px] text-[#3EC6C0] font-medium flex items-center gap-0.5">
              <span>● Live market rate</span>
            </div>
          </div>
          <div className="text-[8px] text-[#71717A] leading-tight flex items-start gap-1">
            <Info size={8} className="shrink-0 mt-0.5" />
            <span>Live market mid-point rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
