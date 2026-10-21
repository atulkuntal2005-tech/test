import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { Phone, MessageSquare, MapPin, Clock, Mail, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteData, isAdmin } = useSite();
  const currentYear = new Date().getFullYear();

  const business = siteData?.business;
  const phone = business?.phone?.trim();
  const whatsapp = business?.whatsapp?.trim();
  const email = business?.email?.trim();
  const cleanPhone = phone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(business?.whatsappMessage || 'Hello Shri Goyal Associates');

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      {/* Top Footer Banner */}
      <div className="border-b border-navy-900 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-300/80 font-medium uppercase tracking-wider">Registered Office</p>
                <p className="text-sm text-slate-200 mt-0.5">
                  Mandi Choraha, near Narsi Vihar, Mathura, UP 281004
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-300/80 font-medium uppercase tracking-wider">Working Hours</p>
                <p className="text-sm text-slate-200 mt-0.5">
                  {business?.businessHours || 'Mon – Sat: 9:30 AM – 7:30 PM'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {phone ? (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold transition-colors border border-navy-700"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call: {phone}</span>
                </a>
              ) : null}

              {whatsapp ? (
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              ) : null}

              {!phone && !whatsapp && (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-semibold transition-colors"
                >
                  <span>Connect With Our Associates</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-navy-800 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20">
                GA
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Shri Goyal Associates
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Professional commercial consultation, strategic advisory, and regulatory liaison firm based in Mathura, Uttar Pradesh. Personally directed by proprietors Jitendra Goyal and Hemant Goyal.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <p className="font-medium text-slate-300">Principals & Proprietors:</p>
              <p className="mt-1">
                Jitendra Goyal · Co-Founder & Senior Associate
              </p>
              <p className="mt-0.5">
                Hemant Goyal · Co-Founder & Managing Partner
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">
              Website Sitemap
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/owners" className="hover:text-amber-300 transition-colors">
                  Our Owners
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-300 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-amber-300 font-semibold hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Properties & Land</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-normal">New</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">
              Our Advisory
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteData?.services.filter(s => s.published).slice(0, 4).map(srv => (
                <li key={srv.id}>
                  <Link
                    to={`/services/${srv.slug}`}
                    className="hover:text-amber-300 transition-colors line-clamp-1"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-xs text-amber-400/90 hover:text-amber-300 font-medium">
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Technical */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">
              Legal & Technical
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>sitemap.xml</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>robots.txt</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/admin/login'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-amber-500/40 text-xs font-semibold text-amber-400 hover:text-white hover:bg-navy-800 transition-colors shadow-xs"
                  title="Direct Admin Access — No URL needed"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAdmin ? 'Open Admin Console' : 'Admin Portal Access'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} Shri Goyal Associates. All rights reserved. Mandi Choraha, near Narsi Vihar, Mathura, UP 281004.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/properties" className="hover:text-slate-300 transition-colors">
              Properties
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
