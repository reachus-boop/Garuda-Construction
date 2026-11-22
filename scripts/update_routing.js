const fs = require('fs');
const path = require('path');

// 1. Update server.js
const serverFile = path.join(__dirname, '..', 'server.js');
let serverCode = fs.readFileSync(serverFile, 'utf8');

const oldServerRewrites = `    '/construction-company-in-omr': '/house-construction-in-omr-chennai.html',
    '/home-construction-in-omr': '/house-construction-in-omr-chennai.html'`;

const newServerRewrites = `    '/construction-company-in-omr': '/house-construction-in-omr-chennai.html',
    '/home-construction-in-omr': '/house-construction-in-omr-chennai.html',
    '/compare-packages': '/compare-packages.html',
    '/house-construction-cost-chennai': '/house-construction-cost-chennai.html',
    '/construction-cost-in-chennai': '/house-construction-cost-chennai.html',
    '/cmda-dtcp-approval-rules-chennai': '/cmda-dtcp-approval-rules-chennai.html',
    '/cmda-approval-rules-chennai': '/cmda-dtcp-approval-rules-chennai.html'`;

if (!serverCode.includes('/house-construction-cost-chennai')) {
  serverCode = serverCode.replace(oldServerRewrites, newServerRewrites);
  fs.writeFileSync(serverFile, serverCode, 'utf8');
  console.log('Updated server.js rewrites.');
}

// 2. Update vercel.json
const vercelFile = path.join(__dirname, '..', 'vercel.json');
let vercelJson = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));

const blogRewrites = [
  { "source": "/compare-packages", "destination": "/compare-packages.html" },
  { "source": "/house-construction-cost-chennai", "destination": "/house-construction-cost-chennai.html" },
  { "source": "/construction-cost-in-chennai", "destination": "/house-construction-cost-chennai.html" },
  { "source": "/cmda-dtcp-approval-rules-chennai", "destination": "/cmda-dtcp-approval-rules-chennai.html" },
  { "source": "/cmda-approval-rules-chennai", "destination": "/cmda-dtcp-approval-rules-chennai.html" }
];

blogRewrites.forEach(rw => {
  if (!vercelJson.rewrites.some(r => r.source === rw.source)) {
    vercelJson.rewrites.push(rw);
  }
});

fs.writeFileSync(vercelFile, JSON.stringify(vercelJson, null, 2), 'utf8');
console.log('Updated vercel.json rewrites.');
