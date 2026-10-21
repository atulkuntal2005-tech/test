import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { updateSiteData, updateFaqs } from '../../services/api.ts';
import { PageContent, FAQ } from '../../types/index.ts';
import { Save, Plus, Trash2, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const AdminPagesPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [pageContent, setPageContent] = useState<PageContent>({
    heroHeadline: '',
    heroSubtitle: '',
    heroBadge: '',
    aboutIntro: '',
    aboutStory: '',
    aboutMission: '',
    values: [],
    privacyPolicy: '',
    termsAndConditions: ''
  });

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'faqs' | 'legal'>('content');

  // FAQ Modal state
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [showAddFaq, setShowAddFaq] = useState(false);

  useEffect(() => {
    if (siteData?.pageContent) {
      setPageContent(siteData.pageContent);
    }
    if (siteData?.faqs) {
      setFaqs(siteData.faqs);
    }
  }, [siteData]);

  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSaving(true);
    try {
      await updateSiteData(adminToken, { pageContent });
      await refreshSiteData();
      showNotification('success', 'Page content saved and published live to database!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save page content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFaqs = async () => {
    if (!adminToken) return;
    setSaving(true);
    try {
      await updateFaqs(adminToken, faqs);
      await refreshSiteData();
      showNotification('success', 'FAQs updated successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update FAQs');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      showNotification('error', 'Question and answer cannot be empty');
      return;
    }

    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
      category: 'General',
      order: faqs.length + 1,
      published: true
    };

    const updated = [...faqs, newFaq];
    setFaqs(updated);
    setNewFaqQ('');
    setNewFaqA('');
    setShowAddFaq(false);

    if (adminToken) {
      await updateFaqs(adminToken, updated);
      await refreshSiteData();
      showNotification('success', 'New FAQ added and published live!');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!adminToken) return;
    if (!window.confirm('Delete this FAQ?')) return;

    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    await updateFaqs(adminToken, updated);
    await refreshSiteData();
    showNotification('success', 'FAQ deleted');
  };

  return (
    <AdminLayout currentTab="pages">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Page Content & Texts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Edit headlines, about story, company mission, FAQs, and legal policies
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-lg">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'content' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Headlines & About
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'faqs' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              FAQs ({faqs.length})
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'legal' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              Legal & Policies
            </button>
          </div>
        </div>

        {activeTab === 'content' && (
          <form onSubmit={handleSavePageContent} className="space-y-6">
            {/* Hero Section Texts */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-navy-950 font-display pb-3 border-b border-slate-100">
                Homepage Hero Section
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Kicker / Top Badge
                </label>
                <input
                  type="text"
                  value={pageContent.heroBadge}
                  onChange={e => setPageContent({ ...pageContent, heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={pageContent.heroHeadline}
                  onChange={e => setPageContent({ ...pageContent, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Subtitle & Introduction *
                </label>
                <textarea
                  rows={3}
                  required
                  value={pageContent.heroSubtitle}
                  onChange={e => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* About Page Texts */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-navy-950 font-display pb-3 border-b border-slate-100">
                About Us Page Content
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About Headline Intro
                </label>
                <input
                  type="text"
                  value={pageContent.aboutIntro}
                  onChange={e => setPageContent({ ...pageContent, aboutIntro: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Firm Story & Mathura Narrative
                </label>
                <textarea
                  rows={4}
                  value={pageContent.aboutStory}
                  onChange={e => setPageContent({ ...pageContent, aboutStory: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Core Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={pageContent.aboutMission}
                  onChange={e => setPageContent({ ...pageContent, aboutMission: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{saving ? 'Saving...' : 'Save & Publish Page Content'}</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-950 font-display">
                    Frequently Asked Questions (FAQs)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add or update questions displayed on /faq and schema.org FAQ structured data
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFaq(true)}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {showAddFaq && (
                <form onSubmit={handleAddFaq} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">New FAQ Entry</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Question *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Do you handle documentation for commercial leases in Mathura?"
                      value={newFaqQ}
                      onChange={e => setNewFaqQ(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Answer *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Clear explanation..."
                      value={newFaqA}
                      onChange={e => setNewFaqA(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddFaq(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-navy-900 text-white text-xs font-semibold rounded"
                    >
                      Save FAQ
                    </button>
                  </div>
                </form>
              )}

              <div className="divide-y divide-slate-100">
                {faqs.map((faq, idx) => (
                  <div key={faq.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-mono font-bold text-amber-600 mt-0.5">0{idx + 1}.</span>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => {
                            const copy = [...faqs];
                            copy[idx].question = e.target.value;
                            setFaqs(copy);
                          }}
                          className="font-bold text-sm text-navy-950 bg-transparent border-b border-dashed border-slate-300 focus:border-amber-500 w-full"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={e => {
                        const copy = [...faqs];
                        copy[idx].answer = e.target.value;
                        setFaqs(copy);
                      }}
                      className="w-full text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                    ></textarea>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveFaqs}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save FAQs Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <form onSubmit={handleSavePageContent} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-navy-950 font-display pb-3 border-b border-slate-100">
                Privacy Policy Content (/privacy-policy)
              </h2>
              <textarea
                rows={8}
                value={pageContent.privacyPolicy}
                onChange={e => setPageContent({ ...pageContent, privacyPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono leading-relaxed"
              ></textarea>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-navy-950 font-display pb-3 border-b border-slate-100">
                Terms and Conditions Content (/terms)
              </h2>
              <textarea
                rows={8}
                value={pageContent.termsAndConditions}
                onChange={e => setPageContent({ ...pageContent, termsAndConditions: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono leading-relaxed"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Legal Content</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};
