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

  if (!btnYes || !btnNo || !popupYes || !popupNo) return;

  const pauseMusic = () => musicApi?.pauseAll?.();
  const resumeMusic = () => musicApi?.resume?.();

  const showYesPopup = () => {
    showerHearts();
    pauseMusic();
    if (kanmaniyeAudio) {
      kanmaniyeAudio.currentTime = 0;
      kanmaniyeAudio.play().catch(() => {});
    }
    const imageWrap = popupYes.querySelector('.popup-image-wrap');
    if (imageWrap) imageWrap.classList.remove('popped');
    popupYes.classList.add('show');
    requestAnimationFrame(() => imageWrap?.classList.add('popped'));
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
    kanmaniyeAudio?.pause();
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
