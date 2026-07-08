import { User } from 'lucide-react';

export default function FrequentContacts() {
  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg h-[220px] flex flex-col">
      <h3 className="text-xs font-semibold text-white mb-3">Quick Contacts</h3>
      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2 hover:bg-[#1C1C24]/30 rounded-lg cursor-pointer transition-colors">
            <div className="p-1.5 bg-[#0D0D12] rounded-lg text-[#D4AF37]"><User size={14} /></div>
            <p className="text-[11px] text-[#A1A1AA]">Contact {i}894</p>
          </div>
        ))}
      </div>
    </div>
  );
}
