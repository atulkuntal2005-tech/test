import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { ChevronDown, HelpCircle, ArrowRight, Phone, MessageSquare } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { siteData, loading } = useSite();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { faqs, business } = siteData;
  const publishedFaqs = faqs.filter(f => f.published);

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-16 py-12">
      {/* Title */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <span>Information & Queries</span>
            <span aria-hidden="true">·</span>
            <span>Client Clarifications</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Find immediate answers regarding our office location at Mandi Choraha, proprietors Jitendra Goyal and Hemant Goyal, consultation process, and working hours.
          </p>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {publishedFaqs.map((faq, idx) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-amber-600 pt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-base sm:text-lg font-bold text-navy-950 font-display">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-xl font-bold text-navy-950 font-display">
            Have a Specific Question Not Listed Here?
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Our associates are happy to clarify any inquiries about commercial services, agreements, or local documentation in Mathura.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white font-semibold text-xs hover:bg-navy-800 transition-colors"
            >
              <span>Contact Shri Goyal Associates Directly</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
