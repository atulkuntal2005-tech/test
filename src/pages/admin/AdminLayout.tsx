import React from 'react';
import { useSite } from '../../context/SiteContext.tsx';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  PhoneCall,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building,
  HelpCircle,
  Inbox
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode; currentTab: string }> = ({
  children,
  currentTab
}) => {
  const { siteData, isAdmin, logoutAdmin } = useSite();
  const { navigate } = useRouter();

  if (!isAdmin) {
    // Redirect to login if unauthenticated
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center max-w-sm w-full space-y-4">
          <ShieldCheck className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-navy-950 font-display">Authentication Required</h2>
          <p className="text-xs text-slate-600">Please sign in with administrator credentials to access this section.</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full py-2.5 px-4 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Listings', href: '/admin/properties', icon: Building },
    { id: 'contact', label: 'Contact & Inquiries', href: '/admin/contact', icon: PhoneCall },
    { id: 'owners', label: 'Owner Profiles', href: '/admin/owners', icon: Users },
    { id: 'services', label: 'Services CMS', href: '/admin/services', icon: Briefcase },
    { id: 'pages', label: 'Page Content', href: '/admin/pages', icon: FileText },
    { id: 'seo', label: 'Technical SEO', href: '/admin/seo', icon: Search },
    { id: 'settings', label: 'Branding & Security', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full md:w-64 bg-navy-950 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-navy-900">
        <div>
          {/* Brand header */}
          <div className="p-4 sm:p-5 border-b border-navy-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-navy-800 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                GA
              </div>
              <div>
                <span className="font-bold text-sm text-white font-display block leading-none">
                  Admin Console
                </span>
                <span className="text-[10px] text-amber-400">Shri Goyal Associates</span>
              </div>
            </div>

            <Link
              to="/"
              className="text-xs px-2.5 py-1 rounded bg-navy-900 text-amber-400 border border-navy-800 hover:text-white flex items-center gap-1 md:hidden"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Desktop Nav links & Mobile horizontal scrolling tabs */}
          <nav className="p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
            {menuItems.map(item => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 ${
                    active
                      ? 'bg-amber-500 text-navy-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-navy-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions (Desktop) */}
        <div className="hidden md:block p-4 border-t border-navy-900 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Public Website</span>
            </span>
            <span className="text-[10px] text-slate-400">↗</span>
          </Link>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
