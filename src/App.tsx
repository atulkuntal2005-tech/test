import React from 'react';
import { SiteProvider } from './context/SiteContext.tsx';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { ContactFloat } from './components/ContactFloat.tsx';
import { Toast } from './components/Toast.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { OwnersPage } from './pages/OwnersPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetailPage.tsx';
import { PropertiesPage } from './pages/PropertiesPage.tsx';
import { PropertyDetailPage } from './pages/PropertyDetailPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminContactPage } from './pages/admin/AdminContactPage.tsx';
import { AdminOwnersPage } from './pages/admin/AdminOwnersPage.tsx';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.tsx';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage.tsx';
import { AdminPagesPage } from './pages/admin/AdminPagesPage.tsx';
import { AdminSeoPage } from './pages/admin/AdminSeoPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  // Normalize path
  const normalizedPath = path.split('?')[0].replace(/\/+$/, '') || '/';

  // Check admin routes
  const isAdminRoute = normalizedPath.startsWith('/admin');

  const renderRoute = () => {
    // Admin Routes
    if (normalizedPath === '/admin/login') return <AdminLoginPage />;
    if (normalizedPath === '/admin' || normalizedPath === '/admin/dashboard') return <AdminDashboardPage />;
    if (normalizedPath === '/admin/contact') return <AdminContactPage />;
    if (normalizedPath === '/admin/owners') return <AdminOwnersPage />;
    if (normalizedPath === '/admin/services') return <AdminServicesPage />;
    if (normalizedPath === '/admin/properties') return <AdminPropertiesPage />;
    if (normalizedPath === '/admin/pages') return <AdminPagesPage />;
    if (normalizedPath === '/admin/seo') return <AdminSeoPage />;
    if (normalizedPath === '/admin/settings') return <AdminSettingsPage />;

    // Public Routes
    if (normalizedPath === '/') return <HomePage />;
    if (normalizedPath === '/about') return <AboutPage />;
    if (normalizedPath === '/owners') return <OwnersPage />;
    if (normalizedPath === '/services') return <ServicesPage />;
    if (normalizedPath === '/properties') return <PropertiesPage />;
    if (normalizedPath === '/contact') return <ContactPage />;
    if (normalizedPath === '/faq') return <FAQPage />;
    if (normalizedPath === '/privacy-policy') return <PrivacyPolicyPage />;
    if (normalizedPath === '/terms') return <TermsPage />;

    // Property Detail Route: /properties/:slug
    if (normalizedPath.startsWith('/properties/')) {
      const slug = normalizedPath.replace('/properties/', '');
      return <PropertyDetailPage slug={slug} />;
    }

    // Service Detail Route: /services/:slug
    if (normalizedPath.startsWith('/services/')) {
      const slug = normalizedPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} />;
    }

    // Custom 404
    return <NotFoundPage />;
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        <Toast />
        {renderRoute()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Toast />
      <Header />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <ContactFloat />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </RouterProvider>
  );
}
