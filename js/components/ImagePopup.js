/**
 * ImagePopup — Click-to-view image teasers
 * Shows alt text + "Click to view" until clicked, then opens image in popup
 */

export function initImagePopups() {
  document.querySelectorAll('.image-teaser[data-popup]').forEach((teaser) => {
    const popupId = teaser.getAttribute('data-popup');
    const popup = document.getElementById(popupId);
    const closeBtn = popup?.querySelector('.popup-close');

    if (!popup) return;

    const openPopup = () => {
      const imageWrap = popup.querySelector('.popup-image-wrap');
      if (imageWrap) imageWrap.classList.add('popped');
      popup.classList.add('show');
    };

    const closePopup = () => {
      popup.classList.remove('show');
      const imageWrap = popup.querySelector('.popup-image-wrap');
      if (imageWrap) imageWrap.classList.remove('popped');
    };

    teaser.addEventListener('click', openPopup);
    closeBtn?.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => e.target === popup && closePopup());
  });
}
