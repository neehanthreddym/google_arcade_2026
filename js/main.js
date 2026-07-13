window.enrollmentConfig = {
  code: "GCAF26-IN-FM4-SKN",
  url: "https://rsvp.withgoogle.com/events/arcade-facilitator/",
  opens: "2026-07-13T11:30:00Z",
  closes: "2026-07-20T18:29:00Z",
  ends: "2026-09-14T18:29:00Z",
  manualStatusOverride: null // can be 'closed-early'
};

window.copyFacilitatorCode = function(btn) {
  const code = window.enrollmentConfig.code;
  const originalHtml = btn.innerHTML;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code).then(showCopied).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); showCopied(); } catch(err) {}
    document.body.removeChild(textArea);
  }

  function showCopied() {
    btn.innerHTML = `<i data-lucide="check" style="width: 18px; height: 18px;"></i> Copied`;
    if (window.lucide) lucide.createIcons();
    
    let announcer = document.getElementById('aria-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.style.cssText = 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;';
      document.body.appendChild(announcer);
    }
    announcer.textContent = 'Facilitator code copied';
    
    if (typeof gtag === 'function') {
      gtag('event', 'facilitator_code_copy');
    }
    
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      if (window.lucide) lucide.createIcons();
      announcer.textContent = '';
    }, 2000);
  }
};

