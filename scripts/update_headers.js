const fs = require('fs');
const path = require('path');

const headerHtml = `    <!-- ============ HEADER ============ -->
    <header class="header" id="top">
      <div class="header__inner">
        <a class="logo" href="index.html" aria-label="Garuda Construction — Home">
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
                    <span class="dropdown-menu__desc">Modular kitchens, wardrobes &amp; false ceilings</span>
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
                  <strong>All Areas Overview &rarr;</strong>
                  <span>Explore Chennai &amp; suburban building zones</span>
                </a>
              </div>
              <div class="dropdown-menu__list">
                <a href="house-construction-in-avadi.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Avadi</span>
                    <span class="dropdown-menu__desc">Duplex villas &amp; defense zone builds</span>
                  </div>
                </a>
                <a href="building-contractors-in-ambattur.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Ambattur</span>
                    <span class="dropdown-menu__desc">Floor additions &amp; civil construction</span>
                  </div>
                </a>
                <a href="house-construction-in-poonamallee.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Poonamallee</span>
                    <span class="dropdown-menu__desc">Metro corridor villas &amp; shops</span>
                  </div>
                </a>
                <a href="building-contractors-in-vanagaram.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Vanagaram</span>
                    <span class="dropdown-menu__desc">Luxury villas &amp; prime residences</span>
                  </div>
                </a>
                <a href="house-construction-in-kelambakkam.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">Kelambakkam</span>
                    <span class="dropdown-menu__desc">Gated community villas &amp; plots</span>
                  </div>
                </a>
                <a href="house-construction-in-omr-chennai.html" class="dropdown-menu__item" role="menuitem">
                  <span class="dropdown-menu__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20V10.5Z"/></svg></span>
                  <div class="dropdown-menu__text">
                    <span class="dropdown-menu__name">OMR (Chennai)</span>
                    <span class="dropdown-menu__desc">IT expressway contemporary homes</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a href="projects.html">Projects</a>
          <a href="packages.html">Packages</a>
          <a href="compare-packages.html">Compare</a>
          <a href="calculator.html">Calculator</a>
          <a href="blog.html">Blog</a>
          <a href="faq.html">FAQ</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="header__right">
          <a class="header__contact" href="tel:+918148856006">+91 81488 56006</a>
          <a class="btn btn--primary btn--sm" href="contact.html">
            <span class="btn__text-full">Book consultation</span>
            <span class="btn__text-short">Consult</span>
            <svg class="btn__arrow" width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav">
            <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span></span>
            <span class="visually-hidden">Open menu</span>
          </button>
        </div>
      </div>

      <div class="mobile-nav" id="mobile-nav">
        <nav aria-label="Mobile">
          <a href="index.html">Home</a>
          
          <div class="mobile-nav__group">
            <button class="mobile-nav__dropdown-btn" type="button" aria-expanded="false">
              <span>Services</span>
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
          <a class="btn btn--primary" href="contact.html">
            Book a consultation
            <svg class="btn__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </header>`;

const targetFiles = [
  'index.html',
  'packages.html',
  'pricing.html',
  'services.html',
  'projects.html',
  'calculator.html',
  'compare-packages.html',
  'areas.html',
  'blog.html',
  'faq.html',
  'contact.html',
  'residential-construction.html',
  'commercial-construction.html',
  'renovation-remodeling.html',
  'interior-design.html',
  'architectural-planning.html',
  'house-construction-in-avadi.html',
  'building-contractors-in-ambattur.html',
  'house-construction-in-poonamallee.html',
  'building-contractors-in-vanagaram.html',
  'house-construction-in-kelambakkam.html',
  'house-construction-in-omr-chennai.html',
  'building-contractors-thiruvallur-chennai.html',
  '404.html'
];

let updatedCount = 0;
targetFiles.forEach(fileName => {
  const filePath = path.join(__dirname, '..', 'public', fileName);
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', fileName);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (/<header[\s\S]*?<\/header>/.test(content)) {
    content = content.replace(/<header[\s\S]*?<\/header>/, headerHtml);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated header in: ${fileName}`);
  } else {
    console.warn(`No header tag found in: ${fileName}`);
  }
});

console.log(`\nSuccessfully updated unified header across ${updatedCount} files.`);
