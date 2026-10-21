import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { useRouter } from '../../context/RouterContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { fetchAdminStats, fetchInquiries, updateInquiryStatus } from '../../services/api.ts';
import { ContactInquiry } from '../../types/index.ts';
import {
  Users,
  Briefcase,
  PhoneCall,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Building2,
  Plus
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { siteData, adminToken, showNotification } = useSite();
  const { navigate } = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) return;

    Promise.all([
      fetchAdminStats(adminToken),
      fetchInquiries(adminToken)
    ])
      .then(([statsData, inquiriesData]) => {
        setStats(statsData);
        setInquiries(inquiriesData);
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [adminToken]);

  const handleUpdateStatus = async (id: string, status: ContactInquiry['status']) => {
    if (!adminToken) return;
    try {
      await updateInquiryStatus(adminToken, id, status);
      setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      showNotification('success', `Inquiry status changed to ${status}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  const business = siteData?.business;
  const missingPhone = !business?.phone?.trim();
  const missingWhatsApp = !business?.whatsapp?.trim();

  return (
    <AdminLayout currentTab="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Administrative Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Control center for Shri Goyal Associates · Mandi Choraha, Mathura
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/contact')}
              className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors"
            >
              Configure Phone & WhatsApp
            </button>
          </div>
        </div>

        {/* Configuration Readiness Notice */}
        {(missingPhone || missingWhatsApp) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-950">
                  Contact Numbers Pending Configuration
                </p>
                <p className="text-xs text-amber-900 mt-0.5">
                  {missingPhone && missingWhatsApp
                    ? 'Neither the direct-call phone number nor the WhatsApp number is configured yet. Configure them now so customer contact buttons activate.'
                    : missingPhone
                    ? 'The direct-call phone number is not configured yet. Set it in Contact Settings.'
                    : 'The WhatsApp business number is not configured yet. Set it in Contact Settings.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/contact')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Configure Numbers Now →
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Inquiries</span>
              <Inbox className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-navy-950 mt-2">
              {stats?.totalInquiries ?? inquiries.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">From contact & service forms</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">New Inquiries</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
              {inquiries.filter(i => i.status === 'new').length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting response</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Published Services</span>
              <Briefcase className="w-4 h-4 text-navy-800" />
            </div>
            <div className="text-2xl font-bold font-mono text-navy-950 mt-2">
              {siteData?.services.filter(s => s.published).length ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active commercial services</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Active Owners</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-navy-950 mt-2">
              {siteData?.owners.filter(o => o.visible).length ?? 2}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Jitendra & Hemant Goyal</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Property Listings</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-navy-950 mt-2">
              {siteData?.properties?.length ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Commercial & Land listings</span>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Quick Actions
            </h2>
            <button
              onClick={() => navigate('/admin/properties')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Property</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => navigate('/admin/properties')}
              className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:border-amber-500 hover:bg-amber-50 transition-all text-left space-y-1"
            >
              <Building2 className="w-4 h-4 text-amber-700" />
              <p className="text-xs font-bold text-navy-950">Add / Edit Properties</p>
              <p className="text-[11px] text-slate-500">Commercial plots, shops & land</p>
            </button>

            <button
              onClick={() => navigate('/admin/owners')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-slate-50 transition-all text-left space-y-1"
            >
              <Users className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-bold text-navy-950">Update Owner Portraits</p>
              <p className="text-[11px] text-slate-500">Manage photos, bios & titles</p>
            </button>

            <button
              onClick={() => navigate('/admin/services')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-slate-50 transition-all text-left space-y-1"
            >
              <Briefcase className="w-4 h-4 text-navy-800" />
              <p className="text-xs font-bold text-navy-950">Manage Services</p>
              <p className="text-[11px] text-slate-500">Create, edit, or reorder services</p>
            </button>

            <button
              onClick={() => navigate('/admin/pages')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-slate-50 transition-all text-left space-y-1"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-bold text-navy-950">Edit Page Text & FAQs</p>
              <p className="text-[11px] text-slate-500">Hero texts, mission, and FAQs</p>
            </button>

            <button
              onClick={() => navigate('/admin/seo')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-slate-50 transition-all text-left space-y-1"
            >
              <Briefcase className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-bold text-navy-950">Technical SEO</p>
              <p className="text-[11px] text-slate-500">Meta tags, sitemap & robots</p>
            </button>
          </div>
        </div>

        {/* Recent Inquiries Inbox */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-navy-950 font-display">
                Recent Inquiries & Contact Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Direct messages submitted by clients on the website
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/contact')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              View All Inquiries →
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No inquiries received yet. Submit a test message on the Contact page to verify.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.slice(0, 5).map(inq => (
                <div key={inq.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
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
                      <span className="text-xs text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Phone:</span> {inq.phone}{' '}
                      {inq.email && <>| <span className="font-semibold text-slate-700">Email:</span> {inq.email}</>}
                    </p>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                      <span className="font-semibold text-navy-900">[{inq.serviceInterest}]:</span> {inq.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {inq.status === 'new' && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, 'contacted')}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {inq.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
