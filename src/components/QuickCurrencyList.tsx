export default function QuickCurrencyList() {
    const pairs = [
        { pair: 'GBP/JPY', change: '+0.12%' },
        { pair: 'EUR/USD', change: '-0.05%' },
    ];
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-3 rounded-2xl border border-[#1C1C24] shadow-lg">
            <h3 className="text-[11px] font-semibold text-white mb-2">Quick Look</h3>
            <ul className="space-y-1">
                {pairs.map((item, i) => (
                    <li key={i} className="flex justify-between text-[10px]">
                        <span className="text-[#A1A1AA] font-mono">{item.pair}</span>
                        <span className={item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{item.change}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
