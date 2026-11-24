// ============================================================================
// DBD Codes Clone — Rendering & Interactive Logic
// ============================================================================

(function () {
  "use strict";

  // SVG Icon Snippets
  const ICONS = {
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    star: `<svg class="star-icon" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>`,
    scissors: `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/></svg>`,
    ticket: `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6z"/></svg>`,
    people: `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>`,
    infinity: `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z"/></svg>`,
    verified: `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`,
    check: `<svg class="check-icon" width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>`,
    bulb: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/></svg>`,
    starOutline: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    starFilled: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  };

  // Mutable live state for codes-left counters
  const liveCounts = new Map();
  COUPONS_DATA.forEach((c) => liveCounts.set(c.id, c.codesLeft));

  let activeModalCoupon = null;
  let revealTimer = null;

  // ==========================================================================
  // Theme Toggle
  // ==========================================================================
  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute("data-bs-theme", theme);
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme !== "dark");

    document.querySelectorAll(".theme-logo").forEach((img) => {
      const targetSrc = theme === "dark" ? img.dataset.darkSrc : img.dataset.lightSrc;
      if (targetSrc) img.src = targetSrc;
    });

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    }
    try {
      localStorage.setItem("dbd-theme", theme);
    } catch (_) {}
  }

  function initTheme() {
    let saved = "light";
    try {
      saved = localStorage.getItem("dbd-theme") || "light";
    } catch (_) {}
    applyTheme(saved);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-bs-theme") || "light";
        applyTheme(current === "light" ? "dark" : "light");
      });
    }
  }

  // ==========================================================================
  // Placeholder Banner HTML (Mint + Scattered Pink Tickets)
  // ==========================================================================
  function buildPlaceholderBanner() {
    return `
      <div class="accent-colored-placeholder">
        <span class="placeholder-ticket" style="top: 14px; left: 26px; transform: rotate(-18deg) scale(2.1);">${ICONS.ticket}</span>
        <span class="placeholder-ticket" style="top: 62px; left: 118px; transform: rotate(22deg) scale(2.4);">${ICONS.ticket}</span>
        <span class="placeholder-ticket" style="top: 20px; right: 36px; transform: rotate(15deg) scale(1.9);">${ICONS.ticket}</span>
        <span class="placeholder-ticket" style="bottom: 18px; right: 64px; transform: rotate(-28deg) scale(2.2);">${ICONS.ticket}</span>
      </div>
    `;
  }

  // ==========================================================================
  // Home Page Renderers
  // ==========================================================================
  function renderFeatured() {
    const container = document.getElementById("featuredContainer");
    if (!container) return;

    const featured = COUPONS_DATA.find((c) => c.featured) || COUPONS_DATA[COUPONS_DATA.length - 1];
    container.innerHTML = `
      <article class="featured-coupon-card">
        <div class="featured-banner-col">
          <img src="${featured.banner}" alt="${featured.title}" class="featured-banner-img" />
          ${featured.hot ? `<span class="hot-pill">Hot</span>` : ""}
        </div>
        <div class="featured-body-col">
          <div>
            <a href="${featured.brandUrl}" class="featured-brand">${featured.brand}</a>
            <h4 class="featured-title">${featured.title}</h4>
            <p class="featured-desc">${featured.shortDesc}</p>
          </div>
          <div class="featured-incentive-box">
            <div class="featured-incentive-label">${featured.badge}</div>
          </div>
          <div class="featured-meta">
            <span class="rating-inline">${ICONS.star} ${featured.rating}</span>
            <span>${featured.expiration}</span>
          </div>
          <button type="button" class="btn-outline-accent" data-open-coupon="${featured.id}">
            Get Code <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderNewest() {
    const container = document.getElementById("newestContainer");
    if (!container) return;

    container.innerHTML = COUPONS_DATA.map((coupon) => `
      <article class="newest-coupon">
        <div class="newest-thumb-wrap">
          <img src="${BRAND_DATA.logo}" alt="${coupon.brand}" />
          ${coupon.hot ? `<span class="hot-pill">Hot</span>` : ""}
        </div>
        <div class="newest-info">
          <h4 class="newest-title" title="${coupon.title}">${coupon.title}</h4>
          <div class="newest-meta-row">
            <span class="newest-tag">${ICONS.ticket} ${coupon.badge}</span>
            <span class="rating-inline">${ICONS.star} ${coupon.rating}</span>
            <span>${coupon.usesToday} uses</span>
          </div>
        </div>
        <div class="newest-divider"></div>
        <button type="button" class="btn-soft-pink" data-open-coupon="${coupon.id}">
          ${ICONS.scissors} Get Code
        </button>
      </article>
    `).join("");
  }

  function renderAllCodes() {
    const grid = document.getElementById("allCodesGrid");
    if (!grid) return;

    grid.innerHTML = COUPONS_DATA.map((coupon) => {
      const left = liveCounts.get(coupon.id);
      const bannerHtml = coupon.banner
        ? `<img src="${coupon.banner}" alt="${coupon.title}" class="banner-img" />`
        : buildPlaceholderBanner();

      return `
        <article class="coupon-card">
          <div class="banner-section">
            <div class="banner-clip">
              ${bannerHtml}
            </div>
            <span class="rating-pill">${ICONS.star} ${coupon.rating}</span>
            ${coupon.hot ? `<span class="hot-pill">Hot</span>` : ""}
            <a href="${coupon.brandUrl}" class="card-brand-logo-wrap" aria-label="${coupon.brand}">
              <img src="${BRAND_DATA.logo}" alt="${coupon.brand}" />
            </a>
          </div>

          <div class="card-body-inner">
            <h3 class="card-title" title="${coupon.title}">${coupon.title}</h3>
            <a href="${coupon.brandUrl}" class="card-brand-link">${coupon.brand}</a>

            <div class="incentive-box">
              <span class="incentive-circle start"></span>
              <span class="incentive-circle end"></span>
              <div class="incentive-badge">${coupon.badge}</div>
              <div class="incentive-desc">${coupon.shortDesc}</div>
            </div>

            <div class="codes-left-wrap">
              <span class="codes-left-pill" data-count-id="${coupon.id}">${left} codes left</span>
            </div>

            <button type="button" class="btn-get-code" data-open-coupon="${coupon.id}">
              <span class="scissors-icon">${ICONS.scissors}</span>
              Get Code
            </button>
          </div>

          <div class="card-footer-meta">
            <span class="meta-item">${ICONS.infinity} ${coupon.expiration}</span>
            <span class="meta-item">${ICONS.people} ${coupon.usesToday} uses today</span>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================================================
  // Brand Page Renderers
  // ==========================================================================
  function renderBrandPage() {
    const sidebar = document.getElementById("brandSidebar");
    const list = document.getElementById("brandCouponsList");
    if (!sidebar || !list) return;

    sidebar.innerHTML = `
      <div class="brand-profile-card">
        <img src="${BRAND_DATA.logo}" alt="${BRAND_DATA.name}" class="brand-profile-logo" />
        <h1 class="brand-profile-title">${BRAND_DATA.name}</h1>
        <p class="brand-profile-bio">${BRAND_DATA.bio}</p>
      </div>

      <div class="brand-stats-grid">
        <div class="brand-stat-card">
          <div class="brand-stat-top">${ICONS.ticket} <span>${BRAND_DATA.totalCoupons}</span></div>
          <div class="brand-stat-label">total coupons</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-top">${ICONS.verified} <span>${BRAND_DATA.verifiedCoupons}</span></div>
          <div class="brand-stat-label">verified coupons</div>
        </div>
        <div class="brand-stat-card">
          <div class="brand-stat-top">${ICONS.people} <span>${BRAND_DATA.usesToday}</span></div>
          <div class="brand-stat-label">uses today</div>
        </div>
      </div>

      <div class="brand-rating-tips-card">
        <div class="brand-rating-row">
          <div class="star-rating-btns" id="brandStarWidget" role="radiogroup" aria-label="Rate Dead By Daylight">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<button type="button" class="star-rate-btn" data-star="${n}" aria-label="Rate ${n} stars">${ICONS.starOutline}</button>`
              )
              .join("")}
          </div>
          <div class="brand-rating-summary">
            <strong id="brandRatingValue">${BRAND_DATA.rating}</strong> • <span id="brandRatingCount">${BRAND_DATA.ratingsCount}</span> ratings
          </div>
        </div>

        <h3 class="tips-title">${ICONS.bulb} Shopping Tips</h3>
        <ul class="tips-list">
          ${BRAND_DATA.tips.map((tip) => `<li>${ICONS.check} <span>${tip}</span></li>`).join("")}
        </ul>
      </div>
    `;

    // Interactive 5-star rating widget
    const starWidget = document.getElementById("brandStarWidget");
    let userRated = false;
    let selectedStars = 0;

    function paintStars(count) {
      starWidget.querySelectorAll(".star-rate-btn").forEach((btn) => {
        const val = Number(btn.dataset.star);
        btn.classList.toggle("active", val <= count);
        btn.innerHTML = val <= count ? ICONS.starFilled : ICONS.starOutline;
      });
    }

    starWidget.querySelectorAll(".star-rate-btn").forEach((btn) => {
      const val = Number(btn.dataset.star);
      btn.addEventListener("mouseenter", () => paintStars(val));
      btn.addEventListener("mouseleave", () => paintStars(selectedStars));
      btn.addEventListener("click", () => {
        selectedStars = val;
        paintStars(selectedStars);
        if (!userRated) {
          userRated = true;
          const countEl = document.getElementById("brandRatingCount");
          if (countEl) countEl.textContent = String(BRAND_DATA.ratingsCount + 1);
        }
      });
    });

    // Horizontal coupon rows
    list.innerHTML = COUPONS_DATA.map((coupon) => {
      const left = liveCounts.get(coupon.id);
      return `
        <article class="coupon-row">
          <div class="coupon-row-left">
            ${coupon.hot ? `<span class="hot-pill">Hot</span>` : ""}
            <div class="coupon-row-badge">${coupon.badge}</div>
            <div class="coupon-row-left-sub">${coupon.expiration}</div>
          </div>

          <div>
            <h3 class="coupon-row-title">${coupon.title}</h3>
            <p class="coupon-row-desc">${coupon.shortDesc}</p>
            <div class="coupon-row-meta">
              <span class="verified-chip">${ICONS.verified} Verified</span>
              <span class="rating-inline">${ICONS.star} ${coupon.rating} (${coupon.ratingsCount} ratings)</span>
              <span class="meta-item">${ICONS.people} ${coupon.usesToday} uses today</span>
            </div>
          </div>

          <div class="coupon-row-right">
            <span class="codes-left-pill" data-count-id="${coupon.id}">${left} codes left</span>
            <button type="button" class="btn-get-code" data-open-coupon="${coupon.id}">
              <span class="scissors-icon">${ICONS.scissors}</span>
              Get Code
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  // ==========================================================================
  // Live Search Autocomplete Dropdown
  // ==========================================================================
  function initSearch() {
    const input = document.getElementById("searchInput");
    const dropdown = document.getElementById("searchDropdown");
    const form = document.getElementById("searchForm");
    if (!input || !dropdown) return;

    function updateResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        dropdown.classList.remove("show");
        dropdown.innerHTML = "";
        return;
      }

      const matches = COUPONS_DATA.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDesc.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="search-empty">No DBD codes found for "${query.replace(/</g, "&lt;")}"</div>`;
      } else {
        dropdown.innerHTML = `
          <div class="search-dropdown-group-label">Coupons</div>
          ${matches
            .map(
              (c) => `
            <button type="button" class="search-result-item" data-search-open="${c.id}">
              <img src="${BRAND_DATA.logo}" alt="${c.brand}" class="search-result-thumb" />
              <div>
                <div class="search-result-title">${c.title}</div>
                <div class="search-result-sub">${c.brand} • <span class="badge-inline">${c.badge}</span></div>
              </div>
            </button>
          `
            )
            .join("")}
        `;
      }
      dropdown.classList.add("show");
    }

    input.addEventListener("input", (e) => updateResults(e.target.value));
    input.addEventListener("focus", (e) => {
      if (e.target.value.trim()) updateResults(e.target.value);
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        updateResults(input.value);
      });
    }

    dropdown.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-search-open]");
      if (!btn) return;
      const id = Number(btn.dataset.searchOpen);
      dropdown.classList.remove("show");
      openCouponModal(id);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        dropdown.classList.remove("show");
      }
    });
  }

  // ==========================================================================
  // Coupon Reveal Modal
  // ==========================================================================
  function openCouponModal(couponId) {
    const coupon = COUPONS_DATA.find((c) => c.id === couponId);
    if (!coupon) return;

    activeModalCoupon = coupon;
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = null;
    }

    const overlay = document.getElementById("couponModalOverlay");
    const bannerImg = document.getElementById("modalBannerImg");
    const codesLeftEl = document.getElementById("modalCodesLeft");
    const brandEl = document.getElementById("modalBrandName");
    const titleEl = document.getElementById("modalTitle");
    const badgeEl = document.getElementById("modalBadge");
    const descEl = document.getElementById("modalShortDesc");
    const ratingEl = document.getElementById("modalRating");
    const usesEl = document.getElementById("modalUses");
    const detailsEl = document.getElementById("modalDetails");
    const maskEl = document.getElementById("modalCodeMask");
    const revealBtn = document.getElementById("modalRevealBtn");
    const processingEl = document.getElementById("modalProcessing");
    const revealedBox = document.getElementById("modalRevealedBox");
    const codeDisplay = document.getElementById("modalCodeDisplay");
    const copyBtn = document.getElementById("modalCopyBtn");
    const copyText = document.getElementById("modalCopyText");

    bannerImg.src = coupon.banner || "assets/banner-auric.svg";
    codesLeftEl.textContent = `${liveCounts.get(coupon.id)} codes left`;
    brandEl.textContent = coupon.brand;
    titleEl.textContent = coupon.title;
    badgeEl.textContent = coupon.badge;
    descEl.textContent = coupon.shortDesc;
    ratingEl.innerHTML = `${ICONS.star} ${coupon.rating}`;
    usesEl.textContent = `${coupon.usesToday} uses`;
    detailsEl.textContent = coupon.details;
    maskEl.textContent = coupon.codeMask;
    codeDisplay.textContent = coupon.codeValue;

    // Reset modal action state
    revealBtn.style.display = "flex";
    processingEl.classList.remove("show");
    revealedBox.classList.remove("show");
    copyBtn.classList.remove("copied");
    copyText.textContent = "Copy Code";

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCouponModal() {
    const overlay = document.getElementById("couponModalOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    activeModalCoupon = null;
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = null;
    }
  }

  function initModal() {
    const overlay = document.getElementById("couponModalOverlay");
    const closeBtn = document.getElementById("modalCloseBtn");
    const revealBtn = document.getElementById("modalRevealBtn");
    const processingEl = document.getElementById("modalProcessing");
    const revealedBox = document.getElementById("modalRevealedBox");
    const copyBtn = document.getElementById("modalCopyBtn");
    const copyText = document.getElementById("modalCopyText");

    if (!overlay) return;

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-coupon]");
      if (!trigger) return;
      openCouponModal(Number(trigger.dataset.openCoupon));
    });

    closeBtn.addEventListener("click", closeCouponModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeCouponModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) {
        closeCouponModal();
      }
    });

    revealBtn.addEventListener("click", () => {
      revealBtn.style.display = "none";
      processingEl.classList.add("show");
      revealTimer = setTimeout(() => {
        processingEl.classList.remove("show");
        revealedBox.classList.add("show");
      }, 650);
    });

    copyBtn.addEventListener("click", async () => {
      if (!activeModalCoupon) return;
      try {
        await navigator.clipboard.writeText(activeModalCoupon.codeValue);
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = activeModalCoupon.codeValue;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      copyBtn.classList.add("copied");
      copyText.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyText.textContent = "Copy Code";
      }, 2200);
    });
  }

  // ==========================================================================
  // Live Client-Side Availability Counter (CouponAvailability)
  // ==========================================================================
  function startAvailabilityTicker() {
    setInterval(() => {
      const randomCoupon = COUPONS_DATA[Math.floor(Math.random() * COUPONS_DATA.length)];
      const current = liveCounts.get(randomCoupon.id);
      if (current <= 12) return;

      const next = current - 1;
      liveCounts.set(randomCoupon.id, next);

      document.querySelectorAll(`[data-count-id="${randomCoupon.id}"]`).forEach((el) => {
        el.textContent = `${next} codes left`;
        el.classList.add("pulse");
        setTimeout(() => el.classList.remove("pulse"), 550);
      });

      if (activeModalCoupon && activeModalCoupon.id === randomCoupon.id) {
        const modalCount = document.getElementById("modalCodesLeft");
        if (modalCount) {
          modalCount.textContent = `${next} codes left`;
          modalCount.classList.add("pulse");
          setTimeout(() => modalCount.classList.remove("pulse"), 550);
        }
      }
    }, 6500);
  }

  // ==========================================================================
  // Bootstrap App
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initSearch();
    initModal();

    const page = document.body.dataset.page;
    if (page === "home") {
      renderFeatured();
      renderNewest();
      renderAllCodes();
    } else if (page === "brand") {
      renderBrandPage();
    }

    startAvailabilityTicker();
  });
})();
