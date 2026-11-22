const fs = require('fs');

const files = [
  'house-construction-in-avadi.html',
  'building-contractors-in-ambattur.html',
  'house-construction-in-poonamallee.html',
  'building-contractors-in-vanagaram.html',
  'house-construction-in-kelambakkam.html',
  'house-construction-in-omr-chennai.html'
];

files.forEach(f => {
  const c = fs.readFileSync('public/' + f, 'utf8');
  const title = c.split('<title>')[1].split('</title>')[0];
  const h1 = c.split('loc-hero__title">')[1].split('</h1>')[0];
  const desc = c.split('name="description" content="')[1].split('"')[0];
  const kw = c.split('name="keywords" content="')[1].split('"')[0];
  console.log(`=== ${f} ===`);
  console.log(`Title: ${title}`);
  console.log(`H1:    ${h1}`);
  console.log(`Desc:  ${desc.slice(0, 90)}...`);
  console.log(`KW:    ${kw.slice(0, 90)}...\n`);
});
