import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import Transaction from './components/Transaction';
import Convert from './components/Convert';
import CardService from './components/CardService';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import PaymentPermissionPage from './components/PaymentPermissionPage';
import LoginPermissionPage from './components/LoginPermissionPage';
import MerchantSandbox from './components/MerchantSandbox';
import TestAuthGenerator from './components/TestAuthGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { walletService, WalletAnalytics } from '@/services/walletService';


interface TransactionItem {
  entity: string;
  date: string;
  method: string;
  amount: string;
  status: string;
}

interface Balances {
  usd: number;
  eur: number;
  gbp: number;
  jpy: number;
}

const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  { entity: 'CloudFlare API', date: 'Oct 12, 14:22', method: 'Automated API', amount: '-$450.00', status: 'Success' },
  { entity: 'EUR Conversion', date: 'Oct 12, 09:10', method: 'Internal FX', amount: '+€2,000.00', status: 'Success' },
  { entity: 'Goldman Sachs Payout', date: 'Oct 11, 23:45', method: 'SWIFT Verified', amount: '+$12,400.00', status: 'Pending' },
  { entity: 'Stripe Payout', date: 'Oct 10, 11:20', method: 'Automated API', amount: '+$3,200.00', status: 'Success' },
  { entity: 'AWS Services', date: 'Oct 09, 10:05', method: 'Credit Card', amount: '-$120.00', status: 'Failed' },
];

const DEFAULT_BALANCES: Balances = {
  usd: 42108.45,
  eur: 12940.10,
  gbp: 8452.00,
  jpy: 154200.00,
};

