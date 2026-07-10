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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-4 sm:p-8 pb-0 flex-shrink-0">
          <Header onLogout={handleLogout} />
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4">
          <Outlet context={{ balances, setBalances, transactions, setTransactions, analytics, setAnalytics }} />
        </div>
      </div>
    </div>
  );
}

type ValidationState =
  | { status: 'loading' }
  | { status: 'valid'; client: any; payload: any }
  | { status: 'error'; reason: string; message: string };

type ConsentResult =
  | null
  | { kind: 'payment_success'; txId: string; displayAmount: string; rawAmount: string; merchant: string }
  | { kind: 'payment_failed'; message: string }
  | { kind: 'payment_denied'; merchant: string }
  | { kind: 'login_success'; merchant: string }
  | { kind: 'login_denied'; merchant: string };

function AuthorizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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

  const [validation, setValidation] = useState<ValidationState>({ status: 'loading' });

  // Shown after the user acts on the consent screen (grant/deny), instead
  // of redirecting silently. Fixes: "when transaction successful or failed
  // it not show any message box" — previously handleGrantConsent/handleDenyConsent
  // redirected immediately with no confirmation UI at all.
  const [consentResult, setConsentResult] = useState<ConsentResult>(null);

  const clientId   = searchParams.get('client_id');
  const type       = searchParams.get('type');
  const appName    = searchParams.get('app_name') ?? searchParams.get('merchant_name') ?? undefined;
  const amount     = searchParams.get('amount') ?? '$0.00';
  const redirectUri = searchParams.get('redirect_uri') ?? undefined;
  const scopeRaw   = searchParams.get('scope');
  const scopes     = scopeRaw ? scopeRaw.split(',').map(s => s.trim()).filter(Boolean) : undefined;

  if (!isAuthenticated) {
    return <Navigate to={`/login${window.location.search}`} replace />;
  }

  useEffect(() => {
    if (!clientId) {
      setValidation({
        status: 'error',
        reason: 'missing_client_id',
        message: 'No client_id was provided in the authorization request.',
      });
      return;
    }

    // IMPORTANT: client_id is now a server-signed token (produced by
    // GenerateClientTokenView), not a raw base64(JSON) string. It must
    // be verified against /clients/validate-token/ (ValidateClientTokenView).
    // The old /auth/validate-client/ endpoint expected raw base64 JSON
    // and has been removed from the backend — pointing at it here would
    // 400 or crash with a decode error on every real token.
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const url = `${apiBase}/users/clients/validate-token/?client_id=${encodeURIComponent(clientId)}`;

    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (data.valid) {
          setValidation({ status: 'valid', client: data.client, payload: data.payload });
        } else {
          setValidation({
            status: 'error',
            reason: data.reason || 'invalid_token',
            message: data.message || 'This authorization token is invalid.',
          });
        }
      })
      .catch(() => {
        setValidation({
          status: 'error',
          reason: 'network_error',
          message: 'Unable to reach the Chain Hook validation service. Please check that the server is running.',
        });
      });
  }, [clientId]);

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

  if (validation.status === 'error') {
    const { reason, message } = validation;

    // The backend now only ever returns 'missing_client_id' or
    // 'invalid_token' (expired / tampered / unknown client) as reasons.
    // The old fine-grained reasons (decode_error, missing_payload_fields,
    // invalid_type, client_name_not_found, base_url_mismatch,
    // flow_not_permitted) belonged to the removed base64 validator and
    // no longer apply, since the server now validates everything itself
    // before ever signing a token in GenerateClientTokenView.
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
      invalid_token: {
        title: 'Invalid Authorization Token',
        color: 'orange',
        icon: (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
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
        {}
        <div className={`absolute top-[-15%] left-[-10%] w-[500px] h-[500px] ${glowBg} rounded-full blur-[160px] pointer-events-none`} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/3 rounded-full blur-[160px] pointer-events-none" />

        <div className={`w-full max-w-[520px] rounded-3xl border ${borderColor} bg-[#0A0A0E]/90 backdrop-blur-2xl shadow-2xl overflow-hidden`}>
          {}
          <div className={`h-1 w-full ${topBarColor}`} />

          <div className="p-8 space-y-6">
            {}
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

            {}
            <div className="bg-[#0D0D14] border border-[#1C1C24] rounded-2xl p-5 space-y-3 text-xs">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 block border-b border-[#1C1C24] pb-2.5">
                Failure Analysis
              </span>

              {reason === 'missing_client_id' && (
                <ErrorRow color={accentColor} title="No client_id parameter" desc="The authorization URL must include a ?client_id= query parameter containing a signed token from the OAuth Console." />
              )}

              {reason === 'invalid_token' && (
                <ErrorRow color={accentColor} title="Token rejected by server" desc={message} />
              )}

              {reason === 'network_error' && (
                <ErrorRow color={accentColor} title="Validation service unreachable" desc="The Chain Hook backend could not be contacted. Check that the server is running and CORS is configured correctly." />
              )}
            </div>

            {}
            <div className="p-4 bg-[#13131A] rounded-2xl border border-[#1C1C24] text-[10px] text-[#71717A] leading-relaxed">
              <strong className="text-[#A1A1AA]">How to fix:</strong> Open the{' '}
              <span className="text-[#D4AF37] font-semibold cursor-pointer" onClick={() => navigate('/test-auth-generator')}>
                Developer OAuth Console
              </span>{' '}
              to generate a fresh signed token. Tokens expire after 10 minutes, so links older than that will always land here.
            </div>

            {}
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

  const validatedPayload = validation.payload;
  const finalType        = validatedPayload?.type || type;
  const finalClientId    = clientId;
  const finalAppName     = validatedPayload?.platform_name || validatedPayload?.merchant_name || appName;
  const finalAmount      = validatedPayload?.total_price || amount;
  const finalRedirectUri = validatedPayload?.platform_url || redirectUri;

  // Once the user has acted, show a result screen first — never redirect
  // silently. The "Continue" button on that screen performs the actual
  // redirect/navigation, using the values captured in consentResult.
  if (consentResult) {
    const proceedPaymentSuccess = () => {
      if (consentResult.kind !== 'payment_success') return;
      const { txId, rawAmount } = consentResult;
      if (finalRedirectUri === 'MerchantSandbox') {
        navigate(`/merchant-sandbox?payment_success=true&amount=${encodeURIComponent(rawAmount)}&tx_id=${txId}`);
      } else if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}payment_success=true&amount=${encodeURIComponent(rawAmount)}&tx_id=${txId}`;
      } else {
        navigate('/dashboard');
      }
    };

    const proceedPaymentDenied = () => {
      if (finalRedirectUri === 'MerchantSandbox') {
        navigate('/merchant-sandbox?payment_cancelled=true');
      } else if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}payment_cancelled=true`;
      } else {
        navigate('/dashboard');
      }
    };

    const proceedLoginSuccess = () => {
      if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}status=success&email=${encodeURIComponent(user?.email || '')}`;
      } else {
        navigate('/dashboard');
      }
    };

    const proceedLoginDenied = () => {
      if (finalRedirectUri) {
        const separator = finalRedirectUri.includes('?') ? '&' : '?';
        window.location.href = `${finalRedirectUri}${separator}error=access_denied`;
      } else {
        navigate('/dashboard');
      }
    };

    return (
      <ConsentResultScreen
        result={consentResult}
        onContinue={() => {
          if (consentResult.kind === 'payment_success') proceedPaymentSuccess();
          else if (consentResult.kind === 'payment_denied') proceedPaymentDenied();
          else if (consentResult.kind === 'login_success') proceedLoginSuccess();
          else if (consentResult.kind === 'login_denied') proceedLoginDenied();
        }}
        onRetry={() => setConsentResult(null)}
      />
    );
  }

  if (finalType === 'payment') {
    const merchantName = finalAppName ?? finalClientId;

    const handleGrantConsent = async (walletType: string, finalAmountPaid: string, finalSymbol: string): Promise<void> => {
      try {
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

        setConsentResult({
          kind: 'payment_success',
          txId,
          displayAmount: `${finalSymbol}${numericAmount.toFixed(2)}`,
          rawAmount: finalAmountPaid,
          merchant: merchantName,
        });
      } catch (err) {
        // This is the "when transaction ... failed it not show any message
        // box" case — a thrown/rejected walletService.payment call used to
        // have nowhere to go. Now it surfaces a proper failure screen.
        setConsentResult({
          kind: 'payment_failed',
          message: err instanceof Error ? err.message : 'The payment could not be completed. Please try again.',
        });
      }
    };

    const handleDenyConsent = () => {
      setConsentResult({ kind: 'payment_denied', merchant: merchantName });
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

  if (finalType === 'login') {
    const merchantName = finalAppName ?? finalClientId ?? 'this application';

    const handleAllow = () => {
      setConsentResult({ kind: 'login_success', merchant: merchantName });
    };

    const handleDeny = () => {
      setConsentResult({ kind: 'login_denied', merchant: merchantName });
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

  return <Navigate to="/dashboard" replace />;
}

function ConsentResultScreen({
  result,
  onContinue,
  onRetry,
}: {
  result: Exclude<ConsentResult, null>;
  onContinue: () => void;
  onRetry: () => void;
}) {
  const isSuccess = result.kind === 'payment_success' || result.kind === 'login_success';
  const isFailure = result.kind === 'payment_failed';

  const color = isSuccess ? 'emerald' : isFailure ? 'red' : 'zinc';
  const borderColor = isSuccess ? 'border-emerald-500/20' : isFailure ? 'border-red-500/20' : 'border-zinc-600/20';
  const topBarColor  = isSuccess ? 'bg-emerald-500' : isFailure ? 'bg-red-500' : 'bg-zinc-500';
  const iconBg       = isSuccess ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : isFailure ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-zinc-700/30 border-zinc-600/25 text-zinc-400';
  const glowBg       = isSuccess ? 'bg-emerald-500/5' : isFailure ? 'bg-red-500/5' : 'bg-zinc-500/5';
  const buttonColor  = isSuccess
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
    : isFailure
    ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
    : 'bg-zinc-700/20 border-zinc-600/30 text-zinc-300 hover:bg-zinc-700/30';

  let title = '';
  let message = '';
  let continueLabel = 'Continue';

  switch (result.kind) {
    case 'payment_success':
      title = 'Payment Successful';
      message = `${result.displayAmount} was sent to ${result.merchant}.`;
      continueLabel = 'Continue';
      break;
    case 'payment_failed':
      title = 'Payment Declined';
      message = result.message;
      continueLabel = 'Try Again';
      break;
    case 'payment_denied':
      title = 'Payment Cancelled';
      message = `You declined the payment request from ${result.merchant}.`;
      continueLabel = 'Continue';
      break;
    case 'login_success':
      title = 'Access Granted';
      message = `${result.merchant} has been signed in successfully.`;
      continueLabel = 'Continue';
      break;
    case 'login_denied':
      title = 'Access Denied';
      message = `You declined the login request from ${result.merchant}.`;
      continueLabel = 'Continue';
      break;
  }

  const icon = isSuccess ? (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ) : isFailure ? (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ) : (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 text-white relative overflow-hidden font-sans">
      <div className={`absolute top-[-15%] left-[-10%] w-[500px] h-[500px] ${glowBg} rounded-full blur-[160px] pointer-events-none`} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/3 rounded-full blur-[160px] pointer-events-none" />

      <div className={`w-full max-w-[480px] rounded-3xl border ${borderColor} bg-[#0A0A0E]/90 backdrop-blur-2xl shadow-2xl overflow-hidden`}>
        <div className={`h-1 w-full ${topBarColor}`} />

        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-4 rounded-2xl border ${iconBg} shadow-lg`}>
              {icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37] mb-2">
                <span>Chain Hook Security Gateway</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
              <p className="text-xs text-[#9A9AA5] leading-relaxed mt-1.5 max-w-xs mx-auto">{message}</p>
            </div>
          </div>

          {result.kind === 'payment_success' && (
            <div className="bg-[#111118] border border-[#1F1F27] rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#52525B] text-[9px] uppercase tracking-widest">Transaction ID</span>
                <span className="text-white font-mono">{result.txId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B] text-[9px] uppercase tracking-widest">Amount</span>
                <span className="text-emerald-400 font-mono font-semibold">{result.displayAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B] text-[9px] uppercase tracking-widest">Merchant</span>
                <span className="text-white font-mono">{result.merchant}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {result.kind === 'payment_failed' && (
              <button
                onClick={onRetry}
                className="flex-1 py-3 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:text-white hover:border-zinc-600 transition-all"
              >
                Back to Payment
              </button>
            )}
            <button
              onClick={onContinue}
              className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${buttonColor}`}
            >
              {continueLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId = searchParams.get('client_id');
  const type = searchParams.get('type');
  const oauth = searchParams.get('oauth');

  const hasPermissionFlow = !!clientId || type === 'login' || type === 'payment' || oauth === 'true';

  if (isAuthenticated && hasPermissionFlow) {
    return <Navigate to={`/authorize${window.location.search}`} replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // client_id is a signed, opaque token now — it cannot be decoded on
  // the client side, so we only use the plain query params here for the
  // pre-login notice. The authoritative check happens in AuthorizePage
  // via /clients/validate-token/ after the user logs in.
  const finalType = type;
  const finalAppName = searchParams.get('app_name') || searchParams.get('merchant_name');
  const finalAmount = searchParams.get('amount') || '$0.00';

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

function AppRoutes() {
  return (
    <Routes>
      {}
      <Route path="/login" element={<LoginRoute />} />
      {}
      <Route path="/authorize" element={<AuthorizePage />} />

      {}
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment-permission" element={<SimulatedPaymentPage />} />
        <Route path="/test-auth-generator" element={<AdminRoute><TestAuthGenerator /></AdminRoute>} />
      </Route>

      {}
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
