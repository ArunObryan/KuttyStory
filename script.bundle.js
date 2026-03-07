/**
 * Kanmani — Bundled script (works with file:// and http://)
 * No ES modules - single file for compatibility
 */

(function () {
  'use strict';

  function initBookPageTurn() {
    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.book-page');
    if (!book || !pages.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const page = entry.target;
          if (entry.isIntersecting) page.classList.remove('turned');
          else page.classList.toggle('turned', entry.boundingClientRect.top < 0);
        });
      },
      { root: book, rootMargin: '0px', threshold: 0 }
    );
    pages.forEach((page) => observer.observe(page));
  }

  function showerHearts() {
    const hearts = ['♥', '💕', '💗', '💖', '💝', '❤'];
    const container = document.createElement('div');
    container.className = 'heart-shower';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
    for (let i = 0; i < 50; i++) {
      const heart = document.createElement('span');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.animationDuration = (3 + Math.random() * 2) + 's';
      heart.style.fontSize = (14 + Math.random() * 20) + 'px';
      heart.style.opacity = 0.6 + Math.random() * 0.4;
      container.appendChild(heart);
    }
    setTimeout(function () { container.remove(); }, 6000);
  }

  function initMusicControls() {
    const audioTop = document.getElementById('bg-music-top');
    const audioEnd = document.getElementById('bg-music-end');
    const toggle = document.getElementById('music-toggle');
    const volumeDown = document.getElementById('volume-down');
    const volumeUp = document.getElementById('volume-up');
    const volumeLevel = document.getElementById('volume-level');
    if (!audioTop || !audioEnd || !toggle) return null;

    var volume = Math.max(0, Math.min(1, parseFloat(localStorage.getItem('kanmaniVolume')) || 0.5));
    var isMuted = true;
    var inLetsTalkSection = false;
    const book = document.getElementById('book');

    function applyVolume() {
      audioTop.volume = volume * 0.4;
      audioEnd.volume = volume * 1;
      var lt = document.getElementById('lets-talk-audio');
      if (lt) lt.volume = volume * 0.8;
      if (volumeLevel) volumeLevel.textContent = Math.round(volume * 100) + '%';
      localStorage.setItem('kanmaniVolume', String(volume));
    }

    function pauseAll() {
      audioTop.pause();
      audioEnd.pause();
    }

    function updateMusicByScroll() {
      if (isMuted || inLetsTalkSection) return;
      var scrollTop = book ? book.scrollTop : window.scrollY;
      var docHeight = book ? book.scrollHeight - book.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (progress < 0.5) {
        audioEnd.pause();
        audioTop.play().catch(function () {});
      } else {
        audioTop.pause();
        audioEnd.play().catch(function () {});
      }
    }

    function startMusic() {
      isMuted = false;
      toggle.classList.remove('muted');
      localStorage.setItem('kanmaniMusicMuted', 'false');
      applyVolume();
      updateMusicByScroll();
    }

    function stopMusic() {
      isMuted = true;
      toggle.classList.add('muted');
      localStorage.setItem('kanmaniMusicMuted', 'true');
      pauseAll();
    }

    applyVolume();
    volumeDown && volumeDown.addEventListener('click', function (e) {
      e.stopPropagation();
      volume = Math.max(0, Math.min(1, volume - 0.1));
      applyVolume();
    });
    volumeUp && volumeUp.addEventListener('click', function (e) {
      e.stopPropagation();
      volume = Math.max(0, Math.min(1, volume + 0.1));
      applyVolume();
    });
    if (book) book.addEventListener('scroll', updateMusicByScroll, { passive: true });
    toggle.addEventListener('click', function () { isMuted ? startMusic() : stopMusic(); });

    if (localStorage.getItem('kanmaniMusicMuted') === 'false') startMusic();
    else stopMusic();

    return {
      getVolume: function () { return volume; },
      startIfMuted: function () {
        if (isMuted) {
          startMusic();
          audioEnd.pause();
          audioTop.currentTime = 0;
          audioTop.play().catch(function () {});
        }
      },
      pauseAll: function () {
        pauseAll();
        var lt = document.getElementById('lets-talk-audio');
        if (lt) lt.pause();
      },
      resume: function () {
        if (isMuted) return;
        applyVolume();
        if (inLetsTalkSection) {
          var lt = document.getElementById('lets-talk-audio');
          if (lt) lt.play().catch(function () {});
        } else updateMusicByScroll();
      },
      setInLetsTalkSection: function (v) {
        inLetsTalkSection = v;
        if (v) pauseAll();
        else updateMusicByScroll();
      }
    };
  }

  function initStoryStart(musicApi) {
    const startBtn = document.getElementById('start-story');
    const page2 = document.querySelector('.page-2');
    if (startBtn && page2) {
      startBtn.addEventListener('click', function () {
        if (musicApi && musicApi.startIfMuted) musicApi.startIfMuted();
        page2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function initGardenWalkers() {
    const walkers = document.querySelector('.walkers');
    const book = document.getElementById('book');
    if (!walkers || !book) return;

    var isWalking = false;
    var walkTimelines = [];

    if (typeof gsap !== 'undefined') {
      var walkerEls = walkers.querySelectorAll('.walker');
      walkerEls.forEach(function (walker, i) {
        var legL = walker.querySelector('.leg-left');
        var legR = walker.querySelector('.leg-right');
        var armL = walker.querySelector('.arm-left');
        var armR = walker.querySelector('.arm-right');
        var body = walker.querySelector('.body-group');
        if (!legL || !legR || !armL || !armR) return;

        var cycle = 0.5;
        var legAngle = 16;
        var armAngle = 24;
        var bobY = 2.5;

        var walkTl = gsap.timeline({ paused: true, repeat: -1 });
        walkTl.to(legL, { rotation: legAngle, duration: cycle / 2, ease: 'power2.inOut' }, 0)
          .to(legR, { rotation: -legAngle, duration: cycle / 2, ease: 'power2.inOut' }, 0)
          .to(armL, { rotation: -armAngle, duration: cycle / 2, ease: 'power2.inOut' }, 0)
          .to(armR, { rotation: armAngle, duration: cycle / 2, ease: 'power2.inOut' }, 0)
          .to(legL, { rotation: -legAngle, duration: cycle / 2, ease: 'power2.inOut' }, cycle / 2)
          .to(legR, { rotation: legAngle, duration: cycle / 2, ease: 'power2.inOut' }, cycle / 2)
          .to(armL, { rotation: armAngle, duration: cycle / 2, ease: 'power2.inOut' }, cycle / 2)
          .to(armR, { rotation: -armAngle, duration: cycle / 2, ease: 'power2.inOut' }, cycle / 2);
        if (body) {
          walkTl.to(body, { y: -bobY, duration: cycle / 2, ease: 'power2.inOut' }, 0)
            .to(body, { y: 0, duration: cycle / 2, ease: 'power2.inOut' }, cycle / 2);
        }
        if (i === 1) walkTl.timeScale(1.08);
        walkTimelines.push(walkTl);
      });
    }

    function setWalking(walking) {
      if (walking === isWalking) return;
      isWalking = walking;
      walkers.classList.toggle('walking', walking);
      if (typeof gsap !== 'undefined') {
        walkTimelines.forEach(function (tl) {
          if (walking) tl.play();
          else {
            tl.pause();
            tl.progress(0);
          }
        });
      }
    }

    function update() {
      var scrollTop = book.scrollTop;
      var docHeight = book.scrollHeight - book.clientHeight;
      var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      var leftPos = 20 + progress * 60;
      walkers.style.left = leftPos + '%';
      walkers.style.transform = 'translateX(-50%)';
      setWalking(scrollTop > 10);
    }

    function tick() {
      update();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    window.addEventListener('resize', update);
  }

  function initLetsTalk(musicApi) {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const popupYes = document.getElementById('popup-yes');
    const popupNo = document.getElementById('popup-no');
    const closeYes = document.getElementById('close-yes');
    const closeNo = document.getElementById('close-no');
    const kanmaniyeAudio = document.getElementById('kanmaniye-audio');
    const popupVideo = document.getElementById('popup-video');
    if (!btnYes || !btnNo || !popupYes || !popupNo) return;

    function closeYesPopup() {
      popupYes.classList.remove('show');
      if (kanmaniyeAudio) kanmaniyeAudio.pause();
      if (musicApi && musicApi.resume) musicApi.resume();
    }
    function closeNoPopup() {
      popupNo.classList.remove('show');
      if (popupVideo) popupVideo.pause();
      if (musicApi && musicApi.resume) musicApi.resume();
    }

    btnYes.addEventListener('click', function () {
      showerHearts();
      if (musicApi && musicApi.pauseAll) musicApi.pauseAll();
      if (kanmaniyeAudio) {
        kanmaniyeAudio.currentTime = 0;
        kanmaniyeAudio.play().catch(function () {});
      }
      var imageWrap = popupYes.querySelector('.popup-image-wrap');
      if (imageWrap) imageWrap.classList.remove('popped');
      popupYes.classList.add('show');
      requestAnimationFrame(function () { if (imageWrap) imageWrap.classList.add('popped'); });
    });
    btnNo.addEventListener('click', function () {
      if (musicApi && musicApi.pauseAll) musicApi.pauseAll();
      popupNo.classList.add('show');
      if (popupVideo) {
        popupVideo.currentTime = 0;
        popupVideo.play().catch(function () {});
      }
    });
    closeYes && closeYes.addEventListener('click', closeYesPopup);
    popupYes.addEventListener('click', function (e) { if (e.target === popupYes) closeYesPopup(); });
    closeNo && closeNo.addEventListener('click', closeNoPopup);
    popupNo.addEventListener('click', function (e) { if (e.target === popupNo) closeNoPopup(); });
  }

  function initLetsTalkAudio(musicApi) {
    const letsTalkSection = document.getElementById('lets-talk');
    const letsTalkAudio = document.getElementById('lets-talk-audio');
    if (!letsTalkSection || !letsTalkAudio) return;
    const book = document.getElementById('book');
    var volumeTimer = null;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (musicApi && musicApi.setInLetsTalkSection) musicApi.setInLetsTalkSection(true);
            var isMuted = document.getElementById('music-toggle') && document.getElementById('music-toggle').classList.contains('muted');
            if (!isMuted) {
              var vol = musicApi && musicApi.getVolume ? musicApi.getVolume() : 0.5;
              letsTalkAudio.currentTime = 0;
              letsTalkAudio.volume = vol * 0.5;
              letsTalkAudio.play().catch(function () {});
              if (volumeTimer) clearTimeout(volumeTimer);
              volumeTimer = setTimeout(function () {
                var v = musicApi && musicApi.getVolume ? musicApi.getVolume() : 0.5;
                letsTalkAudio.volume = v * 0.8;
              }, 2000);
            }
          } else {
            if (musicApi && musicApi.setInLetsTalkSection) musicApi.setInLetsTalkSection(false);
            letsTalkAudio.pause();
            if (volumeTimer) { clearTimeout(volumeTimer); volumeTimer = null; }
          }
        });
      },
      { root: book || null, threshold: 0.3 }
    );
    observer.observe(letsTalkSection);
  }

  function init() {
    var musicApi = initMusicControls();
    initBookPageTurn();
    initStoryStart(musicApi);
    initGardenWalkers();
    initLetsTalk(musicApi);
    initLetsTalkAudio(musicApi);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
