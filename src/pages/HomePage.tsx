import React from 'react';
import { useSite } from '../../src/context/SiteContext.tsx';
import { useRouter, Link } from '../../src/context/RouterContext.tsx';
import { Phone, MessageSquare, MapPin, ArrowRight, CheckCircle2, ShieldCheck, Clock, Users, Briefcase, Building2, Tag, Maximize2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { siteData, loading } = useSite();
  const { navigate } = useRouter();

  if (loading || !siteData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { business, owners, services, pageContent } = siteData;
  const phone = business.phone?.trim();
  const whatsapp = business.whatsapp?.trim();
  const cleanPhone = phone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(business.whatsappMessage || 'Hello Shri Goyal Associates');

  const visibleOwners = owners.filter(o => o.visible);
  const featuredServices = services.filter(s => s.published);
  const featuredProperties = (siteData.properties || []).filter(p => p.published);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#deb356_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Proposition and Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Metadata (Zero-pill discipline) */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
                <span>Mathura, Uttar Pradesh</span>
                <span aria-hidden="true">·</span>
                <span>Mandi Choraha</span>
                <span aria-hidden="true">·</span>
                <span>PIN 281004</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display text-white text-balance leading-tight">
                {pageContent.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {pageContent.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {phone ? (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-semibold text-sm transition-all shadow-md active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Direct Call: {phone}</span>
                  </a>
                ) : (
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-semibold text-sm transition-all shadow-md active:scale-95"
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {whatsapp ? (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                ) : (
                  <Link
                    to="/owners"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-sm transition-all border border-navy-700"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Meet Our Owners</span>
                  </Link>
                )}
              </div>

              {/* Trust Evidence Row */}
              <div className="pt-6 border-t border-navy-800/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct Associate Accessibility</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Established in Mathura (Mandi Choraha)</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mon – Sat: 9:30 AM – 7:30 PM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Anchor (Owners Portrait Duo) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-navy-900 border border-amber-500/30 p-4 sm:p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                  <div>
                    <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Principals & Proprietors</p>
                    <h2 className="text-lg font-bold text-white font-display">Shri Goyal Associates</h2>
                  </div>
                  <span className="text-xs text-slate-400">Mathura, UP</span>
                </div>

                {/* Two Owners Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {/* Jitendra Goyal */}
                  <div className="group rounded-xl overflow-hidden bg-navy-950 border border-navy-800 transition-all hover:border-amber-500/50">
                    <div className="aspect-[3/4] relative overflow-hidden bg-navy-900">
                      <img
                        src="/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg"
                        alt="Jitendra Goyal - Co-Founder & Senior Associate"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white leading-tight">Jitendra Goyal</h3>
                      <p className="text-[11px] text-amber-400 mt-0.5">Co-Founder & Senior Associate</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Navy blazer & white shirt</p>
                    </div>
                  </div>

                  {/* Hemant Goyal */}
                  <div className="group rounded-xl overflow-hidden bg-navy-950 border border-navy-800 transition-all hover:border-amber-500/50">
                    <div className="aspect-[3/4] relative overflow-hidden bg-navy-900">
                      <img
                        src="/assets/aistudio/852243082_2083592802283499_2179126346531225521_n_00c05961.jpg"
                        alt="Hemant Goyal - Co-Founder & Managing Partner"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white leading-tight">Hemant Goyal</h3>
                      <p className="text-[11px] text-amber-400 mt-0.5">Co-Founder & Managing Partner</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Grey blazer & black shirt</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Direct Consultation Available</span>
                  <Link to="/owners" className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1">
                    <span>Full Biographies</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Owners Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Firm Leadership
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-navy-950 font-display">
            Meet Our Proprietors & Senior Associates
          </h2>
          <p className="text-slate-600 text-sm">
            Shri Goyal Associates is guided by our two principal founders who oversee every consultation personally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {visibleOwners.map((owner, idx) => (
            <div
              key={owner.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-5/12 relative aspect-[3/4] sm:aspect-auto sm:min-h-[300px] overflow-hidden bg-slate-100">
                <img
                  src={owner.photo}
                  alt={`${owner.name} - ${owner.designation}`}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="sm:w-7/12 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                    Associate 0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-navy-950 font-display mt-1">
                    {owner.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-600">
                    {owner.designation}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Attire: {owner.attire}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {owner.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {owner.specialties.map(spec => (
                      <span
                        key={spec}
                        className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/owners"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-amber-600 transition-colors"
                  >
                    <span>Read Full Profile & Consultation Areas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Showcase (Bento / Editorial numbering) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Advisory Capabilities
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 font-display mt-1">
              Commercial Consultation & Services
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-amber-600 transition-colors whitespace-nowrap"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {featuredServices.slice(0, 4).map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-amber-600">
                    0{index + 1}.
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Mathura & Western UP</span>
                </div>

                <h3 className="text-xl font-bold text-navy-950 font-display">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Key Deliverables:
                  </p>
                  <ul className="space-y-1.5">
                    {service.keyBenefits.slice(0, 3).map((benefit, bIdx) => (
                      <li key={bIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Target: {service.targetAudience.slice(0, 35)}...
                </span>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-amber-600 transition-colors"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties & Land Parcels Showcase */}
      {featuredProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Prime Real Estate & Commercial Land</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-navy-950 font-display">
                Featured Commercial & Land Listings in Mathura
              </h2>
              <p className="text-slate-600 text-sm">
                Verified plots, retail showrooms, and industrial parcels personally vetted by Shri Goyal Associates.
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors shrink-0 shadow-xs"
            >
              <span>Explore All Properties ({featuredProperties.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.slice(0, 3).map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={property.photos?.[0] || '/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-navy-950/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-amber-500/20">
                    {property.propertyType}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {property.status === 'available' ? 'Available' : property.status === 'discussion' ? 'Under Discussion' : 'Acquired'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-navy-950 font-display line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    {property.size && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Area: {property.size}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {property.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Valuation / Terms</span>
                      <span className="text-xs font-bold text-navy-950">{property.priceDisplay}</span>
                    </div>
                    <Link
                      to={`/properties/${property.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business Location & Physical Presence */}
      <section className="bg-slate-100/80 py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Physical Office & Location
              </div>
              <h2 className="text-3xl font-bold text-navy-950 font-display tracking-tight">
                Operating Directly From Mandi Choraha, Mathura
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Shri Goyal Associates maintains its primary corporate office in Mathura at Mandi Choraha, near Narsi Vihar. We provide dedicated on-ground commercial assistance and in-person consultations by prior appointment.
              </p>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-950">Official Address:</p>
                    <p className="text-slate-600 mt-0.5">
                      Mathura, Mandi Choraha, near Narsi Vihar, Uttar Pradesh, India — PIN 281004.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-950">Consultation Timings:</p>
                    <p className="text-slate-600 mt-0.5">
                      {business.businessHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors"
                >
                  View Route & Contact Details
                </Link>
                {phone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Call Us</span>
                  </a>
                )}
              </div>
            </div>

            {/* Google Map Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                <div className="p-4 bg-navy-900 text-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Mandi Choraha, near Narsi Vihar, Mathura (281004)</span>
                  </div>
                  <a
                    href={business.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Get Directions →
                  </a>
                </div>
                <div className="aspect-[16/10] w-full bg-slate-200 relative">
                  <iframe
                    title="Shri Goyal Associates Office Location"
                    src={business.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-amber-500/30">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Connect With Shri Goyal Associates
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Ready to Discuss Your Commercial Requirements?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Speak directly with Jitendra Goyal or Hemant Goyal for personalized advisory in Mathura and surrounding regional markets.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-sm transition-colors shadow-sm"
              >
                Submit Consultation Request
              </Link>
              {whatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
