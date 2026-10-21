import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.ts';
import { requireAdmin, authenticateAdminCredentials, createSessionToken, verifySessionToken } from './server/auth.ts';
import { Service, PropertyListing } from './src/types/index.ts';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static asset folders
app.use('/assets/aistudio', express.static(path.resolve(process.cwd(), 'public/assets/aistudio')));
app.use('/owners', express.static(path.resolve(process.cwd(), 'public/owners')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));

// ----------------------------------------------------
// Public APIs
// ----------------------------------------------------

// Get full site public data
app.get('/api/site-data', (_req: Request, res: Response) => {
  const siteData = db.getSiteData();
  res.json({ success: true, data: siteData });
});

// Get published services
app.get('/api/services', (_req: Request, res: Response) => {
  const services = db.getServices().filter(s => s.published);
  res.json({ success: true, data: services });
});

// Get single service by slug
app.get('/api/services/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const service = db.getServices().find(s => s.slug === slug);
  if (!service) {
    res.status(404).json({ success: false, error: 'Service not found' });
    return;
  }
  res.json({ success: true, data: service });
});

// Get visible owners
app.get('/api/owners', (_req: Request, res: Response) => {
  const owners = db.getOwners().filter(o => o.visible);
  res.json({ success: true, data: owners });
});

// Get published properties
app.get('/api/properties', (_req: Request, res: Response) => {
  const properties = db.getProperties().filter(p => p.published);
  res.json({ success: true, data: properties });
});

// Get single property by slug or id
app.get('/api/properties/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const property = db.getProperties().find(p => p.slug === slug || p.id === slug);
  if (!property) {
    res.status(404).json({ success: false, error: 'Property not found' });
    return;
  }
  res.json({ success: true, data: property });
});

// Submit contact inquiry
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, serviceInterest, message, honeypot } = req.body;

  // Spam prevention honeypot
  if (honeypot) {
    res.json({ success: true, message: 'Inquiry received' });
    return;
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ success: false, error: 'Please provide a valid full name' });
    return;
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    res.status(400).json({ success: false, error: 'Please provide a valid phone or mobile number' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ success: false, error: 'Please provide a message or inquiry description (min 5 characters)' });
    return;
  }

  const savedInquiry = db.addInquiry({
    name: name.trim(),
    phone: phone.trim(),
    email: email ? String(email).trim() : '',
    serviceInterest: serviceInterest ? String(serviceInterest).trim() : 'General Inquiry',
    message: message.trim()
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your inquiry has been delivered directly to Shri Goyal Associates. We will contact you shortly.',
    data: savedInquiry
  });
});

// Dynamic XML Sitemap
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const siteData = db.getSiteData();
  const baseUrl = siteData.seo.canonicalBase.replace(/\/$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/owners', priority: '0.9', changefreq: 'monthly' },
    { loc: '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  ];

  const serviceRoutes = siteData.services
    .filter(s => s.published)
    .map(s => ({
      loc: `/services/${s.slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));

  const propertyRoutes = (siteData.properties || [])
    .filter(p => p.published)
    .map(p => ({
      loc: `/properties/${p.slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));

  const allUrls = [
    ...staticRoutes,
    { loc: '/properties', priority: '0.9', changefreq: 'weekly' },
    ...serviceRoutes,
    ...propertyRoutes
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const siteData = db.getSiteData();
  const baseUrl = siteData.seo.canonicalBase.replace(/\/$/, '');
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// ----------------------------------------------------
// Admin APIs (Authenticated)
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ success: false, error: 'Password is required' });
    return;
  }

  const isValid = authenticateAdminCredentials(password);
  if (!isValid) {
    res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
    return;
  }

  const token = createSessionToken('admin');
  res.json({
    success: true,
    message: 'Administrator authenticated successfully',
    token,
    user: { username: 'admin', role: 'admin' }
  });
});

