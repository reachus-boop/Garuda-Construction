const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'index.html',
    title: 'Construction Company in Thiruvallur | House Construction & Building Contractors | Garuda',
    desc: 'Top construction company in Thiruvallur. Garuda Construction offers architect-led house construction & building contractors from ₹2,089/sqft with 10-yr warranty.',
    keywords: 'Construction company in Thiruvallur, House Construction in Thiruvallur, Building Contractors in Thiruvallur, Home construction Thiruvallur, Turnkey Builders Thiruvallur, Garuda Construction'
  },
  {
    file: 'areas.html',
    title: 'Construction Company Service Areas in Chennai & Suburbs | Garuda Construction',
    desc: 'Explore top construction company services across Chennai suburbs: Avadi, Ambattur, Poonamallee, Vanagaram, Kelambakkam & OMR. Turnkey rates from ₹2,089/sqft.',
    keywords: 'Construction company Chennai suburbs, Construction company in Avadi, Construction company in Ambattur, Construction company in Poonamallee, Home construction Chennai, Garuda Construction'
  },
  {
    file: 'house-construction-in-avadi.html',
    title: 'Construction Company in Avadi | Home Construction & Building Contractors | Garuda',
    desc: 'Top construction company in Avadi. Garuda Construction offers turnkey home construction & building contractors from ₹2,089/sqft with 10-year warranty.',
    keywords: 'Construction company in Avadi, Home construction in Avadi, Building contractors in Avadi, Turnkey Builders Avadi, Duplex Villa Builders Avadi, House Construction Cost Avadi, Garuda Construction'
  },
  {
    file: 'building-contractors-in-ambattur.html',
    title: 'Construction Company in Ambattur | Home Construction & Building Contractors | Garuda',
    desc: 'Top construction company in Ambattur. Garuda Construction provides turnkey home construction, floor additions & building contractors from ₹2,089/sqft.',
    keywords: 'Construction company in Ambattur, Home construction in Ambattur, Building contractors in Ambattur, Additional Floor Construction Ambattur, Turnkey Builders Ambattur, GCC Zone 7 Approved Builders, Garuda Construction'
  },
  {
    file: 'house-construction-in-poonamallee.html',
    title: 'Construction Company in Poonamallee | Home Construction & Building Contractors | Garuda',
    desc: 'Best construction company in Poonamallee. Turnkey home construction, commercial complexes & building contractors from ₹2,089/sqft. 10-yr warranty.',
    keywords: 'Construction company in Poonamallee, Home construction in Poonamallee, Building contractors in Poonamallee, Turnkey Builders Poonamallee, Commercial Builders Poonamallee, Duplex Villas Poonamallee, Garuda Construction'
  },
  {
    file: 'building-contractors-in-vanagaram.html',
    title: 'Construction Company in Vanagaram | Home Construction & Building Contractors | Garuda',
    desc: 'Top construction company in Vanagaram. Turnkey luxury home construction, modern duplex villas & building contractors from ₹2,089/sqft near Apollo Porur.',
    keywords: 'Construction company in Vanagaram, Home construction in Vanagaram, Building contractors in Vanagaram, Luxury Villa Builders Vanagaram, Turnkey Builders Vanagaram Porur, Commercial Builders Vanagaram, Garuda Construction'
  },
  {
    file: 'house-construction-in-kelambakkam.html',
    title: 'Construction Company in Kelambakkam | Home Construction & Building Contractors | Garuda',
    desc: 'Top construction company in Kelambakkam. Turnkey home construction, gated community villas & building contractors from ₹2,089/sqft. 10-yr warranty.',
    keywords: 'Construction company in Kelambakkam, Home construction in Kelambakkam, Building contractors in Kelambakkam, Duplex Villa Builders Kelambakkam, Gated Community Builders Kelambakkam, Turnkey House Construction Chennai, Garuda Construction'
  },
  {
    file: 'house-construction-in-omr-chennai.html',
    title: 'Construction Company in OMR | Home Construction & Building Contractors Chennai | Garuda',
    desc: 'Premier construction company in OMR. Turnkey contemporary home construction, coastal villas & building contractors from ₹2,089/sqft. 10-yr warranty.',
    keywords: 'Construction company in OMR, Home construction in OMR, Building contractors in OMR Chennai, Luxury Villa Builders OMR, Turnkey Builders Sholinganallur, Duplex House Navalur Siruseri, Garuda Construction'
  },
  {
    file: 'building-contractors-thiruvallur-chennai.html',
    title: 'Building Contractors in Thiruvallur & Chennai | Turnkey Civil & Home Construction | Garuda',
    desc: 'Best building contractors in Thiruvallur & Chennai. Complete guide to turnkey house construction, per-sqft pricing from ₹2,089/sqft & contract checklists.',
    keywords: 'Building Contractors in Thiruvallur & Chennai, Building Contractors in Thiruvallur, Building Contractors in Chennai, Residential Building Contractors, Commercial Construction Contractors, Turnkey Builders Chennai, Garuda Construction'
  }
];

updates.forEach(u => {
  const filePath = path.join(__dirname, '..', 'public', u.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', u.file);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Title
  content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${u.title}</title>`);
  
  // Replace Description
  content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${u.desc}">`);

  // Replace Keywords
  content = content.replace(/<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="keywords" content="${u.keywords}">`);

  // Replace OpenGraph Title & Desc
  content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:title" content="${u.title}">`);
  content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta property="og:description" content="${u.desc}">`);

  // Replace Twitter Title & Desc
  content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:title" content="${u.title}">`);
  content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="twitter:description" content="${u.desc}">`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated meta tags in ${u.file} (Desc length: ${u.desc.length} chars)`);
});
