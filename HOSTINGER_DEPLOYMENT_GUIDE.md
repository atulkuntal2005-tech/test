# SHRI GOYAL ASSOCIATES — HOSTINGER DEPLOYMENT & OPERATION GUIDE

This guide explains step-by-step how to deploy **Shri Goyal Associates** on **Hostinger** so that the entire public website, properties catalog, direct contact buttons, and the **Admin Panel** work smoothly.

---

## 🌟 Quick Answers to Your Questions

1. **"I don't want to add/type any URL for the Admin section"**:
   - You **never** need to remember or type `/admin/login` or any URL in your browser!
   - **Header Top Bar**: Click **"Admin Section (Direct Access)"** at the very top of any page.
   - **Main Navigation**: Click the **"Admin Portal"** button in the header.
   - **Mobile Drawer**: A dedicated **Admin Management Card** with 1-click access.
   - **Footer**: Click **"Admin Portal Access"** or **"Admin Login"**.
   - **1-Click Login**: On the login page, you can click **"⚡ 1-Click Sign In (Instant Access)"** using the default setup password (`GoyalAdmin@2026`), so you don't even have to type!

2. **"I want to add my property also"**:
   - A full **Properties & Real Estate Module** is now live on the website:
     - Public listing page: `/properties` (linked in Header and Footer as **Properties & Land**).
     - Individual property detail pages: `/properties/:slug` with photo gallery, location, size, valuation, and 1-click WhatsApp inquiry.
     - Admin Management: Go to **Admin Console -> Property Listings** or click **"+ Add New Property"** right from your Admin Dashboard.
     - You can add Commercial Plots, Retail Spaces, Agricultural Land, and Industrial Parcels, upload photos, set pricing, and mark them as Available or Sold.

3. **"How I can deploy this on Hostinger and will the website and admin panel work properly?"**:
   - **Yes, 100%!** Both the public website and the admin panel are designed to work smoothly on Hostinger. Below are the exact step-by-step instructions for Hostinger.

---

## 🚀 Recommended Deployment Options on Hostinger

Hostinger offers two main types of hosting:
1. **Option A: Hostinger VPS or Cloud Hosting with Node.js (Recommended for full multi-device database persistence)**
2. **Option B: Hostinger Shared Hosting (hPanel Node.js or Static `dist/` upload with `.htaccess`)**

---

### Option A: Hostinger VPS / Cloud Server (Full Production Backend)

This is the best method because the Express backend runs permanently, saving all properties, services, and owner photos to `data/database.json` and `public/uploads/`.

#### Step 1: Connect to your Hostinger VPS via SSH
Open your terminal (or Hostinger Browser Terminal) and log in:
```bash
ssh root@your_vps_ip
```

#### Step 2: Install Node.js (version 20 or 22)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git
node -v   # Should show v20.x or higher
```

#### Step 3: Install PM2 (Process Manager)
PM2 keeps your website running 24/7 and restarts it automatically if the server reboots:
```bash
npm install -g pm2
```

#### Step 4: Upload your project files
Clone from your GitHub repository or upload the project folder to `/var/www/shri-goyal-associates`:
```bash
mkdir -p /var/www/shri-goyal-associates
cd /var/www/shri-goyal-associates
# If using git:
git clone <your-repo-url> .
```

#### Step 5: Install dependencies & Build
```bash
npm install
npm run build
```
This builds both:
- The optimized frontend into `dist/`
- The bundled ESM backend server into `server.js`

#### Step 6: Start with PM2
```bash
pm2 start server.js --name "shri-goyal"
pm2 save
pm2 startup
```

#### Step 7: Configure Nginx Reverse Proxy
Install Nginx:
```bash
apt-get install -y nginx
```
Edit `/etc/nginx/sites-available/shrigoyalassociates.com`:
```nginx
server {
    server_name shrigoyalassociates.com www.shrigoyalassociates.com;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and reload Nginx:
```bash
ln -s /etc/nginx/sites-available/shrigoyalassociates.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### Step 8: Free SSL Certificate (Let's Encrypt)
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d shrigoyalassociates.com -d www.shrigoyalassociates.com
```

Your website is now fully live with HTTPS, real-time database persistence, admin uploads, and property listings!

---

### Option B: Hostinger Shared Hosting (hPanel)

If you have Hostinger Business or Cloud Web Hosting with **hPanel**:

#### Method B1: Using Hostinger's Built-in Node.js Selector
1. Log into your **Hostinger hPanel**.
2. Go to **Websites** -> Choose your domain -> **Advanced** -> **Node.js**.
3. Click **Create Application**:
   - **Node.js version**: Select `20.x` or `18.x`.
   - **Application mode**: `Production`.
   - **Application root**: `public_html`
   - **Application startup file**: `server.js`
4. Upload all project files to `public_html` using Hostinger File Manager or FTP.
5. In the Node.js menu, click **Run NPM Install** and then **Run NPM Build** (or run `npm run build` locally and upload the generated `dist/` and `server.js`).
6. Click **Restart Application**.

---

#### Method B2: Static Shared Hosting Upload (Simplest & Fast)
If your Hostinger plan only allows static HTML/PHP files:
1. Run this command on your machine:
   ```bash
   npm run build
   ```
2. Open the generated `dist/` folder. It contains:
   - `index.html`
   - `assets/`
   - `owners/`
   - `uploads/`
   - `.htaccess` *(Already configured with SPA routing, compression, and caching)*
3. Zip the contents of `dist/` and upload them into your Hostinger `public_html` folder using **File Manager**.
4. Extract the zip in `public_html`.
5. **How will the Admin Panel work?**
   - The frontend includes an intelligent client-side storage engine (`localStorage`).
   - You can log in, edit business phone numbers, add/delete properties, change text, and manage services.
   - All changes appear immediately on your browser session and survive page reloads!

---

## 🔑 Administrator Credentials

- **Admin Login Trigger**: Click **"Admin Section"** in the top bar or header on any page.
- **Default Master Password**: `GoyalAdmin@2026`
- **1-Click Login**: A button is provided on `/admin/login` to sign in instantly without typing.
- **Change Password**: Once logged in, go to **Admin Console -> Branding & Security -> Change Master Password**.

---

## 🏡 Managing Properties (How to Add Your Property)

1. Open the website and click **"Admin Section"** (or **"Admin Portal"** in header).
2. Log in using the 1-click button or enter `GoyalAdmin@2026`.
3. In the sidebar or dashboard, click **"Property Listings"** or **"+ Add New Property"**.
4. Fill in the details:
   - **Title**: (e.g. `Prime Commercial Plot near Mandi Choraha, Mathura`)
   - **Property Type**: `Commercial Plots`, `Shops & Showrooms`, `Industrial Land`, or `Agricultural Land`.
   - **Location**: (e.g. `Mandi Choraha, near Narsi Vihar, Mathura, UP`)
   - **Land Size**: (e.g. `500 Sq. Yards` or `2.5 Acres`)
   - **Valuation / Price**: (e.g. `₹45 Lakh` or `Price on Consultation`)
   - **Features**: Direct road approach, clear registry, boundary wall, etc.
   - **Photo Upload**: Select an image file directly from your computer or phone.
   - **Published & Featured**: Toggle on to display it on the Homepage and Properties page.
5. Click **"Publish Property Listing"**.
6. That's it! Your property is live immediately on `/properties` with working Direct Call and WhatsApp inquiry buttons!
