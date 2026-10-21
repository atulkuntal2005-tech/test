// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var DATA_DIR = path.resolve(process.cwd(), "data");
var DB_FILE = path.join(DATA_DIR, "database.json");
var UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}
function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return { salt, hash };
}
function verifyPassword(password, salt, storedHash) {
  const calculatedHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculatedHash, "hex"), Buffer.from(storedHash, "hex"));
}
var defaultAdminRecord = createPasswordRecord("GoyalAdmin@2026");
var initialSiteData = {
  business: {
    businessName: "Shri Goyal Associates",
    tagline: "Commercial Advisory, Strategic Consultation & Regional Enterprise Support",
    address: "Mathura, Mandi Choraha, near Narsi Vihar, Uttar Pradesh, India \u2014 PIN 281004",
    street: "Mandi Choraha, near Narsi Vihar",
    area: "Mandi Choraha",
    city: "Mathura",
    state: "Uttar Pradesh",
    pincode: "281004",
    country: "India",
    phone: "",
    // Configurable by admin!
    whatsapp: "",
    // Configurable by admin!
    whatsappMessage: "Hello Shri Goyal Associates, I would like to enquire about your services.",
    email: "",
    // Configurable by admin!
    businessHours: "Monday \u2013 Saturday: 9:30 AM \u2013 7:30 PM, Sunday: Closed",
    googleMapsEmbedUrl: "https://www.google.com/maps?q=Mandi+Choraha,+near+Narsi+Vihar,+Mathura,+Uttar+Pradesh+281004&output=embed",
    googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Mandi+Choraha,+near+Narsi+Vihar,+Mathura,+Uttar+Pradesh+281004"
  },
  owners: [
    {
      id: "jitendra-goyal",
      name: "Jitendra Goyal",
      designation: "Co-Founder & Senior Associate",
      bio: "Directing strategic commercial advisory and enterprise client relations at Shri Goyal Associates. Dedicated to fostering trustworthy business partnerships, commercial feasibility, and professional guidance across Mathura and the Western Uttar Pradesh region.",
      photo: "/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg",
      attire: "Navy-blue blazer and white shirt",
      visible: true,
      order: 1,
      phone: "",
      email: "",
      specialties: [
        "Commercial Strategy",
        "Business Consultation",
        "Regional Trade Operations",
        "Client Advisory"
      ]
    },
    {
      id: "hemant-goyal",
      name: "Hemant Goyal",
      designation: "Co-Founder & Managing Partner",
      bio: "Leading statutory documentation, agreement frameworks, and procedural liaison for commercial clients. Provides rigorous operational guidance to ensure transparent execution, regulatory clarity, and structured compliance for business enterprises in Mathura.",
      photo: "/assets/aistudio/852243082_2083592802283499_2179126346531225521_n_00c05961.jpg",
      attire: "Grey blazer and black shirt",
      visible: true,
      order: 2,
      phone: "",
      email: "",
      specialties: [
        "Documentation & Contracts",
        "Regulatory Liaison",
        "Operational Oversight",
        "Enterprise Facilitation"
      ]
    }
  ],
  services: [
    {
      id: "srv-commercial-advisory",
      title: "Commercial Business Advisory",
      slug: "commercial-business-advisory",
      shortDescription: "Strategic counsel and structured consultation for establishing, operating, and expanding commercial ventures in Mathura.",
      fullDescription: "Our Commercial Business Advisory service provides local entrepreneurs, trading firms, and regional enterprises with structured consultation on market entry, operational setup, vendor structuring, and ongoing business oversight. Shri Goyal Associates assists clients through every phase of the business lifecycle with high integrity and local market insights.",
      keyBenefits: [
        "Tailored strategic roadmaps for new and existing businesses",
        "In-depth Mathura and Western UP regional market perspective",
        "Structured guidance on operations and vendor frameworks",
        "Transparent fee structure and dedicated associate support"
      ],
      targetAudience: "Entrepreneurs, trade partners, distributors, and established businesses seeking regional advisory in Mathura.",
      processSteps: [
        "Initial discovery meeting and requirement assessment",
        "Custom strategic consultation and feasibility evaluation",
        "Documentation and execution advisory",
        "Periodic milestone reviews and ongoing consultation"
      ],
      published: true,
      featured: true,
      order: 1
    },
    {
      id: "srv-documentation-liaison",
      title: "Documentation & Regulatory Liaison",
      slug: "documentation-regulatory-liaison",
      shortDescription: "Thorough assistance with commercial documentation, agreements, filings, and official procedural representations.",
      fullDescription: "Navigating commercial documentation and regional regulatory workflows requires precision and local familiarity. Shri Goyal Associates helps clients prepare, review, and organize all necessary commercial filings, statutory paperwork, and formal agreements to ensure complete compliance and minimize operational friction.",
      keyBenefits: [
        "Accurate drafting and verification of commercial paperwork",
        "Prompt coordination with regional bodies and local authorities",
        "Reduced risk of documentation errors or procedural delays",
        "Confidential and reliable handling of client affairs"
      ],
      targetAudience: "Commercial property owners, trading firms, contractors, and local enterprises.",
      processSteps: [
        "Document audit and checklist preparation",
        "Drafting and statutory review",
        "Submission guidance and procedural follow-up",
        "Final delivery and archival assistance"
      ],
      published: true,
      featured: true,
      order: 2
    },
    {
      id: "srv-partnership-facilitation",
      title: "Contract & Partnership Facilitation",
      slug: "contract-partnership-facilitation",
      shortDescription: "Professional assistance in structuring business partnerships, vendor contracts, lease negotiations, and commercial agreements.",
      fullDescription: "Solid agreements form the cornerstone of successful commerce. We assist partners and commercial parties in structuring equitable terms, reviewing business clauses, and achieving consensus across contracts, commercial leases, and joint undertakings in Mathura.",
      keyBenefits: [
        "Clear term structuring to prevent future disputes",
        "Neutral facilitation between commercial stakeholders",
        "Expert guidance on lease terms and trade conditions",
        "Alignment with prevailing regional commercial practices"
      ],
      targetAudience: "Landlords, tenants, business partners, suppliers, and retail associates.",
      processSteps: [
        "Stakeholder consultation & objective mapping",
        "Drafting terms of understanding and agreement covenants",
        "Mutual review and adjustment facilitation",
        "Final execution and formal recording"
      ],
      published: true,
      featured: true,
      order: 3
    },
    {
      id: "srv-regional-enterprise",
      title: "Regional Enterprise Consultation",
      slug: "regional-enterprise-consultation",
      shortDescription: "Dedicated consultation for enterprises expanding operations or managing commercial investments in the Mathura district.",
      fullDescription: "Mathura is a rapidly developing commercial hub connecting Western Uttar Pradesh, the NCR corridor, and Rajasthan. Shri Goyal Associates offers on-ground consultation for firms establishing regional presence, selecting commercial locations near Mandi Choraha and key corridors, and coordinating local resources.",
      keyBenefits: [
        "Local intelligence on zoning, transit corridors, and market centers",
        "Network connectivity with local trade ecosystems",
        "Risk mitigation for out-of-station investors and businesses",
        "End-to-end local representation"
      ],
      targetAudience: "Regional distributors, national brands setting up regional offices, and commercial investors.",
      processSteps: [
        "Location feasibility and market orientation",
        "Resource mapping and stakeholder introductions",
        "Operational setup coordination",
        "Continuous regional advisory"
      ],
      published: true,
      featured: false,
      order: 4
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Where is the office of Shri Goyal Associates located?",
      answer: "We are situated at Mandi Choraha, near Narsi Vihar, Mathura, Uttar Pradesh, PIN 281004. Our office is conveniently located along key arterial roads connecting Mathura city.",
      category: "General",
      order: 1,
      published: true
    },
    {
      id: "faq-2",
      question: "Who are the principal owners and associates of the firm?",
      answer: "Shri Goyal Associates is owned and led by Mr. Jitendra Goyal (Co-Founder & Senior Associate) and Mr. Hemant Goyal (Co-Founder & Managing Partner), who personally review client matters and direct consultations.",
      category: "General",
      order: 2,
      published: true
    },
    {
      id: "faq-3",
      question: "How can I schedule a consultation with Shri Goyal Associates?",
      answer: "You can click the Direct Call or WhatsApp button on our website for an immediate query, or complete our Contact Us form with your requirements. Our office will respond promptly to schedule a suitable consultation time.",
      category: "Consultation",
      order: 3,
      published: true
    },
    {
      id: "faq-4",
      question: "What are your standard business hours?",
      answer: "Our office operates Monday through Saturday from 9:30 AM to 7:30 PM. We are closed on Sundays and gazetted public holidays.",
      category: "General",
      order: 4,
      published: true
    },
    {
      id: "faq-5",
      question: "Do you offer in-person consultations at your Mathura office?",
      answer: "Yes, we welcome scheduled in-person meetings at our office at Mandi Choraha, near Narsi Vihar, Mathura. We recommend booking in advance to ensure our principal associates are available for your appointment.",
      category: "Consultation",
      order: 5,
      published: true
    }
  ],
  pageContent: {
    heroHeadline: "Trusted Commercial Advisory & Business Consultation in Mathura",
    heroSubtitle: "Founded and personally led by Jitendra Goyal and Hemant Goyal. Providing dedicated commercial guidance, documentation assistance, and professional enterprise consultations from Mandi Choraha, Mathura.",
    heroBadge: "Mathura, Uttar Pradesh \xB7 Mandi Choraha",
    aboutIntro: "Rooted in Mathura with deep regional market understanding and an unwavering commitment to professional integrity.",
    aboutStory: "Shri Goyal Associates was established to bring structured, dependable advisory services to businesses, traders, and commercial stakeholders across Mathura and Western Uttar Pradesh. Under the leadership of Jitendra Goyal and Hemant Goyal, the firm combines extensive local market awareness with rigorous professional standards.",
    aboutMission: "To deliver transparent, pragmatic, and high-value business consultation that enables local enterprises and commercial partners to thrive with legal clarity and operational confidence.",
    values: [
      {
        title: "Integrity & Transparency",
        description: "Uncompromising ethical standards in every consultation, contract review, and business relationship."
      },
      {
        title: "Local Market Mastery",
        description: "Decades of combined familiarity with Mathura's commercial zones, trade corridors, and administrative processes."
      },
      {
        title: "Direct Owner Engagement",
        description: "Every client matter is personally analyzed and directed by Jitendra Goyal or Hemant Goyal."
      },
      {
        title: "Confidentiality & Precision",
        description: "Strict privacy safeguards for all client data, commercial strategies, and documentation records."
      }
    ],
    privacyPolicy: `At Shri Goyal Associates, we are committed to safeguarding your privacy and ensuring the security of your personal information.

1. Information We Collect
We collect personal information that you voluntarily provide through our website contact forms, WhatsApp inquiries, or phone communications. This includes your name, phone number, email address, and consultation details.

2. How We Use Information
Your information is strictly used to:
- Respond to inquiries and provide requested business consultations.
- Prepare documentation and facilitate commercial agreements as requested.
- Maintain client communication records.

3. Information Sharing & Confidentiality
We do not sell, rent, or trade your personal information to third parties. Information is only shared when required by law or with your explicit consent for regulatory filings.

4. Data Security
We implement standard technical and organizational measures to protect your data against unauthorized access, loss, or alteration.

5. Contact Us
For any privacy-related queries, please contact Shri Goyal Associates at our registered office at Mandi Choraha, near Narsi Vihar, Mathura, UP 281004.`,
    termsAndConditions: `Terms and Conditions of Use for Shri Goyal Associates Website.

1. Acceptance of Terms
By accessing or using this website, you agree to be bound by these Terms and Conditions and our Privacy Policy.

2. Informational Purpose
The content provided on this website is for general informational purposes and preliminary business introduction. It does not constitute formal legal or statutory advice until an official engagement is established.

3. Proprietary Rights
All content, business marks, photographs of proprietors Jitendra Goyal and Hemant Goyal, and textual descriptions are the intellectual property of Shri Goyal Associates and may not be reproduced without written permission.

4. Limitation of Liability
Shri Goyal Associates makes every effort to ensure information accuracy on this website. However, we do not warrant that all content is free from inadvertent typographical errors or regional regulatory updates.

5. Jurisdiction
Any disputes arising out of the use of this website or services provided by Shri Goyal Associates shall be subject to the exclusive jurisdiction of the competent courts in Mathura, Uttar Pradesh, India.`
  },
  seo: {
    defaultTitle: "Shri Goyal Associates \u2013 Business Advisory & Consultation, Mathura",
    titleTemplate: "%s | Shri Goyal Associates",
    defaultDescription: "Official website for Shri Goyal Associates at Mandi Choraha, near Narsi Vihar, Mathura, UP (PIN 281004). Led by Jitendra Goyal & Hemant Goyal. Commercial advisory, documentation liaison, and enterprise consultation.",
    canonicalBase: "https://shrigoyalassociates.com",
    ogImage: "/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg",
    keywords: [
      "Shri Goyal Associates",
      "Jitendra Goyal Mathura",
      "Hemant Goyal Mathura",
      "Business Advisory Mathura",
      "Mandi Choraha Narsi Vihar Mathura",
      "Commercial Consultation Mathura UP",
      "Documentation Liaison Uttar Pradesh",
      "Mathura Associates 281004"
    ]
  },
  branding: {
    primaryColor: "#0B1526",
    accentColor: "#C89B3C",
    logoText: "Shri Goyal Associates",
    logoSubtext: "Consultation & Advisory \xB7 Mathura",
    enableWhatsAppFloat: true,
    enableCallFloat: true
  }
};
var Database = class {
  constructor() {
    this.data = this.load();
  }
  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          siteData: { ...initialSiteData, ...parsed.siteData },
          admin: parsed.admin || {
            username: "admin",
            salt: defaultAdminRecord.salt,
            hash: defaultAdminRecord.hash,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : []
        };
      } catch (err) {
        console.error("Failed to load DB, using initial data:", err);
      }
    }
    const initial = {
      siteData: initialSiteData,
      admin: {
        username: "admin",
        salt: defaultAdminRecord.salt,
        hash: defaultAdminRecord.hash,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      inquiries: []
    };
    this.saveDirect(initial);
    return initial;
  }
  saveDirect(payload) {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), "utf-8");
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error("Failed to write database file:", err);
    }
  }
  save() {
    this.saveDirect(this.data);
  }
  getSiteData() {
    return this.data.siteData;
  }
  updateSiteData(updates) {
    this.data.siteData = {
      ...this.data.siteData,
      ...updates
    };
    this.save();
    return this.data.siteData;
  }
  updateBusinessInfo(info) {
    this.data.siteData.business = {
      ...this.data.siteData.business,
      ...info
    };
    this.save();
    return this.data.siteData.business;
  }
  getOwners() {
    return this.data.siteData.owners;
  }
  updateOwners(owners) {
    this.data.siteData.owners = owners;
    this.save();
    return this.data.siteData.owners;
  }
  getServices() {
    return this.data.siteData.services;
  }
  updateServices(services) {
    this.data.siteData.services = services;
    this.save();
    return this.data.siteData.services;
  }
  getFaqs() {
    return this.data.siteData.faqs;
  }
  updateFaqs(faqs) {
    this.data.siteData.faqs = faqs;
    this.save();
    return this.data.siteData.faqs;
  }
  getInquiries() {
    return this.data.inquiries;
  }
  addInquiry(inquiry) {
    const newInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "new"
    };
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }
  updateInquiryStatus(id, status, notes) {
    const inq = this.data.inquiries.find((i) => i.id === id);
    if (!inq) return null;
    inq.status = status;
    if (notes !== void 0) inq.adminNotes = notes;
    this.save();
    return inq;
  }
  deleteInquiry(id) {
    const initialLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter((i) => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  getAdmin() {
    return this.data.admin;
  }
  updateAdminPassword(newPassword) {
    const record = createPasswordRecord(newPassword);
    this.data.admin.salt = record.salt;
    this.data.admin.hash = record.hash;
    this.data.admin.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.save();
    return true;
  }
};
var db = new Database();

// server/auth.ts
import crypto2 from "crypto";
var JWT_SECRET = process.env.ADMIN_SESSION_SECRET || "shri-goyal-associates-mathura-secret-key-2026";
function createSessionToken(username) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Date.now() + 24 * 60 * 60 * 1e3;
  const payload = Buffer.from(JSON.stringify({ username, role: "admin", exp })).toString("base64url");
  const signature = crypto2.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}
