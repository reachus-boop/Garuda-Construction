require('dotenv').config();
const crypto = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'garuda_construction';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Must be supplied via environment variable; no hardcoded fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(32).toString('hex');

if (!ADMIN_PASSWORD) {
  console.warn('[SECURITY NOTICE] ADMIN_PASSWORD environment variable is not configured. Admin panel login will be disabled.');
}

let cachedClient = null;
let cachedDb = null;
let leadsCollection = null;

async function getDatabase() {
  if (cachedDb && cachedClient && leadsCollection) {
    return { db: cachedDb, leads: leadsCollection };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured in environment');
  }

  try {
    cachedClient = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000
    });
    await cachedClient.connect();
    cachedDb = cachedClient.db(MONGODB_DB_NAME);
    leadsCollection = cachedDb.collection('leads');

    // Create index on first connection
    leadsCollection.createIndex({ createdAt: -1 }).catch(() => {});
    leadsCollection.createIndex({ status: 1 }).catch(() => {});
    leadsCollection.createIndex({ phone: 1 }).catch(() => {});

    return { db: cachedDb, leads: leadsCollection };
  } catch (err) {
    console.error('[MongoDB Error]', err.message);
    throw err;
  }
}

// --- Security Helpers ---
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function escapeRegex(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val).replace(/"/g, '""');
  // Neutralize CSV formula injection (=, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str}"`;
}

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('base64url');
  if (!safeCompare(signature, expectedSig)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function getClientIp(req) {
  const xForwarded = req.headers['x-forwarded-for'];
  if (xForwarded) return xForwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

function authenticateAdmin(req) {
  if (!ADMIN_PASSWORD) return null;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const payload = verifyToken(token);
    if (payload && ADMIN_USERNAME && safeCompare(payload.user, ADMIN_USERNAME)) return payload;
  }

  const cookies = parseCookies(req);
  if (cookies.garuda_admin_session) {
    const payload = verifyToken(cookies.garuda_admin_session);
    if (payload && ADMIN_USERNAME && safeCompare(payload.user, ADMIN_USERNAME)) return payload;
  }

  return null;
}

// --- Rate Limiting ---
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return { allowed: true };
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { allowed: false, remainingSecs: Math.ceil((entry.blockedUntil - now) / 1000) };
  }
  if (now > entry.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.blockedUntil = now + LOCKOUT_MS;
    return { allowed: false, remainingSecs: Math.ceil(LOCKOUT_MS / 1000) };
  }
  return { allowed: true };
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + ATTEMPT_WINDOW_MS, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_LOGIN_ATTEMPTS) entry.blockedUntil = now + LOCKOUT_MS;
  loginAttempts.set(ip, entry);
}

function resetLoginRateLimit(ip) {
  loginAttempts.delete(ip);
}

// Public Lead Capture Rate Limiting
const leadSubmissions = new Map();
const MAX_LEAD_SUBMISSIONS = 12;
const LEAD_WINDOW_MS = 15 * 60 * 1000;

