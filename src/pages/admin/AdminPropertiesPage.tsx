import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { createProperty, updateProperty, deleteProperty, uploadOwnerPhoto } from '../../services/api.ts';
import { PropertyListing } from '../../types/index.ts';
import { Plus, Edit3, Trash2, CheckCircle2, X, Building2, Upload, MapPin, Tag } from 'lucide-react';

export const AdminPropertiesPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [editingProp, setEditingProp] = useState<PropertyListing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<PropertyListing['propertyType']>('commercial');
  const [formLocation, setFormLocation] = useState('');
  const [formSize, setFormSize] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formStatus, setFormStatus] = useState<PropertyListing['status']>('available');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  const properties = siteData?.properties || [];

  const openCreateModal = () => {
    setEditingProp(null);
    setFormTitle('');
    setFormType('commercial');
    setFormLocation('Mathura, Mandi Choraha, UP');
    setFormSize('');
    setFormPrice('Price on Request');
    setFormDescription('');
    setFormFeatures('Direct road approach\nClear registry title\nImmediate possession');
    setFormStatus('available');
    setFormPhotos([]);
    setFormPublished(true);
    setFormFeatured(false);
    setIsCreating(true);
  };

  const openEditModal = (prop: PropertyListing) => {
    setEditingProp(prop);
    setFormTitle(prop.title);
    setFormType(prop.propertyType);
    setFormLocation(prop.location);
    setFormSize(prop.size);
    setFormPrice(prop.priceDisplay);
    setFormDescription(prop.description);
    setFormFeatures(prop.features ? prop.features.join('\n') : '');
    setFormStatus(prop.status);
    setFormPhotos(prop.photos || []);
    setFormPublished(prop.published);
    setFormFeatured(prop.featured);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingProp(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!adminToken) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Only image files (JPG, PNG, WebP) are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be under 5MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const photoUrl = await uploadOwnerPhoto(adminToken, `prop_${Date.now()}`, dataUrl, file.name);
          setFormPhotos(prev => [...prev, photoUrl]);
          showNotification('success', 'Property photo uploaded from device successfully!');
        } catch (err: any) {
          showNotification('error', err.message || 'Failed to upload photo');
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingPhoto(false);
      showNotification('error', 'Failed to read image file');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    if (!formTitle.trim()) {
      showNotification('error', 'Property title is required');
      return;
    }

    setSaving(true);
    try {
      const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload: Partial<PropertyListing> = {
        title: formTitle.trim(),
        slug: editingProp?.slug || slug,
        propertyType: formType,
        location: formLocation.trim(),
        size: formSize.trim(),
        priceDisplay: formPrice.trim() || 'Price on Consultation',
        description: formDescription.trim(),
        features: formFeatures.split('\n').map(s => s.trim()).filter(Boolean),
        photos: formPhotos.length > 0 ? formPhotos : ['/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg'],
        status: formStatus,
        published: formPublished,
        featured: formFeatured
      };

      if (editingProp) {
        await updateProperty(adminToken, editingProp.id, payload);
        showNotification('success', 'Property listing updated successfully');
      } else {
        await createProperty(adminToken, payload);
        showNotification('success', 'New property listing created and published');
      }

      await refreshSiteData();
      closeModal();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!adminToken) return;
    try {
      await deleteProperty(adminToken, id);
      await refreshSiteData();
      showNotification('success', 'Property listing removed');
      setConfirmDeleteId(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete property');
    }
  };

  const handleTogglePublish = async (prop: PropertyListing) => {
    if (!adminToken) return;
    try {
      await updateProperty(adminToken, prop.id, { published: !prop.published });
      await refreshSiteData();
      showNotification('success', `Property ${!prop.published ? 'published' : 'unpublished'}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle status');
    }
  };

  return (
    <AdminLayout currentTab="properties">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Commercial Properties & Land CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Add and manage your commercial plots, office showrooms, and land listings in Mathura
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Listed Properties ({properties.length})
            </span>
            <span className="text-xs text-slate-400">Mathura Commercial Real Estate</span>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No properties added yet. Click "Add New Property" to add your first listing.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.map(prop => (
                <div key={prop.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img
                        src={prop.photos?.[0] || '/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg'}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-navy-950">{prop.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {prop.propertyType}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            prop.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prop.status === 'negotiation'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prop.status.toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            prop.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prop.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{prop.location} · {prop.size} · Rate: {prop.priceDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(prop)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                    >
                      {prop.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => openEditModal(prop)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 transition-colors"
                      title="Edit Property"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(prop.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-navy-950 font-display">Confirm Deletion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this property listing permanently?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProperty(confirmDeleteId)}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Modal (Zero URLs!) */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-xl font-bold text-navy-950 font-display">
                  {editingProp ? 'Edit Property Listing' : 'Add New Property Listing'}
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-navy-950">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProperty} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Prime Commercial Plot near Mandi Choraha"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Web address is generated automatically from title. No URL needed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Category *
                    </label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="commercial">Commercial Plot / Land</option>
                      <option value="office">Shop / Commercial Showroom</option>
                      <option value="industrial">Industrial Land / Warehouse</option>
                      <option value="agricultural">Agricultural / Farm Land</option>
                      <option value="residential">Residential Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Listing Status *
                    </label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="available">Available</option>
                      <option value="negotiation">Under Negotiation</option>
                      <option value="sold">Sold / Leased</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Area / Location in Mathura *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      placeholder="e.g. Mandi Choraha, Mathura"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Plot / Space Size *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSize}
                      onChange={e => setFormSize(e.target.value)}
                      placeholder="e.g. 500 Sq. Yards or 1,800 Sq. Ft."
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected Rate / Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPrice}
                      onChange={e => setFormPrice(e.target.value)}
                      placeholder="e.g. ₹ 45 Lakhs or Price on Request"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* 1-Click Photo Upload from Device (Zero URLs!) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-navy-950 block">Property Photos</span>
                      <span className="text-[11px] text-slate-500">Upload photos directly from your device</span>
                    </div>

                    <label className="cursor-pointer px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {formPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formPhotos.map((photo, pIdx) => (
                        <div key={pIdx} className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-300 group">
                          <img src={photo} alt="Property" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(pIdx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Description & Strategic Advantages *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Describe the property, road connectivity, landmark proximity, and commercial suitability..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Features / Specifications (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formFeatures}
                    onChange={e => setFormFeatures(e.target.value)}
                    placeholder="Clear freehold registry&#10;35 ft road frontage&#10;Direct highway connectivity"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={e => setFormPublished(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Publish Listing on Website</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={e => setFormFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors"
                  >
                    {saving ? 'Saving...' : editingProp ? 'Update Listing' : 'Publish Property Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
