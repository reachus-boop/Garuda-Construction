# Garuda Construction — Official Website

> **Architect-Led Civil & Commercial Building in Thiruvallur & Chennai**  
> Transparent, fixed-price construction packages, live cost calculator, and modern design.

---

## 🏛️ About Garuda Construction

Garuda Construction is a premier design-and-build firm founded in 2019, headquartered in Thiruvallur, Tamil Nadu. The company provides end-to-end residential, commercial, interior, and renovation solutions with fully specified material disclosures and a 100% money guarantee written into every agreement.

- **Founder & Principal Architect:** Ar. Harish Balaji
- **Address:** No 5, JN Road, VM Nagar, Thiruvallur, Tamil Nadu
- **Phone:** [+91 81488 56006](tel:+918148856006)
- **Email:** reachus@garuda-construction.com
- **Website:** [https://www.garuda-construction.com](https://www.garuda-construction.com)

---

## ✨ Features & Architecture

- **Zero-Dependency Modern Frontend:** Vanilla HTML5, CSS3, and ES6 JavaScript. No heavy third-party framework overhead.
- **5-Step Construction Cost Calculator:** Dynamic client-side wizard computing built-up areas, package selections, milestone schedules, printable quotations, and direct WhatsApp estimates.
- **Interactive Project Lightbox:** Modal gallery with keyboard navigation (`←`, `→`, `Esc`) and automated enquiry routing.
- **Dynamic Specular Cursor Lighting:** Proximity-based radial light reflections responding in real-time to user pointer movements.
- **Complete Page Suite:**
  - `index.html` — Homepage with villa hero elevation and key stats.
  - `services.html` — Overview of all design & build disciplines.
  - `residential-construction.html` — Duplex villas & custom independent homes.
  - `commercial-construction.html` — Commercial complexes, shops, and offices.
  - `renovation-remodeling.html` — Upgrades, kitchen redesign, and floor additions.
  - `interior-design.html` — Modular kitchens, false ceilings, and wardrobes.
  - `architectural-planning.html` — 2D/3D elevations, Vastu compliance, and DTCP/CMDA sanctioning.
  - `packages.html` / `pricing.html` — Full material & brand matrix across Basic, Classic, Premium, and Royale tiers.
  - `calculator.html` — Interactive cost estimation engine.
  - `projects.html` — Filterable portfolio showcase.
  - `blog.html` — Technical construction guides and modal reader.
  - `faq.html` — Categorized searchable FAQ accordion.
  - `contact.html` — Direct consultation booking form.
  - `admin.html` — Minimalist white-background Lead Acquisition & Management Desk.
  - `404.html` — Branded error fallback.

---

## 🔐 Admin Lead Desk (`/admin`)

The website includes a minimalist white-background administrative panel at `/admin` for tracking and converting enquiries into projects:
- **URL:** [http://localhost:3030/admin](http://localhost:3030/admin)
- **Access:** Authentication protected (credentials configured in `.env`).
- **Features:**
  - Live **MongoDB Atlas** synchronization.
  - Lead metrics: Total leads, New/Uncontacted, Active discussions, Site visits, Converted projects.
  - 1-click **WhatsApp chat** and phone dialing directly to clients.
  - Lead lifecycle stage tracker (`New` → `Contacted` → `In Discussion` → `Site Visit` → `Converted` / `Lost`).
  - Internal follow-up discussion logs & notes.
  - Manual lead creation for walk-in clients and phone enquiries.
  - Instant CSV spreadsheet export.

---

## 🚀 Running Locally

1. **Clone the repository & install dependencies:**
   ```bash
   git clone https://github.com/reachus-boop/Garuda-Construction.git
   cd Garuda-Construction
   npm install
   ```

2. **Start the local server:**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open in browser:**
   - Website: [http://localhost:3030/](http://localhost:3030/)
   - Admin Panel: [http://localhost:3030/admin](http://localhost:3030/admin)

---

## ☁️ Deployment to Vercel

This repository is optimized for instant deployment on [Vercel](https://vercel.com):

1. Import the repository `reachus-boop/Garuda-Construction` into Vercel.
2. Framework Preset: **Other**
3. Build Command: Leave blank (or `echo 'Static build ready'`)
4. Output Directory: `.`
5. Click **Deploy**.

---

## Search visibility and enquiry tracking

### URLs and sitemap

- Public pages are served without `.html`. Keep internal links, canonical tags, structured data URLs, and `public/sitemap.xml` on the same HTTPS `www` URL. List only the preferred URL for each page and update `lastmod` when the page content changes materially.
- `vercel.json` contains permanent redirects for old page names and location aliases. The Node server uses the same redirect list for localhost. Check that an old URL lands on the preferred page and that the final page declares itself canonical.

### Google Search Console and Business Profile

1. Open the existing `https://www.garuda-construction.com/` URL-prefix property in Search Console using an account with access. A separate domain property requires DNS verification.
2. After deployment, resubmit `https://www.garuda-construction.com/sitemap.xml` under **Sitemaps**. Use **URL Inspection** on `/`, `/packages`, `/calculator`, `/house-construction-in-avadi`, and `/park-view-homes-thiruvallur`. Compare the declared and Google-selected canonicals when the indexed result is available.
3. Record web search clicks, impressions, CTR, and top landing pages for the latest complete 28 days. Compare against the previous 28 days after enough data has accumulated, and review successful enquiries alongside clicks.
4. In the verified Google Business Profile, check the website URL, contact details, hours, and service areas. Upload approved Park View Homes project photos and identify progress shots as construction photos. Add case studies for other service areas as project details and photos become available.

### Google Analytics 4 setup

1. Create a GA4 property and a web stream for `https://www.garuda-construction.com` using [Google's setup guide](https://support.google.com/analytics/answer/9304153).
2. Turn off **Enhanced measurement** for that stream before enabling the tag. Custom code records contact clicks without sending destination URLs, which can include prefilled WhatsApp enquiry messages.
3. Set `GA4_MEASUREMENT_ID` to the stream's `G-` ID in the Vercel **Production** environment and redeploy. The site loads GA4 when the ID is configured and visitors are on the canonical HTTPS origin.
4. Use Realtime or DebugView to check `phone_click` and `whatsapp_click`. Estimate and package forms send `generate_lead` after the API saves the enquiry. Mark `generate_lead` as a key event. The calculator's WhatsApp click is an engagement event.
