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
  const toggle = document.getElementById('music-toggle');
  const volumeDown = document.getElementById('volume-down');
  const volumeUp = document.getElementById('volume-up');
  const volumeLevel = document.getElementById('volume-level');

  if (!audioTop || !audioEnd || !toggle) return null;

  let volume = clampVolume(parseFloat(localStorage.getItem(STORAGE_KEYS.volume)) || 0.5);
  let isMuted = true;
  let inLetsTalkSection = false;

  const book = document.getElementById('book');

  const applyVolume = () => {
    audioTop.volume = volume * 0.4;
    audioEnd.volume = volume * 1;
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
  };

  const pauseLetsTalkAudio = () => {
    const lt = document.getElementById('lets-talk-audio');
    if (lt) lt.pause();
  };

  const updateMusicByScroll = () => {
    if (isMuted || inLetsTalkSection) return;

    const scrollTop = book ? book.scrollTop : window.scrollY;
    const docHeight = book
      ? book.scrollHeight - book.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progress < 0.5) {
      audioEnd.pause();
      audioTop.play().catch(() => {});
    } else {
      audioTop.pause();
      audioEnd.play().catch(() => {});
    }
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
      applyVolume();
      if (inLetsTalkSection) {
        const lt = document.getElementById('lets-talk-audio');
        if (lt) lt.play().catch(() => {});
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
