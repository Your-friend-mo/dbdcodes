// test_search.js
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
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

const COUPONS = [
  {
    id: 22,
    title: "6,000 Auric Cells Code",
    category: "Currency",
    reward: "6,000 Auric Cells",
    brand: "Dead By Daylight",
    url: "coupon/22.html",
    slug: "coupon/6000-auric-cells-code.html",
    image: "public/assets/uploads/coupon_banners/coupon_22_b699a05c20572a65.jpg",
    keywords: ["auric", "cells", "currency", "gold", "6000", "6,000", "ac", "money", "code", "codes", "promo"]
  },
  {
    id: 23,
    title: "Hand-Painted Dwight Charm",
    category: "Charm",
    reward: "Dwight Fairfield Charm",
    brand: "Dead By Daylight",
    url: "coupon/23.html",
    slug: "coupon/hand-painted-dwight-charm.html",
    image: "public/assets/uploads/coupon_banners/coupon_23_3f42d8902c9f05cb.webp",
    keywords: ["hand", "painted", "dwight", "fairfield", "charm", "charms", "survivor", "cosmetic", "code", "codes"]
  },
  {
    id: 24,
    title: "Horror Attraction Banner",
    category: "Banner",
    reward: "Exclusive Profile Banner",
    brand: "Dead By Daylight",
    url: "coupon/24.html",
    slug: "coupon/horror-attraction-banner.html",
    image: "public/assets/uploads/coupon_banners/coupon_24_9f98ec6b421fee18.webp",
    keywords: ["horror", "attraction", "banner", "banners", "profile", "badge", "cosmetic", "code", "codes"]
  },
  {
    id: 25,
    title: "Two Karma Banners & One Karma Badge",
    category: "Bundle",
    reward: "2 Banners + 1 Badge",
    brand: "Dead By Daylight",
    url: "coupon/25.html",
    slug: "coupon/two-karma-banners-one-karma-badge.html",
    image: "public/assets/uploads/coupon_banners/coupon_25_1c32bcaa2381dda9.webp",
    keywords: ["two", "karma", "banners", "banner", "one", "badge", "badges", "profile", "bundle", "code", "codes"]
  },
  {
    id: 26,
    title: "Party Dwight Figurine",
    category: "Figurine",
    reward: "Dwight Figurine Cosmetic",
    brand: "Dead By Daylight",
    url: "coupon/26.html",
    slug: "coupon/party-dwight-figurine.html",
    image: "public/assets/uploads/coupon_banners/coupon_26_cb54095ad3133299.jpg",
    keywords: ["party", "dwight", "figurine", "figurines", "charm", "charms", "anniversary", "cosmetic", "code", "codes"]
  },
  {
    id: 27,
    title: "10 Million Bloodpoints",
    category: "Currency",
    reward: "10,000,000 Bloodpoints",
    brand: "Dead By Daylight",
    url: "coupon/27.html",
    slug: "coupon/10-million-bloodpoints.html",
    image: "public/assets/uploads/coupon_banners/coupon_27_08c211d05b9df4f2.jpg",
    keywords: ["10", "million", "bloodpoints", "blood", "points", "bp", "currency", "10m", "code", "codes"]
  },
  {
    id: 28,
    title: "Slasher Figurine Charm",
    category: "Charm",
    reward: "Slasher Killer Charm",
    brand: "Dead By Daylight",
    url: "coupon/28.html",
    slug: "coupon/slasher-figurine-charm.html",
    image: "public/assets/uploads/coupon_banners/coupon_28_6658ab5d93ea3d63.webp",
    keywords: ["slasher", "figurine", "figurines", "charm", "charms", "killer", "cosmetic", "hook", "code", "codes"]
  },
  {
    id: 29,
    title: "Eyes In The Darkness Badge & Grasping Hallway Banner",
    category: "Bundle",
    reward: "Darkness Badge + Hallway Banner",
    brand: "Dead By Daylight",
    url: "coupon/29.html",
    slug: "coupon/eyes-in-the-darkness-badge-grasping-hallway-banner.html",
    image: "public/assets/uploads/coupon_banners/coupon_29_6a6a2a6a84d41.png",
    keywords: ["eyes", "darkness", "badge", "badges", "grasping", "hallway", "banner", "banners", "profile", "bundle", "code", "codes"]
  }
];

