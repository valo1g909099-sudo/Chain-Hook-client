import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Send, ArrowLeftRight, CreditCard, Settings, ShoppingBag, LogOut, Terminal } from 'lucide-react';
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
  { name: 'Merchant Sandbox', path: '/merchant-sandbox', icon: ShoppingBag,     adminOnly: false },
  { name: 'OAuth Console',    path: '/test-auth-generator', icon: Terminal,     adminOnly: true  },
  { name: 'Settings',         path: '/settings',         icon: Settings,        adminOnly: false },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const { user } = useAuth();
  const isPrivileged = !!(user?.is_staff || user?.is_admin);

  const visibleMenu = menu.filter(item => !item.adminOnly || isPrivileged);

  return (
    <aside className="w-[80px] bg-[#0D0D0F] border-r border-[#1F1F23] flex flex-col items-center py-8">
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
  );
}
