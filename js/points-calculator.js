(() => {
  const PROFILE_ENDPOINT = 'https://arcadepoints.vercel.app/api/profile-badges';
  const COHORT_START = new Date('2026-07-13T00:00:00Z');
  const COHORT_END = new Date('2026-09-14T23:59:59Z');

  const milestones = [
    { name: 'Trooper', min: 50, bonus: 10 },
    { name: 'Ranger', min: 75, bonus: 20 },
    { name: 'Champion', min: 95, bonus: 30 },
    { name: 'Legend', min: 120, bonus: 50 }
  ];

  function validProfileUrl(urlString) {
    try {
      const url = new URL(urlString);
      const hostMatch = /cloudskillsboost\.google$/.test(url.hostname);
      return hostMatch && url.pathname.includes('public_profiles');
    } catch {
      return false;
    }
  }

  function normalizeBadge(rawBadge) {
    return {
      title: String(rawBadge?.title || rawBadge?.name || '').trim(),
      date: rawBadge?.earnedAt || rawBadge?.earned_at || rawBadge?.completedAt || rawBadge?.date || null
    };
  }

  function classifyBadge(badge) {
    const title = badge.title.toLowerCase();
    const badgeDate = badge.date ? new Date(badge.date) : null;

    if (!badgeDate || Number.isNaN(badgeDate.getTime())) {
      return 'needsReview';
    }

    if (badgeDate < COHORT_START || badgeDate > COHORT_END) {
      return 'outsideCohort';
    }

    if (title.includes('trivia') || title.includes('survey') || title.includes('attendance')) {
      return 'excluded';
    }

    if (title.includes('arcade game') || (title.includes('arcade') && title.includes('game'))) {
      return 'arcadeGame';
    }

    if (title.includes('skill badge') || title.includes('skill')) {
      return 'skillBadge';
    }

    return 'needsReview';
  }

  function emptyClassified() {
    return {
      arcadeGame: [],
      skillBadge: [],
      outsideCohort: [],
      excluded: [],
      needsReview: []
    };
  }

  function classifyBadges(badges) {
    const grouped = emptyClassified();
    badges.map(normalizeBadge).forEach((badge) => {
      grouped[classifyBadge(badge)].push(badge);
    });
    return grouped;
  }

  function summarizeScores({ arcadeGameCount, skillBadgeCount, optionalBonusPoints }) {
    const basePoints = arcadeGameCount + Math.floor(skillBadgeCount / 2);

    let highestMilestone = null;
    milestones.forEach((milestone) => {
      if (basePoints >= milestone.min) highestMilestone = milestone;
    });

    const potentialMilestoneBonus = highestMilestone ? highestMilestone.bonus : 0;
    const totalEstimatedPoints = basePoints + potentialMilestoneBonus + optionalBonusPoints;

    const nextMilestone = milestones.find((milestone) => totalEstimatedPoints < milestone.min);

    return {
      basePoints,
      potentialMilestoneBonus,
      totalEstimatedPoints,
      highestMilestone,
      nextMilestone
    };
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderClassification(classified) {
    setText('count-game', String(classified.arcadeGame.length));
    setText('count-skill', String(classified.skillBadge.length));
    setText('count-outside', String(classified.outsideCohort.length));
    setText('count-excluded', String(classified.excluded.length));
    setText('count-review', String(classified.needsReview.length));

    const reviewEl = document.getElementById('review-items');
    if (!reviewEl) return;

    if (!classified.needsReview.length) {
      reviewEl.textContent = 'No uncertain badges yet.';
      return;
    }

    reviewEl.innerHTML = `<strong>Needs review:</strong> ${classified.needsReview
      .map((badge) => `${badge.title || 'Untitled badge'}${badge.date ? ` (${badge.date})` : ''}`)
      .join(', ')}`;
  }

  function renderSummary(summary, arcadeGameCount, skillBadgeCount, optionalBonusPoints) {
    setText('base-points', String(summary.basePoints));
    setText('base-formula', `${arcadeGameCount} + floor(${skillBadgeCount} / 2) = ${summary.basePoints}`);
    setText('highest-milestone', summary.highestMilestone ? `${summary.highestMilestone.name} (${summary.highestMilestone.min})` : 'Not reached yet');
    setText('milestone-bonus', String(summary.potentialMilestoneBonus));
    setText('optional-bonus', String(optionalBonusPoints));
    setText('total-points', String(summary.totalEstimatedPoints));

    const nextText = summary.nextMilestone
      ? `Need ${summary.nextMilestone.min - summary.totalEstimatedPoints} points to reach ${summary.nextMilestone.name} (${summary.nextMilestone.min}).`
      : 'Top listed milestone reached.';
    setText('next-milestone', nextText);
  }

  async function tryAutoExtraction(profileUrl) {
    const response = await fetch(`${PROFILE_ENDPOINT}?profileUrl=${encodeURIComponent(profileUrl)}`);
    if (!response.ok) {
      throw new Error('Profile extraction unavailable.');
    }

    const payload = await response.json();
    if (!Array.isArray(payload?.badges)) {
      throw new Error('No badges returned by extraction service.');
    }

    return payload.badges;
  }

  function initialize() {
    const runProfileCheckBtn = document.getElementById('run-profile-check');
    const runManualBtn = document.getElementById('run-manual-calc');
    const showManualBtn = document.getElementById('show-manual');
    const statusEl = document.getElementById('profile-status');
    const profileUrlEl = document.getElementById('profile-url');

    if (!runProfileCheckBtn || !runManualBtn || !showManualBtn || !statusEl || !profileUrlEl) {
      return;
    }

    showManualBtn.addEventListener('click', () => {
      statusEl.textContent = 'Manual calculator enabled. Enter your counts below.';
      statusEl.style.color = 'var(--text-gray)';
      document.getElementById('manual-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    runManualBtn.addEventListener('click', () => {
      const arcadeGameCount = Math.max(0, parseInt(document.getElementById('manual-game-badges')?.value || '0', 10));
      const skillBadgeCount = Math.max(0, parseInt(document.getElementById('manual-skill-badges')?.value || '0', 10));
      const optionalBonusPoints = Math.max(0, parseInt(document.getElementById('manual-bonus-points')?.value || '0', 10));

      renderClassification({
        ...emptyClassified(),
        arcadeGame: new Array(arcadeGameCount).fill({ title: 'Manual entry' }),
        skillBadge: new Array(skillBadgeCount).fill({ title: 'Manual entry' })
      });

      const summary = summarizeScores({ arcadeGameCount, skillBadgeCount, optionalBonusPoints });
      renderSummary(summary, arcadeGameCount, skillBadgeCount, optionalBonusPoints);
      statusEl.textContent = 'Manual estimate updated.';
      statusEl.style.color = 'var(--google-green)';
    });

    runProfileCheckBtn.addEventListener('click', async () => {
      const profileUrl = profileUrlEl.value.trim();
      if (!validProfileUrl(profileUrl)) {
        statusEl.textContent = 'Enter a valid public Google Skills profile URL.';
        statusEl.style.color = 'var(--google-red)';
        return;
      }

      runProfileCheckBtn.disabled = true;
      statusEl.textContent = 'Valid URL detected. Checking publicly visible badges...';
      statusEl.style.color = 'var(--text-gray)';

      try {
        const badges = await tryAutoExtraction(profileUrl);
        const classified = classifyBadges(badges);
        renderClassification(classified);

        const arcadeGameCount = classified.arcadeGame.length;
        const skillBadgeCount = classified.skillBadge.length;
        const optionalBonusPoints = Math.max(0, parseInt(document.getElementById('manual-bonus-points')?.value || '0', 10));

        const summary = summarizeScores({ arcadeGameCount, skillBadgeCount, optionalBonusPoints });
        renderSummary(summary, arcadeGameCount, skillBadgeCount, optionalBonusPoints);

        statusEl.textContent = `Estimated using ${badges.length} extracted badges. Review "Needs Review" badges before relying on totals.`;
        statusEl.style.color = 'var(--google-green)';
      } catch (error) {
        statusEl.textContent = `${error.message} Use the manual calculator below.`;
        statusEl.style.color = 'var(--google-red)';
      } finally {
        runProfileCheckBtn.disabled = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
