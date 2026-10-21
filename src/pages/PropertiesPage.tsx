import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { Link } from '../context/RouterContext.tsx';
import { Building2, MapPin, Maximize2, Tag, CheckCircle2, ArrowRight, Phone, MessageSquare, Search } from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const { siteData, loading } = useSite();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading || !siteData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const properties = (siteData.properties || []).filter(p => p.published);

  const filtered = properties.filter(prop => {
    const matchesType = filterType === 'all' || prop.propertyType === filterType;
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const propertyTypes = [
    { id: 'all', label: 'All Properties' },
    { id: 'commercial', label: 'Commercial Plots' },
    { id: 'office', label: 'Shops & Showrooms' },
    { id: 'industrial', label: 'Industrial Land' },
    { id: 'agricultural', label: 'Agricultural Land' }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <span>Real Estate & Land Consultation</span>
            <span aria-hidden="true">·</span>
            <span>Mathura & Regional Corridors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-navy-950 tracking-tight text-balance">
            Commercial Properties & Land Parcels
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Verified commercial plots, prime retail spaces, and industrial land across Mandi Choraha, NH-19, and Mathura district. Directly facilitated by Shri Goyal Associates.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by area, location, or property type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {propertyTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    filterType === t.id
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-slate-700 font-medium text-sm">No properties found matching your selection.</p>
            <button
              onClick={() => {
                setFilterType('all');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-amber-700 underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo container */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                    <img
                      src={property.photos?.[0] || '/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-sm text-amber-400 border border-amber-500/30">
                        {property.propertyType.toUpperCase()}
                      </span>
                      {property.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500 text-navy-950">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                          property.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : property.status === 'negotiation'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {property.status === 'available' ? 'AVAILABLE' : property.status === 'negotiation' ? 'UNDER NEGOTIATION' : 'SOLD'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-navy-950 font-display line-clamp-1">
                        {property.title}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>

                    {/* Size and Price Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-1 border-y border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Plot / Space</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Maximize2 className="w-3 h-3 text-amber-600" />
                          <span>{property.size || 'On Request'}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expected Rate</span>
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{property.priceDisplay}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Key features */}
                    <ul className="space-y-1">
                      {property.features.slice(0, 2).map((feat, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <Link
                    to={`/contact?property=${encodeURIComponent(property.title)}`}
                    className="text-xs font-semibold text-slate-600 hover:text-navy-950 transition-colors"
                  >
                    Quick Inquiry
                  </Link>

                  <Link
                    to={`/properties/${property.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors"
                  >
                    <span>View Property</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Property Consultation Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-navy-950 text-white border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Land & Real Estate Consultation
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Looking to Buy, Sell, or Verify Commercial Property in Mathura?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Shri Goyal Associates facilitates title verification, registry checks, local authority clearances, and structured negotiation for commercial plots, retail spaces, and agricultural land parcels across Mathura.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors whitespace-nowrap shadow-sm"
          >
            Consult With Our Associates
          </Link>
        </div>
      </section>
    </div>
  );
};
