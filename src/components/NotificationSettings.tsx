import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType } from '@/services/settingsservice';

interface NotificationSettingsProps {
    notificationSettings: NotificationSettingsType | null;
    onUpdate: (data: Partial<Pick<NotificationSettingsType, 'email' | 'push' | 'marketing'>>) => Promise<void>;
}

export default function NotificationSettings({ notificationSettings, onUpdate }: NotificationSettingsProps) {
    const email = notificationSettings?.email ?? false;
    const push = notificationSettings?.push ?? false;
    const marketing = notificationSettings?.marketing ?? false;

    const handleToggle = async (key: 'email' | 'push' | 'marketing', value: boolean) => {
        try {
            await onUpdate({ [key]: value });
        } catch (err: any) {
            alert(err.message || 'Failed to update notification settings.');
        }
    };

    return (
        <div className="group relative p-6 rounded-3xl border border-[#27272A] bg-[#0D0D12]/60 backdrop-blur-sm hover:border-[#3EC6C0]/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-[#3EC6C0]/10 text-[#3EC6C0]">
                    <Bell size={16} />
                </div>
                <h2 className="text-sm font-semibold text-white">Notification Settings</h2>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Email Notifications</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-sm accent-[#3EC6C0]" 
                        checked={email} 
                        onChange={(e) => handleToggle('email', e.target.checked)}
                    />
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Push Notifications</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-sm accent-[#3EC6C0]" 
                        checked={push} 
                        onChange={(e) => handleToggle('push', e.target.checked)}
                    />
                </div>
                <div className="flex justify-between items-center bg-[#16161D] p-3 rounded-xl border border-[#27272A]">
                    <span className="text-xs text-[#A1A1AA]">Marketing Alerts</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-sm accent-[#3EC6C0]" 
                        checked={marketing} 
                        onChange={(e) => handleToggle('marketing', e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
}