function checkLeadRateLimit(ip) {
  const now = Date.now();
  const entry = leadSubmissions.get(ip);
  if (!entry) {
    leadSubmissions.set(ip, { count: 1, resetAt: now + LEAD_WINDOW_MS });
    return { allowed: true };
  }
  if (now > entry.resetAt) {
    leadSubmissions.set(ip, { count: 1, resetAt: now + LEAD_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_LEAD_SUBMISSIONS) {
    return { allowed: false, remainingSecs: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}

// Request Body Parser
function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data, extraHeaders = {}) {
  const currentHeaders = typeof res.getHeaders === 'function' ? res.getHeaders() : {};
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    ...SECURITY_HEADERS,
    ...currentHeaders,
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

// Allowed CORS Origins
const ALLOWED_ORIGINS = new Set([
  'https://www.garuda-construction.com',
  'https://garuda-construction.com',
  'http://localhost:3030',
  'http://127.0.0.1:3030'
]);

// --- Main Handler for Vercel & Node ---
module.exports = async function handler(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method.toUpperCase();
  const clientIp = getClientIp(req);

  // Security Headers
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(k, v);
  }

  // Strict CORS Handling
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.garuda-construction.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/analytics-config' && method === 'GET') {
    const measurementId = (process.env.GA4_MEASUREMENT_ID || '').trim();
    return sendJson(res, 200, {
      measurementId: /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : null
    });
  }

  // Health
  if (pathname === '/api/health' && method === 'GET') {
    let dbStatus = 'connecting';
    try {
      await getDatabase();
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'unavailable';
    }
    return sendJson(res, 200, {
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  }

  // 1. PUBLIC: Capture Lead
  if (pathname === '/api/leads' && method === 'POST') {
    const rateCheck = checkLeadRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return sendJson(res, 429, {
        success: false,
        error: `Submission rate limit exceeded. Please wait ${rateCheck.remainingSecs} seconds before trying again.`
      });
    }

    try {
      const { leads } = await getDatabase();
      const data = await parseJsonBody(req);
      const name = typeof data.name === 'string' ? data.name.trim().slice(0, 150) : '';
      const phone = typeof data.phone === 'string' ? data.phone.trim().slice(0, 50) : '';

      if (!name && !phone) {
        return sendJson(res, 400, { success: false, error: 'Name or phone is required.' });
      }

      let sanitizedDetails = null;
      if (data.details && typeof data.details === 'object' && !Array.isArray(data.details)) {
        sanitizedDetails = {
          propertyType: typeof data.details.propertyType === 'string' ? data.details.propertyType.trim().slice(0, 120) : '',
          propertyLabel: typeof data.details.propertyLabel === 'string' ? data.details.propertyLabel.trim().slice(0, 120) : '',
          areaSqft: Number.isFinite(Number(data.details.areaSqft)) ? Number(data.details.areaSqft) : 0,
          floorsLabel: typeof data.details.floorsLabel === 'string' ? data.details.floorsLabel.trim().slice(0, 120) : '',
          pkgLabel: typeof data.details.pkgLabel === 'string' ? data.details.pkgLabel.trim().slice(0, 120) : '',
          location: typeof data.details.location === 'string' ? data.details.location.trim().slice(0, 120) : '',
          grandTotal: Number.isFinite(Number(data.details.grandTotal)) ? Number(data.details.grandTotal) : 0,
          timeline: typeof data.details.timeline === 'string' ? data.details.timeline.trim().slice(0, 120) : ''
        };
      }

      const newLead = {
        name: name || 'Website Visitor',
        phone: phone,
        email: typeof data.email === 'string' ? data.email.trim().slice(0, 150) : '',
        service: typeof data.service === 'string' ? data.service.trim().slice(0, 150) : 'General Construction',
        location: typeof data.location === 'string' ? data.location.trim().slice(0, 150) : '',
        sqft: data.sqft ? String(data.sqft).trim().slice(0, 50) : '',
        budget: data.budget ? String(data.budget).trim().slice(0, 50) : '',
        message: typeof data.message === 'string' ? data.message.trim().slice(0, 2000) : '',
        source: typeof data.source === 'string' ? data.source.trim().slice(0, 100) : 'website',
        details: sanitizedDetails,
        status: 'new',
        notes: [],
        ip: clientIp,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await leads.insertOne(newLead);
      return sendJson(res, 201, {
        success: true,
        message: 'Lead captured successfully',
        leadId: result.insertedId
      });
    } catch (err) {
      console.error('[API Error saving lead]:', err.message);
      return sendJson(res, 500, { success: false, error: 'Internal server error saving lead. Please try again.' });
    }
  }

  // 2. AUTH: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    if (!ADMIN_PASSWORD) {
      console.error('[SECURITY ALERT] Login attempted but ADMIN_PASSWORD is not set in environment.');
      return sendJson(res, 503, {
        success: false,
        error: 'Admin authentication is currently disabled on this instance. Configure ADMIN_PASSWORD in environment.'
      });
    }

    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return sendJson(res, 429, {
        success: false,
        error: `Too many failed login attempts. Temporarily blocked for security. Please try again in ${rateCheck.remainingSecs} seconds.`
      });
    }

    try {
      const body = await parseJsonBody(req);
      const username = typeof body.username === 'string' ? body.username.trim() : '';
      const password = typeof body.password === 'string' ? body.password.trim() : '';

      if (ADMIN_USERNAME && ADMIN_PASSWORD && safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD)) {
        resetLoginRateLimit(clientIp);

        const token = signToken({
          user: ADMIN_USERNAME,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        });

        const isSecure = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
        const secureFlag = isSecure ? '; Secure' : '';

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': `garuda_admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${secureFlag}`,
          ...SECURITY_HEADERS
        });
        return res.end(JSON.stringify({
          success: true,
          token,
          user: { username: ADMIN_USERNAME }
        }));
      }

      recordFailedLogin(clientIp);
      return sendJson(res, 401, { success: false, error: 'Invalid username or password' });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: 'Malformed request body' });
    }
  }

  // 3. AUTH: Check current status
  if (pathname === '/api/auth/check' && method === 'GET') {
    const admin = authenticateAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { authenticated: false });
    }
    return sendJson(res, 200, {
      authenticated: true,
      user: { username: admin.user }
    });
  }

  // 4. AUTH: Logout
  if (pathname === '/api/auth/logout' && method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': 'garuda_admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
      ...SECURITY_HEADERS
    });
    return res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
  }

  // --- PROTECTED ADMIN API ROUTES ---
  if (pathname.startsWith('/api/leads')) {
    const admin = authenticateAdmin(req);
    if (!admin) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }

    let leads;
    try {
      const dbInfo = await getDatabase();
      leads = dbInfo.leads;
    } catch (e) {
      return sendJson(res, 503, { success: false, error: 'Database service unavailable' });
    }

    // GET /api/leads/stats
    if (pathname === '/api/leads/stats' && method === 'GET') {
      try {
        const total = await leads.countDocuments();
        const newCount = await leads.countDocuments({ status: 'new' });
        const contactedCount = await leads.countDocuments({ status: 'contacted' });
        const inDiscussionCount = await leads.countDocuments({ status: 'in_discussion' });
        const siteVisitCount = await leads.countDocuments({ status: 'site_visit' });
        const convertedCount = await leads.countDocuments({ status: 'converted' });
        const lostCount = await leads.countDocuments({ status: 'lost' });

        const calcLeads = await leads.find({ 'details.grandTotal': { $exists: true } }).toArray();
        const pipelineSum = calcLeads.reduce((acc, lead) => {
          const val = Number(lead.details?.grandTotal) || 0;
          return acc + val;
        }, 0);

        return sendJson(res, 200, {
          success: true,
          stats: {
            total,
            new: newCount,
            contacted: contactedCount,
            inDiscussion: inDiscussionCount,
            siteVisit: siteVisitCount,
            converted: convertedCount,
            lost: lostCount,
            pipelineSum
          }
        });
      } catch (err) {
        console.error('[API Error in stats]:', err);
        return sendJson(res, 500, { success: false, error: 'Internal server error calculating stats' });
      }
    }

    // GET /api/leads/export (Safe CSV)
    if (pathname === '/api/leads/export' && method === 'GET') {
      try {
        const allLeads = await leads.find({}).sort({ createdAt: -1 }).toArray();
        let csv = 'ID,Name,Phone,Email,Service,Location,Sqft,Budget,Status,Source,Date,Notes\n';
        for (const l of allLeads) {
          const id = sanitizeCsvCell(l._id.toString());
          const name = sanitizeCsvCell(l.name);
          const phone = sanitizeCsvCell(l.phone);
          const email = sanitizeCsvCell(l.email);
          const service = sanitizeCsvCell(l.service);
          const location = sanitizeCsvCell(l.location);
          const sqft = sanitizeCsvCell(l.sqft);
          const budget = sanitizeCsvCell(l.budget);
          const status = sanitizeCsvCell(l.status);
          const source = sanitizeCsvCell(l.source);
          const date = sanitizeCsvCell(l.createdAt ? new Date(l.createdAt).toISOString() : '');
          const notesText = l.notes && l.notes.length ? l.notes.map(n => n.text).join(' | ') : '';
          const notes = sanitizeCsvCell(notesText);
          csv += `${id},${name},${phone},${email},${service},${location},${sqft},${budget},${status},${source},${date},${notes}\n`;
        }

        const dateStr = new Date().toISOString().split('T')[0];
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="garuda_leads_${dateStr}.csv"`,
          ...SECURITY_HEADERS
        });
        return res.end(csv);
      } catch (err) {
        console.error('[API Error in CSV export]:', err);
        return sendJson(res, 500, { success: false, error: 'Failed to generate CSV export' });
      }
    }

    // GET /api/leads
    if (pathname === '/api/leads' && method === 'GET') {
      try {
        const validStatuses = ['new', 'contacted', 'in_discussion', 'site_visit', 'converted', 'lost'];
        const qStatus = urlObj.searchParams.get('status');
        const qService = urlObj.searchParams.get('service');
        const qSearch = urlObj.searchParams.get('search');
        const page = Math.max(1, parseInt(urlObj.searchParams.get('page') || '1', 10));
        const limit = Math.min(200, Math.max(1, parseInt(urlObj.searchParams.get('limit') || '50', 10)));

        const filter = {};
        if (qStatus && validStatuses.includes(qStatus)) {
          filter.status = qStatus;
        }
        if (qService && qService !== 'all' && typeof qService === 'string') {
          filter.service = { $regex: new RegExp(escapeRegex(qService.trim()), 'i') };
        }
        if (qSearch && typeof qSearch === 'string' && qSearch.trim()) {
          const rgx = new RegExp(escapeRegex(qSearch.trim()), 'i');
          filter.$or = [
            { name: rgx },
            { phone: rgx },
            { email: rgx },
            { location: rgx },
            { message: rgx }
          ];
        }

        const total = await leads.countDocuments(filter);
        const docs = await leads
          .find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();

        return sendJson(res, 200, {
          success: true,
          leads: docs,
          total,
          page,
          pages: Math.ceil(total / limit)
        });
      } catch (err) {
        console.error('[API Error in listing leads]:', err);
        return sendJson(res, 500, { success: false, error: 'Internal server error retrieving leads' });
      }
    }

    // POST /api/leads/manual
    if (pathname === '/api/leads/manual' && method === 'POST') {
      try {
        const data = await parseJsonBody(req);
        const name = typeof data.name === 'string' ? data.name.trim().slice(0, 150) : '';
        const phone = typeof data.phone === 'string' ? data.phone.trim().slice(0, 50) : '';

        if (!name || !phone) {
          return sendJson(res, 400, { success: false, error: 'Name and phone are required.' });
        }

        const validStatuses = ['new', 'contacted', 'in_discussion', 'site_visit', 'converted', 'lost'];
        const status = validStatuses.includes(data.status) ? data.status : 'new';

        const newLead = {
          name,
          phone,
          email: typeof data.email === 'string' ? data.email.trim().slice(0, 150) : '',
          service: typeof data.service === 'string' ? data.service.trim().slice(0, 150) : 'General Construction',
          location: typeof data.location === 'string' ? data.location.trim().slice(0, 150) : '',
          sqft: data.sqft ? String(data.sqft).trim().slice(0, 50) : '',
          budget: data.budget ? String(data.budget).trim().slice(0, 50) : '',
          message: typeof data.message === 'string' ? data.message.trim().slice(0, 2000) : '',
          source: 'Manual Admin Entry',
          details: null,
          status,
          notes: data.notes ? [{ text: String(data.notes).slice(0, 2000), author: admin.user, createdAt: new Date() }] : [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await leads.insertOne(newLead);
        return sendJson(res, 201, { success: true, leadId: result.insertedId, lead: newLead });
      } catch (err) {
        console.error('[API Error creating manual lead]:', err);
        return sendJson(res, 500, { success: false, error: 'Internal server error creating lead' });
      }
    }

    // PATCH /api/leads/:id
    const matchLeadId = pathname.match(/^\/api\/leads\/([a-f0-9]{24})$/);
    if (matchLeadId && method === 'PATCH') {
      try {
        const id = new ObjectId(matchLeadId[1]);
        const updates = await parseJsonBody(req);
        const validStatuses = ['new', 'contacted', 'in_discussion', 'site_visit', 'converted', 'lost'];

        const setFields = { updatedAt: new Date() };
        if (updates.status && validStatuses.includes(updates.status)) {
          setFields.status = updates.status;
        }
        if (typeof updates.name === 'string') setFields.name = updates.name.trim().slice(0, 150);
        if (typeof updates.phone === 'string') setFields.phone = updates.phone.trim().slice(0, 50);
        if (typeof updates.email === 'string') setFields.email = updates.email.trim().slice(0, 150);
        if (typeof updates.service === 'string') setFields.service = updates.service.trim().slice(0, 150);
        if (typeof updates.location === 'string') setFields.location = updates.location.trim().slice(0, 150);
        if (updates.sqft !== undefined) setFields.sqft = String(updates.sqft).trim().slice(0, 50);
        if (updates.budget !== undefined) setFields.budget = String(updates.budget).trim().slice(0, 50);

        const updateDoc = { $set: setFields };

        if (typeof updates.newNote === 'string' && updates.newNote.trim()) {
          updateDoc.$push = {
            notes: {
              text: updates.newNote.trim().slice(0, 2000),
              author: admin.user,
              createdAt: new Date()
            }
          };
        }

        const result = await leads.updateOne({ _id: id }, updateDoc);
        if (result.matchedCount === 0) {
          return sendJson(res, 404, { success: false, error: 'Lead not found' });
        }

        const updatedLead = await leads.findOne({ _id: id });
        return sendJson(res, 200, { success: true, lead: updatedLead });
      } catch (err) {
        console.error('[API Error updating lead]:', err);
        return sendJson(res, 500, { success: false, error: 'Internal server error updating lead' });
      }
    }

    // DELETE /api/leads/:id
    if (matchLeadId && method === 'DELETE') {
      try {
        const id = new ObjectId(matchLeadId[1]);
        const result = await leads.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          return sendJson(res, 404, { success: false, error: 'Lead not found' });
        }
        return sendJson(res, 200, { success: true, message: 'Lead deleted successfully' });
      } catch (err) {
        console.error('[API Error deleting lead]:', err);
        return sendJson(res, 500, { success: false, error: 'Internal server error deleting lead' });
      }
    }
  }

  // Fallback 404 for unrecognized API routes
  return sendJson(res, 404, { error: 'Not Found' });
};
