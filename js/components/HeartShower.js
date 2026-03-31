/**
 * HeartShower — Floating hearts animation
 */

const HEARTS = ['♥', '💕', '💗', '💖', '💝', '❤'];
const HEART_COUNT = 50;
const DURATION_MS = 6000;

export function showerHearts() {
  const container = document.createElement('div');
  container.className = 'heart-shower';
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);

  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('span');
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.style.animationDuration = `${3 + Math.random() * 2}s`;
    heart.style.fontSize = `${14 + Math.random() * 20}px`;
    heart.style.opacity = 0.6 + Math.random() * 0.4;
    container.appendChild(heart);
  }

  setTimeout(() => container.remove(), DURATION_MS);
}

// Continuous heart shower for a specific page
let continuousShowerInterval = null;
let continuousContainer = null;
let heartBedContainer = null;
let showerTimeout = null;

export function startContinuousHearts(targetElement) {
  if (continuousContainer) return; // Already running
  
  // Create container for falling hearts
  continuousContainer = document.createElement('div');
  continuousContainer.className = 'heart-shower-continuous';
  continuousContainer.setAttribute('aria-hidden', 'true');
  targetElement.appendChild(continuousContainer);
  
  // Create container for the heart bed at the bottom
  heartBedContainer = document.createElement('div');
  heartBedContainer.className = 'heart-bed';
  heartBedContainer.setAttribute('aria-hidden', 'true');
  targetElement.appendChild(heartBedContainer);

  const createHeart = () => {
    const heart = document.createElement('span');
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const leftPos = Math.random() * 100;
    heart.style.left = `${leftPos}%`;
    heart.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    heart.style.fontSize = `${12 + Math.random() * 16}px`;
    heart.style.opacity = 0.5 + Math.random() * 0.5;
    continuousContainer.appendChild(heart);
    
    // When heart reaches bottom, add it to the bed
    const animDuration = parseFloat(heart.style.animationDuration) * 1000;
    setTimeout(() => {
      if (heartBedContainer) {
        const bedHeart = document.createElement('span');
        bedHeart.textContent = heart.textContent;
        bedHeart.style.left = `${leftPos}%`;
        bedHeart.style.fontSize = heart.style.fontSize;
        bedHeart.style.bottom = `${Math.random() * 40}px`;
        bedHeart.style.opacity = 0.6 + Math.random() * 0.4;
        bedHeart.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        heartBedContainer.appendChild(bedHeart);
      }
      heart.remove();
    }, animDuration);
  };

  // Create initial burst of hearts
  for (let i = 0; i < 20; i++) {
    setTimeout(createHeart, i * 100);
  }

  // Continue creating hearts for 5 seconds
  continuousShowerInterval = setInterval(createHeart, 150);
  
  // Stop creating new hearts after 5 seconds
  showerTimeout = setTimeout(() => {
    if (continuousShowerInterval) {
      clearInterval(continuousShowerInterval);
      continuousShowerInterval = null;
    }
  }, 5000);
}

export function stopContinuousHearts() {
  if (showerTimeout) {
    clearTimeout(showerTimeout);
    showerTimeout = null;
  }
  if (continuousShowerInterval) {
    clearInterval(continuousShowerInterval);
    continuousShowerInterval = null;
  }
  if (continuousContainer) {
    continuousContainer.remove();
    continuousContainer = null;
  }
  if (heartBedContainer) {
    heartBedContainer.remove();
    heartBedContainer = null;
  }
}
