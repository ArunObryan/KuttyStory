/**
 * Kanmani — Interactive Storytelling
 * Main entry point
 */

import { initBookPageTurn } from './components/BookPageTurn.js';
import { initStoryStart } from './components/StoryStart.js';
import { initMusicControls } from './components/MusicControls.js';
import { initLetsTalk } from './components/LetsTalk.js';
import { initLetsTalkAudio } from './components/LetsTalkAudio.js';
import { initImagePopups } from './components/ImagePopup.js';
import { initStoryCards } from './components/StoryCards.js';

document.addEventListener('DOMContentLoaded', () => {
  const musicApi = initMusicControls();
  const bookApi = initBookPageTurn();

  initStoryStart(musicApi, bookApi);
  initLetsTalk(musicApi);
  initLetsTalkAudio(musicApi);
  initImagePopups();
  initStoryCards();

  // Initialize page navigation
  initPageNav(bookApi);
});

// Page navigation buttons
function initPageNav(bookApi) {
  const navPrev = document.getElementById('nav-prev');
  const navNext = document.getElementById('nav-next');
  const navIndicator = document.getElementById('nav-indicator');

  if (!navPrev || !navNext || !navIndicator || !bookApi) return;

  const updateIndicator = (current, total) => {
    navIndicator.textContent = `${current + 1} / ${total}`;
    navPrev.disabled = current === 0;
    navNext.disabled = current === total - 1;
  };

  // Initial state
  updateIndicator(bookApi.getCurrentPage(), bookApi.getTotalPages());

  // Listen for page changes
  bookApi.onPageChange(updateIndicator);

  // Button clicks
  navPrev.addEventListener('click', () => bookApi.goToPrev());
  navNext.addEventListener('click', () => bookApi.goToNext());
}
