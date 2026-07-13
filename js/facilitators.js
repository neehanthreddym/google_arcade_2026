const facilitators = [
  {
    name: "Neehanth Reddy Maramreddy",
    badge: "2026 Arcade Facilitator",
    identity: "AI/ML builder and learner-support facilitator",
    bio: "Neehanth is an AI and data professional with an M.S. in Data Science from the University of Memphis. He supports participants with enrollment guidance, Google Skills profiles, cloud and AI learning resources, and technical questions.",
    photo: "assets/images/neehanth_headhsot.jpg",
    initials: "NM",
    linkedin: "", // Placeholder until provided
    contact: "", // Placeholder until provided
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
    linkedin: "", // Placeholder until provided
    contact: "", // Placeholder until provided
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
    const linkedinBtn = fac.linkedin
      ? `<a href="${fac.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-fac-contact btn-equal" aria-label="View LinkedIn for ${fac.name}"><i data-lucide="linkedin"></i> View LinkedIn</a>`
      : ``;

    let contactBtn = '';
    if (fac.contact) {
      contactBtn = `<a href="${fac.contact}" class="btn btn-fac-contact btn-equal" aria-label="Contact ${fac.name}"><i data-lucide="mail"></i> Contact Facilitator</a>`;
    } else {
      contactBtn = `<a href="support.html" class="btn btn-fac-contact btn-equal" aria-label="Ask in Community"><i data-lucide="message-circle"></i> Ask in Community</a>`;
    }

    const buttonsHtml = `<div class="fac-actions">${linkedinBtn}${contactBtn}</div>`;

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
