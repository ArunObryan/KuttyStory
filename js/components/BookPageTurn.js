/**
 * BookPageTurn — 3D page-turn effect with smooth 1s animation
 * Intercepts scroll/wheel to play animation before page change
 */

export function initBookPageTurn() {
  const book = document.getElementById('book');
  const pages = document.querySelectorAll('.book-page');
  if (!book || !pages.length) return;

  let currentPageIndex = 0;
  let isAnimating = false;
  const ANIMATION_DURATION = 1000;
  const pageHeight = window.innerHeight;

  // Prevent default scroll, handle animation manually
  function handleWheel(e) {
    if (isAnimating) {
      e.preventDefault();
      return;
    }

    const direction = e.deltaY > 0 ? 1 : -1; // 1 = down/next, -1 = up/prev
    const nextIndex = currentPageIndex + direction;

    // Bounds check
    if (nextIndex < 0 || nextIndex >= pages.length) {
      return;
    }

    e.preventDefault();
    isAnimating = true;

    if (direction === 1) {
      // Scrolling down - turn current page forward
      turnPageForward(currentPageIndex, nextIndex);
    } else {
      // Scrolling up - turn previous page back
      turnPageBackward(currentPageIndex, nextIndex);
    }
  }

  function turnPageForward(fromIndex, toIndex) {
    const currentPage = pages[fromIndex];
    
    // Start turn animation
    currentPage.classList.add('turning');
    
    // After half animation, mark as turned and scroll
    setTimeout(() => {
      currentPage.classList.remove('turning');
      currentPage.classList.add('turned');
      
      // Smooth scroll to next page
      book.scrollTo({
        top: toIndex * pageHeight,
        behavior: 'instant'
      });
      
      currentPageIndex = toIndex;
    }, ANIMATION_DURATION / 2);

    // Animation complete
    setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  function turnPageBackward(fromIndex, toIndex) {
    const prevPage = pages[toIndex]; // The page we're going back to
    
    // Remove turned state and start turn-back animation
    prevPage.classList.remove('turned');
    prevPage.classList.add('turning-back');
    
    // Scroll to previous page immediately
    book.scrollTo({
      top: toIndex * pageHeight,
      behavior: 'instant'
    });
    
    currentPageIndex = toIndex;

    // Animation complete
    setTimeout(() => {
      prevPage.classList.remove('turning-back');
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  // Touch handling for mobile
  let touchStartY = 0;
  let touchEndY = 0;

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (isAnimating) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (isAnimating) return;

    touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) < threshold) return;

    const direction = diff > 0 ? 1 : -1; // 1 = swipe up/next, -1 = swipe down/prev
    const nextIndex = currentPageIndex + direction;

    // Bounds check
    if (nextIndex < 0 || nextIndex >= pages.length) {
      return;
    }

    isAnimating = true;

    if (direction === 1) {
      turnPageForward(currentPageIndex, nextIndex);
    } else {
      turnPageBackward(currentPageIndex, nextIndex);
    }
  }

  // Event listeners
  book.addEventListener('wheel', handleWheel, { passive: false });
  book.addEventListener('touchstart', handleTouchStart, { passive: true });
  book.addEventListener('touchmove', handleTouchMove, { passive: false });
  book.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Disable scroll-snap during our controlled navigation
  book.style.scrollSnapType = 'none';

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      const nextIndex = currentPageIndex + 1;
      if (nextIndex < pages.length) {
        isAnimating = true;
        turnPageForward(currentPageIndex, nextIndex);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      const prevIndex = currentPageIndex - 1;
      if (prevIndex >= 0) {
        isAnimating = true;
        turnPageBackward(currentPageIndex, prevIndex);
      }
    }
  });
}
