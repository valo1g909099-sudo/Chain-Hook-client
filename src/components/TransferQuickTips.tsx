import { ShieldAlert } from 'lucide-react';
export default function TransferQuickTips() {
  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] flex items-start gap-3 shadow-lg">
        <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
            <ShieldAlert size={18}/>
        </div>
        <div>
            <p className="text-xs font-semibold text-white">Security & Verification Tip</p>
            <p className="text-[10px] text-[#A1A1AA] mt-1 leading-relaxed">
                Always verify the recipient's wallet ID and confirm the transaction details before finalizing. 
                Our platform will never ask for your private keys.
            </p>
        </div>
    </div>
  );
}
