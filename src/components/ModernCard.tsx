import { useState } from 'react';
import { CreditCard, Lock, Unlock, Eye, EyeOff, Wifi, Shield, RotateCw } from 'lucide-react';

interface ModernCardProps {
  type: string;
  advantage: string;
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
  isFrozen: boolean;
  showDetails: boolean;
  onToggleFrozen: () => void;
  onToggleDetails: () => void;
}

export default function ModernCard({ 
  type, 
  advantage, 
  cardNumber, 
  cardholderName, 
  expirationDate, 
  cvv, 
  isFrozen, 
  showDetails, 
  onToggleFrozen, 
  onToggleDetails 
}: ModernCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="group flex flex-col items-center gap-5 w-full max-w-[360px] mx-auto">
      {}
      <div 
        className="w-full h-52 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
      >
        {}
        <div 
          className="relative w-full h-full duration-700 select-none"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {}
          <div 
            className={`absolute inset-0 w-full h-full rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl border transition-all duration-300 ${
              isFrozen 
                ? 'bg-gradient-to-br from-[#121217] to-[#1F1F24] border-zinc-700/40 grayscale' 
                : 'bg-gradient-to-br from-[#1A1A22] to-[#0A0A0C] border-[#D4AF37]/35 shadow-[#D4AF37]/5'
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {}
            <div className="relative flex justify-between items-start">
              <div className="flex flex-col gap-1">
                {}
                <div className="w-10 h-7 bg-gradient-to-r from-[#E6C65E] to-[#A88C30] rounded-md shadow-inner flex flex-col justify-between p-1.5 overflow-hidden">
                  <div className="h-[1px] bg-black/20 w-full"></div>
                  <div className="h-[1px] bg-black/20 w-full"></div>
                  <div className="h-[1px] bg-black/20 w-full"></div>
                </div>
                <span className="text-[7px] text-[#A1A1AA] uppercase tracking-widest font-mono">Chain Hook</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Wifi size={16} className={isFrozen ? 'text-[#71717A]' : 'text-[#D4AF37]'} />
                <span className="text-[9px] font-bold tracking-widest text-[#D4AF37] font-mono">{type}</span>
              </div>
            </div>

            {}
            <div className="relative">
              <p className="font-mono text-lg tracking-[0.2em] text-white">
                {showDetails ? cardNumber : '••••  ••••  ••••  ' + cardNumber.slice(-4)}
              </p>
            </div>

            {}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[7px] uppercase font-bold tracking-wider text-[#71717A]">Cardholder</span>
                <span className="text-xs font-semibold tracking-wide text-zinc-100">{cardholderName}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] uppercase font-bold tracking-wider text-[#71717A]">Expiry</span>
                <span className="text-xs font-semibold font-mono tracking-wide text-zinc-100">{expirationDate}</span>
              </div>
            </div>

            {}
            <div className="absolute top-4 right-4 flex gap-1.5">
              {isFrozen && (
                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full text-[8px] font-bold text-red-400">
                  FROZEN
                </span>
              )}
            </div>
          </div>

          {}
          <div 
            className={`absolute inset-0 w-full h-full rounded-3xl text-white flex flex-col justify-between shadow-2xl border transition-all duration-300 ${
              isFrozen 
                ? 'bg-gradient-to-br from-[#121217] to-[#1F1F24] border-zinc-700/40 grayscale' 
                : 'bg-gradient-to-br from-[#15151C] to-[#0A0A0E] border-[#D4AF37]/20'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {}
            <div className="w-full h-10 bg-black mt-4"></div>

            {}
            <div className="px-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[7px] uppercase font-bold tracking-wider text-[#71717A]">Authorized Signature</span>
                <span className="text-[7px] uppercase font-bold tracking-wider text-[#71717A]">Security Code</span>
              </div>
              
              <div className="flex items-center gap-2">
                {}
                <div className="flex-1 h-7 bg-zinc-800 rounded-md border border-zinc-700/50 flex items-center px-3 italic font-serif text-[#A1A1AA] text-[10px] select-none pointer-events-none [background:repeating-linear-gradient(45deg,#27272a,#27272a_10px,#1f1f23_10px,#1f1f23_20px)]">
                  {cardholderName}
                </div>
                {}
                <div className="w-12 h-7 bg-zinc-900 border border-zinc-700 rounded-md flex items-center justify-center font-mono text-xs font-bold text-[#D4AF37]">
                  {showDetails ? cvv : '•••'}
                </div>
              </div>
            </div>

            {}
            <div className="p-6 pt-0 flex justify-between items-center text-[7px] text-[#52525B]">
              <div className="space-y-0.5">
                <p>Support: support@chainhook.com</p>
                <p>Issued by Chain Hook Wallet. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={10} className="text-[#D4AF37]" />
                <span className="font-bold tracking-widest font-mono text-white/40">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="text-center w-full px-2">
        <p className="text-[11px] font-semibold text-white mb-0.5">{type} Advantage</p>
        <p className="text-[10px] text-[#71717A] leading-relaxed">{advantage}</p>
      </div>

      {}
      <div className="flex w-full gap-2 px-1">
        {}
        <button 
          onClick={onToggleDetails}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold bg-[#1C1C24] hover:bg-[#27272A] text-white transition-all border border-zinc-800 hover:border-zinc-700"
          title="Toggle number visibility"
        >
          {showDetails ? <EyeOff size={12} /> : <Eye size={12} />}
          {showDetails ? 'Hide' : 'Show'}
        </button>

        {}
        <button 
          onClick={handleFlip}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold bg-[#1C1C24] hover:bg-[#27272A] text-white transition-all border border-zinc-800 hover:border-zinc-700"
          title="Rotate card"
        >
          <RotateCw size={12} className="text-[#D4AF37]" />
          Flip
        </button>

        {}
        <button 
          onClick={onToggleFrozen}
          className={`flex-[1.5] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
            isFrozen 
              ? 'bg-[#3EC6C0] text-[#0A0A0B] hover:bg-[#32A8A2]' 
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25'
          }`}
        >
          {isFrozen ? <Unlock size={12} /> : <Lock size={12} />}
          {isFrozen ? 'Unfreeze' : 'Freeze'}
        </button>
      </div>
    </div>
  );
}
