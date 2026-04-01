/**
 * Kanmani Website - Test Fixtures & Utilities
 * Shared test helpers, fixtures, and common functions
 */
import { test as base, expect, Page } from '@playwright/test';

/**
 * Navigate to a specific page number using the navigation buttons
 * @param page - Playwright page object
 * @param pageNumber - Target page number (1-indexed)
 */
export async function navigateToPage(page: Page, pageNumber: number): Promise<void> {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

/**
 * Enable music by clicking the music toggle
 * @param page - Playwright page object
 */
export async function enableMusic(page: Page): Promise<void> {
  const musicToggle = page.locator('#music-toggle');
  const isMuted = await musicToggle.evaluate((el) => el.classList.contains('muted'));
  
  if (isMuted) {
    await musicToggle.click();
  }
}

/**
 * Disable music by clicking the music toggle
 * @param page - Playwright page object
 */
export async function disableMusic(page: Page): Promise<void> {
  const musicToggle = page.locator('#music-toggle');
  const isMuted = await musicToggle.evaluate((el) => el.classList.contains('muted'));
  
  if (!isMuted) {
    await musicToggle.click();
  }
}

/**
 * Set volume to a specific level
 * @param page - Playwright page object
 * @param targetVolume - Target volume (0-100)
 */
export async function setVolume(page: Page, targetVolume: number): Promise<void> {
  const musicControls = page.locator('#music-controls');
  await musicControls.hover();
  
  const volumeLevel = page.locator('#volume-level');
  const volumeUp = page.locator('#volume-up');
  const volumeDown = page.locator('#volume-down');
  
  // Get current volume
  const currentVolumeText = await volumeLevel.textContent();
  const currentVolume = parseInt(currentVolumeText?.replace('%', '') || '50');
  
  const diff = targetVolume - currentVolume;
  const clicks = Math.abs(diff / 10);
  
  for (let i = 0; i < clicks; i++) {
    if (diff > 0) {
      await volumeUp.click();
    } else {
      await volumeDown.click();
    }
  }
}

/**
 * Open popup by clicking Yes button
 * @param page - Playwright page object
 */
export async function openYesPopup(page: Page): Promise<void> {
  await navigateToPage(page, 10);
  await page.locator('#btn-yes').click();
}

/**
 * Open popup by clicking No button
 * @param page - Playwright page object
 */
export async function openNoPopup(page: Page): Promise<void> {
  await navigateToPage(page, 10);
  await page.locator('#btn-no').click();
}

/**
 * Close any open popup
 * @param page - Playwright page object
 */
export async function closeAllPopups(page: Page): Promise<void> {
  const popups = ['#popup-yes', '#popup-no', '#popup-park-bench'];
  
  for (const selector of popups) {
    const popup = page.locator(selector);
    const isVisible = await popup.evaluate((el) => el.classList.contains('show'));
    
    if (isVisible) {
      const closeBtn = popup.locator('.popup-close');
      await closeBtn.click();
    }
  }
}

/**
 * Navigate to story card by index
 * @param page - Playwright page object
 * @param index - Card index (0-indexed)
 */
export async function goToStoryCard(page: Page, index: number): Promise<void> {
  const dot = page.locator(`.story-cards-dot[data-index="${index}"]`);
  await dot.click();
}

/**
 * Wait for page turn animation to complete
 * @param page - Playwright page object
 */
export async function waitForPageTurn(page: Page): Promise<void> {
  await page.waitForTimeout(1200);
}

/**
 * Check if an element is in viewport
 * @param page - Playwright page object
 * @param selector - CSS selector
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.locator(selector).isVisible();
}

/**
 * Get current page number from indicator
 * @param page - Playwright page object
 */
export async function getCurrentPageNumber(page: Page): Promise<number> {
  const indicator = await page.locator('#nav-indicator').textContent();
  const match = indicator?.match(/(\d+)\s*\/\s*\d+/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Custom test fixture with common setup
 */
export const test = base.extend<{
  navigateTo: (pageNumber: number) => Promise<void>;
}>({
  navigateTo: async ({ page }, use) => {
    const navigate = async (pageNumber: number) => {
      await navigateToPage(page, pageNumber);
    };
    await use(navigate);
  },
});

export { expect };
