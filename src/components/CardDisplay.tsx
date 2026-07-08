import { CreditCard, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface CardDisplayProps {
  isFrozen: boolean;
  showDetails: boolean;
  onToggleFrozen: () => void;
  onToggleDetails: () => void;
}

export default function CardDisplay({ isFrozen, showDetails, onToggleFrozen, onToggleDetails }: CardDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-between space-y-6">
      <div className={`relative w-full max-w-[280px] h-44 rounded-3xl p-6 text-white flex flex-col justify-between transition-all duration-500 shadow-2xl ${isFrozen ? 'bg-gray-800 grayscale' : 'bg-gradient-to-tr from-indigo-600 to-violet-700'}`}>
        <div className="flex justify-between items-start">
            <CreditCard size={28} className="text-white/80" />
            <span className="text-xs font-mono font-bold tracking-widest text-white/70">DEBIT</span>
        </div>
        <div className="space-y-2">
            <p className={`font-mono text-lg tracking-widest transition-all ${showDetails ? 'opacity-100' : 'opacity-80'}`}>
                {showDetails ? '4111 2222 3333 8842' : '**** **** **** 8842'}
            </p>
            <div className="flex justify-between text-[10px] uppercase font-semibold text-white/70">
                <span>JOHN DOE</span>
                <span>08/28</span>
            </div>
        </div>
        <div className="absolute top-4 right-4">
            {isFrozen && <div className="px-2 py-0.5 bg-black/30 rounded text-[9px] font-bold text-white">FROZEN</div>}
        </div>
      </div>
      
      <div className="flex w-full gap-3">
        <button 
            onClick={onToggleDetails}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold bg-[#1C1C24] text-white hover:bg-[#27272A] transition-colors"
        >
            {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showDetails ? 'Hide' : 'Show'}
        </button>
        <button 
            onClick={onToggleFrozen}
            className={`flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${isFrozen ? 'bg-[#3EC6C0] text-[#0A0A0B] hover:bg-[#32A8A2]' : 'bg-[#FF6B6B] text-white hover:bg-red-500'}`}
        >
            {isFrozen ? <Unlock size={16} /> : <Lock size={16} />}
            {isFrozen ? 'Unfreeze' : 'Freeze Card'}
        </button>
      </div>
    </div>
  );
}
