import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { updateSiteData, updateAdminPassword } from '../../services/api.ts';
import { BrandingSettings } from '../../types/index.ts';
import { Settings, Lock, Save, Shield, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: '#0B1526',
    accentColor: '#C89B3C',
    logoText: 'Shri Goyal Associates',
    logoSubtext: 'Consultation & Advisory · Mathura',
    enableWhatsAppFloat: true,
    enableCallFloat: true
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);

  useEffect(() => {
    if (siteData?.branding) {
      setBranding(siteData.branding);
    }
  }, [siteData]);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSavingBranding(true);
    try {
      await updateSiteData(adminToken, { branding });
      await refreshSiteData();
      showNotification('success', 'Branding settings saved successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save branding');
    } finally {
      setSavingBranding(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    if (newPassword.length < 8) {
      showNotification('error', 'New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('error', 'New password and confirmation do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await updateAdminPassword(adminToken, currentPassword, newPassword);
      showNotification('success', 'Master administrator password updated successfully! Please keep it secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDownloadBackup = () => {
    if (!siteData) return;
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shri_goyal_associates_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', 'Database backup downloaded successfully');
  };

  return (
    <AdminLayout currentTab="settings">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
            Settings & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage branding options, administrator credentials, and database backups
          </p>
        </div>

        {/* Branding Configuration */}
        <form onSubmit={handleSaveBranding} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-navy-950 font-display">
              Visual Branding & Floating Controls
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Header Logo Text
              </label>
              <input
                type="text"
                value={branding.logoText}
                onChange={e => setBranding({ ...branding, logoText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Header Subtitle / Tagline
              </label>
              <input
                type="text"
                value={branding.logoSubtext}
                onChange={e => setBranding({ ...branding, logoSubtext: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={branding.enableCallFloat}
                onChange={e => setBranding({ ...branding, enableCallFloat: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Enable Floating Direct Call Button</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={branding.enableWhatsAppFloat}
                onChange={e => setBranding({ ...branding, enableWhatsAppFloat: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Enable Floating WhatsApp Button</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingBranding}
              className="px-5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{savingBranding ? 'Saving...' : 'Save Branding'}</span>
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-navy-950 font-display">
              Update Administrator Master Password
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password * (Min 8 chars)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{changingPassword ? 'Updating...' : 'Update Master Password'}</span>
            </button>
          </div>
        </form>

        {/* Database Backup & Export */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Download className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-navy-950 font-display">
              Data Persistence & Backup Export
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Export a full JSON backup snapshot of all website content, owner configurations, services, FAQs, and contact inquiries for safe archival or migration to Firebase / Cloud Firestore.
          </p>

          <div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>Export Full Database Backup (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
