require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const apiHandler = require('./api/index.js');
const { redirects } = require('./vercel.json');

const PORT = parseInt(process.env.PORT, 10) || 3030;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PAGE_REDIRECTS = new Map(redirects.map(({ source, destination }) => [source, destination]));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const BLOCKED_EXTENSIONS = new Set([
  '.env', '.git', '.py', '.sh', '.bat', '.cmd', '.yml', '.yaml', '.log', '.bak', '.config', '.lock'
]);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function resolveSafePublicFile(urlPath) {
  // 1. Strip query string and decode URI safely
  let decoded = '';
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch (err) {
    return { status: 400, path: null };
  }

  // 2. Reject null bytes or illegal characters
  if (decoded.includes('\0')) {
    return { status: 400, path: null };
  }

  // 3. Reject any hidden dotfiles or traversal segments (e.g. /.env, /.git, /..)
  const segments = decoded.split(/[\\/]/).filter(Boolean);
  if (segments.some(seg => seg.startsWith('.') || seg === '..')) {
    return { status: 403, path: null };
  }

  // 4. Default root to index.html
  let relativePath = segments.join(path.sep);
  if (!relativePath) {
    relativePath = 'index.html';
  }

  // 5. Strictly resolve against PUBLIC_DIR only
  const resolvedPath = path.resolve(PUBLIC_DIR, relativePath);
  if (!resolvedPath.startsWith(PUBLIC_DIR + path.sep) && resolvedPath !== PUBLIC_DIR) {
    return { status: 403, path: null };
  }

  // 6. Block forbidden extensions
  const ext = path.extname(resolvedPath).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { status: 403, path: null };
  }

  // 7. Check direct file existence
  try {
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      return { status: 200, path: resolvedPath };
    }
  } catch (err) {}

  // 8. Try clean URLs with .html inside PUBLIC_DIR
  if (!ext) {
    const htmlCandidate = resolvedPath + '.html';
    try {
      if (htmlCandidate.startsWith(PUBLIC_DIR) && fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
        return { status: 200, path: htmlCandidate };
      }
    } catch (err) {}
  }

  return { status: 404, path: null };
}

// --- Request Handler ---
async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. All API routes delegate to api/index.js
  if (pathname.startsWith('/api')) {
    return apiHandler(req, res);
  }

  // 2. Explicit /admin route to admin.html
  if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
    const adminPath = path.join(PUBLIC_DIR, 'admin.html');
    if (fs.existsSync(adminPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        ...SECURITY_HEADERS
      });
      return fs.createReadStream(adminPath).pipe(res);
    }
  }

  // Match the public page redirects configured for Vercel, including old .html links.
  const cleanPath = pathname.replace(/\/+$/, '').replace(/\.html$/i, '') || '/';
  const redirectTo = PAGE_REDIRECTS.get(cleanPath);
  if (redirectTo) {
    res.writeHead(308, { Location: redirectTo + urlObj.search, ...SECURITY_HEADERS });
    return res.end();
  }

  // 3. Resolve file safely within public/
  const resolved = resolveSafePublicFile(pathname);

  if (resolved.status === 403) {
    res.writeHead(403, {
      'Content-Type': 'text/plain; charset=utf-8',
      ...SECURITY_HEADERS
    });
    res.end('403 Forbidden: Access denied.');
    return;
  }

  if (resolved.status === 400 || resolved.status === 404 || !resolved.path) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        ...SECURITY_HEADERS
      });
      fs.createReadStream(notFoundPath).pipe(res);
      return;
    }
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      ...SECURITY_HEADERS
    });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(resolved.path).toLowerCase();
  if (ext === '.html' && pathname !== cleanPath && cleanPath !== '/' &&
      !['404.html', 'review-poster.html'].includes(path.basename(resolved.path)) &&
      !path.basename(resolved.path).startsWith('google')) {
    // Derive Location from the resolved file so it is always a local path.
    const page = path.relative(PUBLIC_DIR, resolved.path).slice(0, -ext.length);
    const route = '/' + page.split(path.sep).map(encodeURIComponent).join('/');
    res.writeHead(308, { Location: route + urlObj.search, ...SECURITY_HEADERS });
    return res.end();
  }
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(resolved.path, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
        ...SECURITY_HEADERS
      });
      res.end('404 Not Found');
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': (ext === '.css' || ext === '.js' || ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.webp')
        ? 'public, max-age=86400'
        : 'no-cache',
      ...SECURITY_HEADERS
    };

    res.writeHead(200, headers);
    fs.createReadStream(resolved.path).pipe(res);
  });
}

const server = http.createServer(handleRequest);

module.exports = server;

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=================================================`);
    console.log(`  Garuda Construction Server is Running!`);
    console.log(`  Local Website:   http://localhost:${PORT}/`);
    console.log(`  Admin Panel:     http://localhost:${PORT}/admin`);
    console.log(`  API Endpoint:    http://localhost:${PORT}/api/health`);
    console.log(`=================================================\n`);
  });
}
