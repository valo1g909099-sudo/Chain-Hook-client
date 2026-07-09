import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_staff && !user?.is_admin) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full text-center space-y-6">
          {}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-sm text-[#71717A] leading-relaxed">
              This area is reserved for administrators and staff members only.
              Your account does not have the required permissions to access the{' '}
              <span className="text-[#D4AF37] font-mono">OAuth Console</span>.
            </p>
          </div>

          {}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0F0F14] border border-[#1F1F23] text-xs text-[#52525B]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D4AF37] shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Contact your system administrator to request elevated access.
          </div>

          {}
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A22] border border-[#27272A] text-xs font-semibold text-[#A1A1AA] hover:text-white hover:border-zinc-600 transition-all"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
