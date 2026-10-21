import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { createService, updateService, deleteService } from '../../services/api.ts';
import { Service } from '../../types/index.ts';
import { Plus, Edit3, Trash2, CheckCircle2, X, MoveUp, MoveDown, Briefcase } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formKeyBenefits, setFormKeyBenefits] = useState('');
  const [formTargetAudience, setFormTargetAudience] = useState('');
  const [formProcessSteps, setFormProcessSteps] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  const services = siteData?.services || [];

  const openCreateModal = () => {
    setEditingService(null);
    setFormTitle('');
    setFormSlug('');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormKeyBenefits('');
    setFormTargetAudience('');
    setFormProcessSteps('');
    setFormPublished(true);
    setFormFeatured(false);
    setIsCreating(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormTitle(service.title);
    setFormSlug(service.slug);
    setFormShortDesc(service.shortDescription);
    setFormFullDesc(service.fullDescription);
    setFormKeyBenefits(service.keyBenefits.join('\n'));
    setFormTargetAudience(service.targetAudience);
    setFormProcessSteps(service.processSteps ? service.processSteps.join('\n') : '');
    setFormPublished(service.published);
    setFormFeatured(service.featured);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingService(null);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingService) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    if (!formTitle.trim()) {
      showNotification('error', 'Service title is required');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Service> = {
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: formShortDesc.trim(),
        fullDescription: formFullDesc.trim(),
        keyBenefits: formKeyBenefits.split('\n').map(s => s.trim()).filter(Boolean),
        targetAudience: formTargetAudience.trim(),
        processSteps: formProcessSteps.split('\n').map(s => s.trim()).filter(Boolean),
        published: formPublished,
        featured: formFeatured
      };

      if (editingService) {
        await updateService(adminToken, editingService.id, payload);
        showNotification('success', 'Service updated successfully');
      } else {
        await createService(adminToken, payload);
        showNotification('success', 'New service created and published');
      }

      await refreshSiteData();
      closeModal();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!adminToken) return;
    try {
      await deleteService(adminToken, id);
      await refreshSiteData();
      showNotification('success', 'Service deleted successfully');
      setConfirmDeleteId(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete service');
    }
  };

  const handleTogglePublish = async (service: Service) => {
    if (!adminToken) return;
    try {
      await updateService(adminToken, service.id, { published: !service.published });
      await refreshSiteData();
      showNotification('success', `Service ${!service.published ? 'published' : 'unpublished'}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle status');
    }
  };

  return (
    <AdminLayout currentTab="services">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Services Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create, modify, publish, or remove commercial services offered by Shri Goyal Associates
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Configured Services ({services.length})
            </span>
            <span className="text-xs text-slate-400">Mathura Commercial Offerings</span>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((service, index) => (
              <div key={service.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-amber-600">0{index + 1}.</span>
                    <h3 className="font-bold text-base text-navy-950">{service.title}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        service.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {service.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    {service.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">{service.shortDescription}</p>
                  <p className="text-[11px] font-mono text-slate-400">/services/{service.slug}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(service)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                  >
                    {service.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 transition-colors"
                    title="Edit Service"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(service.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-navy-950 font-display">Confirm Deletion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this service permanently? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteService(confirmDeleteId)}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-xl font-bold text-navy-950 font-display">
                  {editingService ? 'Edit Commercial Service' : 'Add New Commercial Service'}
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-navy-950">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g. Commercial Lease Negotiation"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    The web address is generated automatically from this title. No URL configuration needed.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Short Summary (Homepage & Card snippet) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formShortDesc}
                    onChange={e => setFormShortDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence description of this service..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full In-Depth Scope & Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formFullDesc}
                    onChange={e => setFormFullDesc(e.target.value)}
                    placeholder="Comprehensive explanation of what this service covers and how Shri Goyal Associates advises the client..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Deliverables & Benefits (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formKeyBenefits}
                    onChange={e => setFormKeyBenefits(e.target.value)}
                    placeholder="Enter each key benefit on a new line..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Clients / Who Is This For?
                  </label>
                  <input
                    type="text"
                    value={formTargetAudience}
                    onChange={e => setFormTargetAudience(e.target.value)}
                    placeholder="e.g. Commercial landlords, regional traders, and retail firms"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consultation & Process Steps (One step per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formProcessSteps}
                    onChange={e => setFormProcessSteps(e.target.value)}
                    placeholder="Step 1: Preliminary meeting&#10;Step 2: Feasibility review..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    <span>Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={e => setFormFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Highlight on Homepage</span>
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
                    {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
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
