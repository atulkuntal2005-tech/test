import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { updateOwners, uploadOwnerPhoto } from '../../services/api.ts';
import { Owner } from '../../types/index.ts';
import { Users, Save, Upload, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminOwnersPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    if (siteData?.owners) {
      setOwners(siteData.owners);
    }
  }, [siteData]);

  const handleOwnerChange = (index: number, field: keyof Owner, value: any) => {
    setOwners(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSpecialtiesChange = (index: number, text: string) => {
    const list = text.split(',').map(s => s.trim()).filter(Boolean);
    handleOwnerChange(index, 'specialties', list);
  };

  const handlePhotoUpload = async (index: number, ownerId: string, file: File) => {
    if (!adminToken) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Only image files (JPG, PNG, WebP) are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Maximum image size is 5MB');
      return;
    }

    setUploadingFor(ownerId);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const photoUrl = await uploadOwnerPhoto(adminToken, ownerId, dataUrl, file.name);
          handleOwnerChange(index, 'photo', photoUrl);
          await refreshSiteData();
          showNotification('success', `Photo for ${owners[index].name} uploaded and replaced!`);
        } catch (err: any) {
          showNotification('error', err.message || 'Failed to upload photo');
        } finally {
          setUploadingFor(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadingFor(null);
      showNotification('error', err.message || 'Failed to read image');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSaving(true);
    try {
      await updateOwners(adminToken, owners);
      await refreshSiteData();
      showNotification('success', 'Owner profiles updated and saved to database successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save owner profiles');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout currentTab="owners">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Owner Profiles Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage Jitendra Goyal and Hemant Goyal credentials, designations, and uploaded portraits
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? 'Saving...' : 'Save All Owner Changes'}</span>
          </button>
        </div>

        <div className="space-y-8">
          {owners.map((owner, idx) => (
            <div
              key={owner.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-navy-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h2 className="text-xl font-bold text-navy-950 font-display">
                    {owner.name} ({owner.id === 'jitendra-goyal' ? 'Jitendra Goyal' : 'Hemant Goyal'})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={owner.visible}
                      onChange={e => handleOwnerChange(idx, 'visible', e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Profile Visible on Public Website</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Photo & Upload Column */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative shadow-xs">
                    <img
                      src={owner.photo}
                      alt={owner.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* 1-Click Direct File Upload from Device - No URL input */}
                  <div>
                    <label className="cursor-pointer w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload New Photo from Device</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handlePhotoUpload(idx, owner.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 text-center mt-1.5">
                      Select JPG or PNG directly from your computer or phone.
                    </p>
                  </div>

                  {uploadingFor === owner.id && (
                    <p className="text-xs text-amber-600 font-semibold animate-pulse">
                      Uploading and saving portrait...
                    </p>
                  )}
                </div>

                {/* Information Fields */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={owner.name}
                        onChange={e => handleOwnerChange(idx, 'name', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Professional Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={owner.designation}
                        onChange={e => handleOwnerChange(idx, 'designation', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Attire Description (Verification Tag)
                    </label>
                    <input
                      type="text"
                      value={owner.attire}
                      onChange={e => handleOwnerChange(idx, 'attire', e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      e.g. "Navy-blue blazer and white shirt" or "Grey blazer and black shirt"
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Executive Biography & Background
                    </label>
                    <textarea
                      rows={4}
                      value={owner.bio}
                      onChange={e => handleOwnerChange(idx, 'bio', e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Practice Specialties (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={owner.specialties.join(', ')}
                      onChange={e => handleSpecialtiesChange(idx, e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      e.g. Commercial Strategy, Business Consultation, Regional Trade Operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </AdminLayout>
  );
};
