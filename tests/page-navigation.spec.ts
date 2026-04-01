/**
 * Kanmani Website - Page Navigation Tests
 * Tests for book page turn animations, navigation buttons, and scrolling
 */
import { test, expect, Page } from '@playwright/test';

test.describe('Page Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Cover Page (Page 1)', () => {
    test('should display the cover page with Tamil title', async ({ page }) => {
      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).toHaveText('கண்மணி');
    });

    test('should display subtitle', async ({ page }) => {
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Let me tell a kutty story');
    });

    test('should have Begin Story button', async ({ page }) => {
      const startButton = page.locator('#start-story');
      await expect(startButton).toBeVisible();
      await expect(startButton).toHaveText('Begin the Story');
    });

    test('should have decorative corner ornaments', async ({ page }) => {
      const ornaments = page.locator('.corner-ornament');
      await expect(ornaments).toHaveCount(4);
    });
  });

  test.describe('Begin Story Navigation', () => {
    test('should navigate to Chapter 1 when clicking Begin Story', async ({ page }) => {
      const startButton = page.locator('#start-story');
      await startButton.click();
      
      // Wait for page turn animation
      await page.waitForTimeout(1200);
      
      // Should now be on page 2 (Chapter 1)
      const chapterLabel = page.locator('.page-2 .chapter-label');
      await expect(chapterLabel).toBeVisible();
      await expect(chapterLabel).toHaveText('Chapter One');
    });

    test('should update navigation indicator after clicking Begin Story', async ({ page }) => {
      const navIndicator = page.locator('#nav-indicator');
      await expect(navIndicator).toHaveText('1 / 11');
      
      await page.locator('#start-story').click();
      await page.waitForTimeout(1200);
      
      await expect(navIndicator).toHaveText('2 / 11');
    });
  });

  test.describe('Navigation Buttons', () => {
    test('should have navigation controls visible', async ({ page }) => {
      await expect(page.locator('#page-nav')).toBeVisible();
      await expect(page.locator('#nav-prev')).toBeVisible();
      await expect(page.locator('#nav-next')).toBeVisible();
      await expect(page.locator('#nav-indicator')).toBeVisible();
    });

    test('should disable previous button on first page', async ({ page }) => {
      const prevButton = page.locator('#nav-prev');
      await expect(prevButton).toBeDisabled();
    });

    test('should enable next button on first page', async ({ page }) => {
      const nextButton = page.locator('#nav-next');
      await expect(nextButton).toBeEnabled();
    });

    test('should navigate to next page when clicking next button', async ({ page }) => {
      const nextButton = page.locator('#nav-next');
      const navIndicator = page.locator('#nav-indicator');
      
      await expect(navIndicator).toHaveText('1 / 11');
      await nextButton.click();
      await page.waitForTimeout(1200);
      
      await expect(navIndicator).toHaveText('2 / 11');
    });

    test('should navigate back when clicking previous button', async ({ page }) => {
      // First go to page 2
      await page.locator('#nav-next').click();
      await page.waitForTimeout(1200);
      
      // Now go back
      const prevButton = page.locator('#nav-prev');
      await expect(prevButton).toBeEnabled();
      await prevButton.click();
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('1 / 11');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate forward with ArrowDown key', async ({ page }) => {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
    });

    test('should navigate forward with PageDown key', async ({ page }) => {
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
    });

    test('should navigate backward with ArrowUp key', async ({ page }) => {
      // First go forward
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(1200);
      
      // Then go back
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('1 / 11');
    });
  });

  test.describe('Wheel Navigation', () => {
    test('should navigate forward on wheel scroll down', async ({ page }) => {
      const book = page.locator('#book');
      await book.hover();
      
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('2 / 11');
    });

    test('should navigate backward on wheel scroll up', async ({ page }) => {
      // First scroll to page 2
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(1200);
      
      // Then scroll back
      await page.mouse.wheel(0, -100);
      await page.waitForTimeout(1200);
      
      await expect(page.locator('#nav-indicator')).toHaveText('1 / 11');
    });
  });

  test.describe('Page Turn Animation', () => {
    test('should apply turning class during page transition', async ({ page }) => {
      const page1 = page.locator('.page-1');
      
      await page.locator('#nav-next').click();
      
      // Check for turning class during animation
      await expect(page1).toHaveClass(/turning/);
    });

    test('should apply turned class after page transition', async ({ page }) => {
      const page1 = page.locator('.page-1');
      
      await page.locator('#nav-next').click();
      await page.waitForTimeout(1200);
      
      // Check for turned class after animation completes
      await expect(page1).toHaveClass(/turned/);
    });
  });

  test.describe('All Pages Navigation', () => {
    test('should be able to navigate through all 11 pages', async ({ page }) => {
      const navIndicator = page.locator('#nav-indicator');
      const nextButton = page.locator('#nav-next');

      for (let i = 1; i <= 11; i++) {
        await expect(navIndicator).toHaveText(`${i} / 11`);
        
        if (i < 11) {
          await nextButton.click();
          await page.waitForTimeout(1200);
        }
      }
      
      // On last page, next button should be disabled
      await expect(nextButton).toBeDisabled();
    });
  });

  test.describe('Chapter Content', () => {
    const chapters = [
      { page: 2, label: 'Chapter One', title: 'The Moment' },
      { page: 3, label: 'Chapter Two', title: 'Who was that person ?' },
      { page: 4, label: 'Chapter Three', title: 'How did he meet this person ?' },
      { page: 5, label: 'Chapter Four', title: 'Kanmani... Did I tell you how beautiful you are ?' },
      { page: 6, label: 'Chapter Five', title: 'Stages of Life' },
      { page: 7, label: 'Chapter Six', title: 'What she said to him ?' },
      { page: 8, label: 'Chapter Seven', title: 'வாழ்வின் அழகியல்' },
    ];

    for (const chapter of chapters) {
      test(`should display ${chapter.label} correctly`, async ({ page }) => {
        // Navigate to the chapter
        for (let i = 1; i < chapter.page; i++) {
          await page.locator('#nav-next').click();
          await page.waitForTimeout(1200);
        }
        
        const pageSelector = `.page-${chapter.page}`;
        await expect(page.locator(`${pageSelector} .chapter-label`)).toHaveText(chapter.label);
        await expect(page.locator(`${pageSelector} h2`)).toContainText(chapter.title);
      });
    }
  });
});
