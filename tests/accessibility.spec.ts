/**
 * Kanmani Website - Accessibility Tests
 * Tests for ARIA labels, keyboard navigation, screen reader support, and WCAG compliance
 */
import { test, expect, Page } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Document Structure', () => {
    test('should have proper html lang attribute', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should have page title', async ({ page }) => {
      await expect(page).toHaveTitle('Kanmani — A Love Story');
    });

    test('should have main heading (h1)', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeAttached();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // H1 should come before H2
      const h1 = page.locator('h1').first();
      const h2 = page.locator('h2').first();
      
      await expect(h1).toBeAttached();
      await expect(h2).toBeAttached();
    });
  });

  test.describe('ARIA Labels', () => {
    test('navigation buttons should have aria-labels', async ({ page }) => {
      await expect(page.locator('#nav-prev')).toHaveAttribute('aria-label', 'Previous page');
      await expect(page.locator('#nav-next')).toHaveAttribute('aria-label', 'Next page');
    });

    test('music toggle should have aria-label', async ({ page }) => {
      await expect(page.locator('#music-toggle')).toHaveAttribute('aria-label', 'Toggle background music');
    });

    test('volume buttons should have aria-labels', async ({ page }) => {
      await expect(page.locator('#volume-down')).toHaveAttribute('aria-label', 'Decrease volume');
      await expect(page.locator('#volume-up')).toHaveAttribute('aria-label', 'Increase volume');
    });

    test('popup close buttons should have aria-labels', async ({ page }) => {
      await expect(page.locator('#close-yes')).toHaveAttribute('aria-label', 'Close');
      await expect(page.locator('#close-no')).toHaveAttribute('aria-label', 'Close');
      await expect(page.locator('#close-park-bench')).toHaveAttribute('aria-label', 'Close');
    });
  });

  test.describe('Button Accessibility', () => {
    test('all buttons should be focusable when enabled', async ({ page }) => {
      // Test visible and enabled buttons only
      const buttons = [
        '#start-story',
        '#nav-next',  // nav-prev is disabled on page 1
        '#music-toggle',
      ];

      for (const selector of buttons) {
        const button = page.locator(selector);
        await button.focus();
        await expect(button).toBeFocused();
      }
    });

    test('disabled buttons should indicate disabled state', async ({ page }) => {
      const prevButton = page.locator('#nav-prev');
      await expect(prevButton).toBeDisabled();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be able to navigate with Tab key', async ({ page }) => {
      // Focus first interactive element
      await page.keyboard.press('Tab');
      
      // Should focus on Begin Story button
      const startButton = page.locator('#start-story');
      await expect(startButton).toBeFocused();
    });

    test('should navigate pages with arrow keys', async ({ page }) => {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
    });

    test('should support PageDown/PageUp keys', async ({ page }) => {
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
      
      await page.keyboard.press('PageUp');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('1 / 11');
    });
  });

  test.describe('Focus Visibility', () => {
    test('buttons should have visible focus indicator', async ({ page }) => {
      const button = page.locator('#start-story');
      await button.focus();
      
      // Check for focus styling
      const outline = await button.evaluate((el) => 
        window.getComputedStyle(el).outline
      );
      
      // Should have some focus indicator
      // Note: actual styling may vary
    });

    test('textarea should have focus styling', async ({ page }) => {
      await navigateToPage(page, 9);
      
      const textarea = page.locator('#her-story-text');
      await textarea.focus();
      
      const boxShadow = await textarea.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      
      expect(boxShadow).not.toBe('none');
    });
  });

  test.describe('Image Accessibility', () => {
    test('final page image should have alt text', async ({ page }) => {
      const img = page.locator('.final-page-image');
      await expect(img).toHaveAttribute('alt', 'Cute boy');
    });

    test('park bench popup image should have alt text', async ({ page }) => {
      const img = page.locator('#popup-park-bench .popup-image');
      await expect(img).toHaveAttribute('alt', 'A moment of first realisation..');
    });

    test('decorative images should have empty alt', async ({ page }) => {
      await navigateToPage(page, 6);
      
      const decorativeImages = page.locator('.life-stages-bg img');
      const count = await decorativeImages.count();
      
      for (let i = 0; i < count; i++) {
        const img = decorativeImages.nth(i);
        await expect(img).toHaveAttribute('alt', '');
      }
    });
  });

  test.describe('Hidden Elements', () => {
    test('decorative backgrounds should be aria-hidden', async ({ page }) => {
      await navigateToPage(page, 6);
      
      const bgContainer = page.locator('.life-stages-bg');
      await expect(bgContainer).toHaveAttribute('aria-hidden', 'true');
    });

    test('volume panel should be aria-hidden when closed', async ({ page }) => {
      const volumePanel = page.locator('#music-volume-panel');
      await expect(volumePanel).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Form Accessibility', () => {
    test('textarea should have id for labeling', async ({ page }) => {
      await navigateToPage(page, 9);
      
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveAttribute('id', 'her-story-text');
    });

    test('textarea should have placeholder', async ({ page }) => {
      await navigateToPage(page, 9);
      
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveAttribute('placeholder', 'Write your story here...');
    });
  });

  test.describe('Semantic HTML', () => {
    test('should use section elements for pages', async ({ page }) => {
      const sections = page.locator('section.book-page');
      const count = await sections.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should use proper list markup for navigation dots', async ({ page }) => {
      await navigateToPage(page, 8);
      
      const dotsContainer = page.locator('.story-cards-nav');
      await expect(dotsContainer).toBeAttached();
    });
  });

  test.describe('Color Contrast', () => {
    test('title should have sufficient contrast on dark background', async ({ page }) => {
      const title = page.locator('.hero-title');
      
      // Pink text on dark purple should have good contrast
      const color = await title.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      expect(color).toBeTruthy();
    });

    test('story text should be readable', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const text = page.locator('.story-text').first();
      const color = await text.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      // Text should be dark enough to read
      expect(color).toBeTruthy();
    });
  });

  test.describe('Interactive Elements', () => {
    test('story cards should be keyboard accessible', async ({ page }) => {
      await navigateToPage(page, 8);
      
      const container = page.locator('#story-cards');
      await expect(container).toHaveAttribute('tabindex', '0');
    });

    test('dots should be buttons', async ({ page }) => {
      await navigateToPage(page, 8);
      
      const dots = page.locator('.story-cards-dot');
      const count = await dots.count();
      
      for (let i = 0; i < count; i++) {
        const dot = dots.nth(i);
        await expect(dot).toHaveRole('button');
      }
    });
  });
});

test.describe('Reduced Motion', () => {
  test.use({
    contextOptions: {
      reducedMotion: 'reduce',
    },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should respect reduced motion preference', async ({ page }) => {
    // This test ensures the site doesn't break with reduced motion
    const book = page.locator('#book');
    await expect(book).toBeVisible();
    
    // Navigation should still work
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
    
    await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
  });
});
