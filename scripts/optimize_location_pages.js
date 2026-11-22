const fs = require('fs');
const path = require('path');

const locationConfigs = [
  {
    fileName: 'house-construction-in-avadi.html',
    area: 'Avadi',
    title: 'Construction Company in Avadi | Home Construction & Building Contractors | Garuda',
    metaDesc: 'Searching for the best construction company in Avadi? Garuda Construction provides turnkey home construction in Avadi, expert building contractors, fixed rates from ₹2,089/sqft & 10-year warranty.',
    keywords: 'Construction company in Avadi, Home construction in Avadi, Building contractors in Avadi, Turnkey Builders Avadi, Duplex Villa Builders Avadi, House Construction Cost Avadi, Civil Contractors Avadi, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/house-construction-in-avadi.html',
    h1: 'Construction Company in Avadi | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'Top-Rated Construction Company in Avadi · Avadi City Municipal Corporation',
    heroLead: 'Architect-Led Custom Duplex Villas &amp; Independent Home Construction for Defense, Railway &amp; IT Families Across Avadi',
    geo: { latitude: 13.1147, longitude: 80.1018 },
    areasServed: ['Avadi', 'Pattabiram', 'Paruthipattu', 'Kovilpathu', 'Mittanamallee'],
    whyHeading: '1. Why Choose Garuda Construction as Your Construction Company in Avadi',
    contractorHeading: '6. Licensed Building Contractors in Avadi with Milestone Billing',
    faq1Q: 'Why choose Garuda Construction as your construction company in Avadi?',
    faq1A: 'Garuda Construction is a premier construction company in Avadi providing end-to-end design and build solutions: certified COA architectural planning, Avadi City Municipal Corporation building permits, strict soil-tested foundation engineering, fixed pricing from ₹2,089/sqft, and an official 10-year structural warranty with zero hidden fees.',
    faq2Q: 'What is the cost of home construction in Avadi per square foot?',
    faq2A: 'Turnkey home construction in Avadi by Garuda Construction starts from ₹2,089/sqft (Basic), ₹2,289/sqft (Classic - most popular), ₹2,489/sqft (Premium), up to ₹2,689/sqft (Royale Luxury). Every package covers architectural design, foundation, structural RCC, brickwork, joinery, plumbing, electrical, tiles, and premium painting.',
    faq3Q: 'How do building contractors in Avadi manage foundation design for clay soil?',
    faq3A: 'Our licensed building contractors in Avadi conduct mandatory pre-construction soil core tests to evaluate safe bearing capacity. For Avadi black clay soils, we engineer trapezoidal isolated footings to depths of 5.5 to 7 feet, tied with continuous RCC plinth tie beams and chemical anti-capillary DPC to guarantee zero wall settlement or cracks.',
    faq4Q: 'Can Garuda Construction assist with bank home loans in Avadi?',
    faq4A: 'Yes. As a recognized construction company in Avadi, we prepare complete bank loan dossiers including municipal sanction blueprints, itemized engineer estimates, and milestone valuation certificates for SBI, HDFC, Canara Bank, ICICI, and all major lenders.'
  },
  {
    fileName: 'building-contractors-in-ambattur.html',
    area: 'Ambattur',
    title: 'Construction Company in Ambattur | Home Construction & Building Contractors | Garuda',
    metaDesc: 'Top construction company in Ambattur. Garuda Construction provides turnkey home construction in Ambattur, additional floor construction & licensed building contractors from ₹2,089/sqft.',
    keywords: 'Construction company in Ambattur, Home construction in Ambattur, Building contractors in Ambattur, Additional Floor Construction Ambattur, Turnkey Builders Ambattur, GCC Zone 7 Approved Builders, Civil Contractors Ambattur OT, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/building-contractors-in-ambattur.html',
    h1: 'Construction Company in Ambattur | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'GCC Zone 7 · Industrial & Established Urban Center',
    heroLead: 'Specialized Civil Engineering for Additional Floors, Commercial Complexes &amp; Modern Home Construction Across Ambattur',
    geo: { latitude: 13.1143, longitude: 80.1548 },
    areasServed: ['Ambattur', 'Ambattur OT', 'Ambattur Industrial Estate', 'Menambedu', 'Padi', 'Korattur'],
    whyHeading: '1. Why We Are the Preferred Construction Company in Ambattur',
    contractorHeading: '6. Experienced Building Contractors in Ambattur for GCC Zone 7 Sanctions',
    faq1Q: 'Why hire Garuda Construction as your construction company in Ambattur?',
    faq1A: 'Garuda Construction is Ambattur’s trusted design-and-build firm, specializing in both greenfield home construction in Ambattur and complex vertical floor additions on older properties. We provide licensed structural engineer certifications, GCC Zone 7 compliance, and locked per-sqft pricing from ₹2,089/sqft.',
    faq2Q: 'Can I add a first or second floor to my existing house in Ambattur?',
    faq2A: 'Yes. Our building contractors in Ambattur conduct a non-destructive structural audit to evaluate your existing foundations and columns. We engineer lightweight AAC block masonry, steel column jackets, and structural tie-ins to add upper floors safely without overburdening original ground foundations.',
    faq3Q: 'What is the cost of home construction in Ambattur per square foot?',
    faq3A: 'Turnkey home construction in Ambattur ranges from ₹2,089/sqft (Basic), ₹2,289/sqft (Classic), ₹2,489/sqft (Premium), to ₹2,689/sqft (Royale). Vertical floor additions and commercial civil projects are quoted transparently with full material brand specifications.',
    faq4Q: 'Do your building contractors in Ambattur handle Greater Chennai Corporation permits?',
    faq4A: 'Yes. Our in-house registered architects handle 100% of GCC Zone 7 building plan approvals, structural stability certificates, and single-window online clearances.'
  },
  {
    fileName: 'house-construction-in-poonamallee.html',
    area: 'Poonamallee',
    title: 'Construction Company in Poonamallee | Home Construction & Building Contractors | Garuda',
    metaDesc: 'Premier construction company in Poonamallee by Garuda Construction. Turnkey home construction in Poonamallee, commercial builders & duplex villas from ₹2,089/sqft. 10-year warranty.',
    keywords: 'Construction company in Poonamallee, Home construction in Poonamallee, Building contractors in Poonamallee, Turnkey Builders Poonamallee, Commercial Builders Poonamallee, Duplex Villas Poonamallee, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/house-construction-in-poonamallee.html',
    h1: 'Construction Company in Poonamallee | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'Prime Transit Corridor · CMDA & Poonamallee Municipality',
    heroLead: 'Architect-Designed Duplex Homes and Commercial Complexes Along Chennai’s Western Lifeline Near Upcoming Metro Terminal',
    geo: { latitude: 13.0489, longitude: 80.0889 },
    areasServed: ['Poonamallee', 'Kumananchavadi', 'Senneerkuppam', 'Nazarathpettai', 'Mangadu'],
    whyHeading: '1. Why We Are the Leading Construction Company in Poonamallee',
    contractorHeading: '6. Licensed Building Contractors in Poonamallee for CMDA Sanctions',
    faq1Q: 'Why choose Garuda Construction as your construction company in Poonamallee?',
    faq1A: 'Garuda Construction is an architect-led construction company in Poonamallee specializing in high-plinth flood-resilient duplex homes, commercial roadside complexes, and mixed-use builds. We guarantee fixed milestone pricing from ₹2,089/sqft, CMDA plan approvals, and a 10-year structural warranty.',
    faq2Q: 'What is the cost of home construction in Poonamallee per square foot?',
    faq2A: 'Turnkey home construction in Poonamallee ranges from ₹2,089 to ₹2,689 per sq.ft across our Basic, Classic, Premium, and Royale packages. All plans include architectural plans, foundation engineering, electrical, plumbing, vitrified tiling, and branded fixtures with zero hidden costs.',
    faq3Q: 'How do building contractors in Poonamallee prevent monsoon waterlogging?',
    faq3A: 'Our building contractors in Poonamallee elevate all finished ground-floor plinth levels by at least 3.0 to 3.5 feet above the road crest, backed by dual-layer polymer elastomeric basement tanking and engineered storm runoff recharge pits.',
    faq4Q: 'Do you build mixed-use commercial and residential properties in Poonamallee?',
    faq4A: 'Yes. Along Trunk Road and high-traffic sectors, we engineer commercial complexes with ground-floor showroom retail spaces and upper-floor luxury duplex residences, maximizing rental return on investment.'
  },
  {
    fileName: 'building-contractors-in-vanagaram.html',
    area: 'Vanagaram',
    title: 'Construction Company in Vanagaram | Home Construction & Building Contractors | Garuda',
    metaDesc: 'Leading construction company in Vanagaram by Garuda Construction. Turnkey luxury home construction in Vanagaram & expert building contractors from ₹2,089/sqft near Apollo Porur corridor.',
    keywords: 'Construction company in Vanagaram, Home construction in Vanagaram, Building contractors in Vanagaram, Luxury Villa Builders Vanagaram, Turnkey Builders Vanagaram Porur, Commercial Builders Vanagaram, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/building-contractors-in-vanagaram.html',
    h1: 'Construction Company in Vanagaram | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'Prime Urban Corridor · Maduravoyal & Porur Junction',
    heroLead: 'Architect-Led Contemporary Luxury Villas, Commercial Complexes &amp; Turnkey Home Construction Near Apollo Hospital Corridor',
    geo: { latitude: 13.0617, longitude: 80.1492 },
    areasServed: ['Vanagaram', 'Maduravoyal', 'Porur', 'Alapakkam', 'Nolambur', 'Valasaravakkam'],
    whyHeading: '1. Why We Are the Trusted Construction Company in Vanagaram',
    contractorHeading: '6. Experienced Building Contractors in Vanagaram with CMDA Clearances',
    faq1Q: 'Why select Garuda Construction as your construction company in Vanagaram?',
    faq1A: 'Garuda Construction is a premier construction company in Vanagaram known for executing high-spec architectural duplex villas, corporate residences, and modern commercial spaces. We provide full CMDA sanction guidance, locked milestone pricing from ₹2,089/sqft, and an official 10-year structural warranty.',
    faq2Q: 'What is the cost of luxury home construction in Vanagaram per sq ft?',
    faq2A: 'Home construction in Vanagaram ranges from ₹2,089/sqft for standard builds to ₹2,489 - ₹2,689/sqft for luxury villas featuring Italian marble foyers, double-height living halls, glass balcony facades, and smart home automation.',
    faq3Q: 'How do building contractors in Vanagaram handle subsoil foundations near the Cooum basin?',
    faq3A: 'Our building contractors in Vanagaram perform borehole soil tests and implement raft foundations or deepened trapezoidal footings with polymer bitumen tanking and anti-termite soil barriers to safeguard structures against high ground moisture.',
    faq4Q: 'Do you manage building permits in Vanagaram and Maduravoyal Taluk?',
    faq4A: 'Yes. Our licensed architects prepare full CMDA and local panchayat/GCC single-window submissions, ensuring complete legal compliance and quick sanction issuance.'
  },
  {
    fileName: 'house-construction-in-kelambakkam.html',
    area: 'Kelambakkam',
    title: 'Construction Company in Kelambakkam | Home Construction & Building Contractors | Garuda',
    metaDesc: 'Trusted construction company in Kelambakkam. Garuda Construction offers turnkey home construction in Kelambakkam, gated community villas & building contractors from ₹2,089/sqft.',
    keywords: 'Construction company in Kelambakkam, Home construction in Kelambakkam, Building contractors in Kelambakkam, Duplex Villa Builders Kelambakkam, Gated Community Builders Kelambakkam, Turnkey House Construction Chennai, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/house-construction-in-kelambakkam.html',
    h1: 'Construction Company in Kelambakkam | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'Southern Growth Corridor · OMR & GST Link Expressway',
    heroLead: 'Bespoke Independent Villas &amp; Turnkey Home Construction for IT Professionals and Plot Owners in Plotted Communities',
    geo: { latitude: 12.7845, longitude: 80.2201 },
    areasServed: ['Kelambakkam', 'Pudupakkam', 'Thaiyur', 'Kovalam', 'Vandalur-Kelambakkam link'],
    whyHeading: '1. Why We Are the Top Construction Company in Kelambakkam',
    contractorHeading: '6. Licensed Building Contractors in Kelambakkam for DTCP Approvals',
    faq1Q: 'Why partner with Garuda Construction as your construction company in Kelambakkam?',
    faq1A: 'Garuda Construction is the leading construction company in Kelambakkam specializing in custom duplex villas on plotted layouts. We provide DTCP Chengalpattu approval assistance, fixed milestone contracts from ₹2,089/sqft, and complete structural guarantees.',
    faq2Q: 'What is the cost of home construction in Kelambakkam per square foot?',
    faq2A: 'Turnkey home construction in Kelambakkam starts at ₹2,089/sqft (Basic), ₹2,289/sqft (Classic - most popular for 3BHK villas), ₹2,489/sqft (Premium), up to ₹2,689/sqft (Royale). Pricing includes all materials, structural concrete, electrical, plumbing, and painting.',
    faq3Q: 'How do building contractors in Kelambakkam engineer foundations for red gravel soil?',
    faq3A: 'The dense red gravelly soil in Kelambakkam provides superior safe bearing capacity. Our building contractors in Kelambakkam design cost-efficient isolated RCC footings with continuous plinth beams that maximize structural longevity at optimized foundation costs.',
    faq4Q: 'Can you build in gated plotted communities around Kelambakkam and Pudupakkam?',
    faq4A: 'Yes. We have extensive experience adhering to gated layout architectural guidelines, managing community construction logistics, and coordinating municipal service connections.'
  },
  {
    fileName: 'house-construction-in-omr-chennai.html',
    area: 'OMR (Chennai)',
    title: 'Construction Company in OMR | Home Construction & Building Contractors Chennai | Garuda',
    metaDesc: 'Premier construction company in OMR by Garuda Construction. Turnkey contemporary home construction in OMR, coastal anti-corrosion engineering & building contractors from ₹2,089/sqft.',
    keywords: 'Construction company in OMR, Home construction in OMR, Building contractors in OMR Chennai, Luxury Villa Builders OMR, Turnkey Builders Sholinganallur, Duplex House Navalur Siruseri, Garuda Construction',
    canonical: 'https://www.garuda-construction.com/house-construction-in-omr-chennai.html',
    h1: 'Construction Company in OMR | Turnkey Home Construction &amp; Building Contractors',
    heroEyebrow: 'IT Expressway · Coastal Corridors & Tech Corridor Hub',
    heroLead: 'Contemporary Architect-Led Luxury Villas with Coastal Anti-Corrosion Engineering from Perungudi to Siruseri',
    geo: { latitude: 12.9150, longitude: 80.2285 },
    areasServed: ['OMR', 'Perungudi', 'Thoraipakkam', 'Sholinganallur', 'Navalur', 'Siruseri', 'Padur'],
    whyHeading: '1. Why We Are the Premier Construction Company in OMR',
    contractorHeading: '6. Experienced Building Contractors in OMR Chennai with Coastal Engineering',
    faq1Q: 'Why select Garuda Construction as your construction company in OMR?',
    faq1A: 'Garuda Construction is a specialized construction company in OMR engineering luxury contemporary homes built to withstand coastal saline air and high water tables. We utilize corrosion-resistant Fe 550D TMT rebar, M25/M30 waterproof concrete, smart home automation, and fixed pricing from ₹2,089/sqft.',
    faq2Q: 'What is the cost of home construction in OMR per square foot?',
    faq2A: 'Turnkey home construction in OMR ranges from ₹2,089 to ₹2,689 per sq.ft across Basic, Classic, Premium, and Royale plans. All specifications, brand grades, and milestone stages are written into a legally binding contract.',
    faq3Q: 'How do building contractors in OMR Chennai protect buildings from coastal salt corrosion?',
    faq3A: 'Our building contractors in OMR Chennai use certified corrosion-inhibiting coatings on Fe 550D rebar, high-grade UPVC and powder-coated aluminium joinery, and dual-layer crystalline polymer waterproofing on all terraces, sunshades, and exposed concrete.',
    faq4Q: 'Do you manage building permits across GCC Zone 14/15 and Chengalpattu DTCP on OMR?',
    faq4A: 'Yes. We handle all planning permissions across the OMR stretch, including Greater Chennai Corporation Zones 14/15, CMDA approvals, and Chengalpattu district clearances.'
  }
];

