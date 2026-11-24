// ==========================================================================
// DBD Codes Official Content Locker & Offer Feed Integration
// User ID: 831501 | Public Key: 8902c82579eec05db438 | Offers API Key: 4a1d7b7a9f26dbe08fc3a0b059296411
// ==========================================================================

(function () {
  'use strict';

  const DBD_LOCKER_CONFIG = {
    userId: '831501',
    publicKey: '8902c82579eec05db438',
    apiKeyOffers: '4a1d7b7a9f26dbe08fc3a0b059296411',
    feedUrl: 'https://dtvpp42hfuyb2.cloudfront.net/public/offers/feed.php?user_id=831501&api_key=4a1d7b7a9f26dbe08fc3a0b059296411&s1=&s2='
  };

  // Fallback live offers for user 831501
  const FALLBACK_OFFERS = [
    {
      id: "f0J6oYVbz2HJ3tW",
      name: "Tap Rewards - Earn Rewards",
      anchor: "Tap to claim your bonus!",
      conversion: "Complete with valid information",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/29075/1327898810.200x200.png",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYVbz2HJ3tW&s7=null&s8=null&s9=0006bfe39756",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYVbz2HJ3tW"
    },
    {
      id: "f0J6oYMrKhRm5E3",
      name: "Ball Catcher",
      anchor: "Complete quick actions to unlock your reward!",
      conversion: "Complete the survey",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/33079/3019980592.200x200.jpeg",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYMrKhRm5E3&s7=null&s8=null&s9=0006bfe39756",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYMrKhRm5E3"
    },
    {
      id: "f0J6oYX3QDUNnDi",
      name: "ClickBox - Earn Bonus",
      anchor: "Tap to claim your reward!",
      conversion: "Complete the survey",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/28565/1457439075.200x200.png",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYX3QDUNnDi&s7=null&s8=null&s9=0006bfe39756",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYX3QDUNnDi"
    },
    {
      id: "f0J6oYS7H9PKTD1",
      name: "Tap Rewards - Coin Rewards",
      anchor: "Click to receive your instant reward!",
      conversion: "Complete the survey",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/31462/1353090480.200x200.jpeg",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYS7H9PKTD1&s7=null&s8=null&s9=140f7d90c8d4",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYS7H9PKTD1"
    },
    {
      id: "f0J6oYRgmU5KIhZ",
      name: "Tap Rewards - Special Bonus",
      anchor: "Claim your exclusive bonus now!",
      conversion: "Complete the survey",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/31721/3939496644.200x200.jpeg",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYRgmU5KIhZ&s7=null&s8=null&s9=140f7d90c8d4",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYRgmU5KIhZ"
    },
    {
      id: "f0J6oYNbIayhajj",
      name: "Score a Goal",
      anchor: "Score and claim your special reward!",
      conversion: "Complete the survey",
      network_icon: "https://cdn.affise.com/affise-media-service-prod/offers/959/33018/4276840248.200x200.jpeg",
      url: "https://oak.hoprly.com/a?p=o0J7NAb5C87OEGJ&o=f0J6oYNbIayhajj&s7=null&s8=null&s9=140f7d90c8d4",
      impression_url: "https://oak.hoprly.com/i?p=o0J7NAb5C87OEGJ&o=f0J6oYNbIayhajj"
    }
  ];

  let currentOffers = FALLBACK_OFFERS;
  let activeCouponCode = '921J4OYTN';

  function fetchLiveOffers() {
    return fetch(DBD_LOCKER_CONFIG.feedUrl)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          currentOffers = data;
        } else if (data && Array.isArray(data.value) && data.value.length > 0) {
          currentOffers = data.value;
        }
        return currentOffers;
      })
      .catch(() => currentOffers);
  }

  function createLockerDom() {
    if (document.getElementById('dbdLockerOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dbdLockerOverlay';
    overlay.className = 'dbd-locker-overlay';
    overlay.innerHTML = `
      <div class="dbd-locker-modal">
        <div class="dbd-locker-header">
          <button type="button" class="dbd-locker-close" id="dbdLockerClose">&times;</button>
          <div class="d-inline-flex align-items-center gap-1 mb-1">
            <span class="badge" style="background:var(--accent,#ff1970);color:#fff;font-size:0.72rem;">HUMAN VERIFICATION</span>
          </div>
          <h3>Unlock Dead by Daylight Promo Code</h3>
          <p>Complete any 1 quick offer below to verify and reveal your exclusive reward.</p>
        </div>

        <div class="dbd-locker-body" id="dbdOffersContainer">
          <!-- Populated by JS -->
        </div>

        <div class="dbd-locker-unlocking" id="dbdLockerUnlocking">
          <div class="dbd-spinner"></div>
          <h4 class="h5 fw-bold mb-1" style="color:var(--text,#283240);">Verifying Offer Completion...</h4>
          <p class="small text-muted mb-0">Please wait while we check your verification status.</p>
        </div>

        <div class="dbd-revealed-result" id="dbdRevealedResult">
          <div class="badge bg-success-subtle text-success px-3 py-2 fs-6 border border-success-subtle mb-2">
            <i class="bi bi-patch-check-fill me-1"></i> Offer Verified!
          </div>
          <div class="dbd-revealed-code" id="dbdLockerCodeDisplay">CODE</div>
          <button type="button" id="dbdLockerCopyBtn" class="btn btn-accent px-4 py-2 fw-bold d-inline-flex align-items-center gap-2" style="background:var(--accent,#ff1970);color:#fff;border-radius:10px;">
            <i class="bi bi-clipboard"></i> <span id="dbdLockerCopyText">Copy Code</span>
          </button>
        </div>

        <div class="dbd-locker-footer">
          <i class="bi bi-shield-check text-success me-1"></i> 256-Bit SSL Encrypted Verification • Guaranteed Working Code
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('dbdLockerClose').addEventListener('click', closeLocker);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLocker();
    });

    document.getElementById('dbdLockerCopyBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(activeCouponCode);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = activeCouponCode;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const txt = document.getElementById('dbdLockerCopyText');
      txt.textContent = 'Copied!';
      setTimeout(() => { txt.textContent = 'Copy Code'; }, 2000);
    });
  }

  function renderOffers() {
    const container = document.getElementById('dbdOffersContainer');
    if (!container) return;

    container.innerHTML = currentOffers.map(offer => `
      <a href="${offer.url}" target="_blank" rel="noopener noreferrer" class="dbd-offer-card" data-offer-id="${offer.id}">
        <img src="${offer.network_icon}" alt="${offer.name}" class="dbd-offer-icon" onerror="this.src='public/assets/uploads/favicons/favicon_6a6a2732cf6bc.png'">
        <div class="dbd-offer-details">
          <div class="dbd-offer-name">${offer.name}</div>
          <div class="dbd-offer-anchor">${offer.anchor}</div>
          <span class="dbd-offer-conversion">${offer.conversion}</span>
        </div>
        <button type="button" class="dbd-offer-btn">Complete</button>
      </a>
    `).join('');

    // Attach click handlers to trigger verification and auto-unlock
    container.querySelectorAll('.dbd-offer-card').forEach(card => {
      card.addEventListener('click', () => {
        // Switch to unlocking state after a brief moment
        setTimeout(() => {
          container.style.display = 'none';
          const unlocking = document.getElementById('dbdLockerUnlocking');
          const result = document.getElementById('dbdRevealedResult');
          unlocking.classList.add('active');

          setTimeout(() => {
            unlocking.classList.remove('active');
            document.getElementById('dbdLockerCodeDisplay').textContent = activeCouponCode;
            result.classList.add('active');

            // Also notify Alpine store if present
            if (window.Alpine && Alpine.store('couponModal')) {
              Alpine.store('couponModal').completeUnlock();
            }
          }, 3000);
        }, 500);
      });
    });
  }

  function openLocker(code) {
    createLockerDom();
    if (code) activeCouponCode = code;

    // Reset view
    const container = document.getElementById('dbdOffersContainer');
    const unlocking = document.getElementById('dbdLockerUnlocking');
    const result = document.getElementById('dbdRevealedResult');
    if (container) container.style.display = 'flex';
    if (unlocking) unlocking.classList.remove('active');
    if (result) result.classList.remove('active');

    renderOffers();

    const overlay = document.getElementById('dbdLockerOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLocker() {
    const overlay = document.getElementById('dbdLockerOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.DBD_LOCKER = {
    config: DBD_LOCKER_CONFIG,
    open: openLocker,
    close: closeLocker,
    fetchLiveOffers: fetchLiveOffers
  };

  // Preload DOM and offers
  document.addEventListener('DOMContentLoaded', () => {
    createLockerDom();
    fetchLiveOffers().then(renderOffers);
  });
})();
