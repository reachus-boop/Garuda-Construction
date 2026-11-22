const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const expectedPages = [
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
  'house-construction-in-omr-chennai.html'
];

let allPassed = true;

// 1. Verify existence of all files
expectedPages.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`FAIL: Missing file: ${file}`);
    allPassed = false;
  }
});

// 2. Verify all navbar links inside index.html resolve to actual files
const indexContent = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const linkMatches = indexContent.match(/href="([^"#]+?\.html)"/g) || [];
const checkedLinks = new Set();

linkMatches.forEach(hrefAttr => {
  const file = hrefAttr.replace('href="', '').replace('"', '');
  if (!checkedLinks.has(file)) {
    checkedLinks.add(file);
    const resolvedPath = path.join(publicDir, file);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`FAIL: Broken link target in navbar: ${file}`);
      allPassed = false;
    }
  }
});

// 3. Verify target keywords on the 6 location pages
const locations = [
  { file: 'house-construction-in-avadi.html', name: 'Avadi' },
  { file: 'building-contractors-in-ambattur.html', name: 'Ambattur' },
  { file: 'house-construction-in-poonamallee.html', name: 'Poonamallee' },
  { file: 'building-contractors-in-vanagaram.html', name: 'Vanagaram' },
  { file: 'house-construction-in-kelambakkam.html', name: 'Kelambakkam' },
  { file: 'house-construction-in-omr-chennai.html', name: 'OMR' }
];

locations.forEach(loc => {
  const content = fs.readFileSync(path.join(publicDir, loc.file), 'utf8');
  
  const kw1 = `Construction Company in ${loc.name}`.toLowerCase();
  const kw2 = `Home Construction in ${loc.name}`.toLowerCase();
  const kw3 = `Building Contractors in ${loc.name}`.toLowerCase();
  const contentLower = content.toLowerCase();

  const hasKw1 = contentLower.includes(kw1);
  const hasKw2 = contentLower.includes(kw2);
  const hasKw3 = contentLower.includes(kw3);
  const hasSchema = content.includes('"@type": "HomeAndConstructionBusiness"');
  const hasNavDropdown = content.includes('<span>Areas</span>');

  if (!hasKw1 || !hasKw2 || !hasKw3 || !hasSchema || !hasNavDropdown) {
    console.error(`FAIL on ${loc.file}: kw1=${hasKw1}, kw2=${hasKw2}, kw3=${hasKw3}, schema=${hasSchema}, nav=${hasNavDropdown}`);
    allPassed = false;
  } else {
    console.log(`PASS: ${loc.name.padEnd(15)} targets all 3 keywords, LocalBusiness schema, and unified Areas navbar`);
  }
});

if (allPassed) {
  console.log('\nALL INTEGRITY CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('\nSOME CHECKS FAILED!');
  process.exit(1);
}
