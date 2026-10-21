import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { updateBusinessInfo, fetchInquiries, updateInquiryStatus, deleteInquiry } from '../../services/api.ts';
import { BusinessInfo, ContactInquiry } from '../../types/index.ts';
import { Save, Phone, MessageSquare, MapPin, Mail, Clock, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminContactPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [form, setForm] = useState<BusinessInfo>({
    businessName: '',
    tagline: '',
    address: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
    whatsapp: '',
    whatsappMessage: '',
    email: '',
    businessHours: '',
    googleMapsEmbedUrl: '',
    googleMapsDirectionsUrl: ''
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'inquiries'>('info');

  useEffect(() => {
    if (siteData?.business) {
      setForm(siteData.business);
    }
    if (adminToken) {
      fetchInquiries(adminToken).then(setInquiries).catch(console.error);
    }
  }, [siteData, adminToken]);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSaving(true);
    try {
      const updatedForm = {
        ...form,
        googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(form.address)}&output=embed`,
        googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.address)}`
      };
      await updateBusinessInfo(adminToken, updatedForm);
      await refreshSiteData();
      showNotification('success', 'Business contact information updated and saved to database successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update contact settings');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactInquiry['status']) => {
    if (!adminToken) return;
    try {
      await updateInquiryStatus(adminToken, id, status);
      setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      showNotification('success', `Status updated to ${status}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!adminToken) return;
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;

    try {
      await deleteInquiry(adminToken, id);
      setInquiries(prev => prev.filter(i => i.id !== id));
      showNotification('success', 'Inquiry deleted');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete inquiry');
    }
  };

  return (
    <AdminLayout currentTab="contact">
      <div className="space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Business Contact & Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure phone numbers, WhatsApp, business hours, and customer submissions
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-lg">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'info' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Contact Settings
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'inquiries' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Inquiries Inbox ({inquiries.length})
            </button>
          </div>
        </div>

        {activeTab === 'info' ? (
          <form onSubmit={handleSaveBusiness} className="space-y-6">
            {/* Phone & WhatsApp Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Phone className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-navy-950 font-display">
                  Clickable Direct Call & WhatsApp Configuration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct-Call Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210 or 0565-XXXXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Activates clickable <code className="text-navy-900 bg-slate-100 px-1 py-0.5 rounded">tel:</code> links across the header, footer, and mobile action bars.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +919876543210 (International format without spaces)"
                    value={form.whatsapp}
                    onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Uses official <code className="text-navy-900 bg-slate-100 px-1 py-0.5 rounded">wa.me/&lt;number&gt;</code> click-to-chat.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Pre-filled WhatsApp Message
                </label>
                <textarea
                  rows={2}
                  value={form.whatsappMessage}
                  onChange={e => setForm({ ...form, whatsappMessage: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
                <p className="text-[11px] text-slate-400 mt-1">
                  Customers clicking the WhatsApp button will have this pre-filled in their chat window.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Business Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@shrigoyalassociates.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating & Consultation Hours
                  </label>
                  <input
                    type="text"
                    value={form.businessHours}
                    onChange={e => setForm({ ...form, businessHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Address & Business Details Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-navy-950 font-display">
                  Official Business Address & Location
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Formatted Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Automatic Map Status - No manual URLs needed */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-navy-950 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google Map & Directions (Automatically Handled)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The Google Maps embed and driving directions links are automatically generated from your address above. You do not need to find or paste any Google Maps URLs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{saving ? 'Saving...' : 'Save & Publish Contact Information'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-navy-950 font-display">
                Customer Inquiries Inbox
              </h2>
              <span className="text-xs text-slate-500">{inquiries.length} submissions recorded</span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No inquiries recorded in the database yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {inquiries.map(inq => (
                  <div key={inq.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy-950">{inq.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            inq.status === 'new'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {inq.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={e => handleStatusChange(inq.id, e.target.value as any)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700">Phone: </span>
                        <a href={`tel:${inq.phone}`} className="text-amber-700 hover:underline">
                          {inq.phone}
                        </a>
                      </div>
                      {inq.email && (
                        <div>
                          <span className="font-semibold text-slate-700">Email: </span>
                          <a href={`mailto:${inq.email}`} className="text-amber-700 hover:underline">
                            {inq.email}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed">
                      <p className="font-semibold text-navy-950 mb-0.5">
                        Area of Interest: {inq.serviceInterest}
                      </p>
                      <p>{inq.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
