import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, User,
  ExternalLink, Lock, BadgeCheck, Key, Mail,
  Eye, Database, Loader2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPermissionPageProps {
  /** The app / client name requesting login */
  clientId: string;
  /** Human-readable app name (falls back to clientId) */
  appName?: string;
  /** The user's display name */
  userName?: string;
  /** The user's email */
  userEmail?: string;
  /** OAuth scopes requested (e.g. ['profile', 'email', 'wallet:read']) */
  scopes?: string[];
  /** Where to send the user after Allow */
  redirectUri?: string;
  /** Called when user clicks Allow */
  onAllow: () => void;
  /** Called when user clicks Deny */
  onDeny: () => void;
}

// ── Scope metadata ─────────────────────────────────────────────────────────
const SCOPE_META: Record<string, { label: string; description: string; icon: React.ElementType; risk: 'low' | 'medium' }> = {
  profile: {
    label: 'Basic Profile',
    description: 'Read your display name and avatar.',
    icon: User,
    risk: 'low',
  },
  email: {
    label: 'Email Address',
    description: 'Read your registered email address.',
    icon: Mail,
    risk: 'low',
  },
  'wallet:read': {
    label: 'Wallet Balance (Read-Only)',
    description: 'View your wallet balances. Cannot initiate transfers.',
    icon: Eye,
    risk: 'low',
  },
  'wallet:history': {
    label: 'Transaction History',
    description: 'Read your past transaction records.',
    icon: Database,
    risk: 'medium',
  },
  openid: {
    label: 'OpenID Connect',
    description: 'Verify your identity via a signed JWT token.',
    icon: Key,
    risk: 'low',
  },
};

const DEFAULT_SCOPES = ['openid', 'profile', 'email'];

