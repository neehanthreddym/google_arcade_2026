document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Handle Form Submissions (Mocking API for now)
  const progressForm = document.getElementById('progress-form');
  if (progressForm) {
    progressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('form-message').style.display = 'block';
      progressForm.reset();
      setTimeout(() => {
        document.getElementById('form-message').style.display = 'none';
      }, 5000);
    });
  }

  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('support-message').style.display = 'block';
      supportForm.reset();
      setTimeout(() => {
        document.getElementById('support-message').style.display = 'none';
      }, 5000);
    });
  }

  // --- DATA DRIVEN RENDERERS ---

  // 1. Resources Data & Logic
  const resourcesData = [
    { title: "Google Cloud Skills Boost", desc: "Official platform to complete labs, learning paths, and skill badges.", link: "https://www.cloudskillsboost.google/", type: "Official", badge: "badge-official", icon: "cloud" },
    { title: "Google Cloud Arcade", desc: "Official Arcade page for games, points, activities, and program updates.", link: "https://go.qwiklabs.com/arcade", type: "Official", badge: "badge-official", icon: "gamepad-2" },
    { title: "Make Profile Public", desc: "Step-by-step guide to make your profile visible for progress tracking.", link: "#", type: "Guide", badge: "badge-guide", icon: "user-check" },
    { title: "Beginner Cloud Basics", desc: "Start here if you are new to cloud computing and Google Cloud.", link: "#", type: "Beginner", badge: "badge-easy", icon: "book-open" },
    { title: "Skill Badge Guide", desc: "Learn how skill badges work and how to complete labs effectively.", link: "#", type: "Skill Badges", badge: "badge-medium", icon: "award" },
    { title: "Common Lab Issues", desc: "Fix common lab errors, quota issues, and verification problems.", link: "support.html", type: "Troubleshooting", badge: "badge-hard", icon: "alert-triangle" },
    { title: "Submit Monthly Progress", desc: "Share your profile link and completed activities with facilitators.", link: "progress.html", type: "Progress", badge: "badge-tool", icon: "upload-cloud" },
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
        <a href="${res.link}" ${res.link.startsWith('http') ? 'target="_blank"' : ''} class="btn btn-outline" style="border: 1px solid var(--border-color); color: var(--text-dark); padding: 0.5rem 1rem; border-radius: var(--radius-sm); text-align: center; margin-top: auto;">View Resource</a>
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
      category: "Getting Started",
      icon: "rocket",
      questions: [
        { q: "Who can join this community?", a: "Anyone interested in learning Google Cloud through the Arcade program. This community is facilitated by Neehanth and Jashwanth." },
        { q: "Is prior cloud experience required?", a: "No! The first month focuses on onboarding and beginner basics. We will guide you step-by-step." },
        { q: "How do I make my profile public?", a: "Go to your Google Cloud Skills Boost settings, navigate to the Profile tab, and click 'Make Profile Public'." }
      ]
    },
    {
      category: "Arcade Activities",
      icon: "gamepad-2",
      questions: [
        { q: "What is Google Cloud Arcade?", a: "It's a gamified learning platform where you play games to learn cloud skills and earn digital badges." },
        { q: "What are skill badges?", a: "Skill badges are digital credentials issued by Google Cloud that prove your ability to solve real-world problems using cloud tools." },
        { q: "How do I complete monthly Arcade activities?", a: "Follow our Monthly Roadmap. We curate the best games and labs for you to focus on each week." }
      ]
    },
    {
      category: "Progress Tracking",
      icon: "trending-up",
      questions: [
        { q: "How do I submit my progress?", a: "Use the Progress Tracker page on this website to submit your public profile link and report completed badges." },
        { q: "Why should my Skills Boost profile be public?", a: "A public profile allows facilitators to verify your completed badges and provide support if you are stuck." },
        { q: "What if my completed badge does not appear?", a: "Sometimes it takes up to 24 hours. If it still doesn't appear, ensure you have a public profile and have completed all labs in the quest." }
      ]
    },
    {
      category: "Points and Rewards",
      icon: "gift",
      questions: [
        { q: "Are rewards guaranteed?", a: "No. Rewards depend on official program rules, availability, and point thresholds. Please check official Google Cloud sources." },
        { q: "Where do I check official points?", a: "Your official points will be communicated by the Google Cloud Arcade team via email. Our community tracker is only for support." }
      ]
    },
    {
      category: "Community and Support",
      icon: "life-buoy",
      questions: [
        { q: "Where can I ask questions?", a: "Join our WhatsApp or Telegram groups. These are the fastest ways to get answers." },
        { q: "What should I do if a lab is not working?", a: "Take a screenshot of the error, note the step you are on, and submit a question in the Support page or community group." }
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
            <div class="accordion-header">
              ${item.q}
              <i data-lucide="chevron-down"></i>
            </div>
            <div class="accordion-content">
              <p style="padding-top: 1rem; margin: 0;">${item.a}</p>
            </div>
          `;
          
          // Add click event for toggle
          accordion.querySelector('.accordion-header').addEventListener('click', () => {
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
