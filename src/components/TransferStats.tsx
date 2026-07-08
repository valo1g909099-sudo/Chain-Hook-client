import { ShieldCheck, Wallet } from 'lucide-react';

export default function TransferStats({ maxLmt = 5000, useLmt = 0 }: { maxLmt?: number; useLmt?: number }) {
  const availableLmt = Math.max(0, maxLmt - useLmt);
  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] flex flex-row gap-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
            <ShieldCheck size={20}/>
        </div>
        <div>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">Daily Transfer Limit</p>
            <p className="text-sm font-semibold text-white mt-1">${maxLmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[9px] text-[#71717A]">Maximum allowed daily transfer volume</p>
        </div>
      </div>
      <div className="w-px bg-[#1C1C24]"></div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#3EC6C0]/10 rounded-lg text-[#3EC6C0]">
            <Wallet size={20}/>
        </div>
        <div>
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">Available Limit</p>
            <p className="text-sm font-semibold text-white mt-1">${availableLmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[9px] text-[#71717A]">Current remaining capacity for today</p>
        </div>
      </div>
    </div>
  );
}
