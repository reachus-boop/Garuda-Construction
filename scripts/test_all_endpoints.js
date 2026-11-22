const http = require('http');

const urls = [
  'http://localhost:3030/',
  'http://localhost:3030/packages',
  'http://localhost:3030/compare-packages',
  'http://localhost:3030/calculator',
  'http://localhost:3030/blog',
  'http://localhost:3030/house-construction-cost-chennai',
  'http://localhost:3030/cmda-dtcp-approval-rules-chennai',
  'http://localhost:3030/construction-company-in-avadi',
  'http://localhost:3030/construction-company-in-ambattur',
  'http://localhost:3030/construction-company-in-poonamallee',
  'http://localhost:3030/construction-company-in-vanagaram',
  'http://localhost:3030/construction-company-in-kelambakkam',
  'http://localhost:3030/construction-company-in-omr',
  'http://localhost:3030/sitemap.xml'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log('Testing server endpoints...');
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`${res.status} | ${res.length ? res.length + ' bytes' : res.error} | ${res.url}`);
  }
}

run();
