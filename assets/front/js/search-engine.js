/**
 * DBD Codes - Universal High-Performance Fuzzy Search Engine
 * Supports:
 * - Single letters ("b", "d", "a", etc.)
 * - Typo tolerance & misspellings ("blodpoints", "aurik", "dwaight", "slaher", etc.)
 * - Full words & numbers ("10 million", "bloodpoints", "auric cells", "6000")
 * - International measures & unicode accents normalization (é, ñ, ö, ü, ø -> e, n, o, u, o)
 * - Abbreviations ("bp", "ac", "dbd")
 * - Keyboard navigation (Arrows, Enter, Escape)
 * - Automatic path handling across root and subfolder pages
 */
(function() {
  'use strict';

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
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
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
      page: "coupon/22.html",
      image: "public/assets/uploads/coupon_banners/coupon_22_b699a05c20572a65.jpg",
      keywords: ["auric", "cells", "currency", "gold", "6000", "6,000", "ac", "money", "code", "codes", "promo"]
    },
    {
      id: 23,
      title: "Hand-Painted Dwight Charm",
      category: "Charm",
      reward: "Dwight Fairfield Charm",
      brand: "Dead By Daylight",
      page: "coupon/23.html",
      image: "public/assets/uploads/coupon_banners/coupon_23_3f42d8902c9f05cb.webp",
      keywords: ["hand", "painted", "dwight", "fairfield", "charm", "charms", "survivor", "cosmetic", "code", "codes"]
    },
    {
      id: 24,
      title: "Horror Attraction Banner",
      category: "Banner",
      reward: "Exclusive Profile Banner",
      brand: "Dead By Daylight",
      page: "coupon/24.html",
      image: "public/assets/uploads/coupon_banners/coupon_24_9f98ec6b421fee18.webp",
      keywords: ["horror", "attraction", "banner", "banners", "profile", "badge", "cosmetic", "code", "codes"]
    },
    {
      id: 25,
      title: "Two Karma Banners & One Karma Badge",
      category: "Bundle",
      reward: "2 Banners + 1 Badge",
      brand: "Dead By Daylight",
      page: "coupon/25.html",
      image: "public/assets/uploads/coupon_banners/coupon_25_1c32bcaa2381dda9.webp",
      keywords: ["two", "karma", "banners", "banner", "one", "badge", "badges", "profile", "bundle", "code", "codes"]
    },
    {
      id: 26,
      title: "Party Dwight Figurine",
      category: "Figurine",
      reward: "Dwight Figurine Cosmetic",
      brand: "Dead By Daylight",
      page: "coupon/26.html",
      image: "public/assets/uploads/coupon_banners/coupon_26_cb54095ad3133299.jpg",
      keywords: ["party", "dwight", "figurine", "figurines", "charm", "charms", "anniversary", "cosmetic", "code", "codes"]
    },
    {
      id: 27,
      title: "10 Million Bloodpoints",
      category: "Currency",
      reward: "10,000,000 Bloodpoints",
      brand: "Dead By Daylight",
      page: "coupon/27.html",
      image: "public/assets/uploads/coupon_banners/coupon_27_08c211d05b9df4f2.jpg",
      keywords: ["10", "million", "bloodpoints", "blood", "points", "bp", "currency", "10m", "code", "codes"]
    },
    {
      id: 28,
      title: "Slasher Figurine Charm",
      category: "Charm",
      reward: "Slasher Killer Charm",
      brand: "Dead By Daylight",
      page: "coupon/28.html",
      image: "public/assets/uploads/coupon_banners/coupon_28_6658ab5d93ea3d63.webp",
      keywords: ["slasher", "figurine", "figurines", "charm", "charms", "killer", "cosmetic", "hook", "code", "codes"]
    },
    {
      id: 29,
      title: "Eyes In The Darkness Badge & Grasping Hallway Banner",
      category: "Bundle",
      reward: "Darkness Badge + Hallway Banner",
      brand: "Dead By Daylight",
      page: "coupon/29.html",
      image: "public/assets/uploads/coupon_banners/coupon_29_6a6a2a6a84d41.png",
      keywords: ["eyes", "darkness", "badge", "badges", "grasping", "hallway", "banner", "banners", "profile", "bundle", "code", "codes"]
    }    ,
    {
      id: 30,
      title: "10,000 Free Robux Code",
      category: "Currency",
      reward: "10,000 Robux",
      brand: "Roblox",
      page: "coupon/30.html",
      image: "public/assets/uploads/coupon_banners/coupon_30_robux.jpg",
      keywords: ["roblox", "robux", "free", "10000", "10,000", "rbx", "currency", "gift", "card", "code", "codes", "promo"]
    },
    {
      id: 31,
      title: "Redeem Free Robux Gift Card",
      category: "Gift Card",
      reward: "$50 Robux Gift Card",
      brand: "Roblox",
      page: "coupon/31.html",
      image: "public/assets/uploads/coupon_banners/coupon_31_giftcard.jpg",
      keywords: ["roblox", "gift", "card", "redeem", "free", "robux", "voucher", "50", "wallet", "code", "codes"]
    },
    {
      id: 32,
      title: "13,500 Free V-Bucks Code",
      category: "Currency",
      reward: "13,500 V-Bucks",
      brand: "Fortnite",
      page: "coupon/32.html",
      image: "public/assets/uploads/coupon_banners/coupon_32_vbucks.jpg",
      keywords: ["fortnite", "vbucks", "v-bucks", "13500", "13,500", "epic", "battle", "pass", "code", "codes", "currency"]
    },
    {
      id: 33,
      title: "Wildcat Skin Bundle Code",
      category: "Skin Bundle",
      reward: "Wildcat Outfit + 2000 V-Bucks",
      brand: "Fortnite",
      page: "coupon/33.html",
      image: "public/assets/uploads/coupon_banners/coupon_33_wildcat.jpg",
      keywords: ["fortnite", "wildcat", "skin", "bundle", "outfit", "rare", "exclusive", "nintendo", "code", "codes"]
    },
    {
      id: 34,
      title: "6,480 Genesis Crystals Code",
      category: "Currency",
      reward: "6,480 Genesis Crystals",
      brand: "Genshin Impact",
      page: "coupon/34.html",
      image: "public/assets/uploads/coupon_banners/coupon_34_crystals.jpg",
      keywords: ["genshin", "impact", "genesis", "crystals", "6480", "6,480", "primogems", "hoyoverse", "code", "codes"]
    },
    {
      id: 35,
      title: "8,000 Free Primogems Code",
      category: "Currency",
      reward: "8,000 Primogems (50 Wishes)",
      brand: "Genshin Impact",
      page: "coupon/35.html",
      image: "public/assets/uploads/coupon_banners/coupon_35_primogems.jpg",
      keywords: ["genshin", "impact", "primogems", "primo", "gems", "8000", "8,000", "wishes", "fates", "code", "codes"]
    },
    {
      id: 36,
      title: "2,000 Free Gems Code",
      category: "Currency",
      reward: "2,000 Gems",
      brand: "Brawl Stars",
      page: "coupon/36.html",
      image: "public/assets/uploads/coupon_banners/coupon_36_gems.jpg",
      keywords: ["brawl", "stars", "gems", "2000", "2,000", "supercell", "free", "brawler", "code", "codes"]
    },
    {
      id: 37,
      title: "Brawl Pass Plus Redeem Code",
      category: "Battle Pass",
      reward: "Brawl Pass Plus Activation",
      brand: "Brawl Stars",
      page: "coupon/37.html",
      image: "public/assets/uploads/coupon_banners/coupon_37_pass.jpg",
      keywords: ["brawl", "stars", "brawl", "pass", "plus", "season", "activation", "voucher", "code", "codes"]
    },
    {
      id: 38,
      title: "5,600 Free Fire Diamonds Code",
      category: "Currency",
      reward: "5,600 Diamonds",
      brand: "Free Fire",
      page: "coupon/38.html",
      image: "public/assets/uploads/coupon_banners/coupon_38_diamonds.jpg",
      keywords: ["free", "fire", "diamonds", "diamond", "5600", "5,600", "garena", "topup", "code", "codes"]
    },
    {
      id: 39,
      title: "Free Fire Elite Pass Code",
      category: "Season Pass",
      reward: "Elite Pass Season Bundle",
      brand: "Free Fire",
      page: "coupon/39.html",
      image: "public/assets/uploads/coupon_banners/coupon_39_elitepass.jpg",
      keywords: ["free", "fire", "elite", "pass", "season", "bundle", "garena", "voucher", "code", "codes"]
    }
  ];

  const BRANDS = [
    {
      id: 27,
      brand_name: "Dead By Daylight",
      brand_logo: "public/assets/uploads/brand_logos/brand_27_e6455b68d4a204e2.jpg",
      coupon_count: 8,
      page: "brand.html",
      keywords: ["dead", "by", "daylight", "dbd", "behaviour", "game", "codes", "promo", "coupons"]
    },
    {
      id: 30,
      brand_name: "Roblox",
      brand_logo: "public/assets/uploads/brand_logos/brand_30_roblox.jpg",
      coupon_count: 2,
      page: "brand/roblox.html",
      keywords: ["roblox", "robux", "rbx", "metaverse", "game", "codes", "promo", "coupons"]
    },
    {
      id: 31,
      brand_name: "Fortnite",
      brand_logo: "public/assets/uploads/brand_logos/brand_31_fortnite.jpg",
      coupon_count: 2,
      page: "brand/fortnite.html",
      keywords: ["fortnite", "vbucks", "v-bucks", "epic", "battle", "royale", "codes", "promo", "coupons"]
    },
    {
      id: 32,
      brand_name: "Genshin Impact",
      brand_logo: "public/assets/uploads/brand_logos/brand_32_genshin.jpg",
      coupon_count: 2,
      page: "brand/genshin-impact.html",
      keywords: ["genshin", "impact", "primogems", "genesis", "crystals", "hoyoverse", "codes", "promo", "coupons"]
    },
    {
      id: 33,
      brand_name: "Brawl Stars",
      brand_logo: "public/assets/uploads/brand_logos/brand_33_brawlstars.jpg",
      coupon_count: 2,
      page: "brand/brawl-stars.html",
      keywords: ["brawl", "stars", "gems", "supercell", "pass", "plus", "codes", "promo", "coupons"]
    },
    {
      id: 34,
      brand_name: "Free Fire",
      brand_logo: "public/assets/uploads/brand_logos/brand_34_freefire.jpg",
      coupon_count: 2,
      page: "brand/free-fire.html",
      keywords: ["free", "fire", "diamonds", "garena", "elite", "pass", "codes", "promo", "coupons"]
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
    'figurines': 'figurine',
    'blood': 'bloodpoints',
    'cell': 'auric cells',
    'cells': 'auric cells',
    'points': 'bloodpoints'
  };

  function scoreItem(item, query, isBrand) {
    const normQuery = normalizeText(query);
    if (!normQuery) return 0;

    const title = isBrand ? item.brand_name : item.title;
    const normTitle = normalizeText(title);
    const keywords = (item.keywords || []).map(normalizeText);
    const allWords = normTitle.split(' ').concat(keywords);

    let score = 0;

    // 1. Exact match on full query
    if (normTitle === normQuery) {
      score += 250;
    } else if (normTitle.startsWith(normQuery)) {
      score += 150;
    } else if (normTitle.includes(normQuery)) {
      score += 90;
    }

    // 2. Single letter search
    if (normQuery.length === 1) {
      const letter = normQuery[0];
      if (normTitle.startsWith(letter)) score += 70;
      const wordStarts = allWords.filter(w => w.startsWith(letter));
      if (wordStarts.length > 0) score += 30 + (wordStarts.length * 8);
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

    // 4. Token-by-token matching & fuzzy typo tolerance
    for (const token of expandedTokens) {
      if (!token) continue;
      let tokenMatched = false;

      // Exact word match
      for (const w of allWords) {
        if (w === token) {
          score += 60;
          tokenMatched = true;
          break;
        } else if (w.startsWith(token) && token.length >= 2) {
          score += 45;
          tokenMatched = true;
          break;
        } else if (w.includes(token) && token.length >= 3) {
          score += 25;
          tokenMatched = true;
          break;
        }
      }

      // Fuzzy matching / typo tolerance via Levenshtein
      if (!tokenMatched && token.length >= 3) {
        for (const w of allWords) {
          if (w.length < 3) continue;
          const maxDist = token.length <= 4 ? 1 : (token.length <= 7 ? 2 : 3);
          const dist = levenshteinDistance(token, w);
          if (dist <= maxDist) {
            score += Math.max(12, 45 - (dist * 14));
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

  // Determine relative path prefix (handles /coupon/ and /brand/ subfolders)
  function getPathPrefix() {
    const p = window.location.pathname.replace(/\\/g, '/');
    if (p.includes('/coupon/') || p.includes('/brand/')) {
      return '../';
    }
    return '';
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initialize search UI on forms & inputs
  function initSearchEngine() {
    const forms = document.querySelectorAll('#searchForm, .search-form, form[role="search"]');
    forms.forEach(form => setupForm(form));
  }

  function setupForm(form) {
    if (form.dataset.searchEngineInit === 'true') return;
    form.dataset.searchEngineInit = 'true';

    const input = form.querySelector('#searchInput, input[type="search"], input[name="q"]');
    if (!input) return;

    // Get or create dropdown container
    let dropdown = form.querySelector('#searchDropdown, .search-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      dropdown.id = 'searchDropdown';
      form.appendChild(dropdown);
    }

    // Get search loader / spinner elements if present
    const loader = form.querySelector('.search-loader');
    const searchIcon = loader ? loader.querySelector('.bi-search') : null;
    const spinner = loader ? loader.querySelector('.spinner-border') : null;

    let debounceTimer = null;
    let activeIndex = -1;

    function showLoading() {
      if (spinner) spinner.classList.remove('d-none');
      if (searchIcon) searchIcon.classList.add('d-none');
    }

    function hideLoading() {
      if (spinner) spinner.classList.add('d-none');
      if (searchIcon) searchIcon.classList.remove('d-none');
    }

    function hideDropdown() {
      dropdown.classList.remove('show');
      dropdown.innerHTML = '';
      activeIndex = -1;
    }

    function renderResults(query) {
      const trimmed = query.trim();
      if (!trimmed) {
        hideDropdown();
        hideLoading();
        return;
      }

      showLoading();
      const results = search(trimmed);
      hideLoading();

      const { brands, coupons } = results;
      const prefix = getPathPrefix();

      if (brands.length === 0 && coupons.length === 0) {
        dropdown.innerHTML = `
          <div class="search-empty" style="padding: 24px; text-align: center; color: var(--text-third, #888);">
            <i class="bi bi-search" style="font-size: 24px; display: block; margin-bottom: 8px;"></i>
            <p class="m-0 fw-semibold" style="color: var(--text, #fff);">No DBD codes found for "${escapeHtml(trimmed)}"</p>
            <p class="small mt-1 mb-0" style="opacity: 0.8;">Try searching for Bloodpoints, Auric Cells, Dwight, Charms, or Banners</p>
          </div>
        `;
        dropdown.classList.add('show');
        activeIndex = -1;
        return;
      }

      let html = '';

      // Brands group
      if (brands.length > 0) {
        html += `<div class="search-section" style="padding: 8px 12px 4px; border-bottom: 1px solid var(--border-light, rgba(255,255,255,0.08));">
          <div class="search-section-title" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-third, #aaa); margin-bottom: 6px; font-weight: 700;">Official Brand</div>
        `;
        brands.forEach(b => {
          const brandUrl = `${prefix}${b.page}`;
          const brandImg = `${prefix}${b.brand_logo}`;
          html += `
            <a href="${brandUrl}" class="search-item d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none" style="transition: background 0.15s ease; color: inherit;" data-type="brand" data-url="${brandUrl}">
              <img src="${brandImg}" alt="${escapeHtml(b.brand_name)}" class="rounded-2" width="36" height="36" style="object-fit: cover; flex-shrink: 0;" onerror="this.style.display='none';">
              <div class="search-item-content flex-grow-1" style="min-width: 0;">
                <div class="search-item-title fw-bold" style="font-size: 13px; color: var(--text, #fff);">${escapeHtml(b.brand_name)}</div>
                <div class="search-item-subtitle small" style="color: var(--text-third, #888); font-size: 11px;">${b.coupon_count} Active DBD Codes • Verified Game Hub</div>
              </div>
            </a>
          `;
        });
        html += `</div>`;
      }

      // Coupons group
      if (coupons.length > 0) {
        html += `<div class="search-section" style="padding: 8px 12px 8px;">
          <div class="search-section-title" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-third, #aaa); margin-bottom: 6px; font-weight: 700;">Verified Reward Codes</div>
        `;
        coupons.forEach(c => {
          const couponUrl = `${prefix}${c.page}`;
          const couponImg = `${prefix}${c.image}`;
          html += `
            <a href="${couponUrl}" class="search-item d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none" style="transition: background 0.15s ease; color: inherit;" data-type="coupon" data-id="${c.id}" data-url="${couponUrl}">
              <img src="${couponImg}" alt="${escapeHtml(c.title)}" class="rounded-2" width="36" height="36" style="object-fit: cover; flex-shrink: 0;" onerror="this.style.display='none';">
              <div class="search-item-content flex-grow-1" style="min-width: 0;">
                <div class="search-item-title fw-semibold text-truncate" style="font-size: 13px; color: var(--text, #fff);">${escapeHtml(c.title)}</div>
                <div class="search-item-subtitle small text-truncate" style="color: var(--accent, #e53e3e); font-size: 11px;">
                  <span class="badge bg-danger bg-opacity-25 text-danger px-1 py-0 me-1" style="font-size: 10px;">${escapeHtml(c.category)}</span>
                  ${escapeHtml(c.reward)} • Active
                </div>
              </div>
            </a>
          `;
        });
        html += `</div>`;
      }

      dropdown.innerHTML = html;
      dropdown.classList.add('show');
      activeIndex = -1;

      // Attach click events
      dropdown.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
          dropdown.querySelectorAll('.search-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        });

        item.addEventListener('click', (e) => {
          const type = item.dataset.type;
          const couponId = item.dataset.id;
          const targetUrl = item.dataset.url;

          if (type === 'coupon' && couponId && window.Alpine && window.Alpine.store('couponModal')) {
            e.preventDefault();
            hideDropdown();
            window.Alpine.store('couponModal').open(parseInt(couponId, 10));
          } else {
            // Normal navigation to page
            window.location.href = targetUrl;
          }
        });
      });
    }

    // Input listener with fast punctual debounce
    input.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      const val = input.value;
      debounceTimer = setTimeout(() => {
        renderResults(val);
      }, 90);
    });

    // Re-open on focus if text present
    input.addEventListener('focus', function() {
      if (input.value.trim().length > 0) {
        renderResults(input.value);
      }
    });

    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
      if (!dropdown.classList.contains('show')) return;
      const items = dropdown.querySelectorAll('.search-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        items.forEach((it, idx) => {
          it.classList.toggle('active', idx === activeIndex);
          if (idx === activeIndex) {
            it.style.backgroundColor = 'var(--background-secondary, rgba(255,255,255,0.08))';
            it.scrollIntoView({ block: 'nearest' });
          } else {
            it.style.backgroundColor = 'transparent';
          }
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        items.forEach((it, idx) => {
          it.classList.toggle('active', idx === activeIndex);
          if (idx === activeIndex) {
            it.style.backgroundColor = 'var(--background-secondary, rgba(255,255,255,0.08))';
            it.scrollIntoView({ block: 'nearest' });
          } else {
            it.style.backgroundColor = 'transparent';
          }
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          items[activeIndex].click();
        } else if (items.length > 0) {
          // Open first match
          items[0].click();
        } else {
          // Fallback to search.html with query
          const prefix = getPathPrefix();
          window.location.href = `${prefix}search.html?q=${encodeURIComponent(input.value.trim())}`;
        }
      } else if (e.key === 'Escape') {
        hideDropdown();
      }
    });

    // Form submit prevention & smart routing
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const items = dropdown.querySelectorAll('.search-item');
      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      } else {
        const prefix = getPathPrefix();
        window.location.href = `${prefix}search.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
      if (!form.contains(e.target)) {
        hideDropdown();
      }
    });
  }

  // Export search API globally
  window.DBD_SEARCH = {
    search: search,
    normalizeText: normalizeText,
    levenshteinDistance: levenshteinDistance,
    coupons: COUPONS,
    brands: BRANDS,
    init: initSearchEngine
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchEngine);
  } else {
    initSearchEngine();
  }
})();
