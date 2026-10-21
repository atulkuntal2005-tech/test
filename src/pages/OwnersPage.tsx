import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { Phone, MessageSquare, Mail, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const OwnersPage: React.FC = () => {
  const { siteData, loading } = useSite();

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { owners, business } = siteData;
  const visibleOwners = owners.filter(o => o.visible);
  const phone = business.phone?.trim();
  const whatsapp = business.whatsapp?.trim();
  const cleanPhone = phone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(business.whatsappMessage || 'Hello Shri Goyal Associates');

  return (
    <div className="space-y-16 lg:space-y-24 py-12">
      {/* Page Title */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <span>Leadership & Proprietors</span>
            <span aria-hidden="true">·</span>
            <span>Shri Goyal Associates</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Our Owners & Senior Associates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Personal leadership and direct associate access are the cornerstones of Shri Goyal Associates. Every consultation is directly overseen by our founding partners, Jitendra Goyal and Hemant Goyal.
          </p>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {visibleOwners.map((owner, idx) => (
            <div
              key={owner.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Photo Column */}
              <div className="lg:col-span-5 relative bg-slate-900 overflow-hidden flex items-center justify-center min-h-[380px] lg:min-h-[480px]">
                <img
                  src={owner.photo}
                  alt={`${owner.name} - ${owner.designation}`}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                    Proprietor Portrait
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {owner.attire}
                  </p>
                </div>
              </div>

              {/* Bio & Details Column */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold text-amber-600">
                      ASSOCIATE #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500">
                      Mathura Office · Mandi Choraha
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 font-display">
                      {owner.name}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-amber-700 mt-1">
                      {owner.designation}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {owner.bio}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Key Areas of Practice & Consultation:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {owner.specialties.map(spec => (
                        <div key={spec} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/contact?associate=${encodeURIComponent(owner.name)}`}
                    className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                  >
                    <span>Request Meeting with {owner.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>

                  {phone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 font-semibold text-xs transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Direct Office Call</span>
                    </a>
                  )}

                  {whatsapp && (
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello, I would like to enquire about consultation with ${owner.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Query</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Philosophy Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-100 p-8 sm:p-12 border border-slate-200 space-y-4">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Our Consultation Guarantee
          </span>
          <h3 className="text-2xl font-bold font-display text-navy-950">
            Direct Access to Proprietors Without Middlemen
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            When you engage Shri Goyal Associates, your commercial files and strategy are directly managed by Jitendra Goyal or Hemant Goyal. This guarantees absolute discretion, rapid decision-making, and decades of regional commercial wisdom applied directly to your venture.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-amber-600 transition-colors"
            >
              <span>Schedule your consultation at Mandi Choraha, Mathura</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
