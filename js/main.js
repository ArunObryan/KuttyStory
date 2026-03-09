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

document.addEventListener('DOMContentLoaded', () => {
  const musicApi = initMusicControls();

  initBookPageTurn();
  initStoryStart(musicApi);
  initLetsTalk(musicApi);
  initLetsTalkAudio(musicApi);
  initImagePopups();
});
