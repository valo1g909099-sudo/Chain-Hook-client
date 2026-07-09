import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onLogin: () => void;
  oauthNotice?: {
    merchantName: string;
    amount: string;
  };

  clientId?: string;
}

export default function LoginPage({ onLogin, oauthNotice, clientId }: LoginPageProps) {
  const { login, register, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setFormError('Passwords do not match.');
          return;
        }
        await register(name, email, password);
        onLogin();
      } else {
        const clientRedirect = await login(email, password, clientId);
        if (clientRedirect?.redirect_url) {
          window.location.href = clientRedirect.redirect_url;
          return;
        }
        onLogin();
      }
    } catch {

    }
  };

  const displayError = formError || error;

  const FeaturePillars = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-850 transition-all">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
          <ShieldCheck size={16} />
        </div>
        <div>
          <h4 className="text-xs font-medium text-white mb-0.5">Zero-Trust Encrypted</h4>
          <p className="text-[10px] text-zinc-500 leading-normal">Every session and endpoint transaction is secure and signature-verified.</p>
        </div>
      </div>

      <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-850 transition-all">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#3EC6C0]">
          <Sparkles size={16} />
        </div>
        <div>
          <h4 className="text-xs font-medium text-white mb-0.5">Instant FX Swaps</h4>
          <p className="text-[10px] text-zinc-500 leading-normal">Instantly swap and hold major world currencies without settlement lag.</p>
        </div>
      </div>
    </div>
  );

  const StatsRow = () => (
    <div className="flex items-center justify-between gap-6 lg:gap-10 text-zinc-500 text-xs w-full flex-nowrap">
      <div className="flex gap-6 lg:gap-8 shrink-0">
        <div>
          <div className="text-white font-medium text-sm">100%</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">API Uptime</div>
        </div>
        <div>
          <div className="text-white font-medium text-sm">&lt; 5ms</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Settlement Latency</div>
        </div>
        <div>
          <div className="text-white font-medium text-sm">$10B+</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Volume Managed</div>
        </div>
      </div>
      <div className="shrink-0 whitespace-nowrap">
        <span>© 2024 Chain Hook Inc.</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col lg:flex-row text-white relative overflow-hidden font-sans">
      {}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>

      {}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden min-h-[45vh] lg:min-h-screen">
        {}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-[#3EC6C0]/5 rounded-full blur-[100px] pointer-events-none"></div>

        {}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png"
            alt="Chain Hook Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="h-6 w-[1px] bg-zinc-800"></div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Chain Hook Wallet</span>
        </div>

        {}
        <div className="relative z-10 my-auto py-12 max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online: v2.4.1 Secure Gateway
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight"
          >
            The new standard for <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3D77A] to-[#3EC6C0] bg-clip-text text-transparent">digital asset management</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-zinc-400 leading-relaxed font-light"
          >
            Manage multi-currency ledger balances, issue secure payment authorizations, and deploy merchant sandbox simulations with global compliance baked right into the protocol.
          </motion.p>

          {}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:block"
          >
            <FeaturePillars />
          </motion.div>
        </div>

        {}
        <div className="relative z-10 border-t border-zinc-900 pt-6 hidden lg:flex">
          <StatsRow />
        </div>
      </div>

      {}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-12 bg-[#08080C] border-t lg:border-t-0 lg:border-l border-zinc-900/60 relative z-10">
        <div className="absolute top-[30%] right-[-10%] w-72 h-72 bg-[#3EC6C0]/5 rounded-full blur-[90px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] space-y-6"
        >
          {}
          {oauthNotice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex gap-3 items-start relative overflow-hidden shadow-inner"
            >
              <div className="absolute top-[-20%] left-[-20%] w-16 h-16 bg-[#D4AF37]/10 rounded-full blur-[20px]"></div>
              <Sparkles size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="relative z-10 space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Secure Checkout Gateway</h4>
                <p className="text-[10px] text-[#A1A1AA] leading-normal">
                  To complete your purchase of <strong className="text-white font-mono">{oauthNotice.amount}</strong> at <strong>{oauthNotice.merchantName}</strong>, sign in to your secure Chain Hook account below.
                </p>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {oauthNotice ? "Secure OAuth Login" : (isSignUp ? "Create your account" : "Welcome back")}
            </h1>
            <p className="text-xs text-zinc-400">
              {oauthNotice ? `Authorize third-party payment requests securely.` : (isSignUp ? "Get started in seconds with a developer wallet account." : "Access your secure portal and settings.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-3 rounded-xl text-sm border border-zinc-800/80 focus:border-[#D4AF37]/50 focus:outline-none transition-all duration-200"
                  placeholder="Alex Morgan"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121218] text-white pl-11 pr-4 py-3 rounded-xl text-sm border border-zinc-800/80 focus:border-[#D4AF37]/50 focus:outline-none transition-all duration-200"
                  placeholder="alex.morgan@chainhook.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121218] text-white pl-11 pr-11 py-3 rounded-xl text-sm border border-zinc-800/80 focus:border-[#D4AF37]/50 focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-3 rounded-xl text-sm border border-zinc-800/80 focus:border-[#D4AF37]/50 focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {displayError && <p className="text-xs text-rose-500 text-center">{displayError}</p>}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
                  <input type="checkbox" className="rounded border-zinc-800 bg-[#121218] text-[#D4AF37] focus:ring-0 focus:ring-offset-0" />
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] text-[#050508] font-bold py-3.5 rounded-xl text-sm transition-all duration-300 mt-6 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/10 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormError(null);
                clearError();
              }}
              className="w-full text-center text-xs text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create Account"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 flex gap-3 items-start mt-6">
            <ShieldCheck size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-white mb-0.5">Secure Gateway</h3>
              <p className="text-[11px] text-zinc-500 leading-normal">Ensure you are connecting to `chainhook.com` prior to inputting any credentials or API authorization codes.</p>
            </div>
          </div>

          {}
          <div className="lg:hidden pt-6 mt-6 border-t border-zinc-900">
            <FeaturePillars />
          </div>
        </motion.div>
      </div>

      {}
      <div className="lg:hidden w-full bg-[#08080C] border-t border-zinc-900/60 px-6 py-6 relative z-10">
        <StatsRow />
      </div>
    </div>
  );
}
