import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { MapPin, Clock, ShieldCheck, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteData, loading } = useSite();

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { business, pageContent, owners } = siteData;

  return (
    <div className="space-y-16 lg:space-y-24 py-12">
      {/* Top Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 tracking-wider uppercase">
            <span>About Shri Goyal Associates</span>
            <span aria-hidden="true">·</span>
            <span>Mathura, Uttar Pradesh</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Rooted in Mathura, Dedicated to Commercial Excellence
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {pageContent.aboutIntro}
          </p>
        </div>
      </section>

      {/* Narrative & History Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-navy-950 font-display">
              Our Story & Founding Vision
            </h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              <p>
                {pageContent.aboutStory}
              </p>
              <p>
                Operating centrally from Mandi Choraha, near Narsi Vihar in Mathura, our firm bridges local business requirements with transparent, structured advisory. We recognize that commercial ventures, trade contracts, and regulatory documentation require clear attention to detail and direct accountability.
              </p>
              <p>
                Unlike distant advisory entities, Shri Goyal Associates prioritizes on-ground presence, accessibility, and straightforward counsel. Our proprietors, Jitendra Goyal and Hemant Goyal, bring complementary strengths to ensure clients receive comprehensive assistance across every facet of regional commerce.
              </p>
            </div>

            {/* Mission Box */}
            <div className="p-6 rounded-2xl bg-navy-950 text-white border border-amber-500/30 space-y-2">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Our Core Mission
              </h3>
              <p className="text-base text-slate-200 leading-relaxed">
                {pageContent.aboutMission}
              </p>
            </div>
          </div>

          {/* Right Column: Office & Founders Glance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <h3 className="text-lg font-bold text-navy-950 font-display">
                Firm Details at a Glance
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy-950 block">Registered Office:</span>
                    <span className="text-slate-600">
                      Mandi Choraha, near Narsi Vihar, Mathura, Uttar Pradesh, PIN 281004.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy-950 block">Key Principals:</span>
                    <span className="text-slate-600">
                      Jitendra Goyal & Hemant Goyal
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy-950 block">Office Timings:</span>
                    <span className="text-slate-600">
                      {business.businessHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/owners"
                  className="w-full py-2.5 px-4 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Owner Biographies</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-bold text-navy-950 font-display mt-1">
              The Values That Drive Shri Goyal Associates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageContent.values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/40 transition-all space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                  0{i + 1}
                </div>
                <h3 className="text-base font-bold text-navy-950 font-display">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-navy-900 text-white border border-navy-800">
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              Connect With Our Senior Associates
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Have questions regarding commercial opportunities or documentation in Mathura?
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors whitespace-nowrap"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};
