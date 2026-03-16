/**
 * MusicControls — Background music, volume, mute toggle
 */

const VOLUME_STEP = 0.1;
const MIN_VOLUME = 0;
const MAX_VOLUME = 1;
const STORAGE_KEYS = {
  muted: 'kanmaniMusicMuted',
  volume: 'kanmaniVolume',
};

export function initMusicControls() {
  const audioTop = document.getElementById('bg-music-top');
  const audioEnd = document.getElementById('bg-music-end');
  const chapterTwoAudio = document.getElementById('chapter-two-audio');
  const chapterThreeAudio = document.getElementById('chapter-three-audio');
  const chapterFiveAudio = document.getElementById('chapter-five-audio');
  const chapterSevenAudio = document.getElementById('chapter-seven-audio');
  const toggle = document.getElementById('music-toggle');
  const volumeDown = document.getElementById('volume-down');
  const volumeUp = document.getElementById('volume-up');
  const volumeLevel = document.getElementById('volume-level');

  if (!audioTop || !audioEnd || !toggle) return null;

  let volume = clampVolume(parseFloat(localStorage.getItem(STORAGE_KEYS.volume)) || 0.5);
  let isMuted = true;
  let inLetsTalkSection = false;
  let inChapterTwo = false;
  let inChapterThree = false;
  let inChapterFour = false;
  let inChapterFive = false;
  let inChapterSix = false;
  let inChapterSeven = false;
  let chapterFourVideoPlaying = false;

  const book = document.getElementById('book');

  const applyVolume = () => {
    audioTop.volume = volume * 0.4;
    audioEnd.volume = volume * 1;
    if (chapterTwoAudio) chapterTwoAudio.volume = volume * 0.35;
    if (chapterThreeAudio) chapterThreeAudio.volume = volume * 0.30;
    if (chapterFiveAudio) chapterFiveAudio.volume = volume * 0.35;
    if (chapterSevenAudio) chapterSevenAudio.volume = volume * 0.5;
    const lt = document.getElementById('lets-talk-audio');
    if (lt) lt.volume = volume * 0.8;
    if (volumeLevel) volumeLevel.textContent = `${Math.round(volume * 100)}%`;
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  };

  const setVolume = (v) => {
    volume = clampVolume(v);
    applyVolume();
  };

  const pauseAll = () => {
    audioTop.pause();
    audioEnd.pause();
    if (chapterTwoAudio) chapterTwoAudio.pause();
    if (chapterThreeAudio) chapterThreeAudio.pause();
    if (chapterFiveAudio) chapterFiveAudio.pause();
    if (chapterSevenAudio) chapterSevenAudio.pause();
  };

  const pauseLetsTalkAudio = () => {
    const lt = document.getElementById('lets-talk-audio');
    if (lt) lt.pause();
    if (chapterTwoAudio) chapterTwoAudio.pause();
    if (chapterThreeAudio) chapterThreeAudio.pause();
    if (chapterFiveAudio) chapterFiveAudio.pause();
    if (chapterSevenAudio) chapterSevenAudio.pause();
  };

  const updateMusicByScroll = () => {
    if (isMuted || inLetsTalkSection) return;

    // Chapter Six (page 7) is silent - no music
    if (inChapterSix) {
      pauseAll();
      return;
    }

    // Check if we're on Chapter Seven (page 8)
    if (inChapterSeven) {
      audioTop.pause();
      audioEnd.pause();
      if (chapterTwoAudio) chapterTwoAudio.pause();
      if (chapterThreeAudio) chapterThreeAudio.pause();
      if (chapterFiveAudio) chapterFiveAudio.pause();
      if (chapterSevenAudio) chapterSevenAudio.play().catch(() => {});
      return;
    }

    // If Chapter Four video is playing, don't play background music
    if (chapterFourVideoPlaying) {
      audioTop.pause();
      audioEnd.pause();
      if (chapterTwoAudio) chapterTwoAudio.pause();
      if (chapterThreeAudio) chapterThreeAudio.pause();
      if (chapterFiveAudio) chapterFiveAudio.pause();
      if (chapterSevenAudio) chapterSevenAudio.pause();
      return;
    }

    // Check if we're on Chapter Two (page 3)
    if (inChapterTwo) {
      audioTop.pause();
      audioEnd.pause();
      if (chapterThreeAudio) chapterThreeAudio.pause();
      if (chapterFiveAudio) chapterFiveAudio.pause();
      if (chapterSevenAudio) chapterSevenAudio.pause();
      if (chapterTwoAudio) chapterTwoAudio.play().catch(() => {});
      return;
    }

    // Check if we're on Chapter Three (page 4)
    if (inChapterThree) {
      audioTop.pause();
      audioEnd.pause();
      if (chapterTwoAudio) chapterTwoAudio.pause();
      if (chapterFiveAudio) chapterFiveAudio.pause();
      if (chapterSevenAudio) chapterSevenAudio.pause();
      if (chapterThreeAudio) chapterThreeAudio.play().catch(() => {});
      return;
    }

    // Check if we're on Chapter Five (page 6)
    if (inChapterFive) {
      audioTop.pause();
      audioEnd.pause();
      if (chapterTwoAudio) chapterTwoAudio.pause();
      if (chapterThreeAudio) chapterThreeAudio.pause();
      if (chapterSevenAudio) chapterSevenAudio.pause();
      if (chapterFiveAudio) chapterFiveAudio.play().catch(() => {});
      return;
    }

    // EnnaSollaPogirai plays only on page 12 (Let's Talk) via lets-talk-audio
    // Munbe_Vaa plays for all other pages
    audioEnd.pause();
    if (chapterTwoAudio) chapterTwoAudio.pause();
    if (chapterThreeAudio) chapterThreeAudio.pause();
    if (chapterFiveAudio) chapterFiveAudio.pause();
    if (chapterSevenAudio) chapterSevenAudio.pause();
    audioTop.play().catch(() => {});
  };

  const startMusic = () => {
    isMuted = false;
    toggle.classList.remove('muted');
    localStorage.setItem(STORAGE_KEYS.muted, 'false');
    applyVolume();
    updateMusicByScroll();
  };

  const stopMusic = () => {
    isMuted = true;
    toggle.classList.add('muted');
    localStorage.setItem(STORAGE_KEYS.muted, 'true');
    pauseAll();
  };

  applyVolume();

  volumeDown?.addEventListener('click', (e) => {
    e.stopPropagation();
    setVolume(volume - VOLUME_STEP);
  });
  volumeUp?.addEventListener('click', (e) => {
    e.stopPropagation();
    setVolume(volume + VOLUME_STEP);
  });

  if (book) {
    book.addEventListener('scroll', updateMusicByScroll, { passive: true });

    // Observe Chapter Two (page 3) to trigger Poopol_Poopol.mp3
    const chapterTwoPage = document.querySelector('.book-page[data-page="3"]');
    if (chapterTwoPage) {
      const chapterTwoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inChapterTwo = entry.isIntersecting && entry.intersectionRatio > 0.5;
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterTwoObserver.observe(chapterTwoPage);
    }

    // Observe Chapter Three (page 4) to trigger Ore_Nyabagam.mp3
    const chapterThreePage = document.querySelector('.book-page[data-page="4"]');
    if (chapterThreePage) {
      const chapterThreeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inChapterThree = entry.isIntersecting && entry.intersectionRatio > 0.5;
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterThreeObserver.observe(chapterThreePage);
    }

    // Observe Chapter Five (page 6) to trigger Vaayamoodi.mp3
    const chapterFivePage = document.querySelector('.book-page[data-page="6"]');
    if (chapterFivePage) {
      const chapterFiveObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inChapterFive = entry.isIntersecting && entry.intersectionRatio > 0.5;
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterFiveObserver.observe(chapterFivePage);
    }

    // Observe Chapter Six (page 7) - silent page, no music
    const chapterSixPage = document.querySelector('.book-page[data-page="7"]');
    if (chapterSixPage) {
      const chapterSixObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inChapterSix = entry.isIntersecting && entry.intersectionRatio > 0.5;
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterSixObserver.observe(chapterSixPage);
    }

    // Observe Chapter Seven (page 8) to trigger YeTuneKyaKiya.mp3
    const chapterSevenPage = document.querySelector('.book-page[data-page="8"]');
    if (chapterSevenPage) {
      const chapterSevenObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inChapterSeven = entry.isIntersecting && entry.intersectionRatio > 0.5;
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterSevenObserver.observe(chapterSevenPage);
    }

    // Observe Chapter Four (page 5) for video pause/resume
    const chapterFourPage = document.querySelector('.book-page[data-page="5"]');
    const chapterFourVideo = chapterFourPage?.querySelector('video');
    if (chapterFourPage && chapterFourVideo) {
      // Track if video was playing before leaving the page
      let videoWasPlaying = false;

      // Listen for video play/pause to control background music
      chapterFourVideo.addEventListener('play', () => {
        chapterFourVideoPlaying = true;
        updateMusicByScroll();
      });
      chapterFourVideo.addEventListener('pause', () => {
        chapterFourVideoPlaying = false;
        updateMusicByScroll();
      });
      chapterFourVideo.addEventListener('ended', () => {
        chapterFourVideoPlaying = false;
        updateMusicByScroll();
      });

      const chapterFourObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const wasInChapterFour = inChapterFour;
            inChapterFour = entry.isIntersecting && entry.intersectionRatio > 0.5;
            
            // Navigating away from Chapter Four - pause video
            if (wasInChapterFour && !inChapterFour) {
              videoWasPlaying = !chapterFourVideo.paused;
              chapterFourVideo.pause();
              chapterFourVideoPlaying = false;
            }
            // Coming back to Chapter Four - resume video if it was playing
            if (!wasInChapterFour && inChapterFour && videoWasPlaying) {
              chapterFourVideo.play().catch(() => {});
            }
            updateMusicByScroll();
          });
        },
        { root: book, threshold: 0.5 }
      );
      chapterFourObserver.observe(chapterFourPage);
    }
  }
  toggle.addEventListener('click', () => (isMuted ? startMusic() : stopMusic()));

  const savedMuted = localStorage.getItem(STORAGE_KEYS.muted);
  if (savedMuted === 'false') startMusic();
  else stopMusic();

  return {
    getVolume: () => volume,
    startIfMuted: () => {
      if (isMuted) {
        startMusic();
        audioEnd.pause();
        audioTop.currentTime = 0;
        audioTop.play().catch(() => {});
      }
    },
    pauseAll: () => {
      pauseAll();
      pauseLetsTalkAudio();
    },
    resume: () => {
      if (isMuted) return;
      if (inChapterSix) return; // Chapter Six is silent
      applyVolume();
      if (inLetsTalkSection) {
        const lt = document.getElementById('lets-talk-audio');
        if (lt) lt.play().catch(() => {});
      } else if (inChapterTwo) {
        if (chapterTwoAudio) chapterTwoAudio.play().catch(() => {});
      } else if (inChapterThree) {
        if (chapterThreeAudio) chapterThreeAudio.play().catch(() => {});
      } else if (inChapterFive) {
        if (chapterFiveAudio) chapterFiveAudio.play().catch(() => {});
      } else if (inChapterSeven) {
        if (chapterSevenAudio) chapterSevenAudio.play().catch(() => {});
      } else {
        updateMusicByScroll();
      }
    },
    setInLetsTalkSection: (value) => {
      inLetsTalkSection = value;
      if (value) pauseAll();
      else updateMusicByScroll();
    },
  };
}

function clampVolume(v) {
  return Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, v));
}
