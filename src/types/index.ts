export interface BusinessInfo {
  businessName: string;
  tagline: string;
  address: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  businessHours: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}

export interface Owner {
  id: string;
  name: string;
  designation: string;
  bio: string;
  photo: string;
  attire: string;
  visible: boolean;
  order: number;
  phone?: string;
  email?: string;
  specialties: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  targetAudience: string;
  processSteps: string[];
  published: boolean;
  featured: boolean;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface PageContent {
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge: string;
  aboutIntro: string;
  aboutStory: string;
  aboutMission: string;
  values: {
    title: string;
    description: string;
  }[];
  privacyPolicy: string;
  termsAndConditions: string;
}

export interface SEOConfig {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  canonicalBase: string;
  ogImage: string;
  keywords: string[];
}

export interface BrandingSettings {
  primaryColor: string;
  accentColor: string;
  logoText: string;
  logoSubtext: string;
  enableWhatsAppFloat: boolean;
  enableCallFloat: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceInterest: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
  adminNotes?: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  slug: string;
  propertyType: 'commercial' | 'plot' | 'agricultural' | 'industrial' | 'office' | 'residential';
  location: string;
  size: string;
  priceDisplay: string;
  description: string;
  features: string[];
  photos: string[];
  status: 'available' | 'negotiation' | 'sold';
  featured: boolean;
  published: boolean;
  order: number;
}

export interface SiteData {
  business: BusinessInfo;
  owners: Owner[];
  services: Service[];
  properties: PropertyListing[];
  faqs: FAQ[];
  pageContent: PageContent;
  seo: SEOConfig;
  branding: BrandingSettings;
}

export interface AdminSession {
  token: string;
  username: string;
  role: string;
  expiresAt: number;
}
