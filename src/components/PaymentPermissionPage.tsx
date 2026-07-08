import { useState, useEffect } from 'react';
import { 
    ShieldCheck, CheckCircle2, XCircle, AlertCircle, 
    User, Wallet, ExternalLink, Lock, BadgeCheck, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalletAccount {
    id: string;
    name: string;
    currency: string;
    symbol: string;
    balance: number;
    rateToUSD: number; // 1 Unit of this currency = X USD
}

interface PaymentPermissionPageProps {
    websiteName: string;
    amount: string;
    balances: {
        usd: number;
        eur: number;
        gbp: number;
        jpy: number;
    };
    onGrant: (walletType: string, finalAmount: string, finalSymbol: string) => Promise<void>;
    onDeny: () => void;
}

export default function PaymentPermissionPage({ 
    websiteName, 
    amount, 
    balances,
    onGrant, 
    onDeny 
}: PaymentPermissionPageProps) {
    const [selectedWalletId, setSelectedWalletId] = useState('usd');
    const [trustMerchant, setTrustMerchant] = useState(false);
    const [status, setStatus] = useState<'consent' | 'processing' | 'success'>('consent');
    const [processingStep, setProcessingStep] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [generatedTxId, setGeneratedTxId] = useState('');
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const usdAmountValue = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;

    const wallets: WalletAccount[] = [
        { id: 'usd', name: 'US Dollar Wallet', currency: 'USD', symbol: '$', balance: balances.usd, rateToUSD: 1.0 },
        { id: 'eur', name: 'Euro Wallet', currency: 'EUR', symbol: '€', balance: balances.eur, rateToUSD: 1.09 }, 
        { id: 'gbp', name: 'British Pound Wallet', currency: 'GBP', symbol: '£', balance: balances.gbp, rateToUSD: 1.30 },
        { id: 'jpy', name: 'Japanese Yen Wallet', currency: 'JPY', symbol: '¥', balance: balances.jpy, rateToUSD: 0.0065 }
    ];

    const activeWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];
    
    const requiredAmount = usdAmountValue / activeWallet.rateToUSD;
    const hasSufficientFunds = activeWallet.balance >= requiredAmount;

    const formattedRequiredAmount = `${activeWallet.symbol}${requiredAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedWalletBalance = `${activeWallet.symbol}${activeWallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const processingMessages = [
        'Establishing secure TLS tunnel...',
        'Authenticating merchant API credentials...',
        'Verifying account status & compliance...',
        'Checking balance, daily & monthly limits...',
        'Signing transaction with ECDSA key...',
        'Writing transaction block to ledger...'
    ];

    useEffect(() => {
        if (status === 'processing') {
            const stepInterval = setInterval(() => {
                setProcessingStep(prev => {
                    if (prev >= processingMessages.length - 1) {
                        clearInterval(stepInterval);
                        const tx = 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
                        setGeneratedTxId(tx);
                        setStatus('success');
                        return prev;
                    }
                    return prev + 1;
                });
            }, 600);

            return () => clearInterval(stepInterval);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onGrant(activeWallet.id, formattedRequiredAmount, activeWallet.symbol)
                            .catch((err: any) => {
                                const msg = err?.response?.data?.detail || err?.message || 'Payment failed after processing.';
                                setPaymentError(msg);
                                setStatus('consent');
                                setCountdown(3);
                                setProcessingStep(0);
                            });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, activeWallet, formattedRequiredAmount, onGrant]);

    const handleGrantSubmit = async () => {
        if (!hasSufficientFunds || submitting) return;
        setPaymentError(null);
        setSubmitting(true);
        try {
            await onGrant(activeWallet.id, formattedRequiredAmount, activeWallet.symbol);
        } catch (err: any) {
            const msg = err?.response?.data?.detail || err?.message || 'Payment validation failed. Please try again.';
            setPaymentError(msg);
            setSubmitting(false);
            return;
        }
    };

    return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#3EC6C0]/5 rounded-full blur-[120px]"></div>

            <AnimatePresence mode="wait">
                {/* STATUS: CONSENT SCREEN */}
                {status === 'consent' && (
                    <motion.div 
                        key="consent"
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full max-w-[500px] p-8 rounded-3xl border border-[#27272A] bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl space-y-6"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-[#27272A] pb-5">
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
                                    <ShieldCheck size={14} /> OAuth 2.0 Payment Authorization
                                </div>
                                <h1 className="text-xl font-bold tracking-tight">Consent Request</h1>
                            </div>
                            <div className="flex items-center gap-2 bg-[#16161D] px-3 py-1.5 rounded-xl border border-[#27272A]">
                                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] text-[10px] font-bold">
                                    AM
                                </div>
                                <span className="text-[10px] font-medium text-[#D4AF37]">Alex Morgan</span>
                            </div>
                        </div>

                        {/* Request Summary Card */}
                        <div className="bg-[#121217] rounded-2xl border border-[#27272A] overflow-hidden">
                            <div className="p-5 border-b border-[#27272A] flex justify-between items-center bg-[#15151D]/50">
                                <div>
                                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block">Merchant Site</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-sm font-bold text-white">{websiteName}</span>
                                        <BadgeCheck size={16} className="text-[#3EC6C0]" />
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    ● Secure Connection
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block">Requested Amount</span>
                                    <div className="text-2xl font-extrabold text-[#D4AF37] font-mono mt-0.5">
                                        {amount} <span className="text-xs font-normal text-[#71717A]">USD</span>
                                    </div>
                                </div>

                                <div className="border-t border-[#27272A] pt-4">
                                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block mb-2">Requested Scopes / Permissions</span>
                                    <ul className="text-xs space-y-2 text-[#A1A1AA]">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#D4AF37] mt-0.5">✔</span>
                                            <span>Initiate a one-time transaction charge of <strong>{amount} USD</strong>.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#D4AF37] mt-0.5">✔</span>
                                            <span>Read basic identity parameters (Name, Email, Profile Avatar).</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Selector with Conversions */}
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[#71717A] ml-1 block">
                                Select Payment Source Wallet
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {wallets.map((wallet) => (
                                    <button
                                        key={wallet.id}
                                        type="button"
                                        onClick={() => setSelectedWalletId(wallet.id)}
                                        className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all duration-300 ${
                                            selectedWalletId === wallet.id
                                                ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white'
                                                : 'border-[#27272A] bg-[#121217] text-[#A1A1AA] hover:border-[#27272A] hover:bg-[#16161D]'
                                        }`}
                                    >
                                        <span className="text-[10px] font-semibold">{wallet.currency} Wallet</span>
                                        <span className="text-xs font-bold mt-2 font-mono text-white">
                                            {wallet.symbol}{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Wallet Info Summary & Live Rate Conversion */}
                            <div className="bg-[#121217]/50 rounded-xl p-4 border border-[#27272A] flex justify-between items-center text-xs">
                                <div className="space-y-1">
                                    <span className="text-[#71717A] text-[10px] block">Final Cost in {activeWallet.currency}:</span>
                                    <span className="text-sm font-bold text-white font-mono">{formattedRequiredAmount}</span>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[#71717A] text-[10px] block">Wallet Balance:</span>
                                    <span className={`text-sm font-bold font-mono ${hasSufficientFunds ? 'text-[#3EC6C0]' : 'text-red-400'}`}>
                                        {formattedWalletBalance}
                                    </span>
                                </div>
                            </div>

                            {/* Live rates conversion detail */}
                            {activeWallet.id !== 'usd' && (
                                <p className="text-[9px] text-[#71717A] text-right italic">
                                    * Conversion rate: 1 {activeWallet.currency} = ${activeWallet.rateToUSD} USD
                                </p>
                            )}

                            {/* Insufficient Funds Warning */}
                            {!hasSufficientFunds && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2"
                                >
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Insufficient Balance</h4>
                                        <p className="text-[10px] text-red-400/80 mt-0.5">
                                            You do not have enough funds in your {activeWallet.name} to complete this checkout. Please choose another wallet.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {paymentError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs"
                                >
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Transaction Declined</h4>
                                        <p className="text-[10px] text-red-400/80 mt-0.5">{paymentError}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Security Advisory & Remember Consent */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2.5 text-xs text-[#A1A1AA] cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={trustMerchant}
                                    onChange={(e) => setTrustMerchant(e.target.checked)}
                                    className="rounded border-[#27272A] bg-[#121217] text-[#D4AF37] focus:ring-0 w-4 h-4" 
                                />
                                Trust {websiteName} for faster checkouts next time
                            </label>

                            <div className="p-3.5 bg-[#16161D] border border-[#27272A] rounded-xl flex gap-3 items-start">
                                <Lock size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                                <p className="text-[10px] text-[#71717A] leading-relaxed">
                                    <strong>Security Notice:</strong> Chain Hook uses OAuth 2.0 protocol. We never share your account login credentials, passwords, or transaction PINs with third-party merchants.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button 
                                type="button"
                                onClick={onDeny}
                                className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
                            >
                                <XCircle size={14} /> Deny Consent
                            </button>
                            <button 
                                type="button"
                                onClick={handleGrantSubmit}
                                disabled={!hasSufficientFunds || submitting}
                                className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] text-[#050508] text-xs font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#D4AF37]/15"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                {submitting ? 'Validating...' : 'Authorize Payment'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STATUS: PROCESSING SCREEN */}
                {status === 'processing' && (
                    <motion.div 
                        key="processing"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="relative w-full max-w-[450px] p-10 rounded-3xl border border-[#27272A] bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[30px] animate-pulse"></div>
                            <Loader2 size={48} className="text-[#D4AF37] animate-spin relative z-10" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-lg font-bold tracking-tight">Processing Authorization</h2>
                            <p className="text-xs text-[#D4AF37] font-mono tracking-wide uppercase">Securing transaction ledger...</p>
                        </div>

                        <div className="w-full bg-[#121217] border border-[#27272A] p-4 rounded-2xl min-h-[70px] flex items-center justify-center">
                            <motion.p 
                                key={processingStep}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-[#A1A1AA] font-mono"
                            >
                                {processingMessages[processingStep]}
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {/* STATUS: SUCCESS SCREEN */}
                {status === 'success' && (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-[450px] p-10 rounded-3xl border border-[#3EC6C0]/30 bg-[#0A0A0E]/80 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#3EC6C0]/5 rounded-full blur-[80px]"></div>

                        <div className="p-4 rounded-full bg-[#3EC6C0]/15 border border-[#3EC6C0]/30 text-[#3EC6C0] shadow-lg animate-bounce">
                            <CheckCircle2 size={40} />
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h2 className="text-xl font-bold tracking-tight text-white">Payment Authorized!</h2>
                            <p className="text-xs text-[#71717A]">Consent granted successfully to {websiteName}</p>
                        </div>

                        <div className="bg-[#121217] w-full p-4 rounded-xl border border-[#27272A] space-y-2 text-left text-xs font-mono relative z-10">
                            <div className="flex justify-between">
                                <span className="text-[#71717A]">Ledger Status:</span>
                                <span className="text-emerald-400 font-semibold">SUCCESS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#71717A]">Tx Code Hash:</span>
                                <span className="text-[#D4AF37] font-semibold">{generatedTxId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#71717A]">Amount Charged:</span>
                                <span className="text-white font-semibold">{formattedRequiredAmount}</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col items-center space-y-2 w-full relative z-10">
                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#3EC6C0] animate-spin"></div>
                            <p className="text-[10px] text-[#A1A1AA]">
                                Redirecting to merchant website in <strong className="text-[#3EC6C0] font-mono">{countdown}</strong> seconds...
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
