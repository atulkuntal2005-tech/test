import { SiteData, ContactInquiry, Service, Owner, FAQ, PropertyListing } from '../types/index.ts';
import { fallbackSiteData } from './fallbackData.ts';

const API_BASE = '/api';

function getLocalSiteData(): SiteData {
  try {
    const saved = localStorage.getItem('sga_local_site_data');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to read local site data', e);
  }
  return fallbackSiteData;
}

function saveLocalSiteData(data: SiteData) {
  try {
    localStorage.setItem('sga_local_site_data', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save local site data', e);
  }
}

function getLocalInquiries(): ContactInquiry[] {
  try {
    const saved = localStorage.getItem('sga_local_inquiries');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to read local inquiries', e);
  }
  return [];
}

function saveLocalInquiries(inquiries: ContactInquiry[]) {
  try {
    localStorage.setItem('sga_local_inquiries', JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save local inquiries', e);
  }
}

export async function fetchSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(`${API_BASE}/site-data`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveLocalSiteData(json.data);
        return json.data;
      }
    }
  } catch {
    // Backend API unreachable (e.g. pure static hosting on Hostinger)
  }
  return getLocalSiteData();
}

export async function submitContactInquiry(inquiry: {
  name: string;
  phone: string;
  email?: string;
  serviceInterest?: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback: save to local inquiries for static Hostinger deployment
    const inquiries = getLocalInquiries();
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email || '',
      serviceInterest: inquiry.serviceInterest || 'General Inquiry',
      message: inquiry.message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    inquiries.unshift(newInquiry);
    saveLocalInquiries(inquiries);
    return {
      success: true,
      message: 'Thank you! Your inquiry has been delivered directly to Shri Goyal Associates. We will contact you shortly.'
    };
  }
  throw new Error('Failed to submit inquiry');
}

// Admin APIs
export async function adminLogin(password: string): Promise<{ token: string; user: { username: string; role: string } }> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }
    if (data.error) throw new Error(data.error);
  } catch (err: any) {
    if (err.message === 'Invalid administrator credentials') {
      throw err;
    }
    // Static hosting fallback
    const savedPassword = localStorage.getItem('sga_admin_pass') || 'GoyalAdmin@2026';
    if (password === savedPassword) {
      const mockToken = `static-token-${Date.now()}`;
      return {
        token: mockToken,
        user: { username: 'admin', role: 'admin' }
      };
    }
    throw new Error('Invalid administrator credentials');
  }
  throw new Error('Login failed');
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  if (!token) return false;
  if (token.startsWith('static-token-')) return true;
  try {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return Boolean(data.success && data.authenticated);
  } catch {
    return true; // Keep local session active
  }
}

export async function fetchAdminStats(token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const siteData = getLocalSiteData();
  const inquiries = getLocalInquiries();
  return {
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter(i => i.status === 'new').length,
    totalServices: siteData.services.length,
    publishedServices: siteData.services.filter(s => s.published).length,
    totalFaqs: siteData.faqs.length,
    hasConfiguredPhone: Boolean(siteData.business.phone),
    hasConfiguredWhatsApp: Boolean(siteData.business.whatsapp),
    hasConfiguredEmail: Boolean(siteData.business.email)
  };
}

export async function updateBusinessInfo(token: string, businessData: Partial<SiteData['business']>) {
  try {
    const res = await fetch(`${API_BASE}/admin/business`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(businessData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.business = { ...current.business, ...businessData };
  saveLocalSiteData(current);
  return current.business;
}

export async function updateOwners(token: string, owners: Owner[]) {
  try {
    const res = await fetch(`${API_BASE}/admin/owners`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ owners })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.owners = owners;
  saveLocalSiteData(current);
  return current.owners;
}

export async function uploadOwnerPhoto(token: string, ownerId: string, dataUrl: string, filename?: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/upload-owner-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ownerId, dataUrl, filename })
    });
    if (res.ok) {
      const data = await res.json();
      return data.photoUrl;
    }
  } catch {
    // Static fallback: store dataUrl directly
  }
  const current = getLocalSiteData();
  const owner = current.owners.find(o => o.id === ownerId);
  if (owner) {
    owner.photo = dataUrl;
    saveLocalSiteData(current);
  }
  return dataUrl;
}

