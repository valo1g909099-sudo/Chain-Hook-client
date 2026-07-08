export default function FeeCalculator() {
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
            <h3 className="text-xs font-semibold text-white mb-3">Fee Calculator</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                    <span className="text-[#A1A1AA]">Transfer Fee</span>
                    <span className="text-white">$5.00</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-[#A1A1AA]">Exchange Rate Markup</span>
                    <span className="text-white">$12.50</span>
                </div>
                <div className="border-t border-[#1C1C24] pt-2 flex justify-between text-[11px] font-semibold">
                    <span className="text-white">Total Cost</span>
                    <span className="text-[#D4AF37]">$17.50</span>
                </div>
            </div>
        </div>
    );
}
