import { User } from 'lucide-react';
export default function RecentTransfers() {
  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
      <div className="mb-3">
          <h3 className="text-xs font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-[#0D0D12] rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#1C1C24] rounded-lg text-[#D4AF37]"><User size={14} /></div>
              <div>
                <p className="text-[10px] text-white">User {i}894</p>
              </div>
            </div>
            <p className="text-[10px] text-[#FF6B6B] font-mono">-$150.00</p>
          </div>
        ))}
      </div>
    </div>
  );
}