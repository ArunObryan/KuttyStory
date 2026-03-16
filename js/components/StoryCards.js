/**
 * StoryCards — Swipable story cards carousel
 */

export function initStoryCards() {
  const container = document.getElementById('story-cards');
  if (!container) return;

  const wrapper = container.querySelector('.story-cards-wrapper');
  const cards = container.querySelectorAll('.story-card');
  const dots = container.querySelectorAll('.story-cards-dot');
  
  if (!wrapper || cards.length === 0) return;

  let currentIndex = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const updateSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  // Touch events
  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    wrapper.style.transition = 'none';
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const offset = -currentIndex * 100;
    const percentMove = (diff / container.offsetWidth) * 100;
    wrapper.style.transform = `translateX(calc(${offset}% + ${percentMove}%))`;
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.transition = 'transform 0.4s ease-out';
    
    const diff = currentX - startX;
    const threshold = container.offsetWidth * 0.2;
    
    if (diff > threshold && currentIndex > 0) {
      updateSlide(currentIndex - 1);
    } else if (diff < -threshold && currentIndex < cards.length - 1) {
      updateSlide(currentIndex + 1);
    } else {
      updateSlide(currentIndex);
    }
  });

  // Mouse events for desktop
  wrapper.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    wrapper.style.transition = 'none';
    wrapper.style.cursor = 'grabbing';
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    const offset = -currentIndex * 100;
    const percentMove = (diff / container.offsetWidth) * 100;
    wrapper.style.transform = `translateX(calc(${offset}% + ${percentMove}%))`;
  });

  wrapper.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.transition = 'transform 0.4s ease-out';
    wrapper.style.cursor = 'grab';
    
    const diff = currentX - startX;
    const threshold = container.offsetWidth * 0.2;
    
    if (diff > threshold && currentIndex > 0) {
      updateSlide(currentIndex - 1);
    } else if (diff < -threshold && currentIndex < cards.length - 1) {
      updateSlide(currentIndex + 1);
    } else {
      updateSlide(currentIndex);
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      wrapper.style.transition = 'transform 0.4s ease-out';
      wrapper.style.cursor = 'grab';
      updateSlide(currentIndex);
    }
  });

  // Dot navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      updateSlide(index);
    });
  });

  // Keyboard navigation
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateSlide(currentIndex + 1);
    }
  });

  // Set initial cursor style
  wrapper.style.cursor = 'grab';
}
