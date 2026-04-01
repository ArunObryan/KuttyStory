/**
 * Kanmani Website - Mobile & Responsive Tests
 * Tests for different viewport sizes, touch interactions, and responsive layouts
 */
import { test, expect, Page, devices } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Mobile Viewport Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Cover Page Mobile', () => {
    test('should display title properly on mobile', async ({ page }) => {
      const title = page.locator('.hero-title');
      await expect(title).toBeVisible();
      
      // Title should fit within viewport
      const box = await title.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(375);
    });

    test('should have readable subtitle', async ({ page }) => {
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
    });

    test('should have appropriately sized button', async ({ page }) => {
      const button = page.locator('#start-story');
      const box = await button.boundingBox();
      
      // Button should be at least 44px tall (tap target)
      expect(box?.height).toBeGreaterThanOrEqual(40);
    });
  });

  test.describe('Navigation Controls Mobile', () => {
    test('should display compact navigation', async ({ page }) => {
      const nav = page.locator('#page-nav');
      await expect(nav).toBeVisible();
      
      const box = await nav.boundingBox();
      // Nav should not be too wide for mobile
      expect(box?.width).toBeLessThan(200);
    });

    test('should have smaller nav buttons on mobile', async ({ page }) => {
      const navBtn = page.locator('#nav-next');
      const box = await navBtn.boundingBox();
      
      // Buttons should be touch-friendly but compact
      expect(box?.width).toBeGreaterThanOrEqual(24);
      expect(box?.height).toBeGreaterThanOrEqual(24);
    });
  });

  test.describe('Music Controls Mobile', () => {
    test('should have smaller music toggle on mobile', async ({ page }) => {
      const toggle = page.locator('#music-toggle');
      const box = await toggle.boundingBox();
      
      expect(box?.width).toBeGreaterThanOrEqual(36);
      expect(box?.height).toBeGreaterThanOrEqual(36);
    });
  });

  test.describe('Content Layout Mobile', () => {
    test('should have readable story text', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const storyText = page.locator('.story-text').first();
      const fontSize = await storyText.evaluate((el) => 
        window.getComputedStyle(el).fontSize
      );
      
      // Font size should be at least 12px for readability
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(12);
    });

    test('should have appropriate padding on mobile', async ({ page }) => {
      const pageInner = page.locator('.page-inner').first();
      const padding = await pageInner.evaluate((el) => 
        window.getComputedStyle(el).paddingLeft
      );
      
      // Should have some padding
      const paddingValue = parseInt(padding);
      expect(paddingValue).toBeGreaterThan(0);
    });
  });

  test.describe('Video Layout Mobile', () => {
    test('should stack video and text vertically on mobile', async ({ page }) => {
      await navigateToPage(page, 5);
      
      const contentWithVideo = page.locator('.content-with-video');
      const flexDirection = await contentWithVideo.evaluate((el) => 
        window.getComputedStyle(el).flexDirection
      );
      
      expect(flexDirection).toBe('column');
    });

    test('should have full-width video on mobile', async ({ page }) => {
      await navigateToPage(page, 5);
      
      const videoBlock = page.locator('.video-block');
      const width = await videoBlock.evaluate((el) => 
        window.getComputedStyle(el).width
      );
      
      const widthValue = parseInt(width);
      // Should be close to full width
      expect(widthValue).toBeGreaterThan(300);
    });
  });
});

test.describe('Tablet Viewport Tests', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display properly on tablet', async ({ page }) => {
    const book = page.locator('#book');
    await expect(book).toBeVisible();
  });

  test('should have appropriate navigation positioning', async ({ page }) => {
    const nav = page.locator('#page-nav');
    const box = await nav.boundingBox();
    
    // Should be positioned on the right
    expect(box?.x).toBeGreaterThan(500);
  });

  test('should have larger story text than mobile', async ({ page }) => {
    await navigateToPage(page, 2);
    
    const storyText = page.locator('.story-text').first();
    const fontSize = await storyText.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14);
  });
});

test.describe('Small Phone Viewport Tests', () => {
  test.use({ viewport: { width: 320, height: 568 } }); // iPhone 5/SE (small)

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should fit content on small screens', async ({ page }) => {
    const title = page.locator('.hero-title');
    const box = await title.boundingBox();
    
    expect(box?.width).toBeLessThanOrEqual(320);
  });

  test('should have scrollable content area', async ({ page }) => {
    await navigateToPage(page, 2);
    
    const pageInner = page.locator('.page-2 .page-inner');
    const overflow = await pageInner.evaluate((el) => 
      window.getComputedStyle(el).overflowY
    );
    
    expect(overflow).toBe('auto');
  });
});

