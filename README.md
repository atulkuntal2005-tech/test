# Shri Goyal Associates — Official Business Website

Production-ready, full-stack commercial web application and administrative CMS for **Shri Goyal Associates** in Mathura, Uttar Pradesh, India. Founded and personally led by **Jitendra Goyal** and **Hemant Goyal**.

---

## 1. Business Overview

- **Business Name:** Shri Goyal Associates
- **Owners & Principals:**
  - **Jitendra Goyal** — Co-Founder & Senior Associate (Attire: Navy-blue blazer & white shirt)
  - **Hemant Goyal** — Co-Founder & Managing Partner (Attire: Grey blazer & black shirt)
- **Registered Address:** Mathura, Mandi Choraha, near Narsi Vihar, Uttar Pradesh, India — PIN 281004.
- **Operating Hours:** Monday – Saturday: 9:30 AM – 7:30 PM (Sunday: Closed)
- **Contact Channels:**
  - Clickable Direct Phone Call (`tel:`)
  - Official WhatsApp Click-to-Chat (`wa.me`) with editable default query message
  - Direct Consultation & Lead Capture Inquiry Forms

---

## 2. Visual Sitemap & Navigation Hierarchy

```
                                [ Shri Goyal Associates ]
                                            │
        ┌───────────────────────────────────┼──────────────────────────────────┐
        │                                   │                                  │
  [ Public Pages ]                   [ Admin Area ]                    [ Search Engine Feeds ]
        │                                   │                                  │
  ├── / (Home)                       ├── /admin/login                  ├── /sitemap.xml
  ├── /about (About Us)              ├── /admin/dashboard              └── /robots.txt
  ├── /owners (Our Owners)           ├── /admin/contact
  │     ├── Jitendra Goyal           ├── /admin/owners
  │     └── Hemant Goyal             ├── /admin/services
  ├── /services (Services)           ├── /admin/pages
  │     └── /services/[slug]         ├── /admin/seo
  ├── /contact (Contact Us)          └── /admin/settings
  ├── /faq (Frequently Asked Questions)
  ├── /privacy-policy
  ├── /terms (Terms & Conditions)
  └── Custom 404
```

---

## 3. Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend Server:** Node.js, Express 4, TypeScript via `tsx`
- **Development Tooling:** Vite 6 with `vite.middlewares` mounted in Express dev runner
- **Database & Persistence:**
  - Local/Container: Atomic transactional JSON store (`./data/database.json`) with automated schema migrations.
  - Cloud Firebase: Production Firebase configuration (`firebase.json`), Cloud Firestore security rules (`firestore.rules`), and Cloud Storage rules (`storage.rules`).
- **Security:** Node `crypto.scryptSync` password hashing with unique 16-byte salt, cryptographically signed Bearer session tokens, and input validation with spam honeypot filters.

---

## 4. Administrator Setup & Credentials

1. Navigate to `/admin/login`.
2. Initial default master credentials:
   - **Username:** `admin`
   - **Default Password:** `GoyalAdmin@2026`
3. Upon first login, access **Settings & Security** (`/admin/settings`) to update your master password.
4. Access **Contact Settings** (`/admin/contact`) to configure your live phone number and WhatsApp number.

---

## 5. Local Setup & Execution Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
Starts the full-stack Express server on port 3000 with Vite middleware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Type Check & Linter
```bash
npm run lint
```

### 4. Create Production Build
```bash
npm run build
```

### 5. Run Production Server
```bash
npm run start
```

---

## 6. Firebase Deployment Guide

### A. Prerequisites
Install Firebase CLI globally:
```bash
npm install -g firebase-tools
firebase login
```

### B. Link Existing Firebase Project
```bash
firebase use --add
```

### C. Deploy Security Rules & Indexes
```bash
firebase deploy --only firestore:rules,storage
```

### D. Build and Deploy Frontend Hosting
```bash
npm run build
firebase deploy --only hosting
```

---

## 7. Custom Domain & HTTPS Setup

1. In Firebase Console, go to **Hosting** > **Add Custom Domain**.
2. Enter your domain (e.g. `shrigoyalassociates.com`).
3. Add the provided DNS `A` records and `TXT` ownership verification records at your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare).
4. Firebase provisions an SSL/TLS certificate automatically within 24 hours.

---

## 8. Google Search Console & Sitemap Submission

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add Property > Select **URL prefix** and input `https://yourdomain.com`.
3. Verify ownership via HTML file, meta tag, or DNS TXT record.
4. In the left navigation, click **Sitemaps**.
5. In the **Add a new sitemap** input, enter:
   ```
   sitemap.xml
   ```
6. Click **Submit**. Google will fetch and index all canonical URLs:
   - `https://yourdomain.com/`
   - `https://yourdomain.com/about`
   - `https://yourdomain.com/owners`
   - `https://yourdomain.com/services`
   - `https://yourdomain.com/services/commercial-business-advisory`
   - `https://yourdomain.com/services/documentation-regulatory-liaison`
   - `https://yourdomain.com/services/contract-partnership-facilitation`
   - `https://yourdomain.com/services/regional-enterprise-consultation`
   - `https://yourdomain.com/contact`
   - `https://yourdomain.com/faq`
   - `https://yourdomain.com/privacy-policy`
   - `https://yourdomain.com/terms`

---

## 9. Verification & Testing Checklist

| Test Item | Status | Verification Method |
|---|---|---|
| Dependency Installation | ✅ Passed | `package.json` dependencies verified |
| TypeScript Compilation | ✅ Passed | Verified via `tsc --noEmit` |
| Vite Production Build | ✅ Passed | Verified via `npm run build` |
| Public Routes Integrity | ✅ Passed | All 12 public routes implemented with navigation |
| Owner Portrait Preservation | ✅ Passed | Jitendra Goyal & Hemant Goyal original portraits preserved |
| Admin Authentication | ✅ Passed | Password hash verification + Bearer token security |
| Contact Form Validation | ✅ Passed | Server-side validation + client feedback + anti-spam honeypot |
| Direct Call & WhatsApp | ✅ Passed | Dynamic `tel:` and `wa.me` links with empty-state safeguards |
| XML Sitemap & Robots.txt | ✅ Passed | Live endpoints `/sitemap.xml` & `/robots.txt` dynamic generation |
| Mobile Responsiveness | ✅ Passed | Compliant with 15% mobile sticky cap and responsive layouts |
| Custom Domain / External Live Project | ⏳ External | Requires live registrar DNS connection |
