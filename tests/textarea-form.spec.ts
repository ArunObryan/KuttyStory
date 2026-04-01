/**
 * Kanmani Website - Textarea & Form Tests
 * Tests for the "Her Story" textarea input on Page 9
 */
import { test, expect, Page } from '@playwright/test';

// Helper to navigate to a specific page
async function navigateToPage(page: Page, pageNumber: number) {
  for (let i = 1; i < pageNumber; i++) {
    await page.locator('#nav-next').click();
    await page.waitForTimeout(1200);
  }
}

test.describe('Her Story Textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Navigate to "Her" page (page 9)
    await navigateToPage(page, 9);
  });

  test.describe('Page Structure', () => {
    test('should display chapter label', async ({ page }) => {
      const chapterLabel = page.locator('.page-9 .chapter-label');
      await expect(chapterLabel).toBeVisible();
      await expect(chapterLabel).toHaveText('Her');
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('.page-9 h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText("It's time for her story");
    });

    test('should have her-story-input container', async ({ page }) => {
      const container = page.locator('.her-story-input');
      await expect(container).toBeVisible();
    });
  });

  test.describe('Textarea Element', () => {
    test('should have textarea element', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toBeVisible();
    });

    test('should have story-textarea class', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveClass(/story-textarea/);
    });

    test('should have placeholder text', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveAttribute('placeholder', 'Write your story here...');
    });

    test('should have rows attribute', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveAttribute('rows', '10');
    });
  });

  test.describe('Textarea Interaction', () => {
    test('should be focusable', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await textarea.focus();
      
      await expect(textarea).toBeFocused();
    });

    test('should accept text input', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      const testText = 'This is my story...';
      
      await textarea.fill(testText);
      await expect(textarea).toHaveValue(testText);
    });

    test('should support multiline input', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      const multilineText = 'Line 1\nLine 2\nLine 3';
      
      await textarea.fill(multilineText);
      await expect(textarea).toHaveValue(multilineText);
    });

    test('should be resizable', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveCSS('resize', 'vertical');
    });

    test('should allow long text input', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      const longText = 'A'.repeat(1000);
      
      await textarea.fill(longText);
      await expect(textarea).toHaveValue(longText);
    });
  });

  test.describe('Textarea Styling', () => {
    test('should have border', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveCSS('border-style', 'solid');
    });

    test('should have rounded corners', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveCSS('border-radius', '16px');
    });

    test('should have appropriate padding', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      const padding = await textarea.evaluate((el) => 
        window.getComputedStyle(el).padding
      );
      expect(padding).not.toBe('0px');
    });

    test('should have focus styling', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      
      // Focus the textarea
      await textarea.focus();
      
      // Should have box-shadow on focus (focus styling)
      const boxShadow = await textarea.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      
      expect(boxShadow).not.toBe('none');
    });

    test('should have focus box-shadow', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await textarea.focus();
      
      const boxShadow = await textarea.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      expect(boxShadow).not.toBe('none');
    });
  });

  test.describe('Textarea Accessibility', () => {
    test('should have id for label association', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await expect(textarea).toHaveAttribute('id', 'her-story-text');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be focusable directly', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      
      // Focus the textarea directly
      await textarea.focus();
      
      await expect(textarea).toBeFocused();
    });

    test('should type correctly when focused', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await textarea.focus();
      
      await page.keyboard.type('Hello world!');
      await expect(textarea).toHaveValue('Hello world!');
    });

    test('should support Enter for new lines', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      await textarea.focus();
      
      await page.keyboard.type('Line 1');
      await page.keyboard.press('Enter');
      await page.keyboard.type('Line 2');
      
      await expect(textarea).toHaveValue('Line 1\nLine 2');
    });
  });

  test.describe('Text Persistence', () => {
    test('should retain text when navigating away and back', async ({ page }) => {
      const textarea = page.locator('#her-story-text');
      const testText = 'My special story';
      
      await textarea.fill(testText);
      
      // Navigate away
      await page.locator('#nav-next').click();
      await page.waitForTimeout(1200);
      
      // Navigate back
      await page.locator('#nav-prev').click();
      await page.waitForTimeout(1200);
      
      // Text should still be there
      await expect(textarea).toHaveValue(testText);
    });
  });
});

test.describe('Page 9 Visual Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToPage(page, 9);
  });

  test('should center the textarea container', async ({ page }) => {
    const container = page.locator('.her-story-input');
    await expect(container).toHaveCSS('display', 'flex');
    await expect(container).toHaveCSS('justify-content', 'center');
  });

  test('should have appropriate textarea width', async ({ page }) => {
    const textarea = page.locator('#her-story-text');
    const width = await textarea.evaluate((el) => 
      window.getComputedStyle(el).width
    );
    
    // Width should be a reasonable percentage of the page
    const widthValue = parseInt(width);
    expect(widthValue).toBeGreaterThan(200);
  });

  test('should have minimum height for content', async ({ page }) => {
    const textarea = page.locator('#her-story-text');
    const minHeight = await textarea.evaluate((el) => 
      window.getComputedStyle(el).minHeight
    );
    
    const minHeightValue = parseInt(minHeight);
    expect(minHeightValue).toBeGreaterThanOrEqual(100);
  });
});
