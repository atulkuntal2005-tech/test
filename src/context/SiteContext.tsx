import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteData } from '../types/index.ts';
import { fetchSiteData, adminLogin, verifyAdminSession } from '../services/api.ts';

interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

interface SiteContextType {
  siteData: SiteData | null;
  loading: boolean;
  error: string | null;
  refreshSiteData: () => Promise<void>;
  adminToken: string | null;
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<void>;
  logoutAdmin: () => void;
  notification: NotificationState | null;
  showNotification: (type: 'success' | 'error', message: string) => void;
  clearNotification: () => void;
}

const SiteContext = createContext<SiteContextType>({
  siteData: null,
  loading: true,
  error: null,
  refreshSiteData: async () => {},
  adminToken: null,
  isAdmin: false,
  loginAdmin: async () => {},
  logoutAdmin: () => {},
  notification: null,
  showNotification: () => {},
  clearNotification: () => {}
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('sga_admin_token');
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const refreshSiteData = useCallback(async () => {
    try {
      const data = await fetchSiteData();
      setSiteData(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load site data:', err);
      setError(err.message || 'Error loading website data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteData();
  }, [refreshSiteData]);

  // Check admin token validity on mount or when token changes
  useEffect(() => {
    if (!adminToken) {
      setIsAdmin(false);
      return;
    }
    verifyAdminSession(adminToken).then(valid => {
      if (valid) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setAdminToken(null);
        localStorage.removeItem('sga_admin_token');
      }
    });
  }, [adminToken]);

  const loginAdmin = async (password: string) => {
    const res = await adminLogin(password);
    localStorage.setItem('sga_admin_token', res.token);
    setAdminToken(res.token);
    setIsAdmin(true);
    showNotification('success', 'Logged into Admin Dashboard successfully');
  };

  const logoutAdmin = () => {
    localStorage.removeItem('sga_admin_token');
    setAdminToken(null);
    setIsAdmin(false);
    showNotification('success', 'Logged out of administrator panel');
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
        loading,
        error,
        refreshSiteData,
        adminToken,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        notification,
        showNotification,
        clearNotification
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
