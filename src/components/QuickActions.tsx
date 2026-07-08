import { Send, ArrowDownToLine, Plus, MoreHorizontal, Search } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { label: 'Send', icon: <Send size={16} /> },
    { label: 'Request', icon: <ArrowDownToLine size={16} /> },
    { label: 'Top-up', icon: <Plus size={16} /> },
    { label: 'More', icon: <MoreHorizontal size={16} /> },
  ];

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1C1C24]/30 border border-[#27272A] rounded-2xl">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-2.5 text-[#52525B]" size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#0D0D12] border border-[#27272A] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#D4AF37]/50 transition-all"
        />
      </div>
      <div className="flex gap-2">
        {actions.map((action) => (
          <button key={action.label} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1C1C24] border border-[#27272A] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300">
              {action.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
