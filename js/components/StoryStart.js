/**
 * StoryStart — Begin the Story button scrolls to first page and starts music
 */

export function initStoryStart(musicApi, bookApi) {
  const startBtn = document.getElementById('start-story');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      musicApi?.startIfMuted?.();
      // Use bookApi to properly navigate with page turn effect
      if (bookApi?.goToNext) {
        bookApi.goToNext();
      } else {
        // Fallback to scroll if bookApi not available
        const page2 = document.querySelector('.page-2');
        page2?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}
