import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Settings, User, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

const ROUTE_INFO: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Welcome back, Alex Morgan',
  },
  '/history': {
    title: 'Transaction History',
    subtitle: 'Review and audit your secure financial ledger activity.',
  },
  '/transaction': {
    title: 'Send Money',
    subtitle: 'Transfer funds instantly to other wallets or verified accounts.',
  },
  '/convert': {
    title: 'Currency Exchange',
    subtitle: 'Convert between USD, EUR, and GBP with live market rates.',
  },
  '/cards': {
    title: 'Card Services',
    subtitle: 'Manage your virtual and physical cards and usage limits.',
  },
  '/merchant-sandbox': {
    title: 'Merchant Sandbox',
    subtitle: 'Test third-party checkout flows using secure Chain Hook OAuth 2.0.',
  },
  '/settings': {
    title: 'Account Settings',
    subtitle: 'Configure your profile settings, security keys, and notices.',
  },
  '/payment-permission': {
    title: 'Payment Authorization',
    subtitle: 'Review and authorize the incoming payment consent request.',
  },
};

export default function Header({ onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { title, subtitle } = ROUTE_INFO[location.pathname] ?? {
    title: location.pathname.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    subtitle: 'Manage your Chain Hook account and holdings.',
  };

  return (
    <header className="flex justify-between items-center mb-8 bg-[#0D0D12]/40 backdrop-blur-md p-6 rounded-3xl border border-[#1C1C24] relative z-40">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-[11px] text-[#9A9AA5] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          className="relative p-2.5 rounded-2xl bg-[#1C1C24] text-[#D4AF37] border border-[#27272A] hover:bg-[#27272A]/50 hover:text-white transition-all duration-300"
          aria-label="Notifications"
        >
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
          <Bell size={15} />
        </button>

        {/* Profile Card & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-[#1C1C24] hover:bg-[#27272A]/50 border border-[#27272A] hover:border-[#D4AF37]/30 transition-all duration-300 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] flex items-center justify-center font-bold text-[#0D0D12] text-xs shadow-md">
              AM
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold text-white leading-none">Alex Morgan</p>
              <p className="text-[9px] text-[#9A9AA5] mt-0.5">Pro Member</p>
            </div>
            <ChevronDown size={14} className={`text-[#71717A] transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Premium Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-52 p-2 rounded-2xl border border-[#27272A] bg-[#0A0A0E]/95 backdrop-blur-xl shadow-2xl space-y-1 text-xs"
              >
                <div className="px-3 py-2 border-b border-[#27272A] mb-1">
                  <p className="font-bold text-white">Alex Morgan</p>
                  <p className="text-[10px] text-[#71717A]">alex.morgan@chainhook.com</p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-default">
                    <User size={14} />
                    <span>View Profile</span>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Shield size={14} />
                    <span>Security Settings</span>
                  </button>
                </div>

                <div className="border-t border-[#27272A] pt-1 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut size={14} />
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
