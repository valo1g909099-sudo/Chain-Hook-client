import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Security2FASettings } from '@/services/settingsservice';

interface SecuritySettingsProps {
    securitySettings: Security2FASettings | null;
    onUpdate: (data: Partial<Pick<Security2FASettings, 'authenticator_app' | 'OTP' | 'B_T'>>) => Promise<void>;
}

export default function SecuritySettings({ securitySettings, onUpdate }: SecuritySettingsProps) {
    const authenticatorApp = securitySettings?.authenticator_app ?? false;
    const otp = securitySettings?.OTP ?? false;
    const bt = securitySettings?.B_T ?? false;

    const [biometricStatus, setBiometricStatus] = useState('Verify');

    const toggleSecurityFeature = async (key: 'authenticator_app' | 'OTP' | 'B_T', currentValue: boolean) => {
        try {
            await onUpdate({ [key]: !currentValue });
        } catch (err: any) {
            alert(err.message || 'Failed to update security settings.');
        }
    };

    const triggerBiometric = () => {
        setBiometricStatus('Scanning...');
        setTimeout(async () => {
            setBiometricStatus('Verified');
            try {
                await onUpdate({ B_T: !bt });
            } catch (err: any) {
                alert(err.message || 'Failed to update biometric setting.');
            }
            setTimeout(() => setBiometricStatus('Verify'), 2000);
        }, 1500);
    };

    return (
        <div className="group relative p-6 rounded-3xl border border-[#27272A] bg-[#0D0D12]/60 backdrop-blur-sm hover:border-[#FF6B6B]/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B]">
                    <ShieldCheck size={16} />
                </div>
                <h2 className="text-sm font-semibold text-white">Security & 2FA</h2>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <div>
                        <div className="text-xs text-[#A1A1AA]">Authenticator App</div>
                        <div className="text-[9px] text-[#71717A]">Use Google or Authy</div>
                    </div>
                    <button 
                        onClick={() => toggleSecurityFeature('authenticator_app', authenticatorApp)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg text-white font-bold transition-all ${
                            authenticatorApp ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#1F1F23]'
                        }`}
                    >
                        {authenticatorApp ? 'Disable' : 'Enable'}
                    </button>
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <div>
                        <div className="text-xs text-[#A1A1AA]">SMS-based OTP</div>
                        <div className="text-[9px] text-[#71717A]">Receive code on your phone</div>
                    </div>
                    <button 
                        onClick={() => toggleSecurityFeature('OTP', otp)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg text-white font-bold transition-all ${
                            otp ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#1F1F23]'
                        }`}
                    >
                        {otp ? 'Disable' : 'Enable'}
                    </button>
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <div>
                        <div className="text-xs text-[#A1A1AA]">Biometric Trigger</div>
                        <div className="text-[9px] text-[#71717A]">
                            Status: {bt ? 'Enabled' : 'Disabled'} (Face/TouchID)
                        </div>
                    </div>
                    <button 
                        onClick={triggerBiometric} 
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-all ${
                            biometricStatus === 'Verified' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : bt 
                                    ? 'bg-[#1F1F23] border border-zinc-700 text-[#D4AF37]' 
                                    : 'bg-[#1F1F23] text-white'
                        }`}
                    >
                        {biometricStatus === 'Verify' ? (bt ? 'Disable Biometrics' : 'Enable Biometrics') : biometricStatus}
                    </button>
                </div>
            </div>
        </div>
    );
}
