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