function ScopeRow({ scopeKey }: { scopeKey: string }) {
  const meta = SCOPE_META[scopeKey] ?? {
    label: scopeKey,
    description: `Access the "${scopeKey}" scope.`,
    icon: Key,
    risk: 'medium' as const,
  };
  const Icon = meta.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3"
    >
      <div className="mt-0.5 p-1.5 rounded-lg bg-[#1A1A24] border border-[#27272A]">
        <Icon size={13} className={meta.risk === 'medium' ? 'text-amber-400' : 'text-[#3EC6C0]'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">{meta.label}</span>
          {meta.risk === 'medium' && (
            <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">
              Sensitive
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#71717A] leading-relaxed mt-0.5">{meta.description}</p>
      </div>
      <span className="mt-1 text-[#D4AF37]">
        <CheckCircle2 size={13} />
      </span>
    </motion.li>
  );
}

export default function LoginPermissionPage({
  clientId,
  appName,
  userName = 'Chain Hook User',
  userEmail,
  scopes = DEFAULT_SCOPES,
  redirectUri,
  onAllow,
  onDeny,
}: LoginPermissionPageProps) {
  const displayName = appName || clientId;
  const [status, setStatus] = useState<'consent' | 'processing' | 'success'>('consent');

  const handleAllow = () => {
    setStatus('processing');
    // Simulate a short processing window before granting
    setTimeout(() => {
      setStatus('success');
      setTimeout(onAllow, 2000);
    }, 1800);
  };

  // Initials from clientId / appName for the app avatar
  const initials = displayName
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  // User initials
  const userInitials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#3EC6C0]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] w-72 h-72 bg-purple-500/3 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* ── CONSENT SCREEN ─────────────────────────────────── */}
        {status === 'consent' && (
          <motion.div
            key="consent"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-[480px] rounded-3xl border border-[#27272A] bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#3EC6C0] to-[#D4AF37]" />

            <div className="p-8 space-y-6">
              {/* ── Header ── */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
                    <ShieldCheck size={13} />
                    OAuth 2.0 Login Authorization
                  </div>
                  <h1 className="text-xl font-bold tracking-tight">Consent Request</h1>
                </div>
                {/* Logged-in user chip */}
                <div className="flex items-center gap-2 bg-[#16161D] px-3 py-1.5 rounded-xl border border-[#27272A] shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] text-[9px] font-bold">
                    {userInitials || 'U'}
                  </div>
                  <span className="text-[10px] font-medium text-[#D4AF37] max-w-[90px] truncate">{userName}</span>
                </div>
              </div>

              {/* ── App → Wallet connection graphic ── */}
              <div className="flex items-center gap-3 p-4 bg-[#0E0E16] border border-[#27272A] rounded-2xl">
                {/* App avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#3EC6C0]/20 border border-[#27272A] flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {initials || '?'}
                </div>

                {/* Arrows */}
                <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-[#D4AF37]/40" />
                  <div className="p-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    <Key size={12} className="text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-[#3EC6C0]/40 via-[#3EC6C0]/40 to-transparent" />
                </div>

                {/* Chain Hook avatar */}
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A24] border border-[#27272A] flex items-center justify-center shrink-0">
                  <img
                    src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png"
                    alt="Chain Hook"
                    className="h-7 w-auto object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* ── App details card ── */}
              <div className="bg-[#121217] rounded-2xl border border-[#27272A] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#27272A] bg-[#15151D]/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block">Requesting Application</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-bold text-white">{displayName}</span>
                      <BadgeCheck size={15} className="text-[#3EC6C0]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ● Verified
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">Client ID</span>
                    <span className="font-mono text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10 text-[10px]">
                      {clientId}
                    </span>
                  </div>
                  {redirectUri && (
                    <div className="flex items-center justify-between text-xs gap-4">
                      <span className="text-[#71717A] shrink-0">Redirect URI</span>
                      <span className="font-mono text-[#A1A1AA] text-[10px] truncate text-right">{redirectUri}</span>
                    </div>
                  )}
                  {userEmail && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#71717A]">Logged-in as</span>
                      <span className="text-[#A1A1AA] text-[10px]">{userEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Scopes ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#71717A]">
                    Requested Permissions
                  </span>
                  <span className="text-[9px] text-[#71717A] bg-[#1A1A24] border border-[#27272A] px-2 py-0.5 rounded-full">
                    {scopes.length} scope{scopes.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="space-y-3 bg-[#0E0E16] border border-[#27272A] rounded-2xl p-4">
                  {scopes.map((s) => (
                    <React.Fragment key={s}>
                      <ScopeRow scopeKey={s} />
                    </React.Fragment>
                  ))}
                </ul>
              </div>

              {/* ── Security notice ── */}
              <div className="p-3.5 bg-[#16161D] border border-[#27272A] rounded-xl flex gap-3 items-start">
                <Lock size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#71717A] leading-relaxed">
                  <strong className="text-[#A1A1AA]">Security Notice:</strong> Chain Hook uses OAuth 2.0. We{' '}
                  <strong className="text-white">never</strong> share your password or private keys with third-party applications.
                  You can revoke this access at any time from your Settings.
                </p>
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-4 pt-1">
                <button
                  type="button"
                  onClick={onDeny}
                  className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
                >
                  <XCircle size={14} /> Deny
                </button>
                <button
                  type="button"
                  onClick={handleAllow}
                  className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] text-[#050508] text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/15"
                >
                  <ShieldCheck size={14} /> Allow Access
                </button>
              </div>

              <p className="text-center text-[9px] text-[#3F3F46]">
                By clicking Allow, you authorize <strong className="text-[#52525B]">{displayName}</strong> to access your
                Chain Hook account with the scopes listed above.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── PROCESSING SCREEN ──────────────────────────────── */}
        {status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-[440px] p-10 rounded-3xl border border-[#27272A] bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[30px] animate-pulse" />
              <Loader2 size={48} className="text-[#D4AF37] animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold tracking-tight">Granting Access</h2>
              <p className="text-xs text-[#D4AF37] font-mono tracking-wide uppercase">Signing OAuth token...</p>
            </div>
            <div className="w-full bg-[#121217] border border-[#27272A] p-4 rounded-2xl text-xs text-[#A1A1AA] font-mono space-y-1 text-left">
              <p>▶ Verifying client credentials...</p>
              <p>▶ Generating signed access token...</p>
              <p className="animate-pulse text-[#D4AF37]">▶ Issuing authorization code...</p>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS SCREEN ──────────────────────────────────── */}
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-[440px] p-10 rounded-3xl border border-[#3EC6C0]/30 bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#3EC6C0]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="p-4 rounded-full bg-[#3EC6C0]/15 border border-[#3EC6C0]/30 text-[#3EC6C0] shadow-lg animate-bounce">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-1 relative z-10">
              <h2 className="text-xl font-bold tracking-tight text-white">Access Granted!</h2>
              <p className="text-xs text-[#71717A]">
                <strong className="text-[#A1A1AA]">{displayName}</strong> can now access your Chain Hook account.
              </p>
            </div>

            <div className="bg-[#121217] w-full p-4 rounded-xl border border-[#27272A] space-y-2 text-left text-xs font-mono relative z-10">
              <div className="flex justify-between">
                <span className="text-[#71717A]">Status:</span>
                <span className="text-emerald-400 font-semibold">AUTHORIZED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Client ID:</span>
                <span className="text-[#D4AF37] font-semibold">{clientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Scopes:</span>
                <span className="text-white font-semibold">{scopes.join(', ')}</span>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 w-full relative z-10">
              <div className="w-7 h-7 rounded-full border-2 border-t-transparent border-[#3EC6C0] animate-spin" />
              <p className="text-[10px] text-[#A1A1AA]">Redirecting you back to the application...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
