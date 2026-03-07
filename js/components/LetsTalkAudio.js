/**
 * LetsTalkAudio — Section-specific audio when Let's Talk is in view
 */

export function initLetsTalkAudio(musicApi) {
  const letsTalkSection = document.getElementById('lets-talk');
  const letsTalkAudio = document.getElementById('lets-talk-audio');

  if (!letsTalkSection || !letsTalkAudio) return;

  const book = document.getElementById('book');
  let volumeTimer = null;

  const getVolume = () => musicApi?.getVolume?.() ?? 0.5;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          musicApi?.setInLetsTalkSection?.(true);
          const isMuted = document.getElementById('music-toggle')?.classList.contains('muted');
          if (!isMuted) {
            const vol = getVolume();
            letsTalkAudio.currentTime = 0;
            letsTalkAudio.volume = vol * 0.5;
            letsTalkAudio.play().catch(() => {});

            if (volumeTimer) clearTimeout(volumeTimer);
            volumeTimer = setTimeout(() => {
              letsTalkAudio.volume = getVolume() * 0.8;
            }, 2000);
          }
        } else {
          musicApi?.setInLetsTalkSection?.(false);
          letsTalkAudio.pause();
          if (volumeTimer) {
            clearTimeout(volumeTimer);
            volumeTimer = null;
          }
        }
      });
    },
    { root: book || null, threshold: 0.3 }
  );

  observer.observe(letsTalkSection);
}
