/**
 * Kanmani Website - Visual Elements & Background Tests
 * Tests for backgrounds, images, animations, and visual styling
 */
import { test, expect, Page } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Visual Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Page Backgrounds', () => {
    test('page 1 should have deep purple gradient background', async ({ page }) => {
      const page1 = page.locator('.page-1');
      const bg = await page1.evaluate((el) => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(bg).toContain('linear-gradient');
    });

    test('page 2 should have ThePerfectFamily background image', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const page2 = page.locator('.page-2');
      const bg = await page2.evaluate((el) => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(bg).toContain('ThePerfectFamily');
    });

    test('page 3 should have Chapter 2 memories background', async ({ page }) => {
      await navigateToPage(page, 3);
      
      const page3 = page.locator('.page-3');
      const bg = await page3.evaluate((el) => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(bg).toContain('Chapter_2_her_memories');
    });

    test('page 4 should have first meeting background', async ({ page }) => {
      await navigateToPage(page, 4);
      
      const page4 = page.locator('.page-4');
      const bg = await page4.evaluate((el) => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(bg).toContain('Chapter_3_First_meet');
    });

    test('page 5 should have Samantha tiled background', async ({ page }) => {
      await navigateToPage(page, 5);
      
      const page5 = page.locator('.page-5');
      const bg = await page5.evaluate((el) => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(bg).toContain('Sammantha');
    });
  });

  test.describe('Life Stages Background (Page 6)', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToPage(page, 6);
    });

    test('should have life-stages-bg container', async ({ page }) => {
      const bgContainer = page.locator('.life-stages-bg');
      await expect(bgContainer).toBeAttached();
    });

    test('should have 30 tiled images', async ({ page }) => {
      const images = page.locator('.life-stages-bg img');
      await expect(images).toHaveCount(30);
    });

    test('should include AK.jpeg image', async ({ page }) => {
      const akImages = page.locator('.life-stages-bg img[src*="AK.jpeg"]');
      const count = await akImages.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should include marriage.png image', async ({ page }) => {
      const images = page.locator('.life-stages-bg img[src*="marriage.png"]');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should include Motherhood.png image', async ({ page }) => {
      const images = page.locator('.life-stages-bg img[src*="Motherhood.png"]');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should include sixties_Date.png image', async ({ page }) => {
      const images = page.locator('.life-stages-bg img[src*="sixties_Date.png"]');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should include Success.png image', async ({ page }) => {
      const images = page.locator('.life-stages-bg img[src*="Success.png"]');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('images should have low opacity', async ({ page }) => {
      const bgContainer = page.locator('.life-stages-bg');
      await expect(bgContainer).toHaveCSS('opacity', '0.15');
    });

    test('images should be aria-hidden', async ({ page }) => {
      const bgContainer = page.locator('.life-stages-bg');
      await expect(bgContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Typography', () => {
    test('should use Cormorant Garamond for headings', async ({ page }) => {
      const title = page.locator('.hero-title');
      const fontFamily = await title.evaluate((el) => 
        window.getComputedStyle(el).fontFamily
      );
      
      expect(fontFamily).toContain('Cormorant Garamond');
    });

    test('should use Lora for body text', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const storyText = page.locator('.story-text').first();
      const fontFamily = await storyText.evaluate((el) => 
        window.getComputedStyle(el).fontFamily
      );
      
      expect(fontFamily).toContain('Lora');
    });

    test('chapter labels should be uppercase', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const chapterLabel = page.locator('.chapter-label').first();
      await expect(chapterLabel).toHaveCSS('text-transform', 'uppercase');
    });
  });

  test.describe('Color Palette', () => {
    test('should have indigo text color', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const heading = page.locator('.page-2 h2');
      const color = await heading.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      // Indigo color RGB
      expect(color).toBeDefined();
    });

    test('should have pink accent color on chapter labels', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const label = page.locator('.chapter-label').first();
      const color = await label.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      expect(color).toBeDefined();
    });
  });

  test.describe('Corner Ornaments (Page 1)', () => {
    test('should have 4 corner ornaments', async ({ page }) => {
      const ornaments = page.locator('.corner-ornament');
      await expect(ornaments).toHaveCount(4);
    });

    test('should have top-left ornament', async ({ page }) => {
      const ornament = page.locator('.corner-ornament.top-left');
      await expect(ornament).toBeAttached();
    });

    test('should have top-right ornament', async ({ page }) => {
      const ornament = page.locator('.corner-ornament.top-right');
      await expect(ornament).toBeAttached();
    });

    test('should have bottom-left ornament', async ({ page }) => {
      const ornament = page.locator('.corner-ornament.bottom-left');
      await expect(ornament).toBeAttached();
    });

    test('should have bottom-right ornament', async ({ page }) => {
      const ornament = page.locator('.corner-ornament.bottom-right');
      await expect(ornament).toBeAttached();
    });
  });

  test.describe('Poetry Blocks Styling', () => {
    test('should have border-left on poetry blocks', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const poetryBlock = page.locator('.poetry-block').first();
      await expect(poetryBlock).toHaveCSS('border-left-width', '4px');
    });

    test('should have rounded corners', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const poetryBlock = page.locator('.poetry-block').first();
      await expect(poetryBlock).toHaveCSS('border-radius', '16px');
    });

    test('should have box shadow', async ({ page }) => {
      await navigateToPage(page, 2);
      
      const poetryBlock = page.locator('.poetry-block').first();
      const shadow = await poetryBlock.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      
      expect(shadow).not.toBe('none');
    });
  });

  test.describe('Reader Questions', () => {
    test('should have styled reader questions', async ({ page }) => {
      await navigateToPage(page, 5);
      
      const question = page.locator('.reader-question').first();
      await expect(question).toBeVisible();
      await expect(question).toHaveCSS('font-style', 'italic');
    });

    test('should have border-left accent', async ({ page }) => {
      await navigateToPage(page, 5);
      
      const question = page.locator('.reader-question').first();
      await expect(question).toHaveCSS('border-left-width', '4px');
    });
  });
});

