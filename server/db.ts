import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SiteData, ContactInquiry } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface AdminAccount {
  username: string;
  salt: string;
  hash: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  siteData: SiteData;
  admin: AdminAccount;
  inquiries: ContactInquiry[];
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function createPasswordRecord(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const calculatedHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculatedHash, 'hex'), Buffer.from(storedHash, 'hex'));
}

const defaultAdminRecord = createPasswordRecord('GoyalAdmin@2026');

const initialSiteData: SiteData = {
  business: {
    businessName: "Shri Goyal Associates",
    tagline: "Commercial Advisory, Strategic Consultation & Regional Enterprise Support",
    address: "Mathura, Mandi Choraha, near Narsi Vihar, Uttar Pradesh, India — PIN 281004",
    street: "Mandi Choraha, near Narsi Vihar",
    area: "Mandi Choraha",
    city: "Mathura",
    state: "Uttar Pradesh",
    pincode: "281004",
    country: "India",
    phone: "", // Configurable by admin!
    whatsapp: "", // Configurable by admin!
    whatsappMessage: "Hello Shri Goyal Associates, I would like to enquire about your services.",
    email: "", // Configurable by admin!
    businessHours: "Monday – Saturday: 9:30 AM – 7:30 PM, Sunday: Closed",
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
  properties: [
    {
      id: "prop-1",
      title: "Prime Commercial Plot near Mandi Choraha",
      slug: "prime-commercial-plot-mandi-choraha",
      propertyType: "commercial",
      location: "Near Mandi Choraha & Narsi Vihar, Mathura",
      size: "600 Sq. Yards",
      priceDisplay: "Price on Consultation",
      description: "Exceptional commercial plot strategically positioned with high arterial frontage near Mandi Choraha, Mathura. Ideal for multi-story corporate offices, retail complexes, diagnostics, or bank branches.",
      features: [
        "Direct main-road frontage with wide approach",
        "Clear freehold title & verified registry",
        "Proximity to Mandi trading hub & residential colonies",
        "Immediate possession & demarcation ready"
      ],
      photos: ["/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg"],
      status: "available",
      featured: true,
      published: true,
      order: 1
    },
    {
      id: "prop-2",
      title: "Commercial Retail Space & Showroom",
      slug: "commercial-retail-space-showroom-mathura",
      propertyType: "office",
      location: "Arterial Corridor, Mathura, UP 281004",
      size: "1,800 Sq. Ft.",
      priceDisplay: "Available on Lease / Sale",
      description: "Ground floor commercial showroom with high visibility and dedicated customer parking. Suitable for national retail brands, pharmaceutical distribution, or financial institutions.",
      features: [
        "Ground floor with 35 ft clear frontage",
        "Heavy footfall trade location",
        "3-phase commercial electrical load connection",
        "Dedicated parking space for staff and visitors"
      ],
      photos: ["/assets/aistudio/852243082_2083592802283499_2179126346531225521_n_00c05961.jpg"],
      status: "available",
      featured: true,
      published: true,
      order: 2
    },
    {
      id: "prop-3",
      title: "Industrial & Warehouse Land Parcel",
      slug: "industrial-warehouse-land-nh19",
      propertyType: "industrial",
      location: "NH-19 / Western Transit Corridor, Mathura",
      size: "2.5 Acres",
      priceDisplay: "Competitive Commercial Rate",
      description: "Level industrial land with wide truck approach, close to highway connectivity. Ideal for logistics hub, cold storage, packaging plant, or heavy warehousing.",
      features: [
        "Direct link to NH-19 expressway",
        "Wide turning radius for container trucks",
        "Clear boundary wall & single ownership",
        "Zoned for industrial and commercial usage"
      ],
      photos: ["/assets/aistudio/852110917_4313507005576552_5488164325380499531_n_3663ff77.jpg"],
      status: "available",
      featured: false,
      published: true,
      order: 3
    }
  ],
  pageContent: {
    heroHeadline: "Trusted Commercial Advisory & Business Consultation in Mathura",
    heroSubtitle: "Founded and personally led by Jitendra Goyal and Hemant Goyal. Providing dedicated commercial guidance, documentation assistance, and professional enterprise consultations from Mandi Choraha, Mathura.",
    heroBadge: "Mathura, Uttar Pradesh · Mandi Choraha",
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
    defaultTitle: "Shri Goyal Associates – Business Advisory & Consultation, Mathura",
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
    logoSubtext: "Consultation & Advisory · Mathura",
    enableWhatsAppFloat: true,
    enableCallFloat: true
  }
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure integrity of schema
        const siteData = {
          ...initialSiteData,
          ...parsed.siteData,
          properties: (Array.isArray(parsed.siteData?.properties) && parsed.siteData.properties.length > 0)
            ? parsed.siteData.properties
            : initialSiteData.properties
        };
        return {
          siteData,
          admin: parsed.admin || {
            username: "admin",
            salt: defaultAdminRecord.salt,
            hash: defaultAdminRecord.hash,
            updatedAt: new Date().toISOString()
          },
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : []
        };
      } catch (err) {
        console.error('Failed to load DB, using initial data:', err);
      }
    }
    const initial: DatabaseSchema = {
      siteData: initialSiteData,
      admin: {
        username: "admin",
        salt: defaultAdminRecord.salt,
        hash: defaultAdminRecord.hash,
        updatedAt: new Date().toISOString()
      },
      inquiries: []
    };
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(payload: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  public getSiteData(): SiteData {
    return this.data.siteData;
  }

  public updateSiteData(updates: Partial<SiteData>): SiteData {
    this.data.siteData = {
      ...this.data.siteData,
      ...updates
    };
    this.save();
    return this.data.siteData;
  }

  public updateBusinessInfo(info: Partial<SiteData['business']>): SiteData['business'] {
    this.data.siteData.business = {
      ...this.data.siteData.business,
      ...info
    };
    this.save();
    return this.data.siteData.business;
  }

  public getOwners() {
    return this.data.siteData.owners;
  }

  public updateOwners(owners: SiteData['owners']) {
    this.data.siteData.owners = owners;
    this.save();
    return this.data.siteData.owners;
  }

  public getServices() {
    return this.data.siteData.services;
  }

  public updateServices(services: SiteData['services']) {
    this.data.siteData.services = services;
    this.save();
    return this.data.siteData.services;
  }

  public getProperties() {
    return this.data.siteData.properties || [];
  }

  public updateProperties(properties: SiteData['properties']) {
    this.data.siteData.properties = properties;
    this.save();
    return this.data.siteData.properties;
  }

  public getFaqs() {
    return this.data.siteData.faqs;
  }

  public updateFaqs(faqs: SiteData['faqs']) {
    this.data.siteData.faqs = faqs;
    this.save();
    return this.data.siteData.faqs;
  }

  public getInquiries(): ContactInquiry[] {
    return this.data.inquiries;
  }

  public addInquiry(inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): ContactInquiry {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: ContactInquiry['status'], notes?: string): ContactInquiry | null {
    const inq = this.data.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    if (notes !== undefined) inq.adminNotes = notes;
    this.save();
    return inq;
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getAdmin(): AdminAccount {
    return this.data.admin;
  }

  public updateAdminPassword(newPassword: string): boolean {
    const record = createPasswordRecord(newPassword);
    this.data.admin.salt = record.salt;
    this.data.admin.hash = record.hash;
    this.data.admin.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }
}

export const db = new Database();
