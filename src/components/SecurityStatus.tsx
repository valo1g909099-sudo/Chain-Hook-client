import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function SecurityStatus({ is2faEnabled }: { is2faEnabled: boolean }) {
    return (
        <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] flex items-center gap-3 shadow-lg">
            <div className={`p-2 rounded-lg ${is2faEnabled ? 'bg-green-500/10 text-green-500' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'}`}>
                {is2faEnabled ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            </div>
            <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">Account Security</p>
                <p className="text-sm font-semibold text-white mt-0.5">{is2faEnabled ? 'Secure' : 'Unsecured'}</p>
                <p className="text-[9px] text-[#71717A] mt-0.5">
                    {is2faEnabled ? 'All security audits passed. 2FA is active.' : 'Security alert. Enable 2FA in settings.'}
                </p>
            </div>
        </div>
    );
}
