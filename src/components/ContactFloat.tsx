import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Phone, MessageSquare } from 'lucide-react';

export const ContactFloat: React.FC = () => {
  const { siteData } = useSite();
  const business = siteData?.business;

  const phone = business?.phone?.trim();
  const whatsapp = business?.whatsapp?.trim();

  // If neither is configured yet, do not render a floating bar to avoid broken buttons
  if (!phone && !whatsapp) {
    return null;
  }

  const cleanPhone = phone?.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    business?.whatsappMessage || 'Hello Shri Goyal Associates, I would like to enquire about your services.'
  );

  return (
    <>
      {/* Desktop Floating Action Pill (Bottom-Right, non-intrusive) */}
      <aside aria-label="Quick contact" className="hidden md:flex fixed bottom-6 right-6 z-30 flex-col items-end gap-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-semibold border border-emerald-500/30 group"
            aria-label="Chat on WhatsApp with Shri Goyal Associates"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        )}

        {phone && (
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-navy-900 hover:bg-navy-800 text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-semibold border border-amber-500/30 group"
            aria-label="Direct Phone Call to Shri Goyal Associates"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call: {phone}</span>
          </a>
        )}
      </aside>

      {/* Mobile Sticky Action Bar: Max height capped at 56px to strictly respect the 15% mobile sticky cap rule */}
      <nav aria-label="Mobile quick actions" className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-around gap-2">
        {phone && (
          <a
            href={`tel:${cleanPhone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-navy-900 text-white text-xs font-semibold active:bg-navy-800"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Call Now</span>
          </a>
        )}

        {whatsapp && (
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodedMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold active:bg-emerald-700"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">WhatsApp</span>
          </a>
        )}
      </nav>
    </>
  );
};