locationConfigs.forEach(cfg => {
  const filePath = path.join(__dirname, '..', 'public', cfg.fileName);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', cfg.fileName);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update Title
  content = content.replace(/<title>[\s\S]*?<\/title>/, `<title>${cfg.title}</title>`);

  // 2. Update Meta Description
  content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${cfg.metaDesc}">`);

  // 3. Update Meta Keywords
  content = content.replace(/<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="keywords" content="${cfg.keywords}">`);

  // 4. Update Canonical
  content = content.replace(/<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i, `<link rel="canonical" href="${cfg.canonical}">`);

  // 5. Update Open Graph & Twitter
  content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:title" content="${cfg.title}">`);
  content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:description" content="${cfg.metaDesc}">`);
  content = content.replace(/<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:url" content="${cfg.canonical}">`);

  content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:title" content="${cfg.title}">`);
  content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:description" content="${cfg.metaDesc}">`);

  // 6. Update Schema.org JSON-LD
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i;
  const newSchema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.garuda-construction.com/" },
          { "@type": "ListItem", "position": 2, "name": "Areas", "item": "https://www.garuda-construction.com/areas.html" },
          { "@type": "ListItem", "position": 3, "name": "${cfg.area}", "item": "${cfg.canonical}" }
        ]
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "${cfg.canonical}#business",
        "name": "Garuda Construction - Construction Company in ${cfg.area}",
        "url": "${cfg.canonical}",
        "telephone": "+918148856006",
        "priceRange": "₹2,089 - ₹2,689 / sq.ft",
        "image": "https://www.garuda-construction.com/assets/img/hero_indian_villa_front.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No 5, JN Road, VM Nagar",
          "addressLocality": "Thiruvallur",
          "addressRegion": "Tamil Nadu",
          "postalCode": "602001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": ${cfg.geo.latitude},
          "longitude": ${cfg.geo.longitude}
        },
        "areaServed": [
          ${cfg.areasServed.map(a => `{"@type": "AdministrativeArea", "name": "${a}"}`).join(',\n          ')}
        ],
        "description": "${cfg.metaDesc}"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "${cfg.faq1Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${cfg.faq1A}"
            }
          },
          {
            "@type": "Question",
            "name": "${cfg.faq2Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${cfg.faq2A}"
            }
          },
          {
            "@type": "Question",
            "name": "${cfg.faq3Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${cfg.faq3A}"
            }
          },
          {
            "@type": "Question",
            "name": "${cfg.faq4Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${cfg.faq4A}"
            }
          }
        ]
      }
    ]
  }
  </script>`;

  if (schemaRegex.test(content)) {
    content = content.replace(schemaRegex, newSchema);
  }

  // 7. Update Hero Eyebrow, H1, and Hero Lead
  content = content.replace(/<span\s+class=["']eyebrow["']>[\s\S]*?<\/span>/i, `<span class="eyebrow">${cfg.heroEyebrow}</span>`);
  content = content.replace(/<h1\s+class=["']loc-hero__title["']>[\s\S]*?<\/h1>/i, `<h1 class="loc-hero__title">${cfg.h1}</h1>`);
  content = content.replace(/<p\s+class=["']loc-hero__lead["']>[\s\S]*?<\/p>/i, `<p class="loc-hero__lead">${cfg.heroLead}</p>`);

  // 8. Update Section 1 Heading
  content = content.replace(/<h2>\s*1\.\s*[\s\S]*?<\/h2>/i, `<h2>${cfg.whyHeading}</h2>`);

  // 9. Update Section 5 or 6 Contractor Heading if present
  if (/<h2>\s*5\.\s*Why Homeowners[\s\S]*?<\/h2>/i.test(content)) {
    content = content.replace(/<h2>\s*5\.\s*Why Homeowners[\s\S]*?<\/h2>/i, `<h2>${cfg.contractorHeading}</h2>`);
  }

  // 10. Update FAQs in HTML to match schema
  const faqListHtml = `<h2>7. Frequently Asked Questions: Home Construction in ${cfg.area}</h2>
            <div class="faq-list" style="margin-top:20px;">
              <div class="faq-item">
                <button class="faq-trigger" type="button" aria-expanded="false">
                  <span>${cfg.faq1Q}</span>
                  <span class="faq-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </span>
                </button>
                <div class="faq-panel">
                  <p>${cfg.faq1A}</p>
                </div>
              </div>

              <div class="faq-item">
                <button class="faq-trigger" type="button" aria-expanded="false">
                  <span>${cfg.faq2Q}</span>
                  <span class="faq-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </span>
                </button>
                <div class="faq-panel">
                  <p>${cfg.faq2A}</p>
                </div>
              </div>

              <div class="faq-item">
                <button class="faq-trigger" type="button" aria-expanded="false">
                  <span>${cfg.faq3Q}</span>
                  <span class="faq-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </span>
                </button>
                <div class="faq-panel">
                  <p>${cfg.faq3A}</p>
                </div>
              </div>

              <div class="faq-item">
                <button class="faq-trigger" type="button" aria-expanded="false">
                  <span>${cfg.faq4Q}</span>
                  <span class="faq-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </span>
                </button>
                <div class="faq-panel">
                  <p>${cfg.faq4A}</p>
                </div>
              </div>
            </div>`;

  if (/<h2>\s*6\.\s*Frequently Asked Questions[\s\S]*?<\/div>\s*<\/div>/i.test(content)) {
    content = content.replace(/<h2>\s*6\.\s*Frequently Asked Questions[\s\S]*?<\/div>\s*<\/div>/i, faqListHtml);
  } else if (/<h2>\s*7\.\s*Frequently Asked Questions[\s\S]*?<\/div>\s*<\/div>/i.test(content)) {
    content = content.replace(/<h2>\s*7\.\s*Frequently Asked Questions[\s\S]*?<\/div>\s*<\/div>/i, faqListHtml);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully optimized SEO keywords & schema for: ${cfg.fileName}`);
});
