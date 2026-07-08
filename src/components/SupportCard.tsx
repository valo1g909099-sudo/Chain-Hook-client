import { HelpCircle } from 'lucide-react';

export default function SupportCard() {
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-3 rounded-2xl border border-[#1C1C24] flex items-center gap-3 shadow-lg">
            <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                <HelpCircle size={16} />
            </div>
            <div>
                <p className="text-xs font-semibold text-white">Need Help?</p>
                <p className="text-[9px] text-[#A1A1AA] mt-0.5">Contact support team.</p>
            </div>
        </div>
    );
}
