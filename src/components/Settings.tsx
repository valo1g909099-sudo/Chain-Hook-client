import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AccountPreferences from './AccountPreferences';
import SecuritySettings from './SecuritySettings';
import { settingsService, AllSettings, UpdateSettingsPayload } from '@/services/settingsservice';

export default function Settings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<AllSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getAll();
            setSettings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load settings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdateSettings = async (payload: UpdateSettingsPayload) => {
        try {
            const res = await settingsService.update(payload);
            if (res && !('errors' in res)) {
                setSettings(prev => prev ? { ...prev, ...res } : null);
            } else if (res && 'updated' in res) {
                setSettings(prev => prev ? { ...prev, ...res.updated } : null);
                if (res.errors) {
                    const errorMsg = Object.entries(res.errors)
                        .map(([section, errs]) => `${section}: ${JSON.stringify(errs)}`)
                        .join(', ');
                    alert(`Failed to update some settings: ${errorMsg}`);
                }
            }
        } catch (err: any) {
            alert(err.message || 'Failed to update settings.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
                    <p className="text-xs text-[#71717A]">Loading settings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
                <button onClick={fetchSettings} className="ml-4 font-bold underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="text-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileSettings 
                    profileSettings={settings?.profile} 
                    onUpdate={(bio) => handleUpdateSettings({ profile: { bio } })}
                />
                <NotificationSettings 
                    notificationSettings={settings?.notifications}
                    onUpdate={(data) => handleUpdateSettings({ notifications: data })}
                />
                <PrivacySettings 
                    privacySettings={settings?.privacy}
                    onUpdate={(data) => handleUpdateSettings({ privacy: data })}
                />
                <AccountPreferences 
                    languageSettings={settings?.language}
                    currencySettings={settings?.currency}
                    timeZoneSettings={settings?.time_zone}
                    onUpdateLang={(lang) => handleUpdateSettings({ language: { lang } })}
                    onUpdateCurrency={(curr) => handleUpdateSettings({ currency: { currency: curr } })}
                    onUpdateTZ={(tz) => handleUpdateSettings({ time_zone: { time_zone: tz } })}
                />
                <SecuritySettings 
                    securitySettings={settings?.security_2fa}
                    onUpdate={(data) => handleUpdateSettings({ security_2fa: data })}
                />
                <div className="p-6 rounded-2xl bg-[#16161D] border border-[#27272A] space-y-4">
                    <h2 className="text-sm font-semibold">External Payment Requests</h2>
                    <p className="text-xs text-[#71717A]">Manage permissions for external websites to initiate payments.</p>
                    <button
                        onClick={() => navigate('/payment-permission')}
                        className="w-full bg-[#D4AF37] text-[#050508] p-3 rounded-xl text-xs font-bold hover:bg-[#B8962E] transition-colors"
                    >
                        Simulate Payment Request
                    </button>
                </div>
            </div>
        </div>
    );
}
