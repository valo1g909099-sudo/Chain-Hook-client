import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Cpu, Server } from 'lucide-react';
import Logo from '@/assets/logo/logo.png';

const STEPS = [
  { text: 'Establishing secure TLS tunnel...', icon: <Lock size={14} className="text-[#D4AF37]" /> },
  { text: 'Verifying cryptographic credentials...', icon: <Shield size={14} className="text-[#3EC6C0]" /> },
  { text: 'Initiating decentralized node consensus...', icon: <Cpu size={14} className="text-purple-400" /> },
  { text: 'Synchronizing multi-currency ledger...', icon: <Server size={14} className="text-blue-400" /> }
];

export default function SplashPage() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-[#3EC6C0]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="flex flex-col items-center space-y-8 max-w-sm w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="w-20 h-20 rounded-3xl bg-[#0D0D12] border border-[#27272A] flex items-center justify-center p-4 relative shadow-2xl">
            <img src={Logo} alt="Chain Hook Logo" className="w-full h-full object-contain animate-pulse" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold tracking-widest uppercase text-white bg-clip-text"
          >
            Chain Hook
          </motion.h2>
          <p className="text-[10px] text-[#71717A] tracking-wider uppercase font-semibold">Ledger Protocol v2.4</p>
        </div>

        <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          ></motion.div>
        </div>

        <div className="h-10 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 bg-[#121217] border border-[#27272A]/40 px-4 py-2 rounded-2xl"
            >
              {STEPS[stepIndex].icon}
              <span className="text-[10px] text-[#A1A1AA] font-medium tracking-wide">
                {STEPS[stepIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
