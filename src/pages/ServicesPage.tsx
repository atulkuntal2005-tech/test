import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { CheckCircle2, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { siteData, loading } = useSite();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const publishedServices = siteData.services.filter(s => s.published);
  const filtered = publishedServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <span>Commercial & Regulatory Advisory</span>
            <span aria-hidden="true">·</span>
            <span>Mathura, UP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Our Professional Advisory Services
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Shri Goyal Associates provides dedicated business advisory, commercial contract facilitation, and statutory documentation representation for enterprises across Mathura and Western Uttar Pradesh.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by keyword or practice area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <p className="text-slate-600 font-medium">No services matched your search term "{searchTerm}".</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all hover:border-amber-500/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold text-amber-600">
                      SERVICE 0{index + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      Mathura & Regional Hub
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-navy-950 font-display">
                    {service.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Key Highlights:
                    </p>
                    <ul className="space-y-1.5">
                      {service.keyBenefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-500 pt-2">
                    <span className="font-semibold text-slate-700">Suitable For: </span>
                    {service.targetAudience}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="text-xs font-semibold text-slate-600 hover:text-navy-950 transition-colors"
                  >
                    Quick Inquiry
                  </Link>
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors"
                  >
                    <span>View Full Details & Process</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom Consultation Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-navy-950 font-display">
              Require a Custom Commercial Consultation in Mathura?
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl">
              If your enterprise has unique regional requirements, joint venture structuring, or special documentation needs, our founders are available for bespoke consultations.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors whitespace-nowrap"
          >
            Consult With Our Associates
          </Link>
        </div>
      </section>
    </div>
  );
};
