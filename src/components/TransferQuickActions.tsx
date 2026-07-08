import { QrCode, BookOpen, History } from 'lucide-react';

export default function TransferQuickActions() {
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg h-full space-y-3">
            <h3 className="text-xs font-semibold text-white">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
                <button className="flex flex-col gap-1 p-3 bg-[#0D0D12] rounded-xl text-white text-xs hover:bg-[#1C1C24] transition-colors">
                    <div className="flex items-center gap-2">
                        <QrCode size={16} className="text-[#D4AF37]"/> <span>Scan QR Code</span>
                    </div>
                    <span className="text-[9px] text-[#A1A1AA]">Instantly transfer by scanning a recipient QR code.</span>
                </button>
                <button className="flex flex-col gap-1 p-3 bg-[#0D0D12] rounded-xl text-white text-xs hover:bg-[#1C1C24] transition-colors">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-[#D4AF37]"/> <span>View My Payees</span>
                    </div>
                    <span className="text-[9px] text-[#A1A1AA]">Manage and select from your saved trusted recipients.</span>
                </button>
                <button className="flex flex-col gap-1 p-3 bg-[#0D0D12] rounded-xl text-white text-xs hover:bg-[#1C1C24] transition-colors">
                    <div className="flex items-center gap-2">
                        <History size={16} className="text-[#D4AF37]"/> <span>Scheduled Transfers</span>
                    </div>
                    <span className="text-[9px] text-[#A1A1AA]">Review and manage your recurring or future payments.</span>
                </button>
            </div>
        </div>
    );
}