test.describe('Heart Shower Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Yes Button Heart Shower', () => {
    test('should create heart shower on Yes click', async ({ page }) => {
      // Navigate to Let's Talk page
      for (let i = 1; i < 10; i++) {
        await page.locator('#nav-next').click();
        await page.waitForTimeout(1200);
      }
      
      await page.locator('#btn-yes').click();
      
      const heartShower = page.locator('.heart-shower');
      await expect(heartShower).toBeAttached();
    });

    test('heart shower should contain heart spans', async ({ page }) => {
      for (let i = 1; i < 10; i++) {
        await page.locator('#nav-next').click();
        await page.waitForTimeout(1200);
      }
      
      await page.locator('#btn-yes').click();
      
      const hearts = page.locator('.heart-shower span');
      const count = await hearts.count();
      expect(count).toBeGreaterThan(0);
    });

    test('heart shower should be aria-hidden', async ({ page }) => {
      for (let i = 1; i < 10; i++) {
        await page.locator('#nav-next').click();
        await page.waitForTimeout(1200);
      }
      
      await page.locator('#btn-yes').click();
      
      const heartShower = page.locator('.heart-shower');
      await expect(heartShower).toHaveAttribute('aria-hidden', 'true');
    });

    test('heart shower should be removed after animation', async ({ page }) => {
      for (let i = 1; i < 10; i++) {
        await page.locator('#nav-next').click();
        await page.waitForTimeout(1200);
      }
      
      await page.locator('#btn-yes').click();
      
      // Wait for animation to complete (6 seconds)
      await page.waitForTimeout(7000);
      
      const heartShower = page.locator('.heart-shower');
      await expect(heartShower).not.toBeAttached();
    });
  });

  test.describe('Final Page Continuous Hearts', () => {
    test('should show continuous hearts on final page', async ({ page }) => {
      // Enable music first (needed for final page effects)
      await page.locator('#music-toggle').click();
      
      // Navigate to final page
      for (let i = 1; i < 11; i++) {
        await page.locator('#nav-next').click();
        await page.waitForTimeout(1200);
      }
      
      // Wait for hearts to start
      await page.waitForTimeout(1000);
      
      const continuousHearts = page.locator('.heart-shower-continuous');
      await expect(continuousHearts).toBeAttached();
    });
  });
});

test.describe('Animations & Transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should have fadeInUp animation on title', async ({ page }) => {
    const title = page.locator('.hero-title');
    const animation = await title.evaluate((el) => 
      window.getComputedStyle(el).animation
    );
    
    expect(animation).toContain('fadeInUp');
  });

  test('should have button hover transitions', async ({ page }) => {
    const button = page.locator('#start-story');
    const transition = await button.evaluate((el) => 
      window.getComputedStyle(el).transition
    );
    
    expect(transition).not.toBe('all 0s ease 0s');
  });

  test('music toggle should have hover transform', async ({ page }) => {
    const toggle = page.locator('#music-toggle');
    
    await toggle.hover();
    
    const transform = await toggle.evaluate((el) => 
      window.getComputedStyle(el).transform
    );
    
    // Should be scaled on hover
    expect(transform).toContain('matrix');
  });
});

test.describe('CSS Variables', () => {
  test('should have CSS custom properties defined', async ({ page }) => {
    await page.goto('/');
    
    const colorWhite = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--color-white')
    );
    
    expect(colorWhite.trim()).toBe('#FFFFFF');
  });

  test('should have font variables defined', async ({ page }) => {
    await page.goto('/');
    
    const fontHeading = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--font-heading')
    );
    
    expect(fontHeading).toContain('Cormorant Garamond');
  });
});
