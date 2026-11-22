const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
let content = fs.readFileSync(sitemapPath, 'utf8');

const newEntries = `
  <!-- Compare Packages Tool -->
  <url>
    <loc>https://www.garuda-construction.com/compare-packages.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- High-Traffic Guide: House Construction Cost Chennai 2026 -->
  <url>
    <loc>https://www.garuda-construction.com/house-construction-cost-chennai.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- High-Traffic Guide: CMDA vs DTCP Approval Rules Chennai 2026 -->
  <url>
    <loc>https://www.garuda-construction.com/cmda-dtcp-approval-rules-chennai.html</loc>
    <lastmod>2026-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
</urlset>`;

if (!content.includes('house-construction-cost-chennai.html')) {
  content = content.replace('</urlset>', newEntries);
  fs.writeFileSync(sitemapPath, content, 'utf8');
  console.log('Successfully added new pages to sitemap.xml');
} else {
  console.log('sitemap.xml already contains the new entries.');
}