window.updateEnrollmentStatus = function() {
  const now = new Date();
  const opens = new Date(window.enrollmentConfig.opens);
  const closes = new Date(window.enrollmentConfig.closes);
  
  let status = 'upcoming';
  if (window.enrollmentConfig.manualStatusOverride) {
    status = window.enrollmentConfig.manualStatusOverride;
  } else if (now < opens) {
    status = 'upcoming';
  } else if (now >= opens && now < closes) {
    if (closes.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) {
      status = 'closing-soon';
    } else {
      status = 'open';
    }
  } else if (now >= closes) {
    status = 'closed';
  }
  
  document.querySelectorAll('.enrollment-status-text').forEach(el => {
    if (status === 'upcoming') el.textContent = 'Enrollment Opens Soon';
    if (status === 'open') el.textContent = 'Enrollment Open';
    if (status === 'closing-soon') el.textContent = 'Closing Soon';
    if (status === 'closed') el.textContent = 'Enrollment Closed';
    if (status === 'closed-early') el.textContent = 'Enrollment Closed — Seats Filled';
  });
  
  document.querySelectorAll('.timeline-date').forEach(el => {
    const dateStr = el.getAttribute('data-date');
    if (dateStr && now >= new Date(dateStr)) {
      el.classList.add('muted');
    }
  });

  if (status === 'closed' || status === 'closed-early') {
    document.querySelectorAll('.official-enrollment-btn').forEach(btn => {
      // Need to replace the text but keep any icon structure if needed
      if (btn.classList.contains('btn-secondary')) {
        btn.innerHTML = 'View Official Program <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>';
      } else {
        btn.textContent = 'View Official Program';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.updateEnrollmentStatus();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- DATA DRIVEN RENDERERS ---

  // 1. Resources Data & Logic
  const resourcesData = [
    { title: "Facilitator ’26 Enrollment", desc: "Official enrollment, eligibility, timeline, points, syllabus, FAQs, and program updates for Google Cloud Arcade Facilitator ’26.", link: "https://rsvp.withgoogle.com/events/arcade-facilitator/", type: "Official", badge: "badge-official", icon: "user-plus", secondaryLink: "index.html#enrollment-essentials", secondaryText: "View Our Team Code" },
    { title: "Google Cloud Skills Boost", desc: "Official platform to complete labs, learning paths, and skill badges.", link: "https://www.cloudskillsboost.google/", type: "Official", badge: "badge-official", icon: "cloud" },
    { title: "Google Cloud Arcade", desc: "Official Arcade page for games, points, activities, and program updates.", link: "https://go.qwiklabs.com/arcade", type: "Official", badge: "badge-official", icon: "gamepad-2" },
    { title: "Beginner Cloud Basics", desc: "Start here if you are new to cloud computing and Google Cloud.", link: "#", type: "Beginner", badge: "badge-easy", icon: "book-open" },
    { title: "Skill Badge Guide", desc: "Learn how skill badges work and how to complete labs effectively.", link: "#", type: "Skill Badges", badge: "badge-medium", icon: "award" },
    { title: "Common Lab Issues", desc: "Fix common lab errors, quota issues, and verification problems.", link: "support.html", type: "Troubleshooting", badge: "badge-hard", icon: "alert-triangle" },
    { title: "Join WhatsApp", desc: "Connect with facilitators and peers through WhatsApp community.", link: "https://chat.whatsapp.com/CqkoPc8doUv74MNkBmzTaD", type: "Community", badge: "badge-community", icon: "message-circle" },
    { title: "Join Telegram", desc: "Connect with facilitators and peers through Telegram group.", link: "https://t.me/googlearcadeplayers", type: "Community", badge: "badge-community", icon: "send" }
  ];

  const resourcesGrid = document.getElementById('resources-grid');
  const resourceSearch = document.getElementById('resource-search');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderResources(data) {
    if (!resourcesGrid) return;
    resourcesGrid.innerHTML = '';
    
    if (data.length === 0) {
      resourcesGrid.innerHTML = '<p style="color: var(--text-gray); grid-column: 1/-1; text-align: center;">No resources found.</p>';
      return;
    }

    data.forEach(res => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <span class="badge ${res.badge}" style="width: fit-content; margin-bottom: 1rem;">${res.type}</span>
        <h3 style="display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="${res.icon}" style="color: var(--primary-color);"></i> ${res.title}</h3>
        <p>${res.desc}</p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto;">
          <a href="${res.link}" ${res.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline" style="border: 1px solid var(--border-color); color: var(--text-dark); padding: 0.5rem 1rem; border-radius: var(--radius-sm); text-align: center;" onclick="${res.link.startsWith('http') ? "if(typeof gtag === 'function') gtag('event', 'official_program_resource_click');" : ""}">${res.link.startsWith('http') ? 'View Official Program' : 'View Resource'}</a>
          ${res.secondaryLink ? `<a href="${res.secondaryLink}" style="text-align: center; font-size: 0.9rem; color: var(--primary-color); text-decoration: none;">${res.secondaryText}</a>` : ''}
        </div>
      `;
      resourcesGrid.appendChild(card);
    });
    // Re-initialize lucide icons for new elements
    if(window.lucide) { lucide.createIcons(); }
  }

  function filterResources() {
    if (!resourcesGrid) return;
    const searchTerm = resourceSearch.value.toLowerCase();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterType = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    const filtered = resourcesData.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchTerm) || res.desc.toLowerCase().includes(searchTerm);
      const matchesFilter = filterType === 'all' || res.type.toLowerCase().replace(' ', '-') === filterType;
      return matchesSearch && matchesFilter;
    });

    renderResources(filtered);
  }

  if (resourcesGrid) {
    renderResources(resourcesData);
    
    resourceSearch.addEventListener('input', filterResources);
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterResources();
      });
    });
  }

  // 2. FAQs Data & Logic
  const faqData = [
    {
      category: "Key Dates and Enrollment",
      icon: "calendar",
      questions: [
        { q: "When does Facilitator ’26 enrollment open?", a: "Enrollment opens on July 13, 2026 at 5:00 PM IST." },
        { q: "When does enrollment close?", a: "Enrollment closes on July 20, 2026 at 11:59 PM IST, or earlier if available seats fill." },
        { q: "Can enrollment close before July 20?", a: "Yes, enrollment may close early if all available seats are filled. We recommend enrolling as soon as possible." },
        { q: "When does the program end?", a: "The program officially ends on September 14, 2026 at 11:59 PM IST." },
        { q: "Where can I find the official enrollment form?", a: "The official enrollment form is available on the <a href='https://rsvp.withgoogle.com/events/arcade-facilitator/' target='_blank' rel='noopener noreferrer'>official program website</a>." }
      ]
    },
    {
      category: "Facilitator referral code",
      icon: "tag",
      questions: [
        { q: "What is our facilitator team code?", a: "Our facilitator team code is <code>GCAF26-IN-FM4-SKN</code>. Enter it in the facilitator referral-code field while completing the official enrollment form.<br><br><button class='btn btn-secondary' style='padding: 0.25rem 0.75rem; font-size: 0.9rem;' onclick='window.copyFacilitatorCode(this)'><i data-lucide='copy' style='width: 16px; height: 16px;'></i> Copy Code</button>" },
        { q: "Where do I enter the facilitator code?", a: "Enter it in the specific 'Facilitator Referral Code' field when you are filling out the official Google Cloud Arcade Facilitator ’26 enrollment form." },
        { q: "Can I enroll without a facilitator code?", a: "Yes. Participants without a referral code may be assigned to a facilitator team later by the official program organizers." },
        { q: "What happens if I forget to enter the code?", a: "If you forget the code, you might miss out on our community-specific support or tracking. However, official Google communications and the official program website take priority." },
        { q: "Does using the code guarantee rewards or milestones?", a: "No. Entering the code links the participant to our facilitator team, but using the code does not guarantee enrollment, milestones, points, rewards, or prizes." }
      ]
    },
    {
      category: "Google Skills account and public profile",
      icon: "user",
      questions: [
        { q: "Do I need a Google Cloud Skills Boost account?", a: "Yes, an active account is required to participate in the labs and earn badges." },
        { q: "How do I make my profile public?", a: "Go to your account settings, navigate to the Profile tab, and enable 'Make Profile Public'. This allows your badges and progress to be verified." }
      ]
    },
    {
      category: "Credits and enrollment email",
      icon: "mail",
      questions: [
        { q: "How do I get credits for labs?", a: "Upon successful enrollment and participating in Arcade events, you receive no-cost credits to complete the hands-on labs." },
        { q: "I haven't received my enrollment email. What should I do?", a: "Check your spam or promotions folder. If it's still missing, ensure your account email is correct on the Skills Boost platform." }
      ]
    },
    {
      category: "Arcade games and skill badges",
      icon: "gamepad-2",
      questions: [
        { q: "What are Arcade games?", a: "They are monthly learning challenges consisting of multiple labs covering various Google Cloud technologies." },
        { q: "How do skill badges work?", a: "Skill badges are digital credentials you earn by completing specific quests and passing a challenge lab." }
      ]
    },
    {
      category: "Points, milestones, and rewards",
      icon: "award",
      questions: [
        { q: "How do I earn points?", a: "You earn points by completing Arcade games, trivia, and skill badges. Points accumulate over the program duration." },
        { q: "When do I get my rewards?", a: "Rewards are distributed based on milestones reached at the end of the program cycle. The official program page will outline the specific point tiers." }
      ]
    },
    {
      category: "Technical and account problems",
      icon: "alert-circle",
      questions: [
        { q: "A lab is broken or won't start. What do I do?", a: "End the lab, wait a few minutes, and restart. If the issue persists, contact Google Cloud Skills Boost support directly through the platform." },
        { q: "My badge isn't showing up on my profile.", a: "It can take up to 24 hours for a badge to appear. Ensure your profile is public." }
      ]
    },
    {
      category: "Community and facilitator support",
      icon: "users",
      questions: [
        { q: "How do facilitators help?", a: "Facilitators guide you through the learning process, help unblock you when stuck, and share regular program updates." },
        { q: "Where can I ask questions?", a: "Join our official WhatsApp and Telegram communities for the fastest response from facilitators and peers." }
      ]
    }
  ];

  const faqContainer = document.getElementById('faq-container');
  const faqSearch = document.getElementById('faq-search');

  function renderFAQs(data, searchTerm = "") {
    if (!faqContainer) return;
    faqContainer.innerHTML = '';
    
    let totalQuestionsRendered = 0;

    data.forEach(cat => {
      // Filter questions in this category by search term
      const filteredQuestions = cat.questions.filter(item => 
        item.q.toLowerCase().includes(searchTerm) || item.a.toLowerCase().includes(searchTerm)
      );

      if (filteredQuestions.length > 0) {
        // Create Category Header
        const catHeader = document.createElement('h3');
        catHeader.style.cssText = "margin: 2.5rem 0 1rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-dark);";
        catHeader.innerHTML = `<i data-lucide="${cat.icon}" style="color: var(--primary-color);"></i> ${cat.category}`;
        faqContainer.appendChild(catHeader);

        // Create Accordions
        filteredQuestions.forEach(item => {
          totalQuestionsRendered++;
          const accordion = document.createElement('div');
          accordion.className = 'accordion';
          accordion.innerHTML = `
            <button class="accordion-header" aria-expanded="false" aria-controls="content-${totalQuestionsRendered}" id="header-${totalQuestionsRendered}" style="width: 100%; text-align: left; background: none; border: none; font-family: inherit; font-size: 1rem;">
              ${item.q}
              <i data-lucide="chevron-down"></i>
            </button>
            <div class="accordion-content" id="content-${totalQuestionsRendered}" role="region" aria-labelledby="header-${totalQuestionsRendered}">
              <p style="padding-top: 1rem; margin: 0;">${item.a}</p>
            </div>
          `;
          
          // Add click event for toggle
          const headerBtn = accordion.querySelector('.accordion-header');
          headerBtn.addEventListener('click', () => {
            const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';
            headerBtn.setAttribute('aria-expanded', !isExpanded);
            accordion.classList.toggle('active');
          });

          faqContainer.appendChild(accordion);
        });
      }
    });

    if (totalQuestionsRendered === 0) {
      faqContainer.innerHTML = '<p style="color: var(--text-gray); text-align: center; margin-top: 2rem;">No FAQs found matching your search.</p>';
    }

    if(window.lucide) { lucide.createIcons(); }
  }

  if (faqContainer) {
    renderFAQs(faqData);
    
    if (faqSearch) {
      faqSearch.addEventListener('input', (e) => {
        renderFAQs(faqData, e.target.value.toLowerCase());
      });
    }
  }

});


window.copyFacilitatorCodeNew = function(btn) {
  const codeText = "GCAF26-IN-FM4-SKN";
  
  navigator.clipboard.writeText(codeText).then(() => {
    // Add copied class to button
    btn.classList.add("copied");
    
    // Spawn celebration animation
    spawnCopyParticles(btn);
    
    // Change icon to check
    const iconEl = btn.querySelector(".copy-icon");
    if (iconEl) {
      iconEl.setAttribute("data-lucide", "check");
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
    
    // Change text to Copied
    const textEl = btn.querySelector(".copy-text");
    if (textEl) {
      textEl.textContent = "Copied";
    }
    
    // Announce to screen readers
    const liveRegion = document.getElementById("copy-live-region");
    if (liveRegion) {
      liveRegion.textContent = "Facilitator code copied";
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      btn.classList.remove("copied");
      
      if (iconEl) {
        iconEl.setAttribute("data-lucide", "copy");
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
      
      if (textEl) {
        textEl.textContent = "Copy Code";
      }
      
      if (liveRegion) {
        liveRegion.textContent = "";
      }
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};

function spawnCopyParticles(btn) {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const btnRect = btn.getBoundingClientRect();
  const particleCount = 60;
  const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'copy-particle';
    
    // Randomize colors, size, and starting position slightly
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 6 + 4; // 4px to 10px
    const startX = btnRect.width / 2 + (Math.random() * 20 - 10);
    const startY = btnRect.height / 2 + (Math.random() * 10 - 5);
    
    // Randomize trajectory
    const tx = (Math.random() - 0.5) * 800; // -250px to 250px
    const ty = (Math.random() - 1) * 800;   // -500px to 0px
    
    particle.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation: copyParticleAnim 1s ease-out forwards;
    `;
    
    // Make sure button has position relative if not already handled in CSS
    btn.style.position = 'relative';
    btn.appendChild(particle);
    
    // Clean up
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}
