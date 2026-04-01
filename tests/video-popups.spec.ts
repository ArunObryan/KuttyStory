/**
 * Kanmani Website - Video & Popup Tests
 * Tests for Yes/No popups, video playback, image popup, and heart shower animation
 */
import { test, expect, Page } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Video & Popup Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Let\'s Talk Page (Page 10)', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Let's Talk page (page 10)
      await navigateToPage(page, 10);
    });

    test('should display Yes and No buttons', async ({ page }) => {
      const yesButton = page.locator('#btn-yes');
      const noButton = page.locator('#btn-no');
      
      await expect(yesButton).toBeVisible();
      await expect(noButton).toBeVisible();
      await expect(yesButton).toHaveText('Yes');
      await expect(noButton).toHaveText('No');
    });

    test('should display talk questions', async ({ page }) => {
      const questions = page.locator('.talk-question');
      await expect(questions).toHaveCount(3);
    });

    test('should have chapter label visible', async ({ page }) => {
      const chapterLabel = page.locator('.page-12 .chapter-label');
      await expect(chapterLabel).toHaveText("What's gonna happen ?");
    });
  });

  test.describe('Yes Popup', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToPage(page, 10);
    });

    test('should be hidden initially', async ({ page }) => {
      const popup = page.locator('#popup-yes');
      await expect(popup).not.toHaveClass(/show/);
    });

    test('should open when clicking Yes button', async ({ page }) => {
      const yesButton = page.locator('#btn-yes');
      const popup = page.locator('#popup-yes');
      
      await yesButton.click();
      await expect(popup).toHaveClass(/show/);
    });

    test('should display popup message', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      const message = page.locator('#popup-yes .popup-message');
      await expect(message).toBeVisible();
      await expect(message).toHaveText('Shall we go on a date?');
    });

    test('should display video in popup', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      const video = page.locator('#popup-yes-video');
      await expect(video).toBeVisible();
    });

    test('should have video with correct source', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      const source = page.locator('#popup-yes-video source');
      await expect(source).toHaveAttribute('src', /Cute_Date\.mp4/);
    });

    test('should have playsinline attribute on video', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      const video = page.locator('#popup-yes-video');
      await expect(video).toHaveAttribute('playsinline', '');
    });

    test('should have close button', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      const closeBtn = page.locator('#close-yes');
      await expect(closeBtn).toBeVisible();
    });

    test('should close when clicking close button', async ({ page }) => {
      const popup = page.locator('#popup-yes');
      
      await page.locator('#btn-yes').click();
      await expect(popup).toHaveClass(/show/);
      
      await page.locator('#close-yes').click();
      await expect(popup).not.toHaveClass(/show/);
    });

    test('should close when clicking overlay background', async ({ page }) => {
      const popup = page.locator('#popup-yes');
      
      await page.locator('#btn-yes').click();
      await expect(popup).toHaveClass(/show/);
      
      // Click on the overlay (not the content)
      await popup.click({ position: { x: 10, y: 10 } });
      await expect(popup).not.toHaveClass(/show/);
    });

    test('should trigger heart shower on Yes click', async ({ page }) => {
      await page.locator('#btn-yes').click();
      
      // Heart shower container should be created
      const heartShower = page.locator('.heart-shower');
      await expect(heartShower).toBeAttached();
    });
  });

  test.describe('No Popup', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToPage(page, 10);
    });

    test('should be hidden initially', async ({ page }) => {
      const popup = page.locator('#popup-no');
      await expect(popup).not.toHaveClass(/show/);
    });

    test('should open when clicking No button', async ({ page }) => {
      const noButton = page.locator('#btn-no');
      const popup = page.locator('#popup-no');
      
      await noButton.click();
      await expect(popup).toHaveClass(/show/);
    });

    test('should display video in popup', async ({ page }) => {
      await page.locator('#btn-no').click();
      
      const video = page.locator('#popup-video');
      await expect(video).toBeVisible();
    });

    test('should have video with correct source', async ({ page }) => {
      await page.locator('#btn-no').click();
      
      const source = page.locator('#popup-video source');
      await expect(source).toHaveAttribute('src', /Thalapathi_BGM\.mp4/);
    });

    test('should have playsinline attribute on video', async ({ page }) => {
      const video = page.locator('#popup-video');
      await expect(video).toHaveAttribute('playsinline', '');
    });

    test('should close when clicking close button', async ({ page }) => {
      const popup = page.locator('#popup-no');
      
      await page.locator('#btn-no').click();
      await expect(popup).toHaveClass(/show/);
      
      await page.locator('#close-no').click();
      await expect(popup).not.toHaveClass(/show/);
    });
  });

  test.describe('Chapter 4 Video (Saami Silai)', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Chapter 4 (page 5)
      await navigateToPage(page, 5);
    });

    test('should have visible video on Chapter 4 page', async ({ page }) => {
      const video = page.locator('.page-5 video');
      await expect(video).toBeVisible();
    });

    test('should have video controls', async ({ page }) => {
      const video = page.locator('.page-5 video');
      await expect(video).toHaveAttribute('controls', '');
    });

    test('should have correct video source', async ({ page }) => {
      const source = page.locator('.page-5 video source');
      await expect(source).toHaveAttribute('src', /Saami_Silai\.mp4/);
    });

    test('should have playsinline attribute', async ({ page }) => {
      const video = page.locator('.page-5 video');
      await expect(video).toHaveAttribute('playsinline', '');
    });

    test('should have video caption', async ({ page }) => {
      const caption = page.locator('.page-5 .video-caption');
      await expect(caption).toBeVisible();
      await expect(caption).toContainText('Or else we say in Tamil');
    });
  });

  test.describe('Park Bench Image Popup', () => {
    test('should have park bench popup element', async ({ page }) => {
      const popup = page.locator('#popup-park-bench');
      await expect(popup).toBeAttached();
    });

    test('should have popup image with correct source', async ({ page }) => {
      const img = page.locator('#popup-park-bench .popup-image');
      await expect(img).toHaveAttribute('src', /Park_bench\.png/);
    });

    test('should have alt text on popup image', async ({ page }) => {
      const img = page.locator('#popup-park-bench .popup-image');
      await expect(img).toHaveAttribute('alt', 'A moment of first realisation..');
    });

    test('should have close button', async ({ page }) => {
      const closeBtn = page.locator('#close-park-bench');
      await expect(closeBtn).toBeAttached();
    });
  });

  test.describe('Final Page (Page 13)', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to final page (page 11)
      await navigateToPage(page, 11);
    });

    test('should display final page content', async ({ page }) => {
      const chapterLabel = page.locator('.page-13 .chapter-label');
      await expect(chapterLabel).toHaveText('Kanmaniye... this is for you');
    });

    test('should display cute boy image', async ({ page }) => {
      const img = page.locator('.final-page-image');
      await expect(img).toBeVisible();
      await expect(img).toHaveAttribute('src', /Cute_boy\.png/);
    });

    test('should display reader questions', async ({ page }) => {
      const questions = page.locator('.page-13 .reader-question');
      await expect(questions).toHaveCount(2);
    });

    test('should have "To be continued" message', async ({ page }) => {
      const question = page.locator('.page-13 .reader-question').last();
      await expect(question).toHaveText('To be continued...');
    });
  });

  test.describe('Popup Accessibility', () => {
    test('should have aria-label on close buttons', async ({ page }) => {
      const closeYes = page.locator('#close-yes');
      const closeNo = page.locator('#close-no');
      const closeParkBench = page.locator('#close-park-bench');
      
      await expect(closeYes).toHaveAttribute('aria-label', 'Close');
      await expect(closeNo).toHaveAttribute('aria-label', 'Close');
      await expect(closeParkBench).toHaveAttribute('aria-label', 'Close');
    });
  });

  test.describe('Popup Animations', () => {
    test('should apply pop animation on Yes popup', async ({ page }) => {
      await navigateToPage(page, 10);
      await page.locator('#btn-yes').click();
      
      const videoWrap = page.locator('#popup-yes .popup-video-wrap');
      await expect(videoWrap).toHaveClass(/popped/);
    });
  });
});
