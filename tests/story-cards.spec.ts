/**
 * Kanmani Website - Story Cards Carousel Tests
 * Tests for the swipeable story cards on Chapter 7
 */
import { test, expect, Page } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Story Cards Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Navigate to Chapter 7 (page 8)
    await navigateToPage(page, 8);
  });

  test.describe('Story Cards Structure', () => {
    test('should have story cards container', async ({ page }) => {
      const container = page.locator('#story-cards');
      await expect(container).toBeVisible();
    });

    test('should have story cards wrapper', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toBeVisible();
    });

    test('should have 5 story cards', async ({ page }) => {
      const cards = page.locator('.story-card');
      await expect(cards).toHaveCount(5);
    });

    test('should have navigation dots', async ({ page }) => {
      const dots = page.locator('.story-cards-dot');
      await expect(dots).toHaveCount(5);
    });

    test('should have swipe hint text', async ({ page }) => {
      const hint = page.locator('.story-cards-hint');
      await expect(hint).toBeVisible();
      await expect(hint).toHaveText('Swipe or tap dots to navigate');
    });
  });

  test.describe('Navigation Dots', () => {
    test('should have first dot active by default', async ({ page }) => {
      const firstDot = page.locator('.story-cards-dot').first();
      await expect(firstDot).toHaveClass(/active/);
    });

    test('should have data-index attributes on dots', async ({ page }) => {
      const dots = page.locator('.story-cards-dot');
      
      for (let i = 0; i < 5; i++) {
        const dot = dots.nth(i);
        await expect(dot).toHaveAttribute('data-index', String(i));
      }
    });

    test('should navigate to card when clicking dot', async ({ page }) => {
      const dots = page.locator('.story-cards-dot');
      const wrapper = page.locator('.story-cards-wrapper');
      
      // Click on third dot (index 2)
      await dots.nth(2).click();
      
      // Third dot should be active
      await expect(dots.nth(2)).toHaveClass(/active/);
      await expect(dots.first()).not.toHaveClass(/active/);
      
      // Wrapper should have transform applied (translateX for card position)
      const transform = await wrapper.evaluate((el) => 
        window.getComputedStyle(el).transform
      );
      expect(transform).not.toBe('none');
    });

    test('should update active dot when navigating', async ({ page }) => {
      const dots = page.locator('.story-cards-dot');
      
      // Navigate through all dots
      for (let i = 0; i < 5; i++) {
        await dots.nth(i).click();
        await expect(dots.nth(i)).toHaveClass(/active/);
        
        // Previous dots should not be active
        for (let j = 0; j < i; j++) {
          await expect(dots.nth(j)).not.toHaveClass(/active/);
        }
      }
    });
  });

  test.describe('Card Content', () => {
    test('first card should have meaningful moments content', async ({ page }) => {
      const firstCard = page.locator('.story-card').first();
      const text = firstCard.locator('.story-text').first();
      
      await expect(text).toContainText('moments that quietly defined their relationship');
    });

    test('last card should have "Only she could tell" text', async ({ page }) => {
      // Navigate to last card
      await page.locator('.story-cards-dot').last().click();
      
      const lastCard = page.locator('.story-card').last();
      const strongText = lastCard.locator('strong');
      
      await expect(strongText).toHaveText('Only she could tell.');
    });

    test('cards should have multiple story text paragraphs', async ({ page }) => {
      const firstCard = page.locator('.story-card').first();
      const paragraphs = firstCard.locator('.story-text');
      
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(1);
    });
  });

  test.describe('Mouse Drag Navigation', () => {
    test('should change cursor to grab on wrapper', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toHaveCSS('cursor', 'grab');
    });

    test('should navigate when dragging left', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      const container = page.locator('#story-cards');
      const dots = page.locator('.story-cards-dot');
      
      // Get container position
      const box = await container.boundingBox();
      if (!box) return;
      
      const startX = box.x + box.width * 0.8;
      const endX = box.x + box.width * 0.2;
      const y = box.y + box.height / 2;
      
      // Perform drag gesture
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 10 });
      await page.mouse.up();
      
      // Should navigate to second card
      await expect(dots.nth(1)).toHaveClass(/active/);
    });
  });

  test.describe('Touch Swipe Navigation', () => {
    test('should have touch-action set for horizontal pan', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toHaveCSS('touch-action', 'pan-x');
    });

    test('should not allow text selection during drag', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toHaveCSS('user-select', 'none');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be focusable', async ({ page }) => {
      const container = page.locator('#story-cards');
      await expect(container).toHaveAttribute('tabindex', '0');
    });

    test('should navigate with ArrowRight key', async ({ page }) => {
      const container = page.locator('#story-cards');
      const dots = page.locator('.story-cards-dot');
      
      await container.focus();
      await page.keyboard.press('ArrowRight');
      
      await expect(dots.nth(1)).toHaveClass(/active/);
    });

    test('should navigate with ArrowLeft key', async ({ page }) => {
      const container = page.locator('#story-cards');
      const dots = page.locator('.story-cards-dot');
      
      // First go to second card
      await dots.nth(1).click();
      
      await container.focus();
      await page.keyboard.press('ArrowLeft');
      
      await expect(dots.first()).toHaveClass(/active/);
    });

    test('should not go before first card', async ({ page }) => {
      const container = page.locator('#story-cards');
      const dots = page.locator('.story-cards-dot');
      
      await container.focus();
      await page.keyboard.press('ArrowLeft');
      
      // Should still be on first card
      await expect(dots.first()).toHaveClass(/active/);
    });

    test('should not go after last card', async ({ page }) => {
      const container = page.locator('#story-cards');
      const dots = page.locator('.story-cards-dot');
      
      // Go to last card
      await dots.last().click();
      
      await container.focus();
      await page.keyboard.press('ArrowRight');
      
      // Should still be on last card
      await expect(dots.last()).toHaveClass(/active/);
    });
  });

  test.describe('Visual Styling', () => {
    test('should have border-left on cards', async ({ page }) => {
      const card = page.locator('.story-card').first();
      // Border-left should be purple/magenta
      await expect(card).toHaveCSS('border-left-width', '4px');
      await expect(card).toHaveCSS('border-left-style', 'solid');
    });

    test('should have rounded borders on cards', async ({ page }) => {
      const card = page.locator('.story-card').first();
      await expect(card).toHaveCSS('border-radius', '16px');
    });

    test('should have box shadow on cards', async ({ page }) => {
      const card = page.locator('.story-card').first();
      const boxShadow = await card.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      expect(boxShadow).not.toBe('none');
    });
  });

  test.describe('Transition Effects', () => {
    test('should have smooth transition on wrapper', async ({ page }) => {
      const wrapper = page.locator('.story-cards-wrapper');
      await expect(wrapper).toHaveCSS('transition', /transform.*0\.4s/);
    });

    test('should scale active dot', async ({ page }) => {
      const activeDot = page.locator('.story-cards-dot.active');
      
      // Active dot should be scaled
      const transform = await activeDot.evaluate((el) => 
        window.getComputedStyle(el).transform
      );
      expect(transform).toContain('matrix');
    });
  });
});
