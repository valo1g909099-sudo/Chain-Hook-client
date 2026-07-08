import React from 'react';
import { Globe } from 'lucide-react';
import { LanguageSettings, CurrencySettings, TimeZoneSettings } from '@/services/settingsservice';

interface AccountPreferencesProps {
    languageSettings: LanguageSettings | null;
    currencySettings: CurrencySettings | null;
    timeZoneSettings: TimeZoneSettings | null;
    onUpdateLang: (lang: string) => Promise<void>;
    onUpdateCurrency: (curr: string) => Promise<void>;
    onUpdateTZ: (tz: string) => Promise<void>;
}

export default function AccountPreferences({
    languageSettings,
    currencySettings,
    timeZoneSettings,
    onUpdateLang,
    onUpdateCurrency,
    onUpdateTZ,
}: AccountPreferencesProps) {
    const lang = languageSettings?.lang || 'English';
    const currency = currencySettings?.currency || 'USD';
    const timezone = timeZoneSettings?.time_zone || 'UTC';

    const handleLangChange = async (value: string) => {
        try {
            await onUpdateLang(value);
        } catch (err: any) {
            alert(err.message || 'Failed to update language preference.');
        }
    };

    const handleCurrencyChange = async (value: string) => {
        try {
            await onUpdateCurrency(value);
        } catch (err: any) {
            alert(err.message || 'Failed to update currency preference.');
        }
    };

    const handleTZChange = async (value: string) => {
        try {
            await onUpdateTZ(value);
        } catch (err: any) {
            alert(err.message || 'Failed to update timezone preference.');
        }
    };

    return (
        <div className="group relative p-6 rounded-3xl border border-[#27272A] bg-[#0D0D12]/60 backdrop-blur-sm hover:border-[#A1A1AA]/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-[#A1A1AA]/10 text-[#A1A1AA]">
                    <Globe size={16} />
                </div>
                <h2 className="text-sm font-semibold text-white">Account Preferences</h2>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Language</span>
                    <select 
                        className="bg-[#0D0D12] text-white p-2 rounded-lg text-xs border border-[#27272A] focus:outline-none focus:border-[#A1A1AA]/50 cursor-pointer"
                        value={lang}
                        onChange={(e) => handleLangChange(e.target.value)}
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Currency</span>
                    <select 
                        className="bg-[#0D0D12] text-white p-2 rounded-lg text-xs border border-[#27272A] focus:outline-none focus:border-[#A1A1AA]/50 cursor-pointer"
                        value={currency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Time Zone</span>
                    <select 
                        className="bg-[#0D0D12] text-white p-2 rounded-lg text-xs border border-[#27272A] focus:outline-none focus:border-[#A1A1AA]/50 cursor-pointer"
                        value={timezone}
                        onChange={(e) => handleTZChange(e.target.value)}
                    >
                        <option value="UTC">UTC</option>
                        <option value="PST">PST</option>
                        <option value="EST">EST</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