const BRANDS = [
  {
    id: 27,
    brand_name: "Dead By Daylight",
    brand_logo: "public/assets/uploads/brand_logos/brand_27_e6455b68d4a204e2.jpg",
    coupon_count: 8,
    keywords: ["dead", "by", "daylight", "dbd", "behaviour", "game", "codes", "promo", "coupons"]
  }
];

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
  'figurines': 'figurine'
};

function scoreItem(item, query, isBrand = false) {
  const normQuery = normalizeText(query);
  if (!normQuery) return 0;

  const title = isBrand ? item.brand_name : item.title;
  const normTitle = normalizeText(title);
  const keywords = (item.keywords || []).map(normalizeText);
  const allWords = normTitle.split(' ').concat(keywords);

  let score = 0;

  // 1. Exact match on full query
  if (normTitle === normQuery) {
    score += 200;
  } else if (normTitle.startsWith(normQuery)) {
    score += 120;
  } else if (normTitle.includes(normQuery)) {
    score += 80;
  }

  // 2. Single letter match
  if (normQuery.length === 1) {
    const letter = normQuery[0];
    if (normTitle.startsWith(letter)) score += 60;
    const wordStarts = allWords.filter(w => w.startsWith(letter));
    if (wordStarts.length > 0) score += 30 + wordStarts.length * 5;
    if (normTitle.includes(letter)) score += 10;
    return score;
  }

  // 3. Synonym / abbreviation expansion
  const queryTokens = normQuery.split(' ');
  const expandedTokens = [];
  queryTokens.forEach(t => {
    expandedTokens.push(t);
    if (SYNONYMS[t]) {
      SYNONYMS[t].split(' ').forEach(st => expandedTokens.push(st));
    }
  });

  // 4. Token-by-token matching & fuzzy matching
  for (const token of expandedTokens) {
    if (!token) continue;
    let tokenMatched = false;

    // Check exact word or prefix match
    for (const w of allWords) {
      if (w === token) {
        score += 50;
        tokenMatched = true;
        break;
      } else if (w.startsWith(token) && token.length >= 2) {
        score += 35;
        tokenMatched = true;
        break;
      } else if (w.includes(token) && token.length >= 3) {
        score += 20;
        tokenMatched = true;
        break;
      }
    }

    // Fuzzy matching / typo tolerance
    if (!tokenMatched && token.length >= 3) {
      for (const w of allWords) {
        if (w.length < 3) continue;
        const maxDist = token.length <= 4 ? 1 : (token.length <= 7 ? 2 : 3);
        const dist = levenshteinDistance(token, w);
        if (dist <= maxDist) {
          // Score inversely proportional to distance and token length
          score += Math.max(10, 40 - dist * 12);
          tokenMatched = true;
          break;
        }
      }
    }
  }

  return score;
}

function search(query) {
  if (!query || !query.trim()) return { brands: [], coupons: [] };

  const scoredCoupons = COUPONS.map(c => ({ coupon: c, score: scoreItem(c, query, false) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.coupon);

  const scoredBrands = BRANDS.map(b => ({ brand: b, score: scoreItem(b, query, true) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.brand);

  return { brands: scoredBrands, coupons: scoredCoupons };
}

// Test test cases
const testQueries = [
  "b", "d", "a", "s", "c", "p", "h", "1", "6",
  "blodpoint", "bludpoint", "blood points", "bp", "10 million",
  "aurik", "auric", "ac", "6000", "gold",
  "dwaight", "dwight", "party dwight",
  "slaher", "slasherr", "slasher",
  "horor", "attraction",
  "krama", "karma", "baner", "bagde",
  "darknes", "eyes", "hallway",
  "blöödpoints", "auríc", "slásher",
  "dead by daylight", "dbd"
];

let allPassed = true;
for (const q of testQueries) {
  const res = search(q);
  const count = res.coupons.length + res.brands.length;
  const topCoupon = res.coupons[0] ? res.coupons[0].title : 'None';
  console.log(`[SEARCH] "${q}" -> Total: ${count} | Top: ${topCoupon}`);
  if (count === 0) {
    allPassed = false;
    console.error(`FAILED to find results for: "${q}"`);
  }
}

if (allPassed) {
  console.log("\n>>> ALL TEST CASES PASSED! Every query, letter, and misspelling found matches! <<<");
} else {
  process.exit(1);
}