// Verify Admin Session
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, authenticated: false });
    return;
  }
  const token = authHeader.substring(7).trim();
  const payload = verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ success: false, authenticated: false });
    return;
  }
  res.json({ success: true, authenticated: true, user: payload });
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const siteData = db.getSiteData();
  const inquiries = db.getInquiries();
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const totalServices = siteData.services.length;
  const publishedServices = siteData.services.filter(s => s.published).length;
  const totalFaqs = siteData.faqs.length;

  res.json({
    success: true,
    data: {
      totalInquiries: inquiries.length,
      newInquiries,
      totalServices,
      publishedServices,
      totalFaqs,
      hasConfiguredPhone: Boolean(siteData.business.phone),
      hasConfiguredWhatsApp: Boolean(siteData.business.whatsapp),
      hasConfiguredEmail: Boolean(siteData.business.email)
    }
  });
});

// Update Site Data
app.put('/api/admin/site-data', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  const updated = db.updateSiteData(updates);
  res.json({ success: true, message: 'Website content updated successfully', data: updated });
});

// Update Business Info
app.put('/api/admin/business', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  const updated = db.updateBusinessInfo(updates);
  res.json({ success: true, message: 'Business and contact information updated', data: updated });
});

// Update Owners
app.put('/api/admin/owners', requireAdmin, (req: Request, res: Response) => {
  const { owners } = req.body;
  if (!Array.isArray(owners)) {
    res.status(400).json({ success: false, error: 'Owners must be an array' });
    return;
  }
  const updated = db.updateOwners(owners);
  res.json({ success: true, message: 'Owner profiles updated successfully', data: updated });
});

// Upload Owner Photo (base64)
app.post('/api/admin/upload-owner-photo', requireAdmin, (req: Request, res: Response) => {
  const { ownerId, dataUrl, filename } = req.body;
  if (!ownerId || !dataUrl) {
    res.status(400).json({ success: false, error: 'Missing ownerId or image data' });
    return;
  }

  try {
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ success: false, error: 'Invalid base64 image data' });
      return;
    }

    const extension = matches[1].replace('jpeg', 'jpg');
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Check max size: 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ success: false, error: 'Image size exceeds maximum limit of 5MB' });
      return;
    }

    const sanitizedBase = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : `owner_${ownerId}`;
    const targetFileName = `${sanitizedBase}_${Date.now()}.${extension}`;
    const targetFilePath = path.resolve(process.cwd(), 'public/uploads', targetFileName);

    fs.writeFileSync(targetFilePath, buffer);
    const photoUrl = `/uploads/${targetFileName}`;

    // Update owner photo directly in DB
    const owners = db.getOwners();
    const targetOwner = owners.find(o => o.id === ownerId);
    if (targetOwner) {
      targetOwner.photo = photoUrl;
      db.updateOwners(owners);
    }

    res.json({
      success: true,
      message: 'Owner portrait uploaded and saved successfully',
      photoUrl
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to process image' });
  }
});

// Services management
app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
  const newServiceData = req.body as Partial<Service>;
  if (!newServiceData.title) {
    res.status(400).json({ success: false, error: 'Service title is required' });
    return;
  }

  const services = db.getServices();
  const slug = newServiceData.slug || newServiceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newService: Service = {
    id: `srv-${Date.now()}`,
    title: newServiceData.title,
    slug,
    shortDescription: newServiceData.shortDescription || '',
    fullDescription: newServiceData.fullDescription || '',
    keyBenefits: Array.isArray(newServiceData.keyBenefits) ? newServiceData.keyBenefits : [],
    targetAudience: newServiceData.targetAudience || '',
    processSteps: Array.isArray(newServiceData.processSteps) ? newServiceData.processSteps : [],
    published: newServiceData.published !== undefined ? newServiceData.published : true,
    featured: Boolean(newServiceData.featured),
    order: services.length + 1
  };

  services.push(newService);
  db.updateServices(services);

  res.status(201).json({ success: true, message: 'Service created successfully', data: newService });
});

