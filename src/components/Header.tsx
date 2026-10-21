import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { useRouter, Link } from '../context/RouterContext.tsx';
import { Phone, MessageSquare, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { siteData, isAdmin } = useSite();
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = siteData?.business.phone?.trim();
  const hasPhone = Boolean(phone);
  const cleanPhone = phone?.replace(/[^0-9+]/g, '');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Owners', href: '/owners' },
    { label: 'Services', href: '/services' },
    { label: 'Properties', href: '/properties' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Quick Utility Bar with Direct Admin Access */}
      <div className="bg-navy-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-navy-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] truncate">
            <span className="text-amber-400 font-semibold uppercase tracking-wider">Mathura Office:</span>
            <span className="truncate text-slate-300">Mandi Choraha, near Narsi Vihar, Mathura, UP 281004</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/properties"
              className="text-[11px] text-amber-300 hover:text-white transition-colors"
            >
              Commercial & Land Listings
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 hover:text-white bg-navy-900 hover:bg-navy-800 px-2.5 py-0.5 rounded border border-amber-500/30 transition-colors shadow-xs"
              title="Open Admin Section directly without typing any URL"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Section (Direct Access)</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center text-amber-400 font-bold text-xl shadow-xs border border-amber-500/20">
              GA
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-navy-950 font-display whitespace-nowrap">
                Shri Goyal Associates
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline-block">
                Mathura · Mandi Choraha
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Single line, text with hover underline) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navLinks.map(link => {
              const isActive = path === link.href || (link.href !== '/' && path.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors py-1 whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'border-amber-600 text-navy-950 font-semibold'
                      : 'border-transparent hover:text-navy-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Admin Portal */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {hasPhone ? (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call: {phone}</span>
              </a>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <span>Consultation Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            )}

            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                title="Direct Admin Access — No URL needed"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              className="p-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"
              title="Admin Section"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-[11px]">Admin</span>
            </Link>
            {hasPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="p-2 text-navy-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                aria-label="Direct Call"
              >
                <Phone className="w-4 h-4 text-amber-600" />
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Admin Section Callout for Mobile (Zero URL entry) */}
          <div className="p-3 bg-navy-950 rounded-xl text-white space-y-2 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Admin Section (Direct Access)
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                No URL Needed
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Add properties, change phone numbers, update owner portraits, and edit services.
            </p>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors"
            >
              {isAdmin ? 'Open Admin Dashboard' : 'Open Admin Portal / Sign In'}
            </Link>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const isActive = path === link.href || (link.href !== '/' && path.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium ${
                    isActive ? 'bg-navy-50 text-navy-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {hasPhone ? (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-navy-900 rounded-lg"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {phone}</span>
              </a>
            ) : (
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-navy-900 rounded-lg"
              >
                <span>Request Consultation</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
