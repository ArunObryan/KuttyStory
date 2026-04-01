/**
 * LetsTalk — Yes/No buttons, popups, heart shower
 */

import { showerHearts } from './HeartShower.js';

export function initLetsTalk(musicApi) {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const popupYes = document.getElementById('popup-yes');
  const popupNo = document.getElementById('popup-no');
  const closeYes = document.getElementById('close-yes');
  const closeNo = document.getElementById('close-no');
  const kanmaniyeAudio = document.getElementById('kanmaniye-audio');
  const popupVideo = document.getElementById('popup-video');
  const popupYesVideo = document.getElementById('popup-yes-video');

  if (!btnYes || !btnNo || !popupYes || !popupNo) return;

  const pauseMusic = () => musicApi?.pauseAll?.();
  const resumeMusic = () => musicApi?.resume?.();

  const showYesPopup = () => {
    showerHearts();
    pauseMusic();
    const videoWrap = popupYes.querySelector('.popup-video-wrap');
    if (videoWrap) videoWrap.classList.remove('popped');
    popupYes.classList.add('show');
    requestAnimationFrame(() => videoWrap?.classList.add('popped'));
    if (popupYesVideo) {
      popupYesVideo.currentTime = 0;
      popupYesVideo.play().catch(() => {});
    }
  };

  const showNoPopup = () => {
    pauseMusic();
    popupNo.classList.add('show');
    if (popupVideo) {
      popupVideo.currentTime = 0;
      popupVideo.play().catch(() => {});
    }
  };

  const closeYesPopup = () => {
    popupYes.classList.remove('show');
    popupYesVideo?.pause();
    resumeMusic();
  };

  const closeNoPopup = () => {
    popupNo.classList.remove('show');
    popupVideo?.pause();
    resumeMusic();
  };

  btnYes.addEventListener('click', showYesPopup);
  btnNo.addEventListener('click', showNoPopup);

  closeYes?.addEventListener('click', closeYesPopup);
  popupYes.addEventListener('click', (e) => e.target === popupYes && closeYesPopup());

  closeNo?.addEventListener('click', closeNoPopup);
  popupNo.addEventListener('click', (e) => e.target === popupNo && closeNoPopup());
}
