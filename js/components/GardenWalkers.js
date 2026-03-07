/**
 * GardenWalkers — Boy & girl walk with GSAP when user scrolls
 */

import gsap from 'gsap';

export function initGardenWalkers() {
  const walkers = document.querySelector('.walkers');
  const book = document.getElementById('book');
  if (!walkers || !book) return;

  let isWalking = false;
  const walkTimelines = [];

  {
    const walkerEls = walkers.querySelectorAll('.walker');
    walkerEls.forEach((walker, i) => {
      const legL = walker.querySelector('.leg-left');
      const legR = walker.querySelector('.leg-right');
      const armL = walker.querySelector('.arm-left');
      const armR = walker.querySelector('.arm-right');
      const body = walker.querySelector('.body-group');
      if (!legL || !legR || !armL || !armR) return;

      const cycle = 0.5;
      const legAngle = 16;
      const armAngle = 24;
      const bobY = 2.5;

      const walkTl = gsap.timeline({ paused: true, repeat: -1 });
      walkTl
        .to(legL, { rotation: legAngle, duration: cycle / 2, ease: 'power2.inOut' }, 0)
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

  const setWalking = (walking) => {
    if (walking === isWalking) return;
    isWalking = walking;
    walkers.classList.toggle('walking', walking);
    walkTimelines.forEach((tl) => {
      walking ? tl.play() : (tl.pause(), tl.progress(0));
    });
  };

  const updateWalkerPosition = () => {
    const scrollTop = book.scrollTop;
    const docHeight = book.scrollHeight - book.clientHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const leftPos = 20 + progress * 60;

    walkers.style.left = `${leftPos}%`;
    walkers.style.transform = 'translateX(-50%)';
    setWalking(scrollTop > 10);
  };

  const tick = () => {
    updateWalkerPosition();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  window.addEventListener('resize', updateWalkerPosition);
}
