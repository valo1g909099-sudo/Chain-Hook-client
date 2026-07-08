import React, { useState, useEffect } from 'react';
import { User as UserIcon, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '@/services/userService';
import { ProfileSettings as ProfileSettingsType } from '@/services/settingsservice';

interface ProfileSettingsProps {
    profileSettings: ProfileSettingsType | null;
    onUpdate: (bio: string) => Promise<void>;
}

export default function ProfileSettings({ profileSettings, onUpdate }: ProfileSettingsProps) {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(profileSettings?.bio || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        if (profileSettings) {
            setBio(profileSettings.bio);
        }
    }, [profileSettings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        try {
            // Update auth fields (name, email)
            await userService.updateProfile({ name, email });
            // Update bio settings
            await onUpdate(bio);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            alert(err.message || 'Failed to save profile settings.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="group relative p-6 rounded-3xl border border-[#27272A] bg-[#0D0D12]/60 backdrop-blur-sm hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <UserIcon size={16} />
                    </div>
                    <h2 className="text-sm font-semibold text-white">Profile Settings</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A]">Display Name</span>
                        <input 
                            type="text" 
                            className="w-full bg-[#16161D] text-white p-3 rounded-xl text-xs border border-[#27272A] focus:border-[#D4AF37]/50 focus:outline-none transition-colors" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A]">Email</span>
                        <input 
                            type="email" 
                            className="w-full bg-[#16161D] text-white p-3 rounded-xl text-xs border border-[#27272A] focus:border-[#D4AF37]/50 focus:outline-none transition-colors" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A]">Bio</span>
                        <textarea 
                            className="w-full bg-[#16161D] text-white p-3 rounded-xl text-xs border border-[#27272A] focus:border-[#D4AF37]/50 focus:outline-none transition-colors h-20" 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#050508] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#B8962E] transition-colors disabled:opacity-50"
                >
                    <Save size={12} />
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
