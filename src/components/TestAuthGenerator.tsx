import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal, ShieldCheck, ArrowRight, Copy, Check,
  Code, Layers, FileCode, KeyRound, AlertTriangle, Loader2,
} from 'lucide-react';

import { useGenerateClientToken } from '../hooks/useGenerateClientToken';

export default function TestAuthGenerator() {
  const navigate = useNavigate();
  const [platformName, setPlatformName] = useState('Nova Store');
  const [platformUrl, setPlatformUrl] = useState('MerchantSandbox');
  const [flowType, setFlowType] = useState<'login' | 'payment'>('payment');
  const [merchantName, setMerchantName] = useState('Nova Store');
  const [totalPrice, setTotalPrice] = useState('$49.99');
  const [apiKey, setApiKey] = useState('');

  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const { generate, loading, error, clientId } = useGenerateClientToken();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await generate({
      type: flowType,
      platform_name: platformName,
      base_url: platformUrl,
      merchant_name: merchantName || platformName,
      total_price: flowType === 'payment' ? totalPrice : undefined,
      api_key: apiKey,
    });

    if (token) {
      const queryParams = new URLSearchParams();
      queryParams.set('client_id', token);
      setGeneratedUrl(`/authorize?${queryParams.toString()}`);
    } else {
      setGeneratedUrl('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    if (generatedUrl) {
      navigate(generatedUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {}
      <div className="bg-[#0D0D12]/40 backdrop-blur-md p-6 rounded-3xl border border-[#1C1C24] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="text-[#D4AF37]" size={20} />
            Developer OAuth Console
          </h2>
          <p className="text-[11px] text-[#9A9AA5] mt-0.5">
            Configure client parameters and request a server-signed authorization token using your API key.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#D4AF37]/5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37]">
          <span>v2.0.0-Sandbox</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {}
        <div className="lg:col-span-7 bg-[#0A0A0E]/80 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#27272A] pb-3">
            <Layers size={15} className="text-[#3EC6C0]" />
            Payload Configuration
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Flow Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setFlowType('payment'); setPlatformUrl('MerchantSandbox'); }}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      flowType === 'payment'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white'
                        : 'border-[#27272A] bg-[#121217] text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    Payment Authorization
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFlowType('login'); setPlatformUrl('http://localhost'); }}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      flowType === 'login'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white'
                        : 'border-[#27272A] bg-[#121217] text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    User Login Consent
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                  placeholder="Nova Store"
                  required
                />
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Base / Redirect URL</label>
                <input
                  type="text"
                  value={platformUrl}
                  onChange={(e) => setPlatformUrl(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                  placeholder="MerchantSandbox or https://..."
                  required
                />
              </div>

              {flowType === 'payment' ? (
                <>
                  {}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Merchant Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                      placeholder="Nova Store"
                      required
                    />
                  </div>

                  {}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total Price</label>
                    <input
                      type="text"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                      placeholder="$49.99"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Merchant / Consent Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                    placeholder="Nova Store"
                  />
                </div>
              )}

              {}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <KeyRound size={11} className="text-[#D4AF37]" />
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                  placeholder="Your client's secret API key"
                  autoComplete="off"
                  required
                />
                <p className="text-[9px] text-[#71717A]">
                  Verified server-side against your registered Client record — this is what actually authorizes token generation now.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl px-4 py-3">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] disabled:opacity-50 disabled:cursor-not-allowed text-[#050508] font-bold py-3 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/10"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying with server...
                </>
              ) : (
                <>
                  <Code size={14} />
                  Generate Verified OAuth Token
                </>
              )}
            </button>
          </form>
        </div>

        {}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {}
          <div className="bg-[#0A0A0E]/80 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#27272A] pb-3 mb-4">
                <FileCode size={15} className="text-[#D4AF37]" />
                Generated Result
              </h3>

              {!generatedUrl ? (
                <div className="h-48 border border-dashed border-[#27272A] rounded-2xl flex flex-col items-center justify-center text-center p-4">
                  <Code size={24} className="text-[#52525B] mb-2" />
                  <p className="text-xs text-[#71717A]">
                    Enter your API key and configuration, then generate to receive a server-signed client_id.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Signed `client_id` Token</span>
                    <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800 text-[10px] font-mono text-[#3EC6C0] break-all max-h-24 overflow-y-auto">
                      {clientId}
                    </div>
                  </div>

                  {}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Full Sandbox Authorize URL</span>
                    <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800 text-[10px] font-mono text-[#D4AF37] break-all">
                      {generatedUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {generatedUrl && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:border-zinc-700 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleLaunch}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#3EC6C0]/10 border border-[#3EC6C0]/25 text-[#3EC6C0] hover:bg-[#3EC6C0]/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch Flow</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {}
          <div className="p-4 rounded-3xl bg-[#16161D] border border-[#27272A] space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#3EC6C0]" />
              Security Note
            </h4>
            <p className="text-[10px] text-[#71717A] leading-relaxed">
              client_id tokens are now minted and signed exclusively by the server after verifying your API key
              against a registered, active client. Tokens expire after 10 minutes and cannot be forged or edited client-side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal, ShieldCheck, ArrowRight, Copy, Check,
  Code, Layers, FileCode, KeyRound, AlertTriangle, Loader2,
} from 'lucide-react';

import { useGenerateClientToken } from '../hooks/useGenerateClientToken';

export default function TestAuthGenerator() {
  const navigate = useNavigate();
  const [platformName, setPlatformName] = useState('Nova Store');
  const [platformUrl, setPlatformUrl] = useState('MerchantSandbox');
  const [flowType, setFlowType] = useState<'login' | 'payment'>('payment');
  const [merchantName, setMerchantName] = useState('Nova Store');
  const [totalPrice, setTotalPrice] = useState('$49.99');
  const [apiKey, setApiKey] = useState('');

  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const { generate, loading, error, clientId } = useGenerateClientToken();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await generate({
      type: flowType,
      platform_name: platformName,
      base_url: platformUrl,
      merchant_name: merchantName || platformName,
      total_price: flowType === 'payment' ? totalPrice : undefined,
      api_key: apiKey,
    });

    if (token) {
      const queryParams = new URLSearchParams();
      queryParams.set('client_id', token);
      setGeneratedUrl(`/authorize?${queryParams.toString()}`);
    } else {
      setGeneratedUrl('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    if (generatedUrl) {
      navigate(generatedUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {}
      <div className="bg-[#0D0D12]/40 backdrop-blur-md p-6 rounded-3xl border border-[#1C1C24] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="text-[#D4AF37]" size={20} />
            Developer OAuth Console
          </h2>
          <p className="text-[11px] text-[#9A9AA5] mt-0.5">
            Configure client parameters and request a server-signed authorization token using your API key.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#D4AF37]/5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37]">
          <span>v2.0.0-Sandbox</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {}
        <div className="lg:col-span-7 bg-[#0A0A0E]/80 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#27272A] pb-3">
            <Layers size={15} className="text-[#3EC6C0]" />
            Payload Configuration
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Flow Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setFlowType('payment'); setPlatformUrl('MerchantSandbox'); }}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      flowType === 'payment'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white'
                        : 'border-[#27272A] bg-[#121217] text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    Payment Authorization
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFlowType('login'); setPlatformUrl('http://localhost'); }}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      flowType === 'login'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white'
                        : 'border-[#27272A] bg-[#121217] text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    User Login Consent
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                  placeholder="Nova Store"
                  required
                />
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Base / Redirect URL</label>
                <input
                  type="text"
                  value={platformUrl}
                  onChange={(e) => setPlatformUrl(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                  placeholder="MerchantSandbox or https://..."
                  required
                />
              </div>

              {flowType === 'payment' ? (
                <>
                  {}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Merchant Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                      placeholder="Nova Store"
                      required
                    />
                  </div>

                  {}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total Price</label>
                    <input
                      type="text"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                      placeholder="$49.99"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Merchant / Consent Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none"
                    placeholder="Nova Store"
                  />
                </div>
              )}

              {}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <KeyRound size={11} className="text-[#D4AF37]" />
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#121218] text-white px-4 py-2.5 rounded-xl text-xs border border-zinc-800 focus:border-[#D4AF37]/50 focus:outline-none font-mono"
                  placeholder="Your client's secret API key"
                  autoComplete="off"
                  required
                />
                <p className="text-[9px] text-[#71717A]">
                  Verified server-side against your registered Client record — this is what actually authorizes token generation now.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl px-4 py-3">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] disabled:opacity-50 disabled:cursor-not-allowed text-[#050508] font-bold py-3 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/10"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying with server...
                </>
              ) : (
                <>
                  <Code size={14} />
                  Generate Verified OAuth Token
                </>
              )}
            </button>
          </form>
        </div>

        {}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {}
          <div className="bg-[#0A0A0E]/80 backdrop-blur-2xl border border-[#27272A] rounded-3xl p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#27272A] pb-3 mb-4">
                <FileCode size={15} className="text-[#D4AF37]" />
                Generated Result
              </h3>

              {!generatedUrl ? (
                <div className="h-48 border border-dashed border-[#27272A] rounded-2xl flex flex-col items-center justify-center text-center p-4">
                  <Code size={24} className="text-[#52525B] mb-2" />
                  <p className="text-xs text-[#71717A]">
                    Enter your API key and configuration, then generate to receive a server-signed client_id.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Signed `client_id` Token</span>
                    <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800 text-[10px] font-mono text-[#3EC6C0] break-all max-h-24 overflow-y-auto">
                      {clientId}
                    </div>
                  </div>

                  {}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Full Sandbox Authorize URL</span>
                    <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800 text-[10px] font-mono text-[#D4AF37] break-all">
                      {generatedUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {generatedUrl && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:border-zinc-700 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleLaunch}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#3EC6C0]/10 border border-[#3EC6C0]/25 text-[#3EC6C0] hover:bg-[#3EC6C0]/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch Flow</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {}
          <div className="p-4 rounded-3xl bg-[#16161D] border border-[#27272A] space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#3EC6C0]" />
              Security Note
            </h4>
            <p className="text-[10px] text-[#71717A] leading-relaxed">
              client_id tokens are now minted and signed exclusively by the server after verifying your API key
              against a registered, active client. Tokens expire after 10 minutes and cannot be forged or edited client-side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
