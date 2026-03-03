/**
 * Kanmani — Interactive Storytelling
 * Handles scroll animations, story start, background music, and media interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStoryStart();
  initScrollAnimations();
  initBackgroundMusic();
});

function initBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');

  if (!audio || !toggle) return;

  // Restore user preference (default: muted to respect autoplay policies)
  const savedMuted = localStorage.getItem('kanmaniMusicMuted');
  const startMuted = savedMuted !== 'false'; // 'false' = was playing

  if (startMuted) {
    audio.pause();
    toggle.classList.add('muted');
  } else {
    toggle.classList.remove('muted');
    // Try to play (may need user interaction first)
    audio.play().catch(() => toggle.classList.add('muted'));
  }

  // Start music on first user interaction (Begin the Story or music toggle)
  const startMusicOnInteraction = () => {
    if (toggle.classList.contains('muted')) {
      audio.play().then(() => {
        toggle.classList.remove('muted');
        localStorage.setItem('kanmaniMusicMuted', 'false');
      }).catch(() => {});
    }
  };

  // Toggle on click
  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('muted')) {
      audio.play().then(() => {
        toggle.classList.remove('muted');
        localStorage.setItem('kanmaniMusicMuted', 'false');
      }).catch(() => {});
    } else {
      audio.pause();
      toggle.classList.add('muted');
      localStorage.setItem('kanmaniMusicMuted', 'true');
    }
  });

  // Also start on "Begin the Story" click
  document.getElementById('start-story')?.addEventListener('click', startMusicOnInteraction);
}

function initStoryStart() {
  const startBtn = document.getElementById('start-story');
  const firstChapter = document.getElementById('chapter-1');

  if (startBtn && firstChapter) {
    startBtn.addEventListener('click', () => {
      firstChapter.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function initScrollAnimations() {
  const chapters = document.querySelectorAll('.chapter');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger when 100px from bottom of viewport
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  chapters.forEach(chapter => observer.observe(chapter));
}
