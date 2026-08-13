import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Send, ArrowLeftRight, CreditCard, Settings, LogOut, Terminal, Menu, X } from 'lucide-react';
import Logo from '@/assets/logo/logo.png';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  onLogout: () => void;
}

const menu = [
  { name: 'Dashboard',        path: '/dashboard',        icon: LayoutDashboard, adminOnly: false },
  { name: 'History',          path: '/history',          icon: Receipt,         adminOnly: false },
  { name: 'Transaction',      path: '/transaction',      icon: Send,            adminOnly: false },
  { name: 'Convert',          path: '/convert',          icon: ArrowLeftRight,  adminOnly: false },
  { name: 'Cards',            path: '/cards',            icon: CreditCard,      adminOnly: false },
  { name: 'OAuth Console',    path: '/test-auth-generator', icon: Terminal,     adminOnly: true  },
  { name: 'Settings',         path: '/settings',         icon: Settings,        adminOnly: false },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPrivileged = !!(user?.is_staff || user?.is_admin);

  const visibleMenu = menu.filter(item => !item.adminOnly || isPrivileged);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[80px] bg-[#0D0D0F] border-r border-[#1F1F23] flex-col items-center py-8 shrink-0 h-screen sticky top-0">
        <div className="mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src={Logo} alt="Chain Hook Logo" />
          </div>
        </div>

        <nav className="flex-1 w-full px-4 space-y-4">
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.name}
                className={({ isActive }) =>
                  `flex w-full justify-center items-center p-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'text-[#52525B] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
                  }`
                }
              >
                <Icon size={16} />
              </NavLink>
            );
          })}
        </nav>

        <div className="w-full px-4 mt-auto">
          <button
            onClick={onLogout}
            className="flex w-full justify-center items-center p-3 rounded-2xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header with Logo & Drawer Toggle button */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0D0D0F] border-b border-[#1F1F23] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Chain Hook Logo" className="w-7 h-7" />
          <span className="text-sm font-bold text-white tracking-wide">Chain Hook</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-xl bg-[#1C1C24] border border-[#27272A]"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col"
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className="w-[260px] max-w-[80vw] h-full bg-[#0D0D0F] border-r border-[#1F1F23] p-6 flex flex-col space-y-6 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F23]">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Chain Hook Logo" className="w-7 h-7" />
                <span className="text-sm font-bold text-white">Chain Hook</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-[#1C1C24]"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {visibleMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold ${
                        isActive
                          ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                          : 'text-[#9A9AA5] hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#1F1F23]">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

