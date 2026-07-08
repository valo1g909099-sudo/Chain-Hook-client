import React from 'react';
import { Shield } from 'lucide-react';
import { PrivacySettings as PrivacySettingsType } from '@/services/settingsservice';

interface PrivacySettingsProps {
    privacySettings: PrivacySettingsType | null;
    onUpdate: (data: Partial<Pick<PrivacySettingsType, 'auth_2f' | 'data_sharing' | 'activity_status'>>) => Promise<void>;
}

export default function PrivacySettings({ privacySettings, onUpdate }: PrivacySettingsProps) {
    const auth2f = privacySettings?.auth_2f ?? false;
    const dataSharing = privacySettings?.data_sharing ?? false;
    const activityStatus = privacySettings?.activity_status ?? false;

    const handleToggle = async (key: 'auth_2f' | 'data_sharing' | 'activity_status', value: boolean) => {
        try {
            await onUpdate({ [key]: value });
        } catch (err: any) {
            alert(err.message || 'Failed to update privacy settings.');
        }
    };

    return (
        <div className="group relative p-6 rounded-3xl border border-[#27272A] bg-[#0D0D12]/60 backdrop-blur-sm hover:border-[#FF6B6B]/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B]">
                    <Shield size={16} />
                </div>
                <h2 className="text-sm font-semibold text-white">Privacy</h2>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Two-Factor Authentication</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-sm accent-[#FF6B6B]" 
                        checked={auth2f} 
                        onChange={(e) => handleToggle('auth_2f', e.target.checked)}
                    />
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Data Sharing</span>
                    <select 
                        className="bg-[#0D0D12] text-white p-2 rounded-lg text-xs border border-[#27272A] focus:outline-none focus:border-[#FF6B6B]/50"
                        value={dataSharing ? 'Enabled' : 'Disabled'}
                        onChange={(e) => handleToggle('data_sharing', e.target.value === 'Enabled')}
                    >
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                    </select>
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Activity Status</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-sm accent-[#FF6B6B]" 
                        checked={activityStatus} 
                        onChange={(e) => handleToggle('activity_status', e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
}