// ---------------------------------------------------------
// Layout: the main shell (sidebar + header + content area)
// Wrapped in ProtectedRoute so only authenticated users see it
// ---------------------------------------------------------
function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [balances, setBalances] = useState<Balances>(() => {
    const saved = localStorage.getItem('ewallet_balances');
    return saved ? JSON.parse(saved) : DEFAULT_BALANCES;
  });

  const [transactions, setTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('ewallet_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('ewallet_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('ewallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [analytics, setAnalytics] = useState<WalletAnalytics | null>(null);

  useEffect(() => {
    let active = true;
    const fetchWalletData = async () => {
      try {
        const balData = await walletService.getBalances();
        if (!active) return;
        setBalances({
          usd: parseFloat(balData.USD as string) || 0,
          eur: parseFloat(balData.EUR as string) || 0,
          gbp: parseFloat(balData.GBP as string) || 0,
          jpy: parseFloat(balData.JPY as string) || 0,
        });

        const txData = await walletService.getTransactions();
        if (!active) return;
        setTransactions(txData);

        const analyticsData = await walletService.getAnalytics();
        if (!active) return;
        setAnalytics(analyticsData);
      } catch (err) {
        console.warn('Backend wallet API failed, falling back to local state:', err);
      }
    };
    fetchWalletData();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-[#E4E4E7]">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-8 pb-0">
          <Header onLogout={handleLogout} />
        </div>
        <div className="p-4 sm:p-8 pt-4">
          <Outlet context={{ balances, setBalances, transactions, setTransactions, analytics, setAnalytics }} />
        </div>
      </main>
    </div>
  );
}// ---------------------------------------------------------
// Unified /authorize page — handles type=login and type=payment
// Required query params: type, client_id
// Optional: merchant_name, amount, redirect_uri, scope, app_name, ...
// Validates client_id against the backend before showing consent.
// ---------------------------------------------------------

type ValidationState =
  | { status: 'loading' }
  | { status: 'valid'; client: any; payload: any }
  | { status: 'error'; reason: string; message: string; details: any; decodedPayload?: any };

function AuthorizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [balances, setBalances] = useState<Balances>(() => {
    const saved = localStorage.getItem('ewallet_balances');
    return saved ? JSON.parse(saved) : DEFAULT_BALANCES;
  });

  const [validation, setValidation] = useState<ValidationState>({ status: 'loading' });

  const clientId   = searchParams.get('client_id');
  const type       = searchParams.get('type');
  const appName    = searchParams.get('app_name') ?? searchParams.get('merchant_name') ?? undefined;
  const amount     = searchParams.get('amount') ?? '$0.00';
  const redirectUri = searchParams.get('redirect_uri') ?? undefined;
  const scopeRaw   = searchParams.get('scope');
  const scopes     = scopeRaw ? scopeRaw.split(',').map(s => s.trim()).filter(Boolean) : undefined;

  // ── Auth guard — preserve ALL query params through login ─
  if (!isAuthenticated) {
    return <Navigate to={`/login${window.location.search}`} replace />;
  }

  // ── Validate client_id against backend on mount ──────────
  useEffect(() => {
    if (!clientId) {
      setValidation({
        status: 'error',
        reason: 'missing_client_id',
        message: 'No client_id was provided in the authorization request.',
        details: {},
      });
      return;
    }

    // Quick local decode attempt to show payload details in error screens
    let localPayload: any = null;
    try {
      localPayload = JSON.parse(atob(clientId));
    } catch (_) {
      // Not decodable locally either
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const url = `${apiBase}/users/auth/validate-client/?client_id=${encodeURIComponent(clientId)}`;
    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (data.valid) {
          setValidation({ status: 'valid', client: data.client, payload: data.payload });
        } else {
          setValidation({
            status: 'error',
            reason: data.reason,
            message: data.message,
            details: data.details || {},
            decodedPayload: localPayload,
          });
        }
      })
      .catch(() => {
        setValidation({
          status: 'error',
          reason: 'network_error',
          message: 'Unable to reach the Chain Hook validation service. Please check that the server is running.',
          details: {},
          decodedPayload: localPayload,
        });
      });
  }, [clientId]);

  // ── Dynamically update document title and favicon based on client platform name ──
  useEffect(() => {
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    
    if (validation.status === 'valid') {
      const platformName = validation.payload?.platform_name || validation.payload?.merchant_name || 'Chain Hook';
      document.title = `${platformName} - Chain Hook Secure Gateway`;
      if (favicon) {
        favicon.href = '/assets/logo/logo.png';
      }
    } else if (validation.status === 'error') {
      document.title = 'Security Alert - Chain Hook';
      if (favicon) {
        favicon.href = '/assets/logo/logo.png';
      }
    } else {
      document.title = 'Chain Hook Secure Gateway';
      if (favicon) {
        favicon.href = '/assets/logo/logo.png';
      }
    }
    
    return () => {
      document.title = 'Chain Hook';
      if (favicon) {
        favicon.href = '/assets/logo/logo.png';
      }
    };
  }, [validation]);

  // ── Loading Spinner ──────────────────────────────────────
  if (validation.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
          <p className="text-sm text-[#71717A]">Validating client credentials…</p>
        </div>
      </div>
    );
  }

  // ── Error Layout ─────────────────────────────────────────
  if (validation.status === 'error') {
    const { reason, message, details, decodedPayload } = validation;

    const reasonMeta: Record<string, { title: string; color: string; icon: React.ReactNode }> = {
      missing_client_id: {
        title: 'Missing Client ID',
        color: 'red',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ),
      },
      decode_error: {
        title: 'Invalid Encoding',
        color: 'orange',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ),
      },
      missing_payload_fields: {
        title: 'Incomplete Payload',
        color: 'orange',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        ),
      },
      invalid_type: {
        title: 'Invalid Flow Type',
        color: 'orange',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        ),
      },
      client_name_not_found: {
        title: 'Unknown Client Application',
        color: 'red',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        ),
      },
      base_url_mismatch: {
        title: 'URL Mismatch Detected',
        color: 'red',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        ),
      },
      flow_not_permitted: {
        title: 'Flow Not Permitted',
        color: 'red',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        ),
      },
      network_error: {
        title: 'Service Unavailable',
        color: 'zinc',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        ),
      },
    };

    const meta = reasonMeta[reason] || {
      title: 'Authorization Failed',
      color: 'red',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    };

    const c = meta.color;
    const borderColor   = c === 'red' ? 'border-red-500/20' : c === 'orange' ? 'border-orange-500/20' : 'border-zinc-600/20';
    const topBarColor   = c === 'red' ? 'bg-red-500' : c === 'orange' ? 'bg-orange-500' : 'bg-zinc-500';
    const iconBg        = c === 'red' ? 'bg-red-500/10 border-red-500/25 text-red-400' : c === 'orange' ? 'bg-orange-500/10 border-orange-500/25 text-orange-400' : 'bg-zinc-700/30 border-zinc-600/25 text-zinc-400';
    const glowBg        = c === 'red' ? 'bg-red-500/5' : c === 'orange' ? 'bg-orange-500/5' : 'bg-zinc-500/5';
    const accentColor   = c === 'red' ? 'text-red-400' : c === 'orange' ? 'text-orange-400' : 'text-zinc-400';
    const badgeBg       = c === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400' : c === 'orange' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-zinc-700/20 border-zinc-600/20 text-zinc-400';

    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 text-white relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className={`absolute top-[-15%] left-[-10%] w-[500px] h-[500px] ${glowBg} rounded-full blur-[160px] pointer-events-none`} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/3 rounded-full blur-[160px] pointer-events-none" />

        <div className={`w-full max-w-[520px] rounded-3xl border ${borderColor} bg-[#0A0A0E]/90 backdrop-blur-2xl shadow-2xl overflow-hidden`}>
          {/* Colored top accent bar */}
          <div className={`h-1 w-full ${topBarColor}`} />

          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-4 rounded-2xl border ${iconBg} shadow-lg`}>
                {meta.icon}
              </div>
              <div>
                <div className={`inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${badgeBg} mb-2`}>
                  <span>Chain Hook Security Gateway</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">{meta.title}</h2>
                <p className="text-xs text-[#9A9AA5] leading-relaxed mt-1.5 max-w-xs mx-auto">{message}</p>
              </div>
            </div>

            {/* ── Decoded Payload Preview (if we could decode it) ── */}
            {decodedPayload && (
              <div className="bg-[#111118] border border-[#1F1F27] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1F1F27]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Decoded Payload (for reference)</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {[
                    ['Platform', decodedPayload.platform_name],
                    ['URL', decodedPayload.platform_url],
                    ['Type', decodedPayload.type],
                    ['Merchant', decodedPayload.merchant_name],
                    ['Price', decodedPayload.total_price],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <span className="text-[#52525B] block text-[9px] uppercase tracking-widest">{label}</span>
                      <span className="text-white font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Specific Diagnostics per error reason ── */}
            <div className="bg-[#0D0D14] border border-[#1C1C24] rounded-2xl p-5 space-y-3 text-xs">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 block border-b border-[#1C1C24] pb-2.5">
                Failure Analysis
              </span>

              {reason === 'missing_client_id' && (
                <ErrorRow color={accentColor} title="No client_id parameter" desc="The authorization URL must include a ?client_id= query parameter containing a Base64-encoded JSON payload." />
              )}

              {reason === 'decode_error' && (
                <>
                  <ErrorRow color={accentColor} title="Base64 decode failed" desc="The provided client_id is not a valid Base64 string or does not contain valid JSON." />
                  {details.error && (
                    <div className="mt-2 bg-[#0A0A0F] rounded-xl p-3 font-mono text-[10px] text-[#D4AF37] border border-[#27272A]">
                      {details.error}
                    </div>
                  )}
                </>
              )}

              {reason === 'missing_payload_fields' && (
                <>
                  <ErrorRow color={accentColor} title="Payload is incomplete" desc="The decoded JSON object is missing one or more required fields." />
                  {details.missing_fields && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {details.missing_fields.map((f: string) => (
                        <span key={f} className="bg-red-500/10 border border-red-500/25 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {reason === 'invalid_type' && (
                <>
                  <ErrorRow color={accentColor} title="Unrecognized flow type" desc="The 'type' field in the payload must be exactly 'login' or 'payment'." />
                  {details.received_type && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-zinc-500">Received:</span>
                      <code className="text-[#D4AF37] font-mono bg-[#D4AF37]/5 px-2 py-0.5 rounded">{details.received_type}</code>
                    </div>
                  )}
                </>
              )}

              {reason === 'client_name_not_found' && (
                <>
                  <ErrorRow color={accentColor} title="Client not registered" desc="No active client application with this name is registered in the Chain Hook platform." />
                  {details.platform_name && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-zinc-500">Searched for:</span>
                      <code className="text-white font-mono bg-[#1C1C24] px-2 py-0.5 rounded">{details.platform_name}</code>
                    </div>
                  )}
                </>
              )}

              {reason === 'base_url_mismatch' && (
                <>
                  <ErrorRow color={accentColor} title="Base URL does not match" desc="A client with this name was found, but the platform_url in the payload does not match its registered base URL." />
                  <div className="space-y-1.5 mt-1">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">✗</span>
                      <div>
                        <span className="text-zinc-500 text-[9px] block uppercase tracking-widest">Provided URL</span>
                        <code className="text-red-300 font-mono text-[10px]">{details.provided_url}</code>
                      </div>
                    </div>
                    {details.registered_urls?.map((u: string) => (
                      <div key={u} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <div>
                          <span className="text-zinc-500 text-[9px] block uppercase tracking-widest">Registered URL</span>
                          <code className="text-emerald-300 font-mono text-[10px]">{u}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {reason === 'flow_not_permitted' && (
                <>
                  <ErrorRow color={accentColor} title="Flow type not authorized" desc="This client application is not permitted to initiate this type of authorization flow." />
                  <div className="flex gap-3 mt-1">
                    <PermBadge label="Login" allowed={details.for_login} />
                    <PermBadge label="Payment" allowed={details.for_payment} />
                  </div>
                </>
              )}

              {reason === 'network_error' && (
                <ErrorRow color={accentColor} title="Validation service unreachable" desc="The Chain Hook backend could not be contacted. Check that the server is running and CORS is configured correctly." />
              )}
            </div>

            {/* Recommendation box */}
            <div className="p-4 bg-[#13131A] rounded-2xl border border-[#1C1C24] text-[10px] text-[#71717A] leading-relaxed">
              <strong className="text-[#A1A1AA]">How to fix:</strong> Open the{' '}
              <span className="text-[#D4AF37] font-semibold cursor-pointer" onClick={() => navigate('/test-auth-generator')}>
                Developer OAuth Console
              </span>{' '}
              to generate a correctly encoded payload. Make sure the <code>platform_name</code> and <code>platform_url</code> match an active registered client in the Chain Hook system.
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/test-auth-generator')}
                className="flex-1 py-3 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:text-white hover:border-zinc-600 transition-all"
              >
                OAuth Console
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                  c === 'red'
                    ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                    : c === 'orange'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-300 hover:bg-orange-500/20'
                    : 'bg-zinc-700/20 border-zinc-600/30 text-zinc-300 hover:bg-zinc-700/30'
                }`}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Derive display values from validated payload ─────────
  const validatedPayload = validation.payload;
  const finalType        = validatedPayload?.type || type;
  const finalClientId    = clientId;
  const finalAppName     = validatedPayload?.platform_name || validatedPayload?.merchant_name || appName;
  const finalAmount      = validatedPayload?.total_price || amount;
  const finalRedirectUri = validatedPayload?.platform_url || redirectUri;

  // ── TYPE = PAYMENT ────────────────────────────────────────
  if (finalType === 'payment') {
    const merchantName = finalAppName ?? finalClientId;

    const handleGrantConsent = async (walletType: string, finalAmountPaid: string, finalSymbol: string): Promise<void> => {
      const numericAmount = parseFloat(finalAmountPaid.replace(/[^0-9.]/g, '')) || 0;
      const currency = walletType.toUpperCase() as 'USD' | 'EUR' | 'GBP' | 'JPY';

      const result = await walletService.payment(
        currency,
        numericAmount,
        merchantName,
        'Chain Hook Secure Pay'
      );

      const w = result.wallet;
      setBalances({
        usd: parseFloat(String(w.USD)) || 0,
        eur: parseFloat(String(w.EUR)) || 0,
        gbp: parseFloat(String(w.GBP)) || 0,
        jpy: parseFloat(String(w.JPY)) || 0,
      });

      const txId = result.tx_id || 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const newTx: TransactionItem = {
        entity: merchantName,
        date:
          new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
          ', ' +
          new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }),
        method: 'Chain Hook Secure Pay',
        amount: `-${finalSymbol}${numericAmount.toFixed(2)}`,
        status: 'Success',
      };
      setTransactions(prev => [newTx, ...prev]);

      if (finalRedirectUri === 'MerchantSandbox') {
        navigate(`/merchant-sandbox?payment_success=true&amount=${encodeURIComponent(finalAmountPaid)}&tx_id=${txId}`);
      } else if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}payment_success=true&amount=${encodeURIComponent(finalAmountPaid)}&tx_id=${txId}`;
      } else {
        navigate('/dashboard');
      }
    };

    const handleDenyConsent = () => {
      if (finalRedirectUri === 'MerchantSandbox') {
        navigate('/merchant-sandbox?payment_cancelled=true');
      } else if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}payment_cancelled=true`;
      } else {
        navigate('/dashboard');
      }
    };

    return (
      <PaymentPermissionPage
        websiteName={merchantName}
        amount={finalAmount}
        balances={balances}
        onGrant={handleGrantConsent}
        onDeny={handleDenyConsent}
      />
    );
  }

  // ── TYPE = LOGIN ──────────────────────────────────────────
  if (finalType === 'login') {
    const handleAllow = () => {
      if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}status=success&email=${encodeURIComponent(user?.email || '')}`;
      } else {
        navigate('/dashboard');
      }
    };

    const handleDeny = () => {
      if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}error=access_denied`;
      } else {
        navigate('/dashboard');
      }
    };

    return (
      <LoginPermissionPage
        clientId={finalClientId || 'client_unknown'}
        appName={finalAppName}
        userName={user?.name ?? 'Chain Hook User'}
        userEmail={user?.email ?? undefined}
        scopes={scopes}
        redirectUri={finalRedirectUri}
        onAllow={handleAllow}
        onDeny={handleDeny}
      />
    );
  }

  // ── Unknown type fallback ─────────────────────────────────
  return <Navigate to="/dashboard" replace />;
}