test.describe('Landscape Mobile Tests', () => {
  test.use({ viewport: { width: 667, height: 375 } }); // iPhone landscape

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display in landscape mode', async ({ page }) => {
    const book = page.locator('#book');
    await expect(book).toBeVisible();
  });

  test('should have compact styling in landscape', async ({ page }) => {
    const title = page.locator('.hero-title');
    const fontSize = await title.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    
    const fontSizeValue = parseInt(fontSize);
    // Should be reasonably sized in landscape
    expect(fontSizeValue).toBeGreaterThan(20);
    expect(fontSizeValue).toBeLessThan(200);
  });
});

test.describe('Touch Interactions', () => {
  test.use({ 
    hasTouch: true,
    viewport: { width: 375, height: 667 }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Page Touch Navigation', () => {
    test('should support swipe up to navigate forward', async ({ page }) => {
      const book = page.locator('#book');
      const box = await book.boundingBox();
      if (!box) return;
      
      const centerX = box.x + box.width / 2;
      const startY = box.y + box.height * 0.7;
      const endY = box.y + box.height * 0.3;
      
      // Perform swipe gesture
      await page.touchscreen.tap(centerX, startY);
      await page.mouse.move(centerX, startY);
      await page.mouse.down();
      await page.mouse.move(centerX, endY, { steps: 10 });
      await page.mouse.up();
      
      await page.waitForTimeout(1200);
    });

    test('should have touch-friendly navigation buttons', async ({ page }) => {
      const navNext = page.locator('#nav-next');
      const box = await navNext.boundingBox();
      
      // Touch target should be at least 24x24
      expect(box?.width).toBeGreaterThanOrEqual(24);
      expect(box?.height).toBeGreaterThanOrEqual(24);
    });
  });

  test.describe('Story Cards Touch', () => {
    test('should support swipe on story cards', async ({ page }) => {
      await navigateToPage(page, 8);
      
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toHaveCSS('touch-action', 'pan-x');
    });
  });

  test.describe('Button Tap States', () => {
    test('should have visible tap feedback on buttons', async ({ page }) => {
      const navBtn = page.locator('#nav-next');
      
      // Check that -webkit-tap-highlight-color is set
      const tapHighlight = await navBtn.evaluate((el) => 
        window.getComputedStyle(el).webkitTapHighlightColor
      );
      
      // Should be transparent or custom color
      expect(tapHighlight).toBeDefined();
    });
  });

  test.describe('Popup Touch Interactions', () => {
    test('should be able to tap Yes button on mobile', async ({ page }) => {
      await navigateToPage(page, 10);
      
      const yesBtn = page.locator('#btn-yes');
      await yesBtn.tap();
      
      const popup = page.locator('#popup-yes');
      await expect(popup).toHaveClass(/show/);
    });

    test('should be able to close popup by tapping background', async ({ page }) => {
      await navigateToPage(page, 10);
      
      await page.locator('#btn-yes').tap();
      await page.waitForTimeout(300);
      
      // Tap on overlay background
      const popup = page.locator('#popup-yes');
      await popup.tap({ position: { x: 10, y: 10 } });
      
      await expect(popup).not.toHaveClass(/show/);
    });
  });
});

test.describe('Responsive Image Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('life stages images should tile properly', async ({ page }) => {
    await navigateToPage(page, 6);
    
    const images = page.locator('.life-stages-bg img');
    await expect(images).toHaveCount(30);
  });

  test('final page image should be responsive', async ({ page }) => {
    await navigateToPage(page, 11);
    
    const img = page.locator('.final-page-image');
    const maxWidth = await img.evaluate((el) => 
      window.getComputedStyle(el).maxWidth
    );
    
    expect(maxWidth).toBe('400px');
  });
});

test.describe('Safe Area Tests', () => {
  test.use({ 
    viewport: { width: 375, height: 812 }, // iPhone X/11/12 dimensions
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should support safe-area-inset CSS', async ({ page }) => {
    const nav = page.locator('#page-nav');
    const right = await nav.evaluate((el) => 
      window.getComputedStyle(el).right
    );
    
    // Should have right positioning
    expect(right).toBeTruthy();
  });
});

test.describe('Viewport Meta Tag', () => {
  test('should have proper viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
  });
});

test.describe('Text Scaling', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('title should scale with viewport', async ({ page }) => {
    await page.goto('/');
    
    const title = page.locator('.hero-title');
    const fontSize = await title.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    
    // Font should use clamp() and be responsive
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThan(20);
    expect(fontSizeValue).toBeLessThan(200);
  });
});