function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSig = crypto2.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url");
  if (signature !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }
  const token = authHeader.substring(7).trim();
  const payload = verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized: Session expired or invalid" });
    return;
  }
  req.user = payload;
  next();
}
function authenticateAdminCredentials(password) {
  const admin = db.getAdmin();
  return verifyPassword(password, admin.salt, admin.hash);
}

// server.ts
var app = express();
var PORT = 3e3;
var HOST = "0.0.0.0";
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/assets/aistudio", express.static(path2.resolve(process.cwd(), "public/assets/aistudio")));
app.use("/owners", express.static(path2.resolve(process.cwd(), "public/owners")));
app.use("/uploads", express.static(path2.resolve(process.cwd(), "public/uploads")));
app.get("/api/site-data", (_req, res) => {
  const siteData = db.getSiteData();
  res.json({ success: true, data: siteData });
});
app.get("/api/services", (_req, res) => {
  const services = db.getServices().filter((s) => s.published);
  res.json({ success: true, data: services });
});
app.get("/api/services/:slug", (req, res) => {
  const { slug } = req.params;
  const service = db.getServices().find((s) => s.slug === slug);
  if (!service) {
    res.status(404).json({ success: false, error: "Service not found" });
    return;
  }
  res.json({ success: true, data: service });
});
app.get("/api/owners", (_req, res) => {
  const owners = db.getOwners().filter((o) => o.visible);
  res.json({ success: true, data: owners });
});
app.post("/api/contact", (req, res) => {
  const { name, phone, email, serviceInterest, message, honeypot } = req.body;
  if (honeypot) {
    res.json({ success: true, message: "Inquiry received" });
    return;
  }
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    res.status(400).json({ success: false, error: "Please provide a valid full name" });
    return;
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
    res.status(400).json({ success: false, error: "Please provide a valid phone or mobile number" });
    return;
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    res.status(400).json({ success: false, error: "Please provide a message or inquiry description (min 5 characters)" });
    return;
  }
  const savedInquiry = db.addInquiry({
    name: name.trim(),
    phone: phone.trim(),
    email: email ? String(email).trim() : "",
    serviceInterest: serviceInterest ? String(serviceInterest).trim() : "General Inquiry",
    message: message.trim()
  });
  res.status(201).json({
    success: true,
    message: "Thank you! Your inquiry has been delivered directly to Shri Goyal Associates. We will contact you shortly.",
    data: savedInquiry
  });
});
app.get("/sitemap.xml", (_req, res) => {
  const siteData = db.getSiteData();
  const baseUrl = siteData.seo.canonicalBase.replace(/\/$/, "");
  const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const staticRoutes = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/about", priority: "0.8", changefreq: "monthly" },
    { loc: "/owners", priority: "0.9", changefreq: "monthly" },
    { loc: "/services", priority: "0.9", changefreq: "weekly" },
    { loc: "/contact", priority: "0.8", changefreq: "monthly" },
    { loc: "/faq", priority: "0.7", changefreq: "monthly" },
    { loc: "/privacy-policy", priority: "0.4", changefreq: "yearly" },
    { loc: "/terms", priority: "0.4", changefreq: "yearly" }
  ];
  const serviceRoutes = siteData.services.filter((s) => s.published).map((s) => ({
    loc: `/services/${s.slug}`,
    priority: "0.8",
    changefreq: "monthly"
  }));
  const allUrls = [...staticRoutes, ...serviceRoutes];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(
    (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  ).join("\n")}
</urlset>`;
  res.header("Content-Type", "application/xml");
  res.send(xml);
});
app.get("/robots.txt", (_req, res) => {
  const siteData = db.getSiteData();
  const baseUrl = siteData.seo.canonicalBase.replace(/\/$/, "");
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.send(robots);
});
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ success: false, error: "Password is required" });
    return;
  }
  const isValid = authenticateAdminCredentials(password);
  if (!isValid) {
    res.status(401).json({ success: false, error: "Invalid administrator credentials" });
    return;
  }
  const token = createSessionToken("admin");
  res.json({
    success: true,
    message: "Administrator authenticated successfully",
    token,
    user: { username: "admin", role: "admin" }
  });
});
app.get("/api/admin/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
app.get("/api/admin/stats", requireAdmin, (_req, res) => {
  const siteData = db.getSiteData();
  const inquiries = db.getInquiries();
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const totalServices = siteData.services.length;
  const publishedServices = siteData.services.filter((s) => s.published).length;
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
app.put("/api/admin/site-data", requireAdmin, (req, res) => {
  const updates = req.body;
  const updated = db.updateSiteData(updates);
  res.json({ success: true, message: "Website content updated successfully", data: updated });
});
app.put("/api/admin/business", requireAdmin, (req, res) => {
  const updates = req.body;
  const updated = db.updateBusinessInfo(updates);
  res.json({ success: true, message: "Business and contact information updated", data: updated });
});
app.put("/api/admin/owners", requireAdmin, (req, res) => {
  const { owners } = req.body;
  if (!Array.isArray(owners)) {
    res.status(400).json({ success: false, error: "Owners must be an array" });
    return;
  }
  const updated = db.updateOwners(owners);
  res.json({ success: true, message: "Owner profiles updated successfully", data: updated });
});
app.post("/api/admin/upload-owner-photo", requireAdmin, (req, res) => {
  const { ownerId, dataUrl, filename } = req.body;
  if (!ownerId || !dataUrl) {
    res.status(400).json({ success: false, error: "Missing ownerId or image data" });
    return;
  }
  try {
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ success: false, error: "Invalid base64 image data" });
      return;
    }
    const extension = matches[1].replace("jpeg", "jpg");
    const buffer = Buffer.from(matches[2], "base64");
    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ success: false, error: "Image size exceeds maximum limit of 5MB" });
      return;
    }
    const sanitizedBase = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, "") : `owner_${ownerId}`;
    const targetFileName = `${sanitizedBase}_${Date.now()}.${extension}`;
    const targetFilePath = path2.resolve(process.cwd(), "public/uploads", targetFileName);
    fs2.writeFileSync(targetFilePath, buffer);
    const photoUrl = `/uploads/${targetFileName}`;
    const owners = db.getOwners();
    const targetOwner = owners.find((o) => o.id === ownerId);
    if (targetOwner) {
      targetOwner.photo = photoUrl;
      db.updateOwners(owners);
    }
    res.json({
      success: true,
      message: "Owner portrait uploaded and saved successfully",
      photoUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to process image" });
  }
});
app.post("/api/admin/services", requireAdmin, (req, res) => {
  const newServiceData = req.body;
  if (!newServiceData.title) {
    res.status(400).json({ success: false, error: "Service title is required" });
    return;
  }
  const services = db.getServices();
  const slug = newServiceData.slug || newServiceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newService = {
    id: `srv-${Date.now()}`,
    title: newServiceData.title,
    slug,
    shortDescription: newServiceData.shortDescription || "",
    fullDescription: newServiceData.fullDescription || "",
    keyBenefits: Array.isArray(newServiceData.keyBenefits) ? newServiceData.keyBenefits : [],
    targetAudience: newServiceData.targetAudience || "",
    processSteps: Array.isArray(newServiceData.processSteps) ? newServiceData.processSteps : [],
    published: newServiceData.published !== void 0 ? newServiceData.published : true,
    featured: Boolean(newServiceData.featured),
    order: services.length + 1
  };
  services.push(newService);
  db.updateServices(services);
  res.status(201).json({ success: true, message: "Service created successfully", data: newService });
});
app.put("/api/admin/services/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const services = db.getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, error: "Service not found" });
    return;
  }
  services[index] = {
    ...services[index],
    ...updates
  };
  db.updateServices(services);
  res.json({ success: true, message: "Service updated successfully", data: services[index] });
});
app.delete("/api/admin/services/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const services = db.getServices();
  const filtered = services.filter((s) => s.id !== id);
  if (filtered.length === services.length) {
    res.status(404).json({ success: false, error: "Service not found" });
    return;
  }
  db.updateServices(filtered);
  res.json({ success: true, message: "Service deleted successfully" });
});
app.put("/api/admin/faqs", requireAdmin, (req, res) => {
  const { faqs } = req.body;
  if (!Array.isArray(faqs)) {
    res.status(400).json({ success: false, error: "FAQs must be an array" });
    return;
  }
  const updated = db.updateFaqs(faqs);
  res.json({ success: true, message: "FAQs updated successfully", data: updated });
});
app.get("/api/admin/inquiries", requireAdmin, (_req, res) => {
  const inquiries = db.getInquiries();
  res.json({ success: true, data: inquiries });
});
app.put("/api/admin/inquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const updated = db.updateInquiryStatus(id, status, adminNotes);
  if (!updated) {
    res.status(404).json({ success: false, error: "Inquiry not found" });
    return;
  }
  res.json({ success: true, message: "Inquiry updated", data: updated });
});
app.delete("/api/admin/inquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteInquiry(id);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Inquiry not found" });
    return;
  }
  res.json({ success: true, message: "Inquiry deleted" });
});
app.put("/api/admin/password", requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, error: "Current and new password are required" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ success: false, error: "New password must be at least 8 characters" });
    return;
  }
  if (!authenticateAdminCredentials(currentPassword)) {
    res.status(401).json({ success: false, error: "Current password is incorrect" });
    return;
  }
  db.updateAdminPassword(newPassword);
  res.json({ success: true, message: "Password updated successfully" });
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, HOST, () => {
    console.log(`[Shri Goyal Associates] Server running on http://${HOST}:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
