import { useState, useEffect } from 'react';
import { Send, ChevronDown, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { walletService } from '@/services/walletService';

export default function TransferForm({ recipient, setRecipient, amount, setAmount, type, setType }: any) {
  const [jpyRate, setJpyRate] = useState(148.50);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const history = await walletService.getPriceHistory();
        if (history && history.length > 0) {
          setJpyRate(parseFloat(history[0].JPY as string) || 148.50);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchRate();
  }, []);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    setLoading(true);
    try {
      const res = await walletService.transfer(recipient, currency, parseFloat(amount), type);
      setSuccess(res.detail || 'Transfer completed successfully.');
      setRecipient('');
      setAmount('');
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Transfer failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-white">Initiate Transfer</h3>
        <span className="text-[9px] text-[#A1A1AA] bg-[#1C1C24] px-2 py-0.5 rounded-lg border border-[#27272A] font-mono">
          USD / JPY: <strong className="text-[#D4AF37]">{jpyRate.toFixed(2)}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Recipient Payment Address (CH-WAL-...)"
          value={recipient}
          onChange={(e) => { setRecipient(e.target.value); setError(null); setSuccess(null); }}
          className="w-full bg-[#0D0D12] border border-[#27272A] rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]/50 outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(null); setSuccess(null); }}
            className="w-full bg-[#0D0D12] border border-[#27272A] rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]/50 outline-none"
          />
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#0D0D12] border border-[#27272A] rounded-lg p-2.5 text-xs text-white appearance-none focus:border-[#D4AF37]/50 outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-[#52525B] pointer-events-none" size={14} />
          </div>
        </div>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#0D0D12] border border-[#27272A] rounded-lg p-2.5 text-xs text-white appearance-none focus:border-[#D4AF37]/50 outline-none"
          >
            <option>Peer Transfer</option>
            <option>Bank Transfer</option>
            <option>Crypto Transfer</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-[#52525B] pointer-events-none" size={14} />
        </div>
        <input
          type="text"
          placeholder="Reference / Note (optional)"
          className="w-full bg-[#0D0D12] border border-[#27272A] rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]/50 outline-none"
        />
      </div>

      {error && (
        <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px]">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
          <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full mt-3 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0A0A0B] py-2.5 rounded-lg font-semibold text-xs hover:bg-[#B8962E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        {loading ? 'Processing...' : 'Send Payment'}
      </button>
    </div>
  );
}
