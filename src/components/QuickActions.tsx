import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowDownToLine, Plus, MoreHorizontal, Search, FileText, Settings as SettingsIcon, CreditCard, ArrowLeftRight, User, Terminal } from 'lucide-react';

interface SearchItem {
  name: string;
  desc: string;
  path: string;
  category: string;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  { name: 'Send Money', desc: 'Transfer funds to other users instantly', path: '/transaction', category: 'Send' },
  { name: 'Initiate Transfer', desc: 'Start a peer-to-peer or bank transfer', path: '/transaction', category: 'Send' },
  { name: 'Quick Contacts', desc: 'View and send money to recent contacts', path: '/transaction', category: 'Send' },
  { name: 'Recent Activity', desc: 'View list of recent transactions', path: '/transaction', category: 'History' },
  { name: 'Currency Exchange', desc: 'Convert USD, EUR, GBP, JPY with live rates', path: '/convert', category: 'Exchange' },
  { name: 'Convert Funds', desc: 'Swap base currencies instantly', path: '/convert', category: 'Exchange' },
  { name: 'Exchange Rates', desc: 'Check current live forex market rates', path: '/convert', category: 'Exchange' },
  { name: 'Card Services', desc: 'Manage standard, premium, and virtual cards', path: '/cards', category: 'Cards' },
  { name: 'Virtual Cards', desc: 'Create and configure temporary virtual cards', path: '/cards', category: 'Cards' },
  { name: 'Daily Limit Usage', desc: 'View daily card spending limits', path: '/cards', category: 'Cards' },
  { name: 'Transaction History', desc: 'Browse full ledger and export statements', path: '/history', category: 'History' },
  { name: 'Export Data / Report', desc: 'Download CSV statement of your history', path: '/history', category: 'History' },
  { name: 'Account Settings', desc: 'Edit profile bio and security preferences', path: '/settings', category: 'Settings' },
  { name: 'Profile Settings', desc: 'Change account username and details', path: '/settings', category: 'Settings' },
  { name: 'Security Settings', desc: 'Configure 2FA and authentication keys', path: '/settings', category: 'Settings' },
  { name: 'Notification Settings', desc: 'Manage system alert configurations', path: '/settings', category: 'Settings' },
  { name: 'OAuth Console', desc: 'Generate test OAuth authorization flow codes', path: '/test-auth-generator', category: 'Admin' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? SEARCHABLE_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Send':
        return <Send size={12} className="text-[#D4AF37]" />;
      case 'Exchange':
        return <ArrowLeftRight size={12} className="text-[#3EC6C0]" />;
      case 'Cards':
        return <CreditCard size={12} className="text-purple-400" />;
      case 'History':
        return <FileText size={12} className="text-blue-400" />;
      case 'Settings':
        return <SettingsIcon size={12} className="text-zinc-400" />;
      case 'Admin':
        return <Terminal size={12} className="text-amber-400" />;
      default:
        return <User size={12} className="text-zinc-400" />;
    }
  };

  const handleAction = (label: string) => {
    if (label === 'Send' || label === 'Request') {
      navigate('/transaction');
    } else if (label === 'Top-up') {
      navigate('/convert');
    } else {
      navigate('/settings');
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1C1C24]/30 border border-[#27272A] rounded-2xl relative" ref={containerRef}>
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-2.5 text-[#52525B]" size={16} />
        <input
          type="text"
          placeholder="Search features, pages, components..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full bg-[#0D0D12] border border-[#27272A] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-[#D4AF37]/50 transition-all font-medium"
        />

        {showResults && filtered.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-[#0A0A0F]/95 backdrop-blur-xl border border-[#27272A] rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto divide-y divide-[#27272A]/40">
            {filtered.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setShowResults(false);
                  setQuery('');
                }}
                className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-[#1C1C24] shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[9px] text-[#71717A] truncate">{item.desc}</p>
                </div>
                <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold px-1.5 py-0.5 bg-zinc-800/40 rounded border border-zinc-700/30">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {[
          { label: 'Send', icon: <Send size={15} /> },
          { label: 'Request', icon: <ArrowDownToLine size={15} /> },
          { label: 'Top-up', icon: <Plus size={15} /> },
          { label: 'More', icon: <MoreHorizontal size={15} /> },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.label)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1C1C24] border border-[#27272A] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-sm"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