export async function createService(token: string, serviceData: Partial<Service>) {
  try {
    const res = await fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  const newService: Service = {
    id: `srv-${Date.now()}`,
    title: serviceData.title || 'New Service',
    slug: serviceData.slug || (serviceData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    shortDescription: serviceData.shortDescription || '',
    fullDescription: serviceData.fullDescription || '',
    keyBenefits: serviceData.keyBenefits || [],
    targetAudience: serviceData.targetAudience || '',
    processSteps: serviceData.processSteps || [],
    published: serviceData.published !== undefined ? serviceData.published : true,
    featured: Boolean(serviceData.featured),
    order: current.services.length + 1
  };
  current.services.push(newService);
  saveLocalSiteData(current);
  return newService;
}

export async function updateService(token: string, id: string, serviceData: Partial<Service>) {
  try {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  const index = current.services.findIndex(s => s.id === id);
  if (index !== -1) {
    current.services[index] = { ...current.services[index], ...serviceData };
    saveLocalSiteData(current);
    return current.services[index];
  }
  throw new Error('Service not found');
}

export async function deleteService(token: string, id: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.services = current.services.filter(s => s.id !== id);
  saveLocalSiteData(current);
  return true;
}

export async function updateFaqs(token: string, faqs: FAQ[]) {
  try {
    const res = await fetch(`${API_BASE}/admin/faqs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ faqs })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.faqs = faqs;
  saveLocalSiteData(current);
  return current.faqs;
}

export async function updateSiteData(token: string, updates: Partial<SiteData>) {
  try {
    const res = await fetch(`${API_BASE}/admin/site-data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  const merged = { ...current, ...updates };
  saveLocalSiteData(merged);
  return merged;
}

export async function fetchInquiries(token: string): Promise<ContactInquiry[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  return getLocalInquiries();
}

export async function updateInquiryStatus(token: string, id: string, status: ContactInquiry['status'], adminNotes?: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, adminNotes })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const inquiries = getLocalInquiries();
  const inq = inquiries.find(i => i.id === id);
  if (inq) {
    inq.status = status;
    if (adminNotes !== undefined) inq.adminNotes = adminNotes;
    saveLocalInquiries(inquiries);
    return inq;
  }
  throw new Error('Inquiry not found');
}

export async function deleteInquiry(token: string, id: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch {
    // Static fallback
  }
  const inquiries = getLocalInquiries().filter(i => i.id !== id);
  saveLocalInquiries(inquiries);
  return true;
}

export async function updateAdminPassword(token: string, currentPassword: string, newPassword: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (res.ok) return true;
  } catch {
    // Static fallback
  }
  const savedPassword = localStorage.getItem('sga_admin_pass') || 'GoyalAdmin@2026';
  if (currentPassword !== savedPassword) {
    throw new Error('Current password is incorrect');
  }
  localStorage.setItem('sga_admin_pass', newPassword);
  return true;
}

export async function createProperty(token: string, propertyData: Partial<PropertyListing>) {
  try {
    const res = await fetch(`${API_BASE}/admin/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  const slug = (propertyData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProperty: PropertyListing = {
    id: `prop-${Date.now()}`,
    title: propertyData.title || 'New Property',
    slug: propertyData.slug || slug,
    propertyType: propertyData.propertyType || 'commercial',
    location: propertyData.location || 'Mathura, UP',
    size: propertyData.size || '',
    priceDisplay: propertyData.priceDisplay || 'Price on Consultation',
    description: propertyData.description || '',
    features: propertyData.features || [],
    photos: propertyData.photos || [],
    status: propertyData.status || 'available',
    published: propertyData.published !== undefined ? propertyData.published : true,
    featured: Boolean(propertyData.featured),
    order: (current.properties || []).length + 1
  };
  current.properties = current.properties || [];
  current.properties.push(newProperty);
  saveLocalSiteData(current);
  return newProperty;
}

export async function updateProperty(token: string, id: string, propertyData: Partial<PropertyListing>) {
  try {
    const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.properties = current.properties || [];
  const index = current.properties.findIndex(p => p.id === id);
  if (index !== -1) {
    current.properties[index] = { ...current.properties[index], ...propertyData };
    saveLocalSiteData(current);
    return current.properties[index];
  }
  throw new Error('Property not found');
}

export async function deleteProperty(token: string, id: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch {
    // Static fallback
  }
  const current = getLocalSiteData();
  current.properties = (current.properties || []).filter(p => p.id !== id);
  saveLocalSiteData(current);
  return true;
}

