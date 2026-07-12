// js/community-popup.js
const cmpConfig = {
  enabled: true,
  homepageOnly: true,
  delayMs: 3000,
  reminderIntervalMs: 24 * 60 * 60 * 1000, // 24 hours
  suppressionIntervalMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  whatsappUrl: "https://chat.whatsapp.com/CqkoPc8doUv74MNkBmzTaD",
  telegramUrl: "https://t.me/googlearcadeplayers",
  officialUrl: "https://rsvp.withgoogle.com/events/arcade-facilitator/",
  memberCount: "500+",
  qrAssetPath: "",
};

(function() {
  if (!cmpConfig.enabled) return;
  // Check if we are on homepage
  const path = window.location.pathname;
  if (cmpConfig.homepageOnly) {
    const isHome = path === '/' || path.endsWith('index.html') || path.endsWith('/google_arcade_2026/');
    if (!isHome) return;
  }

  const STORAGE_KEY = 'arcade_community_popup_state';
  let previousActiveElement = null;

  function checkState() {
    try {
      const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!state) return true;
      const now = Date.now();
      if (state.action === 'remind_later' && (now - state.timestamp > cmpConfig.reminderIntervalMs)) return true;
      if (state.action === 'dont_show' && (now - state.timestamp > cmpConfig.suppressionIntervalMs)) return true;
      return false;
    } catch (e) {
      return true;
    }
  }

  function setState(action) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ action: action, timestamp: Date.now() }));
    } catch (e) {}
  }

  function emitEvent(eventName) {
    if (typeof gtag === 'function') {
      gtag('event', eventName);
    } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event: eventName });
    }
  }

  if (!checkState()) return;

  setTimeout(initPopup, cmpConfig.delayMs);

  function initPopup() {
    if (document.getElementById('cmp-overlay')) return;

    previousActiveElement = document.activeElement;

    const overlay = document.createElement('div');
    overlay.id = 'cmp-overlay';
    overlay.className = 'cmp-overlay';

    let qrHtml = '';
    if (cmpConfig.qrAssetPath) {
      qrHtml = `
        <div class="cmp-qr">
          <img src="${cmpConfig.qrAssetPath}" alt="WhatsApp Community QR Code" />
        </div>
      `;
    }

    const modalHtml = `
      <div class="cmp-modal" role="dialog" aria-modal="true" aria-labelledby="cmp-title" aria-describedby="cmp-desc" tabindex="-1" id="cmp-modal">
        <div class="cmp-accent"></div>
        <button class="cmp-close" aria-label="Close dialog" id="cmp-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="cmp-header">
          <span class="cmp-badge">Facilitator-Led Community</span>
          <h2 id="cmp-title" class="cmp-title">Build your Google Cloud skills with a community beside you.</h2>
          <p id="cmp-desc" class="cmp-desc">Join our Arcade Facilitator ’26 community for verified updates, enrollment guidance, learning resources, and peer support.</p>
        </div>

        <div class="cmp-highlights">
          <div class="cmp-highlight">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Verified program updates
          </div>
          <div class="cmp-highlight">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Enrollment and profile guidance
          </div>
          <div class="cmp-highlight">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Community learning support
          </div>
        </div>

        <div class="cmp-whatsapp-card">
          <div class="cmp-wa-content">
            <div class="cmp-wa-header">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              <div>
                <h3>Join the WhatsApp Community</h3>
                <p>Updates, reminders, guidance, and participant discussions.</p>
              </div>
            </div>
            ${cmpConfig.memberCount ? `<div class="cmp-member-count"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> ${cmpConfig.memberCount} Members</div>` : ''}
            <a href="${cmpConfig.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="cmp-btn cmp-btn-whatsapp" id="cmp-wa-btn">Join on WhatsApp</a>
          </div>
          ${qrHtml}
        </div>

        <div class="cmp-telegram-card">
          <div class="cmp-tg-text">
            <h3>Prefer Telegram?</h3>
            <p>Receive the same essential community updates.</p>
          </div>
          <a href="${cmpConfig.telegramUrl}" target="_blank" rel="noopener noreferrer" class="cmp-btn cmp-btn-telegram" id="cmp-tg-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram Community
          </a>
        </div>

        <div class="cmp-official">
          <a href="${cmpConfig.officialUrl}" target="_blank" rel="noopener noreferrer" id="cmp-official-link">View official Facilitator ’26 program details</a>
          <p>This is an independent facilitator-led community hub. Official program rules and updates are provided by Google.</p>
        </div>

        <div class="cmp-actions">
          <button class="cmp-btn-text" id="cmp-remind">Remind Me Later</button>
          <button class="cmp-btn-text" id="cmp-dont-show">Don’t Show Again</button>
        </div>
      </div>
    `;

    overlay.innerHTML = modalHtml;
    document.body.appendChild(overlay);

    document.body.style.overflow = 'hidden';

    emitEvent('community_popup_view');

    // Setup interactions
    const modal = document.getElementById('cmp-modal');
    const closeBtn = document.getElementById('cmp-close');
    const remindBtn = document.getElementById('cmp-remind');
    const dontShowBtn = document.getElementById('cmp-dont-show');
    const waBtn = document.getElementById('cmp-wa-btn');
    const tgBtn = document.getElementById('cmp-tg-btn');
    const offLink = document.getElementById('cmp-official-link');

    function closeModal(action) {
      if (action) {
        setState(action);
      }
      if (action === 'remind_later') emitEvent('community_popup_remind_later');
      if (action === 'dont_show') emitEvent('community_popup_dont_show_again');
      
      overlay.classList.add('cmp-closing');
      setTimeout(() => {
        document.body.style.overflow = '';
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (previousActiveElement) previousActiveElement.focus();
      }, 350); // Matches CSS animation duration
    }

    closeBtn.addEventListener('click', () => {
      emitEvent('community_popup_close');
      closeModal('remind_later');
    });

    remindBtn.addEventListener('click', () => closeModal('remind_later'));
    dontShowBtn.addEventListener('click', () => closeModal('dont_show'));

    waBtn.addEventListener('click', () => emitEvent('community_popup_whatsapp_click'));
    tgBtn.addEventListener('click', () => emitEvent('community_popup_telegram_click'));
    offLink.addEventListener('click', () => emitEvent('community_popup_official_link_click'));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        emitEvent('community_popup_close');
        closeModal('remind_later');
      }
    });

    // Trap Focus
    const focusableElements = modal.querySelectorAll('a[href], button:not([disabled])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        emitEvent('community_popup_close');
        closeModal('remind_later');
        e.preventDefault();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('cmp-active');
      modal.focus();
    });
  }
})();
