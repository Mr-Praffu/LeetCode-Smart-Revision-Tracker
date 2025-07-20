// Wait until the DOM is fully loaded
window.addEventListener('load', () => {
  // Check if we are on a LeetCode problem page
  if (!window.location.href.includes('/problems/')) return;

  // Create the button
  const button = document.createElement('button');
  button.innerText = '🔖 Mark for Revision';
  button.style.position = 'fixed';
  button.style.top = '100px';
  button.style.right = '30px';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#FFA500';
  button.style.color = '#000';
  button.style.border = 'none';
  button.style.borderRadius = '6px';
  button.style.zIndex = '9999';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';

  // Add click logic
  button.addEventListener('click', () => {
    const titleEl = document.querySelector('h4') || document.querySelector('h3') || document.title;
    const problemTitle = titleEl.innerText || document.title;
    const timestamp = new Date().toISOString();

    chrome.storage.local.get({ revisions: [] }, (data) => {
      const revisions = data.revisions;
      revisions.push({
        title: problemTitle,
        url: window.location.href,
        markedAt: timestamp,
        nextReview: getFutureDate(1), // review after 1 day
        reviewed: false
      });

      chrome.storage.local.set({ revisions }, () => {
        alert(`✅ "${problemTitle}" marked for revision!`);
      });
    });
  });

  // Inject the button into the DOM
  document.body.appendChild(button);
});

// Helper to get future date as string
function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}
