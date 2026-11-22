const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'cmda-dtcp-approval-rules-chennai.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMDA vs DTCP Approval Rules Chennai (2026 Guide) | Setbacks, Documents & Costs</title>
  <meta name="description" content="2026 guide to CMDA and DTCP building plan approvals in Chennai, Avadi, Poonamallee & Thiruvallur. TNCDBR setback rules, checklist, fees, and approval process.">
  <meta name="keywords" content="CMDA approval process Chennai, DTCP approval rules Tamil Nadu, TNCDBR setback rules Chennai, Building plan sanction cost Chennai, CMDA approval in Avadi, DTCP approval Thiruvallur, House approval Poonamallee, Garuda Construction">
  <link rel="canonical" href="https://www.garuda-construction.com/cmda-dtcp-approval-rules-chennai.html">
  <meta name="theme-color" content="#F3EBE3">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="CMDA vs DTCP Approval Rules Chennai (2026 Guide) | Setbacks, Documents & Costs">
  <meta property="og:description" content="2026 guide to CMDA and DTCP building plan approvals in Chennai, Avadi, Poonamallee & Thiruvallur. TNCDBR setback rules, checklist, fees, and approval process.">
  <meta property="og:url" content="https://www.garuda-construction.com/cmda-dtcp-approval-rules-chennai.html">
  <meta property="og:image" content="https://www.garuda-construction.com/assets/img/hero_indian_villa_front.jpg">
  <meta property="og:site_name" content="Garuda Construction">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="CMDA vs DTCP Approval Rules Chennai (2026 Guide) | Setbacks, Documents & Costs">
  <meta name="twitter:description" content="Complete guide on CMDA & DTCP residential building approvals, TNCDBR setbacks, and documents in Chennai & Thiruvallur.">
  <meta name="twitter:image" content="https://www.garuda-construction.com/assets/img/hero_indian_villa_front.jpg">

  <link rel="icon" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="premium.css">

  <style>
    .article-page {
      background: var(--bg, #FAF8F5);
      color: var(--ink, #171514);
    }
    .article-hero {
      padding: clamp(40px, 6vw, 76px) 0 clamp(28px, 4vw, 48px);
      background: linear-gradient(180deg, #F9F5F0 0%, #FFFFFF 100%);
      border-bottom: 1px solid var(--line, #C9BFB5);
    }
    .breadcrumb-nav {
      font-size: 13.5px;
      color: var(--muted, #3D3833);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .breadcrumb-nav a {
      color: var(--ink, #171514);
      text-decoration: none;
      font-weight: 600;
    }
    .breadcrumb-nav a:hover {
      color: #C41E24;
      text-decoration: underline;
    }
    .article-hero__badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 999px;
      background: #FEE2E2;
      color: #C41E24;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .article-hero__title {
      font-family: var(--font-head, 'Manrope', sans-serif);
      font-size: clamp(28px, 4.2vw, 44px);
      line-height: 1.18;
      font-weight: 800;
      color: var(--ink, #171514);
      max-width: 900px;
      margin-bottom: 18px;
    }
    .article-meta-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 13.5px;
      color: var(--muted, #3D3833);
      padding-top: 14px;
      border-top: 1px dashed var(--line, #C9BFB5);
    }
    .article-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .article-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      gap: 48px;
      padding: clamp(36px, 5vw, 64px) 0 clamp(48px, 7vw, 96px);
      align-items: start;
    }
    .article-body {
      font-size: 16.5px;
      line-height: 1.8;
      color: #2D2926;
    }
    .article-body h2 {
      font-family: var(--font-head, 'Manrope', sans-serif);
      font-size: clamp(22px, 2.6vw, 30px);
      font-weight: 800;
      color: var(--ink, #171514);
      margin: 44px 0 16px;
      line-height: 1.25;
      padding-bottom: 10px;
      border-bottom: 2px solid #EFEAE3;
    }
    .article-body h3 {
      font-family: var(--font-head, 'Manrope', sans-serif);
      font-size: clamp(18px, 2vw, 22px);
      font-weight: 700;
      color: var(--ink, #171514);
      margin: 28px 0 12px;
    }
    .article-body p {
      margin-bottom: 18px;
    }
    .article-body ul, .article-body ol {
      margin: 0 0 22px 24px;
      padding: 0;
    }
    .article-body li {
      margin-bottom: 10px;
      line-height: 1.7;
    }
    .guide-table-wrap {
      overflow-x: auto;
      margin: 28px 0 36px;
      border: 1px solid var(--line, #C9BFB5);
      border-radius: 12px;
      background: #FFFFFF;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    }
    .guide-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14.5px;
    }
    .guide-table th {
      background: #171514;
      color: #FFFFFF;
      padding: 14px 16px;
      font-weight: 700;
      font-family: var(--font-head, 'Manrope', sans-serif);
      white-space: nowrap;
    }
    .guide-table td {
      padding: 13px 16px;
      border-bottom: 1px solid #EFEAE3;
      vertical-align: middle;
    }
    .guide-table tr:last-child td {
      border-bottom: none;
    }
    .guide-table tr:nth-child(even) td {
      background: #FAF8F5;
    }
    .guide-callout {
      background: #FFF8F0;
      border-left: 4px solid #C41E24;
      padding: 20px 24px;
      border-radius: 0 12px 12px 0;
      margin: 28px 0;
    }
    .guide-callout h4 {
      font-size: 16px;
      font-weight: 800;
      color: #C41E24;
      margin: 0 0 6px;
    }
    .guide-callout p {
      margin: 0;
      font-size: 14.5px;
      line-height: 1.6;
    }
    .checklist-box {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      padding: 24px;
      margin: 28px 0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
    }
    .checklist-box h4 {
      font-size: 17px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
    }
    .checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
      line-height: 1.5;
    }
    .checklist-icon {
      color: #059669;
      font-weight: bold;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .article-sidebar {
      position: sticky;
      top: 100px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .sidebar-card {
      background: #FFFFFF;
      border: 1px solid var(--line, #C9BFB5);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.04);
    }
    .sidebar-card h3 {
      font-family: var(--font-head, 'Manrope', sans-serif);
      font-size: 18px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 12px;
      color: var(--ink, #171514);
    }
    .sidebar-card p {
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--muted, #3D3833);
      margin-bottom: 18px;
    }
    .sidebar-nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .sidebar-nav-list li {
      margin-bottom: 10px;
    }
    .sidebar-nav-list a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 8px;
      background: #FAF8F5;
      color: var(--ink, #171514);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .sidebar-nav-list a:hover {
      background: #C41E24;
      color: #FFFFFF;
      transform: translateX(4px);
    }
    .faq-accordion {
      margin: 32px 0;
    }
    .faq-card {
      border: 1px solid var(--line, #C9BFB5);
      border-radius: 12px;
      margin-bottom: 12px;
      background: #FFFFFF;
      overflow: hidden;
    }
    .faq-btn {
      width: 100%;
      text-align: left;
      padding: 18px 20px;
      background: none;
      border: none;
      font-family: var(--font-head, 'Manrope', sans-serif);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink, #171514);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .faq-btn:hover {
      color: #C41E24;
    }
    .faq-answer {
      padding: 0 20px 18px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted, #3D3833);
      display: block;
    }
    @media (max-width: 991px) {
      .article-layout {
        grid-template-columns: 1fr;
        gap: 36px;
      }
      .article-sidebar {
        position: static;
      }
    }
  </style>

  <!-- Structured Data: Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "CMDA vs DTCP Approval Rules Chennai (2026 Guide) | Setbacks, Documents & Costs",
    "description": "Complete 2026 homeowner guide on CMDA and DTCP building plan approvals in Chennai, Avadi, Poonamallee, Ambattur, and Thiruvallur.",
    "author": {
      "@type": "Organization",
      "name": "Garuda Construction Architecture & Planning Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Garuda Construction",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.garuda-construction.com/assets/logo.png"
      }
    },
    "datePublished": "2026-01-18",
    "dateModified": "2026-11-01",
    "mainEntityOfPage": "https://www.garuda-construction.com/cmda-dtcp-approval-rules-chennai.html"
  }
  </script>

  <!-- Structured Data: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.garuda-construction.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog & Guides",
        "item": "https://www.garuda-construction.com/blog.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "CMDA & DTCP Approval Rules Chennai",
        "item": "https://www.garuda-construction.com/cmda-dtcp-approval-rules-chennai.html"
      }
    ]
  }
  </script>

  <!-- Structured Data: FAQPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the difference between CMDA and DTCP approvals in Chennai suburbs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CMDA (Chennai Metropolitan Development Authority) governs urban and extended city limits including Avadi, Poonamallee, Ambattur, Vanagaram, and OMR up to Kelambakkam border. DTCP (Directorate of Town and Country Planning) governs areas outside CMA boundaries, including rural Thiruvallur, Kancheepuram, and Sriperumbudur."
        }
      },
      {
        "@type": "Question",
        "name": "What are the minimum setbacks required for building an independent house under TNCDBR rules?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under Tamil Nadu Combined Development and Building Rules (TNCDBR), residential plots up to 100 sq.m (approx 1,076 sq.ft) require a front setback of 1.5m and zero rear/side setbacks. Plots between 100 and 300 sq.m require 1.5m front setback, 1.5m rear setback, and 1.0m to 1.5m side setbacks depending on building height."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to obtain residential building plan approval in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Through the Tamil Nadu Single Window Portal, standard non-high-rise residential building approvals (G+1 or G+2 floors) typically take between 21 to 45 working days, provided all land titles, patta, chitta, and FMB sketches are clean and verified."
        }
      },
      {
        "@type": "Question",
        "name": "Does Garuda Construction handle CMDA and DTCP building plan approvals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every turnkey construction package from Garuda Construction comes with complete architectural planning, 2D Vastu drawing, structural drawings, and liaison guidance for municipal / CMDA / DTCP plan sanctions."
        }
      }
    ]
  }
  </script>
</head>
<body class="article-page">
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="site-canvas">

    <!-- ============ HEADER ============ -->
    <header class="header" id="top">
      <div class="header__inner">
        <a class="logo" href="index.html" aria-label="Garuda Construction - Home">
          <img src="assets/logo.png" width="450" height="114" alt="Garuda Construction">
        </a>

        <nav class="nav" aria-label="Primary">
          <a href="index.html">Home</a>
          
          <div class="nav-item nav-item--dropdown">
            <button class="dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
              <span>Services</span>
              <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-menu__header">
                <a href="services.html" class="dropdown-menu__overview-link">
                  <strong>All Services Overview &rarr;</strong>
                  <span>See everything we build under one roof</span>
                </a>
              </div>
              <div class="dropdown-menu__list">
                <a href="residential-construction.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Residential Construction</span>
                    <span class="dropdown-menu__desc">Custom independent houses &amp; duplex villas</span>
                  </div>
                </a>
                <a href="commercial-construction.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M11 18h2v4h-2z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Commercial Construction</span>
                    <span class="dropdown-menu__desc">Shops, offices &amp; commercial buildings</span>
                  </div>
                </a>
                <a href="renovation-remodeling.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.6 15 22 10.6"/><path d="m20.9 3.3-1.7-1.7a2.4 2.4 0 0 0-3.4 0l-4.5 4.5 5.2 5.2 4.5-4.5a2.4 2.4 0 0 0 0-3.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Renovation &amp; Remodeling</span>
                    <span class="dropdown-menu__desc">Floor additions, modern kitchen &amp; roof upgrades</span>
                  </div>
                </a>
                <a href="interior-design.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z"/><path d="M6 19v2M18 19v2M6 11V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Interior Design</span>
                    <span class="dropdown-menu__desc">Custom modular kitchens &amp; wardrobes</span>
                  </div>
                </a>
                <a href="architectural-planning.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.2 17.6 5.4 1.8A2 2 0 0 0 2 3.2V21a1 1 0 0 0 1 1h17.8a2 2 0 0 0 1.4-3.4Z"/><path d="M5 19V7.8L16.2 19H5Z"/><path d="M8 19v-2M11 19v-3M14 19v-2"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Architectural Planning</span>
                    <span class="dropdown-menu__desc">2D/3D floor plans, Vastu &amp; DTCP approvals</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div class="nav-item nav-item--dropdown">
            <button class="dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
              <span>Areas</span>
              <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-menu__header">
                <a href="areas.html" class="dropdown-menu__overview-link">
                  <strong>All Service Areas Overview &rarr;</strong>
                  <span>Chennai Western Suburbs &amp; Growth Corridors</span>
                </a>
              </div>
              <div class="dropdown-menu__list">
                <a href="house-construction-in-avadi.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Avadi</span>
                    <span class="dropdown-menu__desc">Defence corridor &amp; residential duplexes</span>
                  </div>
                </a>
                <a href="building-contractors-in-ambattur.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Ambattur</span>
                    <span class="dropdown-menu__desc">Modern urban homes &amp; OT commercial hubs</span>
                  </div>
                </a>
                <a href="house-construction-in-poonamallee.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Poonamallee</span>
                    <span class="dropdown-menu__desc">Metro corridor &amp; suburban gated villas</span>
                  </div>
                </a>
                <a href="building-contractors-in-vanagaram.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Vanagaram</span>
                    <span class="dropdown-menu__desc">Porur corridor &amp; high-end residential</span>
                  </div>
                </a>
                <a href="house-construction-in-kelambakkam.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Kelambakkam</span>
                    <span class="dropdown-menu__desc">Vandalur-Kelambakkam road &amp; villas</span>
                  </div>
                </a>
                <a href="house-construction-in-omr-chennai.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">OMR (Chennai)</span>
                    <span class="dropdown-menu__desc">IT expressway smart homes &amp; luxury villas</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a href="projects.html">Projects</a>
          <a href="packages.html">Packages</a>
          <a href="compare-packages.html">Compare</a>
          <a href="calculator.html">Cost Calculator</a>
          <a href="blog.html" class="is-active">Blog</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="header__cta">
          <a class="header__phone" href="tel:+918148856006">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>+91 81488 56006</span>
          </a>
          <a class="btn btn--primary btn--sm" href="contact.html">Free Plan Consult</a>
        </div>

        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
        </button>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-nav" id="mobile-nav" hidden>
        <div class="mobile-nav__head">
          <a class="logo" href="index.html">
            <img src="assets/logo.png" width="130" height="33" alt="Garuda Construction">
          </a>
          <button class="mobile-nav__close" type="button" aria-label="Close menu">&times;</button>
        </div>
        <nav class="mobile-nav__links" aria-label="Mobile">
          <a href="index.html">Home</a>

          <div class="mobile-nav__group">
            <button class="mobile-nav__dropdown-btn" type="button" aria-expanded="false">
              <span>Our Services</span>
              <svg class="mobile-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="mobile-nav__sublinks">
              <a href="services.html" class="mobile-nav__sublink mobile-nav__sublink--overview">All Services Overview &rarr;</a>
              <a href="residential-construction.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Residential Construction</span></a>
              <a href="commercial-construction.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M11 18h2v4h-2z"/></svg><span>Commercial Construction</span></a>
              <a href="renovation-remodeling.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.6 15 22 10.6"/><path d="m20.9 3.3-1.7-1.7a2.4 2.4 0 0 0-3.4 0l-4.5 4.5 5.2 5.2 4.5-4.5a2.4 2.4 0 0 0 0-3.5Z"/></svg><span>Renovation &amp; Remodeling</span></a>
              <a href="interior-design.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z"/><path d="M6 19v2M18 19v2M6 11V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2"/></svg><span>Interior Design</span></a>
              <a href="architectural-planning.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.2 17.6 5.4 1.8A2 2 0 0 0 2 3.2V21a1 1 0 0 0 1 1h17.8a2 2 0 0 0 1.4-3.4Z"/><path d="M5 19V7.8L16.2 19H5Z"/><path d="M8 19v-2M11 19v-3M14 19v-2"/></svg><span>Architectural Planning</span></a>
            </div>
          </div>

          <div class="mobile-nav__group">
            <button class="mobile-nav__dropdown-btn" type="button" aria-expanded="false">
              <span>Areas We Serve</span>
              <svg class="mobile-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="mobile-nav__sublinks">
              <a href="areas.html" class="mobile-nav__sublink mobile-nav__sublink--overview">All Areas Overview &rarr;</a>
              <a href="house-construction-in-avadi.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Avadi</span></a>
              <a href="building-contractors-in-ambattur.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Ambattur</span></a>
              <a href="house-construction-in-poonamallee.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Poonamallee</span></a>
              <a href="building-contractors-in-vanagaram.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Vanagaram</span></a>
              <a href="house-construction-in-kelambakkam.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>Kelambakkam</span></a>
              <a href="house-construction-in-omr-chennai.html" class="mobile-nav__sublink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg><span>OMR (Chennai)</span></a>
            </div>
          </div>

          <a href="projects.html">Recent Projects</a>
          <a href="packages.html">Pricing Packages</a>
          <a href="compare-packages.html">Compare Packages</a>
          <a href="calculator.html">Cost Calculator</a>
          <a href="blog.html">Blog &amp; Guides</a>
          <a href="faq.html">Help &amp; FAQs</a>
          <a href="contact.html">Contact Us</a>
        </nav>
        <div class="mobile-nav__foot">
          <a href="tel:+918148856006">+91 81488 56006</a>
          <a class="btn btn--primary" href="contact.html">Book a consultation</a>
        </div>
      </div>
    </header>

    <!-- ============ MAIN CONTENT ============ -->
    <main id="main">

      <!-- Hero Header -->
      <section class="article-hero">
        <div class="container">
          <nav class="breadcrumb-nav" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <span>/</span>
            <a href="blog.html">Blog &amp; Guides</a>
            <span>/</span>
            <span style="color: var(--ink);">CMDA &amp; DTCP Approval Rules Chennai</span>
          </nav>

          <span class="article-hero__badge">Legal &amp; Regulatory Guide (2026 Updated)</span>
          <h1 class="article-hero__title">CMDA vs DTCP Building Plan Approval Rules in Chennai Suburbs: Setbacks, Checklist &amp; Approval Process</h1>

          <div class="article-meta-bar">
            <div class="article-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>10 Min Comprehensive Read</span>
            </div>
            <div class="article-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>By Er. Chief Architect, Garuda Construction</span>
            </div>
            <div class="article-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Updated for 2026 TNCDBR Norms</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Article Layout -->
      <section class="section" style="padding-top: 0;">
        <div class="container">
          <div class="article-layout">

            <!-- Main Editorial Content -->
            <article class="article-body">
              <p class="lead" style="font-size: 19px; line-height: 1.7; color: #171514; font-weight: 500;">
                Before pouring a single column of concrete or digging a foundation trench for your dream house in Chennai or Thiruvallur, obtaining a legally sanctioned building plan is mandatory. Constructing without an approved plan risks demolition notices, EB power disconnection, refusal of drinking water/sewage connections, and rejection of bank home loans.
              </p>

              <p>
                In Tamil Nadu, building planning rules are governed uniformly by the <strong>Tamil Nadu Combined Development and Building Rules (TNCDBR)</strong>. However, the sanctioning authority depends on your plot’s geographic jurisdiction &mdash; either the <strong>Chennai Metropolitan Development Authority (CMDA)</strong> or the <strong>Directorate of Town and Country Planning (DTCP)</strong>. Here is our master guide on rules, setbacks, documents, and costs.
              </p>

              <!-- Section 1: CMDA vs DTCP Jurisdiction -->
              <h2>1. CMDA vs DTCP: Which Authority Governs Your Land?</h2>
              <p>
                The Chennai Metropolitan Area (CMA) covers approximately 1,189 sq.km (and is undergoing progressive expansion). Understanding which authority controls your locality saves weeks of paperwork in the wrong government office:
              </p>

              <div class="guide-table-wrap">
                <table class="guide-table">
                  <thead>
                    <tr>
                      <th>Locality / Corridor</th>
                      <th>Sanctioning Authority</th>
                      <th>Local Approving Body</th>
                      <th>Jurisdiction Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Avadi</strong></td>
                      <td>CMDA</td>
                      <td>Avadi City Municipal Corporation</td>
                      <td>Within Chennai Metropolitan Area (CMA)</td>
                    </tr>
                    <tr>
                      <td><strong>Ambattur</strong></td>
                      <td>CMDA</td>
                      <td>Greater Chennai Corporation (Zone 7)</td>
                      <td>Core Greater Chennai Corporation Zone</td>
                    </tr>
                    <tr>
                      <td><strong>Poonamallee</strong></td>
                      <td>CMDA</td>
                      <td>Poonamallee Municipality</td>
                      <td>Within CMA Western Growth Corridor</td>
                    </tr>
                    <tr>
                      <td><strong>Vanagaram</strong></td>
                      <td>CMDA</td>
                      <td>Vanagaram Town Panchayat / CMA</td>
                      <td>Porur-Maduravoyal CMA Belt</td>
                    </tr>
                    <tr>
                      <td><strong>OMR (Perungudi to Navalur)</strong></td>
                      <td>CMDA</td>
                      <td>GCC Zone 14 / St. Thomas Mount Union</td>
                      <td>IT Expressway Urban Metropolitan Belt</td>
                    </tr>
                    <tr>
                      <td><strong>Kelambakkam</strong></td>
                      <td>CMDA / DTCP Border</td>
                      <td>Thiruporur Panchayat Union</td>
                      <td>Transition zone; DTCP for rural layouts</td>
                    </tr>
                    <tr>
                      <td><strong>Thiruvallur Municipality</strong></td>
                      <td>DTCP / CMA Extended</td>
                      <td>Thiruvallur Municipal Council</td>
                      <td>District Headquarters Planning Authority</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Section 2: Setback Norms -->
              <h2>2. TNCDBR 2026 Setback Rules for Residential Houses</h2>
              <p>
                A "setback" is the mandatory open buffer space left between your house’s external walls and your plot boundary. It ensures natural ventilation, sunlight, rainwater drainage, and fire rescue access. Under TNCDBR rules, setbacks depend primarily on plot size and road width:
              </p>

              <div class="guide-table-wrap">
                <table class="guide-table">
                  <thead>
                    <tr>
                      <th>Plot Area (Sq.M / Sq.Ft)</th>
                      <th>Front Setback</th>
                      <th>Rear Setback</th>
                      <th>Side 1 Setback</th>
                      <th>Side 2 Setback</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Up to 50 sq.m</strong> (538 sq.ft)</td>
                      <td>1.0 m (3.3 ft)</td>
                      <td>Nil</td>
                      <td>Nil</td>
                      <td>Nil</td>
                    </tr>
                    <tr>
                      <td><strong>51 to 100 sq.m</strong> (540 - 1,076 sq.ft)</td>
                      <td>1.5 m (5.0 ft)</td>
                      <td>1.0 m (3.3 ft)</td>
                      <td>Nil</td>
                      <td>Nil</td>
                    </tr>
                    <tr>
                      <td><strong>101 to 300 sq.m</strong> (1,077 - 3,229 sq.ft)</td>
                      <td>1.5 m (5.0 ft)</td>
                      <td>1.5 m (5.0 ft)</td>
                      <td>1.0 m (3.3 ft)</td>
                      <td>1.5 m (5.0 ft)</td>
                    </tr>
                    <tr>
                      <td><strong>Above 300 sq.m</strong> (&gt;3,230 sq.ft)</td>
                      <td>3.0 m (10.0 ft)</td>
                      <td>2.0 m (6.6 ft)</td>
                      <td>2.0 m (6.6 ft)</td>
                      <td>2.0 m (6.6 ft)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="guide-callout">
                <h4>Important Road Width Rule:</h4>
                <p>
                  For non-high-rise residential construction (G+1 or G+2 floors, height under 12 meters), the access road must have a minimum width of <strong>7.2 meters (approx 24 feet)</strong> or <strong>6.0 meters (20 feet)</strong> in continuously built areas. Constructing on roads narrower than prescribed widths requires special relaxation or may restrict maximum floor area ratio (FSI).
                </p>
              </div>

              <!-- Section 3: Document Checklist -->
              <h2>3. Document Checklist for Building Sanction</h2>
              <p>
                Incomplete documentation is the #1 reason plan approvals get delayed for months. Gather the following 10 mandatory documents before filing on the Tamil Nadu Single Window Portal:
              </p>

              <div class="checklist-box">
                <h4>Mandatory Document Checklist</h4>
                <div class="checklist-grid">
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Registered Sale Deed:</strong> Certified title deed proving ownership in applicant's name.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Patta &amp; Chitta:</strong> Computerized Revenue Patta issued by Taluk office in your name.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>FMB Sketch:</strong> Field Measurement Book sketch with official surveyor dimensions.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Encumbrance Certificate (EC):</strong> 30-year non-encumbrance certificate from sub-registrar.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Layout Approval Order:</strong> Copy of original CMDA/DTCP layout approval for the plot.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Detailed Working Drawings:</strong> 2D architectural site plan, floor plans, sections, and elevations.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Structural Stability Certificate:</strong> Signed by a licensed structural engineer (IS 456 &amp; IS 1893).</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Soil Test Report:</strong> Geotechnical investigation report for foundation design validation.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Property Tax / Vacant Land Tax:</strong> Up-to-date paid tax receipt from local body.</div>
                  </div>
                  <div class="checklist-item">
                    <span class="checklist-icon">&#10004;</span>
                    <div><strong>Applicant Aadhaar &amp; PAN:</strong> Identity and address proof of all registered plot owners.</div>
                  </div>
                </div>
              </div>

              <!-- Section 4: Step-by-Step Approval Process -->
              <h2>4. Step-by-Step Online Approval Process (Single Window Portal)</h2>
              <p>
                The Government of Tamil Nadu has centralized all building sanctions via the <strong>Single Window Portal (onlineplan.tn.gov.in)</strong>. The process involves 5 clear steps:
              </p>
              <ol>
                <li><strong>Architect Drawing Preparation:</strong> Your licensed architect prepares the CAD drawings conforming to Pre-DCR (AutoDCR) automated scrutiny standards with color-coded layers for built-up, setbacks, and road lines.</li>
                <li><strong>Online Application Filing:</strong> Upload land records, patta, EC, structural certificate, and AutoDCR drawing files on the portal under the respective local corporation (e.g. GCC Zone 7 Ambattur, Avadi Corporation, or Poonamallee Municipality).</li>
                <li><strong>Scrutiny &amp; Site Inspection:</strong> The site engineer and Town Planning Officer inspect the physical plot to verify boundary stones, road width, and absence of overhead HT power lines or waterbody encroachments.</li>
                <li><strong>Fee Payment (Demand Notice):</strong> Once scrutiny passes, the portal generates an automated Demand Notice for scrutiny fee, development charge, and building permit fee.</li>
                <li><strong>Sanction Order &amp; QR-Coded Permit:</strong> Upon online fee clearance, the digitally signed Building Permit Order and stamped drawings with official QR code are issued for immediate construction commencement.</li>
              </ol>

              <!-- Section 5: Sanction Fees & Charges -->
              <h2>5. Estimated Plan Sanction Fees in Chennai (2026)</h2>
              <p>
                Government fees for a typical residential duplex (1,500 to 2,000 sq.ft built-up area) generally fall between <strong>&#8377;35,000 and &#8377;75,000</strong>, broken down into:
              </p>
              <ul>
                <li><strong>Scrutiny Fee:</strong> Approx &#8377;3 to &#8377;5 per sq.meter.</li>
                <li><strong>Development Charges (CMDA / DTCP):</strong> Fixed tariff per sq.meter based on guideline value of the locality.</li>
                <li><strong>Building License &amp; Permit Fee:</strong> Charged by the local municipality / corporation based on total floor area.</li>
                <li><strong>Infrastructure &amp; Basic Amenities Charges:</strong> Applicable for residential buildings above specified area thresholds.</li>
                <li><strong>Shelter Fund (if applicable):</strong> Payable for large developments exceeding specified FSI.</li>
              </ul>

              <!-- Section 6: How Garuda Construction Helps -->
              <h2>6. Hassle-Free Sanction Guidance with Garuda Construction</h2>
              <p>
                Navigating Town Planning offices, AutoDCR layering, and structural stability filings can be overwhelming for individual families. At <strong>Garuda Construction</strong>, every turnkey residential package includes:
              </p>
              <ul>
                <li><strong>Complete Architectural 2D &amp; 3D Plans:</strong> Custom Vastu-compliant layouts drawn by our Council of Architecture (COA) registered architects.</li>
                <li><strong>AutoDCR Compliant Drawings:</strong> Precise digital CAD files pre-configured for instant single-window portal clearance.</li>
                <li><strong>In-House Structural Stability Certification:</strong> Certified foundation and column schedules vetted for seismic zone III.</li>
                <li><strong>Liaison Support:</strong> Full documentation guidance across Avadi Corporation, Ambattur GCC Zone 7, Poonamallee, Vanagaram, Kelambakkam, OMR, and Thiruvallur.</li>
              </ul>

              <!-- CTA Banner -->
              <div class="guide-callout" style="background: #171514; color: #FFFFFF; border-left-color: #C41E24; padding: 32px; border-radius: 14px; margin-top: 48px;">
                <h4 style="color: #FFFFFF; font-size: 22px; margin-bottom: 10px;">Starting Construction in Chennai Suburbs?</h4>
                <p style="color: #D1D5DB; font-size: 15.5px; margin-bottom: 20px;">
                  Get a free plot inspection, setback calculation, and transparent per-sq.ft turnkey quote starting from &#8377;2,089/sqft. Zero hidden charges, 10-year structural warranty.
                </p>
                <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                  <a href="contact.html" class="btn btn--primary" style="padding: 12px 24px; font-weight: 700;">Book Free Plot Inspection &rarr;</a>
                  <a href="calculator.html" class="btn btn--secondary" style="background: rgba(255,255,255,0.15); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.3); padding: 12px 24px;">Calculate Construction Cost &rarr;</a>
                </div>
              </div>

              <!-- FAQ Accordion -->
              <h2>Frequently Asked Questions on CMDA &amp; DTCP Rules</h2>
              <div class="faq-accordion">
                <div class="faq-card">
                  <button class="faq-btn" type="button">
                    <span>What is the difference between CMDA and DTCP approvals?</span>
                    <span>&darr;</span>
                  </button>
                  <div class="faq-answer">
                    CMDA governs urban and metropolitan zones within the Chennai Metropolitan Area (including Avadi, Ambattur, Poonamallee, Vanagaram, and OMR). DTCP governs outside CMA limits, covering rural layouts, Thiruvallur taluk outskirts, and Kancheepuram districts.
                  </div>
                </div>

                <div class="faq-card">
                  <button class="faq-btn" type="button">
                    <span>Can I build a house on an unapproved plot (Panchayat approved)?</span>
                    <span>&darr;</span>
                  </button>
                  <div class="faq-answer">
                    Under Tamil Nadu government regularisation schemes (Framework 2017/2020), unapproved plots subdivided prior to October 20, 2016 must first undergo official layout regularisation (Akrama-Sakrama portal) before any building sanction or EB service connection can be issued.
                  </div>
                </div>

                <div class="faq-card">
                  <button class="faq-btn" type="button">
                    <span>What is the maximum permissible FSI for residential houses in Chennai?</span>
                    <span>&darr;</span>
                  </button>
                  <div class="faq-answer">
                    Under TNCDBR rules, non-high-rise residential buildings (up to 12m height or G+2/stilt+3 floors) generally receive an FSI (Floor Space Index) of 1.5 to 2.0 depending on road width. For roads wider than 9m, premium FSI may be purchased subject to local municipal guidelines.
                  </div>
                </div>

                <div class="faq-card">
                  <button class="faq-btn" type="button">
                    <span>Does Garuda Construction provide sanction drawing guidance?</span>
                    <span>&darr;</span>
                  </button>
                  <div class="faq-answer">
                    Yes. All Garuda Construction packages include comprehensive architectural drawings, Vastu layout, structural stability certificates, and complete document guidance for municipal building permits.
                  </div>
                </div>
              </div>

            </article>

            <!-- Sticky Sidebar -->
            <aside class="article-sidebar">
              <div class="sidebar-card">
                <h3>Our Service Locations</h3>
                <p>We build high-quality architectural homes across Chennai suburbs:</p>
                <ul class="sidebar-nav-list">
                  <li><a href="house-construction-in-avadi.html"><span>Avadi</span> <span>&rarr;</span></a></li>
                  <li><a href="building-contractors-in-ambattur.html"><span>Ambattur</span> <span>&rarr;</span></a></li>
                  <li><a href="house-construction-in-poonamallee.html"><span>Poonamallee</span> <span>&rarr;</span></a></li>
                  <li><a href="building-contractors-in-vanagaram.html"><span>Vanagaram</span> <span>&rarr;</span></a></li>
                  <li><a href="house-construction-in-kelambakkam.html"><span>Kelambakkam</span> <span>&rarr;</span></a></li>
                  <li><a href="house-construction-in-omr-chennai.html"><span>OMR (Chennai)</span> <span>&rarr;</span></a></li>
                  <li><a href="index.html"><span>Thiruvallur</span> <span>&rarr;</span></a></li>
                </ul>
              </div>

              <div class="sidebar-card" style="background: #FFFDF9; border-color: #E2D9CF;">
                <h3 style="color: #C41E24;">Turnkey Packages</h3>
                <p>Transparent per-sq.ft packages with 10-year structural warranty:</p>
                <div style="font-size: 26px; font-weight: 800; color: #171514; margin-bottom: 6px;">
                  From &#8377;2,089 <span style="font-size: 14px; color: #6B7280; font-weight: 500;">/ sqft</span>
                </div>
                <p style="font-size: 13px; margin-bottom: 16px;">
                  Includes steel, 53G cement, chamber bricks, teak door, tiles &amp; sanction guidance.
                </p>
                <a href="packages.html" class="btn btn--primary" style="width: 100%; text-align: center; justify-content: center;">View Packages</a>
                <a href="compare-packages.html" style="display: block; text-align: center; margin-top: 10px; font-size: 13px; color: #C41E24; font-weight: 700; text-decoration: none;">Compare 2 Packages &rarr;</a>
              </div>
            </aside>

          </div>
        </div>
      </section>

    </main>

    <!-- ============ FOOTER ============ -->
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          
          <div class="footer__brand">
            <a class="footer__logo" href="index.html">
              <img src="assets/logo.png" alt="Garuda Construction" width="160" height="34">
            </a>
            <p class="footer__tagline">
              Architect-led residential and commercial construction across Thiruvallur and Chennai. Since 2019.
            </p>
            <div class="footer__badges">
              <span class="footer__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                COA Registered Architect (CA/2021/138477)
              </span>
              <span class="footer__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                MSME Govt. Certified
              </span>
            </div>
          </div>

          <div>
            <h3 class="footer__col-title">Our Services</h3>
            <nav class="footer__nav" aria-label="Services links">
              <a href="residential-construction.html">Residential Construction</a>
              <a href="commercial-construction.html">Commercial Construction</a>
              <a href="renovation-remodeling.html">Renovation &amp; Remodeling</a>
              <a href="interior-design.html">Interior Design</a>
              <a href="architectural-planning.html">Architectural Planning</a>
            </nav>
          </div>

          <div>
            <h3 class="footer__col-title">Areas We Serve</h3>
            <nav class="footer__nav" aria-label="Locations links">
              <a href="index.html">Thiruvallur</a>
              <a href="house-construction-in-avadi.html">Avadi</a>
              <a href="building-contractors-in-ambattur.html">Ambattur</a>
              <a href="house-construction-in-poonamallee.html">Poonamallee</a>
              <a href="building-contractors-in-vanagaram.html">Vanagaram</a>
              <a href="house-construction-in-kelambakkam.html">Kelambakkam</a>
              <a href="house-construction-in-omr-chennai.html">OMR (Chennai)</a>
              <a href="areas.html">All Service Areas &rarr;</a>
            </nav>
          </div>

          <div>
            <h3 class="footer__col-title">Contact &amp; Office</h3>
            <address class="footer__contact">
              <p>
                <strong>Garuda Construction</strong><br>
                12, Bharathiyar Street, Jaya Nagar,<br>
                Thiruvallur, Tamil Nadu 602001
              </p>
              <p>
                <a href="tel:+918148856006" style="color: inherit; text-decoration: none;">+91 81488 56006</a><br>
                <a href="mailto:garudaconstruction.cbe@gmail.com" style="color: inherit; text-decoration: none;">garudaconstruction.cbe@gmail.com</a>
              </p>
              <p class="footer__hours">
                Mon - Sat: 9:00 AM - 7:00 PM<br>
                Sunday: By appointment
              </p>
            </address>
          </div>

        </div>

        <div class="footer__bottom">
          <p>&copy; 2026 Garuda Construction. All rights reserved.</p>
          <div class="footer__bottom-links">
            <a href="contact.html">Privacy Policy</a>
            <a href="contact.html">Terms of Service</a>
            <a href="sitemap.xml">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>

  </div>

  <script src="script.js"></script>
</body>
</html>
`;

fs.writeFileSync(filePath, htmlContent, 'utf8');
console.log('Successfully created Blog 2:', filePath);
