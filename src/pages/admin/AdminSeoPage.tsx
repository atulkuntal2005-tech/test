import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { updateSiteData } from '../../services/api.ts';
import { SEOConfig } from '../../types/index.ts';
import { Search, Save, ExternalLink, Globe, CheckCircle2 } from 'lucide-react';

export const AdminSeoPage: React.FC = () => {
  const { siteData, adminToken, refreshSiteData, showNotification } = useSite();

  const [seo, setSeo] = useState<SEOConfig>({
    defaultTitle: '',
    titleTemplate: '',
    defaultDescription: '',
    canonicalBase: '',
    ogImage: '',
    keywords: []
  });

  const [keywordsText, setKeywordsText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (siteData?.seo) {
      setSeo(siteData.seo);
      setKeywordsText(siteData.seo.keywords.join(', '));
    }
  }, [siteData]);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSaving(true);
    try {
      const updatedSeo: SEOConfig = {
        ...seo,
        keywords: keywordsText.split(',').map(k => k.trim()).filter(Boolean)
      };

      await updateSiteData(adminToken, { seo: updatedSeo });
      await refreshSiteData();
      showNotification('success', 'SEO configuration saved and published!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout currentTab="seo">
      <form onSubmit={handleSaveSeo} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Technical SEO & Meta Tags
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage title tags, search snippets, canonical URLs, and indexing configuration
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? 'Saving...' : 'Save SEO Configuration'}</span>
          </button>
        </div>

        {/* Core Metadata Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Search className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-navy-950 font-display">
              Primary Search Meta Tags
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Meta Title (&lt;title&gt;) *
            </label>
            <input
              type="text"
              required
              value={seo.defaultTitle}
              onChange={e => setSeo({ ...seo, defaultTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Length: {seo.defaultTitle.length} characters (Recommended 30–60 characters)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meta Description (&lt;meta name="description"&gt;) *
            </label>
            <textarea
              rows={3}
              required
              value={seo.defaultDescription}
              onChange={e => setSeo({ ...seo, defaultDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            ></textarea>
            <p className="text-[11px] text-slate-400 mt-1">
              Length: {seo.defaultDescription.length} characters (Recommended 120–160 characters)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-navy-950 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Canonical Link & Social Card (Automated)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Canonical links and OpenGraph social preview images are configured automatically from your domain and owner portraits. You do not need to enter or configure any URLs.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target SEO Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywordsText}
              onChange={e => setKeywordsText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Indexing & Sitemap Verification Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-navy-950 font-display">
              Google Indexing Endpoints
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            These technical endpoints are served dynamically by the backend and updated automatically when services or pages are edited.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy-950 block">XML Sitemap</span>
                <span className="text-[11px] text-slate-500 font-mono">/sitemap.xml</span>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-navy-900 text-white rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <span>View XML</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy-950 block">Robots Directives</span>
                <span className="text-[11px] text-slate-500 font-mono">/robots.txt</span>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-navy-900 text-white rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <span>View Text</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Google Search Console Guidance */}
          <div className="mt-4 p-4 rounded-xl bg-navy-950 text-white space-y-2 text-xs">
            <span className="text-amber-400 font-bold uppercase tracking-wider block">
              Google Search Console Instructions
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
              <li>Log in to Google Search Console and add your domain or URL prefix property.</li>
              <li>Verify domain ownership using HTML meta tag or DNS TXT record.</li>
              <li>Navigate to <strong>Sitemaps</strong> in the left console menu.</li>
              <li>Enter <code className="text-amber-300 font-mono">sitemap.xml</code> and click <strong>Submit</strong>.</li>
              <li>Google will fetch all canonical public pages: Home, About, Owners, Services, Contact, FAQ, and individual service URLs.</li>
            </ol>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};
