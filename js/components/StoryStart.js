/**
 * StoryStart — Begin the Story button scrolls to first page and starts music
 */

export function initStoryStart(musicApi) {
  const startBtn = document.getElementById('start-story');
  const page2 = document.querySelector('.page-2');

  if (startBtn && page2) {
    startBtn.addEventListener('click', () => {
      musicApi?.startIfMuted?.();
      page2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