app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const services = db.getServices();
  const index = services.findIndex(s => s.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Service not found' });
    return;
  }

  services[index] = {
    ...services[index],
    ...updates
  };
  db.updateServices(services);

  res.json({ success: true, message: 'Service updated successfully', data: services[index] });
});

app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const services = db.getServices();
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) {
    res.status(404).json({ success: false, error: 'Service not found' });
    return;
  }
  db.updateServices(filtered);
  res.json({ success: true, message: 'Service deleted successfully' });
});

// Properties management (CRUD)
app.post('/api/admin/properties', requireAdmin, (req: Request, res: Response) => {
  const newPropData = req.body as Partial<PropertyListing>;
  if (!newPropData.title) {
    res.status(400).json({ success: false, error: 'Property title is required' });
    return;
  }

  const properties = db.getProperties();
  const slug = (newPropData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProperty: PropertyListing = {
    id: `prop-${Date.now()}`,
    title: newPropData.title,
    slug: newPropData.slug || slug,
    propertyType: newPropData.propertyType || 'commercial',
    location: newPropData.location || 'Mathura, UP',
    size: newPropData.size || '',
    priceDisplay: newPropData.priceDisplay || 'Price on Consultation',
    description: newPropData.description || '',
    features: Array.isArray(newPropData.features) ? newPropData.features : [],
    photos: Array.isArray(newPropData.photos) ? newPropData.photos : [],
    status: newPropData.status || 'available',
    published: newPropData.published !== undefined ? newPropData.published : true,
    featured: Boolean(newPropData.featured),
    order: properties.length + 1
  };

  properties.push(newProperty);
  db.updateProperties(properties);

  res.status(201).json({ success: true, message: 'Property listing created successfully', data: newProperty });
});

app.put('/api/admin/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const properties = db.getProperties();
  const index = properties.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Property not found' });
    return;
  }

  properties[index] = {
    ...properties[index],
    ...updates
  };
  db.updateProperties(properties);

  res.json({ success: true, message: 'Property updated successfully', data: properties[index] });
});

app.delete('/api/admin/properties/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const properties = db.getProperties();
  const filtered = properties.filter(p => p.id !== id);

  if (filtered.length === properties.length) {
    res.status(404).json({ success: false, error: 'Property not found' });
    return;
  }

  db.updateProperties(filtered);
  res.json({ success: true, message: 'Property listing deleted successfully' });
});

// FAQs management
app.put('/api/admin/faqs', requireAdmin, (req: Request, res: Response) => {
  const { faqs } = req.body;
  if (!Array.isArray(faqs)) {
    res.status(400).json({ success: false, error: 'FAQs must be an array' });
    return;
  }
  const updated = db.updateFaqs(faqs);
  res.json({ success: true, message: 'FAQs updated successfully', data: updated });
});

// Contact Inquiries
app.get('/api/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  const inquiries = db.getInquiries();
  res.json({ success: true, data: inquiries });
});

app.put('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const updated = db.updateInquiryStatus(id, status, adminNotes);

  if (!updated) {
    res.status(404).json({ success: false, error: 'Inquiry not found' });
    return;
  }

  res.json({ success: true, message: 'Inquiry updated', data: updated });
});

app.delete('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteInquiry(id);
  if (!deleted) {
    res.status(404).json({ success: false, error: 'Inquiry not found' });
    return;
  }
  res.json({ success: true, message: 'Inquiry deleted' });
});

// Change Admin Password
app.put('/api/admin/password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, error: 'Current and new password are required' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ success: false, error: 'New password must be at least 8 characters' });
    return;
  }

  if (!authenticateAdminCredentials(currentPassword)) {
    res.status(401).json({ success: false, error: 'Current password is incorrect' });
    return;
  }

  db.updateAdminPassword(newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
});

// ----------------------------------------------------
// Frontend Mounting & Server Initialization
// ----------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Shri Goyal Associates] Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
