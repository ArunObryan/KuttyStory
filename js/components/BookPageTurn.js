/**
 * BookPageTurn — 3D page-turn effect on scroll
 */

export function initBookPageTurn() {
  const book = document.getElementById('book');
  const pages = document.querySelectorAll('.book-page');
  if (!book || !pages.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const page = entry.target;
        if (entry.isIntersecting) {
          page.classList.remove('turned');
        } else {
          page.classList.toggle('turned', entry.boundingClientRect.top < 0);
        }
      });
    },
    { root: book, rootMargin: '0px', threshold: 0 }
  );

  pages.forEach((page) => observer.observe(page));
}
