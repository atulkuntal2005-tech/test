import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { siteData, loading } = useSite();

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { pageContent } = siteData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <span>Terms of Use</span>
          <span aria-hidden="true">·</span>
          <span>Shri Goyal Associates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-navy-950 mt-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective date: October 2026 · Mathura Jurisdiction, Uttar Pradesh, India
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm whitespace-pre-line">
        {pageContent.termsAndConditions}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
        Governed under the laws of the Republic of India and subject to the jurisdiction of the competent courts in Mathura, Uttar Pradesh.
      </div>
    </div>
  );
};
