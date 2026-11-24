const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = 'c:/Users/m/Documents/dbdcodes';
const PORT = 8795;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

const SYNONYMS = {
  'bp': 'bloodpoints',
  'bloodpoint': 'bloodpoints',
  'ac': 'auric cells',
  'dbd': 'dead by daylight',
  'charm': 'charm',
  'charms': 'charm',
  'banner': 'banner',
  'banners': 'banner',
  'badge': 'badge',
  'badges': 'badge',
  'figurine': 'figurine',
  'figurines': 'figurine',
  'blood': 'bloodpoints',
  'cell': 'auric cells',
  'cells': 'auric cells',
  'points': 'bloodpoints'
};

function scoreItem(title, keywords, query) {
  const normQuery = normalizeText(query);
  if (!normQuery) return 0;
  const normTitle = normalizeText(title);
  const normKeywords = (keywords || []).map(normalizeText);
  const allWords = normTitle.split(' ').concat(normKeywords);

  let score = 0;
  if (normTitle === normQuery) score += 250;
  else if (normTitle.startsWith(normQuery)) score += 150;
  else if (normTitle.includes(normQuery)) score += 90;

  if (normQuery.length === 1) {
    const letter = normQuery[0];
    if (normTitle.startsWith(letter)) score += 70;
    const wordStarts = allWords.filter(w => w.startsWith(letter));
    if (wordStarts.length > 0) score += 30 + wordStarts.length * 8;
    if (normTitle.includes(letter)) score += 10;
    return score;
  }

  const queryTokens = normQuery.split(' ');
  const expandedTokens = [];
  queryTokens.forEach(t => {
    expandedTokens.push(t);
    if (SYNONYMS[t]) {
      SYNONYMS[t].split(' ').forEach(st => expandedTokens.push(st));
    }
  });

  for (const token of expandedTokens) {
    if (!token) continue;
    let matched = false;
    for (const w of allWords) {
      if (w === token) {
        score += 60; matched = true; break;
      } else if (w.startsWith(token) && token.length >= 2) {
        score += 45; matched = true; break;
      } else if (w.includes(token) && token.length >= 3) {
        score += 25; matched = true; break;
      }
    }
    if (!matched && token.length >= 3) {
      for (const w of allWords) {
        if (w.length < 3) continue;
        const maxDist = token.length <= 4 ? 1 : (token.length <= 7 ? 2 : 3);
        const dist = levenshteinDistance(token, w);
        if (dist <= maxDist) {
          score += Math.max(12, 45 - dist * 14);
          matched = true;
          break;
        }
      }
    }
  }
  return score;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname);

  // CDN CGI mock
  if (pathname.startsWith('/cdn-cgi/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
    return;
  }

  // Search API endpoint with fuzzy matching
  if (pathname === '/search' || pathname === '/api/search') {
    const q = parsed.query.q || '';
    const couponDir = path.join(ROOT, 'api', 'coupons');
    let coupons = [];
    if (fs.existsSync(couponDir)) {
      fs.readdirSync(couponDir).forEach(f => {
        if (f.endsWith('.json')) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(couponDir, f), 'utf8'));
            coupons.push(data.coupon || data);
          } catch (_) {}
        }
      });
    }

    const scoredCoupons = coupons
      .map(c => {
        const keywords = [c.category, c.coupon_short_incent, c.coupon_short_description, c.brand_name];
        return { coupon: c, score: scoreItem(c.coupon_title, keywords, q) };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.coupon);

    const brands = [{ id: 27, brand_name: "Dead By Daylight", brand_logo: "public/assets/uploads/brand_logos/brand_27_e6455b68d4a204e2.jpg", coupon_count: 8 }];
    const scoredBrands = brands
      .map(b => ({ brand: b, score: scoreItem(b.brand_name, ["dbd", "dead", "daylight", "game"], q) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.brand);

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ coupons: scoredCoupons, brands: scoredBrands }));
    return;
  }

  if (pathname === '/') pathname = '/index.html';

  let filePath = path.join(ROOT, pathname);

  // Check fallback paths
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.json')) {
    filePath = filePath + '.json';
  } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  // Handle /brand/27 -> brand.html
  if (pathname === '/brand/27' || pathname === '/brand/27/') {
    filePath = path.join(ROOT, 'brand.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Page Not Found</h2><p><a href="/index.html">Return to DBD Codes Home</a></p></body></html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`DBD Codes server running on http://127.0.0.1:${PORT}`);
});
