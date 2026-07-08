export default function ExchangeRateSummary() {
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] flex justify-between items-center shadow-lg">
            <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">USD / EUR</p>
                <p className="text-sm font-semibold text-white mt-1">0.9250</p>
                <p className="text-[9px] text-[#71717A] mt-0.5">Live market mid-point rate</p>
            </div>
            <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">USD / GBP</p>
                <p className="text-sm font-semibold text-white mt-1">0.7820</p>
                <p className="text-[9px] text-[#71717A] mt-0.5">Live market mid-point rate</p>
            </div>
        </div>
    );
}
