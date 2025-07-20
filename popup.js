function loadRevisions() {
  chrome.storage.local.get(['revisions'], (data) => {
    const list = data.revisions || [];
    const container = document.getElementById('revision-list');
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = '<p>No problems marked for revision yet.</p>';
      return;
    }

    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = document.createElement('div');
      title.className = 'card-title';
      title.innerText = item.title;

      const meta = document.createElement('div');
      meta.className = 'card-meta';
      const next = item.nextReview || "N/A";
      meta.innerHTML = `📅 Next Review: <b>${next}</b>`;

      const stage = document.createElement('div');
      stage.className = 'card-meta';
      stage.innerText = `🔁 Stage: S${(item.reviewCount || 0) + 1}`;

      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.innerText = '🔗 Open Problem';

      const reviewBtn = document.createElement('button');
      reviewBtn.className = 'review-btn';
      reviewBtn.innerText = item.reviewed ? '✅ Reviewed' : 'Mark as Reviewed';
      reviewBtn.disabled = item.reviewed;

      reviewBtn.addEventListener('click', () => {
        const updatedCount = (item.reviewCount || 0) + 1;
        const nextDate = calculateNextReviewDate(updatedCount);

        list[index].reviewed = true;
        list[index].reviewCount = updatedCount;
        list[index].nextReview = nextDate;

        chrome.storage.local.set({ revisions: list }, loadRevisions);
      });

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(stage);
      card.appendChild(link);
      card.appendChild(reviewBtn);
      container.appendChild(card);
    });
  });
}

function calculateNextReviewDate(stage) {
  const intervals = [1, 3, 7, 14, 30]; // days
  const days = intervals[Math.min(stage, intervals.length - 1)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', loadRevisions);