// Small helper components used inside error layout
function ErrorRow({ color, title, desc }: { color: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`${color} font-bold mt-0.5`}>✗</span>
      <p className="leading-relaxed">
        <strong className="text-white">{title}: </strong>
        <span className="text-[#9A9AA5]">{desc}</span>
      </p>
    </div>
  );
}

function PermBadge({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold ${
      allowed
        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
        : 'bg-red-500/10 border-red-500/25 text-red-400'
    }`}>
      <span>{allowed ? '✓' : '✗'}</span>
      <span>{label}</span>
    </div>
  );
}


// ---------------------------------------------------------
// Simulated (Settings) Payment Permission page
// ---------------------------------------------------------
function SimulatedPaymentPage() {
  const navigate = useNavigate();

  const [balances, setBalances] = useState<Balances>(() => {
    const saved = localStorage.getItem('ewallet_balances');
    return saved ? JSON.parse(saved) : DEFAULT_BALANCES;
  });

  return (
    <PaymentPermissionPage
      websiteName="Simulated Merchant"
      amount="$49.99"
      balances={balances}
      onGrant={async (wallet, amt, sym) => {
        const numericAmount = parseFloat(amt.replace(/[^0-9.]/g, '')) || 0;
        const currency = wallet.toUpperCase() as 'USD' | 'EUR' | 'GBP' | 'JPY';

        const result = await walletService.payment(
          currency,
          numericAmount,
          'Simulated Merchant',
          'Mock Payment API'
        );

        const w = result.wallet;
        setBalances({
          usd: parseFloat(String(w.USD)) || 0,
          eur: parseFloat(String(w.EUR)) || 0,
          gbp: parseFloat(String(w.GBP)) || 0,
          jpy: parseFloat(String(w.JPY)) || 0,
        });

        navigate('/dashboard');
      }}
      onDeny={() => navigate('/dashboard')}
    />
  );
}



interface OutletContextType {
  balances: Balances;
  setBalances: React.Dispatch<React.SetStateAction<Balances>>;
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  analytics: WalletAnalytics | null;
  setAnalytics: React.Dispatch<React.SetStateAction<WalletAnalytics | null>>;
}

function DashboardPage() {
  const { balances, transactions, analytics } = useOutletContext<OutletContextType>();
  return <Dashboard balances={balances} transactions={transactions} analytics={analytics} />;
}

function TransactionHistoryPage() {
  const { transactions, analytics } = useOutletContext<OutletContextType>();
  return <TransactionHistory transactions={transactions} analytics={analytics} />;
}

// ---------------------------------------------------------
// Login route: redirect to /authorize (preserving all query params)
// after login when the user came from an /authorize flow.
// ---------------------------------------------------------
function LoginRoute() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId = searchParams.get('client_id');
  const type = searchParams.get('type');
  const oauth = searchParams.get('oauth');

  // Detect any OAuth/permission flow. Presence of client_id or type or oauth=true signals this.
  const hasPermissionFlow = !!clientId || type === 'login' || type === 'payment' || oauth === 'true';

  // Already authenticated → bounce straight back to /authorize with all params
  if (isAuthenticated && hasPermissionFlow) {
    return <Navigate to={`/authorize${window.location.search}`} replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Attempt to decode client_id locally for OAuth Banner notice
  let decodedPayload: any = null;
  if (clientId) {
    try {
      decodedPayload = JSON.parse(atob(clientId));
    } catch (_) {
      // Not a valid base64 JSON payload, ignore for banner
    }
  }

  const finalType = decodedPayload?.type || type;
  const finalAppName = decodedPayload?.platform_name || decodedPayload?.merchant_name || searchParams.get('app_name') || searchParams.get('merchant_name');
  const finalAmount = decodedPayload?.total_price || searchParams.get('amount') || '$0.00';

  let oauthNotice = undefined;
  if (finalType === 'payment') {
    oauthNotice = {
      merchantName: finalAppName || 'Simulated Merchant',
      amount: finalAmount,
    };
  } else if (finalType === 'login') {
    oauthNotice = {
      merchantName: finalAppName || 'Third-Party Application',
      amount: '',
    };
  }

  return (
    <LoginPage
      onLogin={() => {
        if (hasPermissionFlow) {
          navigate(`/authorize${window.location.search}`);
        } else {
          navigate('/dashboard');
        }
      }}
      oauthNotice={oauthNotice}
      clientId={clientId || undefined}
    />
  );
}

// ---------------------------------------------------------
// Root App: provides router + auth context
// ---------------------------------------------------------
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginRoute />} />
      {/* Unified permission page: ?type=login|payment&client_id=... */}
      <Route path="/authorize" element={<AuthorizePage />} />

      {/* Protected layout routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<TransactionHistoryPage />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/cards" element={<CardService />} />
        <Route path="/merchant-sandbox" element={<MerchantSandbox />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment-permission" element={<SimulatedPaymentPage />} />
        <Route path="/test-auth-generator" element={<AdminRoute><TestAuthGenerator /></AdminRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}