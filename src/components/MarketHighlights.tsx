export default function MarketHighlights() {
    const highlights = [
        "USD strength continues against EUR.",
        "Market volatility expected on Friday.",
        "New central bank policies announced."
    ];

    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-3 rounded-2xl border border-[#1C1C24] shadow-lg">
            <h3 className="text-[11px] font-semibold text-white mb-2">Market Highlights</h3>
            <ul className="list-disc list-inside space-y-1 text-[9px] text-[#A1A1AA]">
                {highlights.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
