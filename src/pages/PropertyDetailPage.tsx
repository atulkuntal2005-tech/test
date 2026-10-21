import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { useRouter, Link } from '../context/RouterContext.tsx';
import { submitContactInquiry } from '../services/api.ts';
import {
  MapPin,
  Maximize2,
  Tag,
  CheckCircle2,
  ArrowLeft,
  Phone,
  MessageSquare,
  ShieldCheck,
  Send,
  Building2
} from 'lucide-react';

export const PropertyDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { siteData, loading, showNotification } = useSite();
  const { navigate } = useRouter();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const property = (siteData.properties || []).find(p => p.slug === slug || p.id === slug);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold text-navy-950 font-display">Property Not Found</h1>
        <p className="text-slate-600">The requested property listing could not be found or has been updated.</p>
        <div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  const business = siteData.business;
  const phone = business.phone?.trim();
  const whatsapp = business.whatsapp?.trim();
  const cleanPhone = phone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, '');

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formMessage.trim()) {
      showNotification('error', 'Please fill in your name, phone number, and query details.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactInquiry({
        name: formName,
        phone: formPhone,
        email: formEmail,
        serviceInterest: `Property Inquiry: ${property.title}`,
        message: formMessage
      });
      setFormSuccess(true);
      showNotification('success', 'Your property inquiry has been delivered directly to Shri Goyal Associates.');
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 lg:space-y-16 py-12">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-950">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-navy-950">Properties</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">{property.title}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {property.propertyType.toUpperCase()}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded text-white ${
                  property.status === 'available'
                    ? 'bg-emerald-600'
                    : property.status === 'negotiation'
                    ? 'bg-amber-600'
                    : 'bg-slate-700'
                }`}
              >
                {property.status === 'available' ? 'AVAILABLE' : property.status === 'negotiation' ? 'UNDER NEGOTIATION' : 'SOLD'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-display text-navy-950 tracking-tight mt-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Pricing / Terms</span>
            <span className="text-2xl font-bold text-amber-700 font-display">
              {property.priceDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Photo & Info vs Inquiry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Primary Image */}
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-[16/10]">
              <img
                src={property.photos?.[0] || '/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Area / Dimensions</span>
                <span className="text-sm sm:text-base font-bold text-navy-950 mt-0.5 block">{property.size || 'On Request'}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Location Hub</span>
                <span className="text-sm sm:text-base font-bold text-navy-950 mt-0.5 block">Mathura, UP</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-semibold">Status</span>
                <span className="text-sm sm:text-base font-bold text-emerald-700 mt-0.5 block uppercase">{property.status}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-navy-950 font-display">
                Property Overview & Strategic Value
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* Key Features */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-navy-950 font-display">
                  Key Specifications & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Due Diligence Guarantee */}
            <div className="p-5 rounded-2xl bg-navy-950 text-white space-y-2 border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Title & Documentation Verification</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Shri Goyal Associates verifies municipal zoning, revenue records, registry chains, and encumbrance certificates for all properties listed through our firm to guarantee full legal clarity.
              </p>
            </div>
          </div>

          {/* Right Column: Direct Consultation Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 sticky top-28">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Site Visit & Discussion
                </span>
                <h3 className="text-xl font-bold text-navy-950 font-display mt-0.5">
                  Inquire for This Property
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect with Jitendra Goyal or Hemant Goyal to arrange a physical site visit or discuss commercial terms.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <p className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Inquiry Received Successfully!
                  </p>
                  <p className="text-xs text-emerald-800">
                    Our team will contact you to coordinate property documentation or a site visit.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-xs font-semibold text-emerald-900 underline mt-2 block"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Details / Proposed Usage *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={`I am interested in ${property.title}. Please share site visit schedule and registry details...`}
                      value={formMessage}
                      onChange={e => setFormMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {submitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Property Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Direct call options */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Direct Immediate Consultation:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {phone ? (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>Call Now</span>
                    </a>
                  ) : null}

                  {whatsapp ? (
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello, I would like to inquire about ${property.title} in Mathura.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
