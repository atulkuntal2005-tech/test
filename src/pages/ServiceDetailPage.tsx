import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { useRouter, Link } from '../context/RouterContext.tsx';
import { submitContactInquiry } from '../services/api.ts';
import { CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Phone, MessageSquare, Clock, Send } from 'lucide-react';

export const ServiceDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
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

  const service = siteData.services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold text-navy-950 font-display">Service Not Found</h1>
        <p className="text-slate-600">The requested service could not be located or may have been updated.</p>
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Services</span>
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
        serviceInterest: service.title,
        message: formMessage
      });
      setFormSuccess(true);
      showNotification('success', 'Your inquiry has been submitted directly to Shri Goyal Associates.');
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
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-950">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-navy-950">Services</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">{service.title}</span>
        </nav>

        <div className="max-w-4xl space-y-4">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Practice Area
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            {service.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Full Details */}
          <div className="lg:col-span-7 space-y-10">
            {/* Detailed Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-950 font-display">
                Service Scope & Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
                <p>{service.fullDescription}</p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-navy-950 font-display">
                Key Deliverables & Advantages
              </h3>
              <ul className="space-y-3">
                {service.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-navy-950 font-display">
                Who Is This Service For?
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                {service.targetAudience}
              </p>
            </div>

            {/* Process Steps */}
            {service.processSteps && service.processSteps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-navy-950 font-display">
                  Our Engagement & Consultation Process
                </h3>
                <div className="space-y-3">
                  {service.processSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-navy-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed pt-1">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Direct Consultation Form Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 sticky top-28">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Direct Inquiries
                </span>
                <h3 className="text-xl font-bold text-navy-950 font-display mt-0.5">
                  Inquire for This Service
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect with Jitendra Goyal or Hemant Goyal regarding this service.
                </p>
              </div>

              {formSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <p className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Inquiry Received Successfully!
                  </p>
                  <p className="text-xs text-emerald-800">
                    Our associates in Mathura will review your details and contact you shortly.
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
                      Phone Number *
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
                      Requirement Details *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={`Tell us about your requirements regarding ${service.title}...`}
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
                        <span>Send Consultation Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Direct call options */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Or Contact Immediately:
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
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello, I would like to inquire about ${service.title} at Shri Goyal Associates.`)}`}
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
