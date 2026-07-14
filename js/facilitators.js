const facilitators = [
  {
    name: "Neehanth Reddy Maramreddy",
    badge: "2026 Arcade Facilitator",
    identity: "AI/ML builder and learner-support facilitator",
    bio: "Neehanth is an AI and data professional with an M.S. in Data Science from the University of Memphis. He supports participants with enrollment guidance, Google Skills profiles, cloud and AI learning resources, and technical questions.",
    photo: "assets/images/neehanth_headhsot.jpg",
    initials: "NM",
    linkedin: "https://www.linkedin.com/in/neehanthreddy",
    x: "https://x.com/NeehanthReddyM",
    whatsapp: "https://wa.me/918520072947",
    supportAreas: [
      "Enrollment and facilitator-code guidance",
      "Google Skills profile setup",
      "AI, data, and cloud-learning resources"
    ],
    expertise: [
      "AI/ML",
      "Data Science",
      "Python",
      "Cloud Learning",
      "Community Support"
    ]
  },
  {
    name: "Jashwanth Dasari",
    badge: "2026 Arcade Facilitator",
    identity: "Developer community organizer and data/AI facilitator",
    bio: "Jashwanth is a data and AI professional and developer-community organizer at Florida Atlantic University. He supports participant onboarding, community coordination, program communication, and hands-on cloud learning.",
    photo: "assets/images/jashwanth_headshot.png",
    initials: "JD",
    linkedin: "https://www.linkedin.com/in/jashwanthdasari2001",
    whatsapp: "https://wa.me/919063998345",
    supportAreas: [
      "Participant onboarding",
      "Program announcements and community coordination",
      "Google Cloud learning support"
    ],
    expertise: [
      "Data Science",
      "AI",
      "Developer Communities",
      "Community Building",
      "Cloud Learning"
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('facilitator-cards-container');
  if (!container) return;

  facilitators.forEach(fac => {
    // Determine Photo or Initials
    const photoContent = fac.photo 
      ? `<img src="${fac.photo}" alt="${fac.name}, ${fac.badge}" class="fac-photo" />`
      : `<div class="fac-initials">${fac.initials}</div>`;

    // Determine Links
    let socialsHtml = '<div class="fac-socials" style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: center; width: 100%;">';
    if (fac.linkedin) socialsHtml += `<a href="${fac.linkedin}" target="_blank" rel="noopener noreferrer" style="color: #0A66C2; transition: transform 0.2s; display: inline-block;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>`;
    if (fac.x) socialsHtml += `<a href="${fac.x}" target="_blank" rel="noopener noreferrer" style="color: #000000; transition: transform 0.2s; display: inline-block;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" aria-label="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="lucide lucide-x"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>`;
    if (fac.whatsapp) socialsHtml += `<a href="${fac.whatsapp}" target="_blank" rel="noopener noreferrer" style="color: #25D366; transition: transform 0.2s; display: inline-block;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" aria-label="WhatsApp"><i data-lucide="message-circle"></i></a>`;
    socialsHtml += '</div>';

    const buttonsHtml = `${socialsHtml}`;

    // Render support areas
    const supportHtml = fac.supportAreas.map(item => `<li><i data-lucide="check" class="fac-icon"></i>${item}</li>`).join('');

    // Render expertise tags
    const expertiseHtml = fac.expertise.map(tag => `<span class="fac-tag">${tag}</span>`).join('');

    const cardHTML = `
      <div class="card fac-card">
        <div class="fac-header">
          <div class="fac-photo-container">
            ${photoContent}
          </div>
          <div class="fac-title">
            <h2>${fac.name}</h2>
            <div class="fac-badge"><i data-lucide="shield-check" class="fac-icon-small"></i> ${fac.badge}</div>
            <p class="fac-identity">${fac.identity}</p>
          </div>
        </div>
        
        <p class="fac-bio">${fac.bio}</p>
        
        <div class="fac-section">
          <h4 class="fac-section-title">Areas of Support</h4>
          <ul class="fac-list">
            ${supportHtml}
          </ul>
        </div>
        
        <div class="fac-section">
          <h4 class="fac-section-title">Expertise</h4>
          <div class="fac-tags">
            ${expertiseHtml}
          </div>
        </div>
        
        ${buttonsHtml}
      </div>
    `;

    container.innerHTML += cardHTML;
  });

  // Re-initialize Lucide icons for the newly added HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
