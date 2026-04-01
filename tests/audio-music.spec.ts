/**
 * Kanmani Website - Audio & Music Tests
 * Tests for background music, chapter-specific audio, volume controls, and mute functionality
 */
import { test, expect, Page } from '@playwright/test';

test.describe('Audio & Music Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Music Controls UI', () => {
    test('should display music toggle button', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      await expect(musicToggle).toBeVisible();
    });

    test('should display music icon', async ({ page }) => {
      // Music toggle has two icons, one visible based on muted state
      const musicToggle = page.locator('#music-toggle');
      const musicIcons = musicToggle.locator('.music-icon');
      await expect(musicIcons).toHaveCount(2);
    });

    test('should have volume panel hidden by default', async ({ page }) => {
      const volumePanel = page.locator('#music-volume-panel');
      await expect(volumePanel).not.toBeVisible();
    });

    test('should show volume panel on hover', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      const volumePanel = page.locator('#music-volume-panel');
      
      await musicControls.hover();
      await expect(volumePanel).toBeVisible();
    });

    test('should have volume up and down buttons', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      await expect(page.locator('#volume-down')).toBeVisible();
      await expect(page.locator('#volume-up')).toBeVisible();
      await expect(page.locator('#volume-level')).toBeVisible();
    });
  });

  test.describe('Music Toggle Functionality', () => {
    test('should start with music muted', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      await expect(musicToggle).toHaveClass(/muted/);
    });

    test('should unmute when clicking toggle', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      
      await musicToggle.click();
      await expect(musicToggle).not.toHaveClass(/muted/);
    });

    test('should mute when clicking toggle again', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      
      // Unmute
      await musicToggle.click();
      await expect(musicToggle).not.toHaveClass(/muted/);
      
      // Mute again
      await musicToggle.click();
      await expect(musicToggle).toHaveClass(/muted/);
    });

    test('should start music when clicking Begin Story', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      const startButton = page.locator('#start-story');
      
      await expect(musicToggle).toHaveClass(/muted/);
      await startButton.click();
      
      // Music should be unmuted after clicking Begin Story
      await expect(musicToggle).not.toHaveClass(/muted/);
    });
  });

  test.describe('Volume Controls', () => {
    test('should display initial volume level as 50%', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      const volumeLevel = page.locator('#volume-level');
      await expect(volumeLevel).toHaveText('50%');
    });

    test('should increase volume when clicking volume up', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      const volumeUp = page.locator('#volume-up');
      const volumeLevel = page.locator('#volume-level');
      
      await volumeUp.click();
      await expect(volumeLevel).toHaveText('60%');
    });

    test('should decrease volume when clicking volume down', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      const volumeDown = page.locator('#volume-down');
      const volumeLevel = page.locator('#volume-level');
      
      await volumeDown.click();
      await expect(volumeLevel).toHaveText('40%');
    });

    test('should not exceed 100% volume', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      const volumeUp = page.locator('#volume-up');
      const volumeLevel = page.locator('#volume-level');
      
      // Click volume up many times
      for (let i = 0; i < 10; i++) {
        await volumeUp.click();
      }
      
      await expect(volumeLevel).toHaveText('100%');
    });

    test('should not go below 0% volume', async ({ page }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      const volumeDown = page.locator('#volume-down');
      const volumeLevel = page.locator('#volume-level');
      
      // Click volume down many times
      for (let i = 0; i < 10; i++) {
        await volumeDown.click();
      }
      
      await expect(volumeLevel).toHaveText('0%');
    });
  });

  test.describe('Audio Elements', () => {
    test('should have main background music element', async ({ page }) => {
      const bgMusicTop = page.locator('#bg-music-top');
      await expect(bgMusicTop).toBeAttached();
      
      // Check source
      const source = bgMusicTop.locator('source');
      await expect(source).toHaveAttribute('src', /Munbe_Vaa\.mp3/);
    });

    test('should have chapter-specific audio elements', async ({ page }) => {
      const audioElements = {
        'chapter-two-audio': 'Poopol_Poopol.mp3',
        'chapter-three-audio': 'Ore_Nyabagam.mp3',
        'chapter-five-audio': 'Vaayamoodi.mp3',
        'chapter-seven-audio': 'YeTuneKyaKiya.mp3',
        'kanmaniye-audio': 'kanmaniye.mp3',
        'lets-talk-audio': 'EnnaSollaPogirai.mp3',
      };

      for (const [id, expectedSrc] of Object.entries(audioElements)) {
        const audio = page.locator(`#${id}`);
        await expect(audio).toBeAttached();
        
        const source = audio.locator('source');
        await expect(source).toHaveAttribute('src', new RegExp(expectedSrc));
      }
    });

    test('should have audio elements set to loop', async ({ page }) => {
      const audioIds = [
        'bg-music-top',
        'chapter-two-audio',
        'chapter-three-audio',
        'chapter-five-audio',
        'chapter-seven-audio',
        'kanmaniye-audio',
        'lets-talk-audio',
      ];

      for (const id of audioIds) {
        const audio = page.locator(`#${id}`);
        await expect(audio).toHaveAttribute('loop', '');
      }
    });
  });

  test.describe('Chapter-Specific Audio Behavior', () => {
    test('should have audio elements with preload attribute', async ({ page }) => {
      const audioIds = [
        'bg-music-top',
        'chapter-two-audio',
        'chapter-three-audio',
      ];

      for (const id of audioIds) {
        const audio = page.locator(`#${id}`);
        await expect(audio).toHaveAttribute('preload', 'auto');
      }
    });
  });

  test.describe('Audio State Persistence', () => {
    test('should persist volume setting', async ({ page, context }) => {
      const musicControls = page.locator('#music-controls');
      await musicControls.hover();
      
      // Change volume
      const volumeUp = page.locator('#volume-up');
      await volumeUp.click();
      await volumeUp.click();
      
      // Verify volume changed to 70%
      await expect(page.locator('#volume-level')).toHaveText('70%');
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      
      // Volume should be persisted
      await page.locator('#music-controls').hover();
      await expect(page.locator('#volume-level')).toHaveText('70%');
    });

    test('should persist mute state', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      
      // Unmute
      await musicToggle.click();
      await expect(musicToggle).not.toHaveClass(/muted/);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      
      // State should be persisted (unmuted)
      await expect(page.locator('#music-toggle')).not.toHaveClass(/muted/);
    });
  });

  test.describe('Music Controls Accessibility', () => {
    test('should have aria-label on music toggle', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      await expect(musicToggle).toHaveAttribute('aria-label', 'Toggle background music');
    });

    test('should have aria-labels on volume buttons', async ({ page }) => {
      await expect(page.locator('#volume-down')).toHaveAttribute('aria-label', 'Decrease volume');
      await expect(page.locator('#volume-up')).toHaveAttribute('aria-label', 'Increase volume');
    });

    test('should have title on music toggle', async ({ page }) => {
      const musicToggle = page.locator('#music-toggle');
      await expect(musicToggle).toHaveAttribute('title', 'Toggle background music');
    });
  });
});
