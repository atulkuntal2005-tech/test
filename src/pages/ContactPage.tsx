import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { useRouter } from '../context/RouterContext.tsx';
import { submitContactInquiry } from '../services/api.ts';
import { Phone, MessageSquare, MapPin, Clock, Mail, CheckCircle2, AlertCircle, Send, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteData, loading, showNotification } = useSite();
  const { path } = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Commercial Business Advisory');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL query parameters (e.g. ?service=... or ?associate=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service');
      const associateParam = urlParams.get('associate');
      if (serviceParam) {
        setServiceInterest(serviceParam);
      } else if (associateParam) {
        setServiceInterest(`Consultation with ${associateParam}`);
      }
    }
  }, []);

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { business, services } = siteData;
  const configuredPhone = business.phone?.trim();
  const configuredWhatsApp = business.whatsapp?.trim();
  const cleanPhone = configuredPhone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = configuredWhatsApp?.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    business.whatsappMessage || 'Hello Shri Goyal Associates, I would like to enquire about your services.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please provide your full name (at least 2 characters).');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('Please provide a valid phone or mobile number.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Please provide consultation details or a brief message (min 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactInquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceInterest,
        message: message.trim(),
        honeypot
      });
      setSubmittedSuccess(true);
      showNotification('success', 'Thank you! Your inquiry has been delivered directly to Shri Goyal Associates.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try calling directly or WhatsApp.');
      showNotification('error', err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12">
      {/* Title */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <span>Direct Inquiries & Location</span>
            <span aria-hidden="true">·</span>
            <span>Mathura Office</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Contact Shri Goyal Associates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Reach out directly to schedule a commercial consultation, discuss documentation requirements, or visit our office at Mandi Choraha, Mathura.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Details & Inquiry Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Action Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-navy-950 font-display">
                Office Information
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy-950 block">Office Address:</span>
                    <span className="text-slate-600 leading-relaxed">
                      Mathura, Mandi Choraha, near Narsi Vihar, Uttar Pradesh, India — PIN 281004.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy-950 block">Operating Hours:</span>
                    <span className="text-slate-600">
                      {business.businessHours}
                    </span>
                  </div>
                </div>

                {business.email && (
                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-navy-950 block">Email Address:</span>
                      <a href={`mailto:${business.email}`} className="text-amber-700 hover:underline">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Direct Contact Options:
                </p>

                {configuredPhone ? (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Direct Call: {configuredPhone}</span>
                  </a>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                    <p className="font-medium">Direct phone number is being configured by administrator.</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">Please submit the form below or chat on WhatsApp.</p>
                  </div>
                )}

                {configuredWhatsApp ? (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* Directions & Landmark Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-navy-950 font-display">
                Location & Landmarks
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Located near Mandi Choraha close to Narsi Vihar, Mathura. Easily reachable by auto, taxi, or personal transport from Mathura Junction and major highways.
              </p>
              <a
                href={business.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                <span>Open in Google Maps for Navigation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Direct Submission
              </span>
              <h2 className="text-2xl font-bold text-navy-950 font-display mt-1">
                Send Us a Consultation Message
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                All inquiries are received directly by our Mathura office. We respond promptly.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Inquiry Successfully Delivered</span>
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Thank you for reaching out to Shri Goyal Associates. Your consultation request has been logged in our system. Our senior associates, Jitendra Goyal or Hemant Goyal, will follow up with you.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-3 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for spam bots */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Agarwal"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. anand@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Service / Consultation Interest
                    </label>
                    <select
                      value={serviceInterest}
                      onChange={e => setServiceInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Commercial Business Advisory">Commercial Business Advisory</option>
                      <option value="Documentation & Regulatory Liaison">Documentation & Regulatory Liaison</option>
                      <option value="Contract & Partnership Facilitation">Contract & Partnership Facilitation</option>
                      <option value="Regional Enterprise Consultation">Regional Enterprise Consultation</option>
                      <option value="Consultation with Jitendra Goyal">Consultation with Jitendra Goyal</option>
                      <option value="Consultation with Hemant Goyal">Consultation with Hemant Goyal</option>
                      <option value="General Commercial Inquiry">General Commercial Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Details / Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your business or documentation requirements in detail..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <span>Submitting inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Submit Inquiries to Shri Goyal Associates</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <div className="p-4 bg-navy-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-amber-300">
              Office Location: Mandi Choraha, near Narsi Vihar, Mathura, Uttar Pradesh 281004
            </span>
            <a
              href={business.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="aspect-[16/7] w-full bg-slate-200">
            <iframe
              title="Shri Goyal Associates Map"
              src={business.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
