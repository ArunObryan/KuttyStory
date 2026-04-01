# Kanmani Website Test Suite

Comprehensive E2E test suite using Playwright to test all features of the Kanmani love story website.

## Test Coverage

### 1. Page Navigation (`page-navigation.spec.ts`)
- Cover page display (Tamil title, subtitle, button)
- Begin Story navigation
- Navigation buttons (prev/next)
- Keyboard navigation (ArrowUp/Down, PageUp/Down)
- Wheel/scroll navigation
- Page turn animations
- All 11 pages navigation
- Chapter content verification

### 2. Audio & Music (`audio-music.spec.ts`)
- Music controls UI (toggle, volume panel)
- Music toggle functionality (mute/unmute)
- Volume controls (up/down, limits)
- Audio elements verification
- Chapter-specific audio elements
- Audio state persistence (localStorage)
- Accessibility labels

### 3. Video & Popups (`video-popups.spec.ts`)
- Let's Talk page buttons
- Yes popup (video, message, close, heart shower)
- No popup (video, close)
- Chapter 4 video (Saami Silai)
- Park bench image popup
- Final page content
- Popup accessibility
- Pop animations

### 4. Story Cards Carousel (`story-cards.spec.ts`)
- Cards structure (5 cards, wrapper, dots)
- Navigation dots functionality
- Card content verification
- Mouse drag navigation
- Touch swipe support
- Keyboard navigation (ArrowLeft/Right)
- Visual styling (borders, shadows)
- Transition effects

### 5. Textarea/Form (`textarea-form.spec.ts`)
- Page structure ("Her" chapter)
- Textarea element attributes
- Text input/interaction
- Multiline support
- Styling (borders, focus states)
- Accessibility
- Keyboard navigation
- Text persistence across navigation

### 6. Responsive/Mobile (`responsive.spec.ts`)
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Small phone viewport (320x568)
- Landscape mobile (667x375)
- Touch interactions
- Touch-friendly navigation
- Story cards touch support
- Popup touch interactions
- Safe area support
- Viewport meta tag
- Cross-browser mobile tests

### 7. Visual Elements (`visual-elements.spec.ts`)
- Page backgrounds
- Life stages tiled images (30 images)
- Typography (fonts)
- Color palette
- Corner ornaments
- Poetry block styling
- Reader questions styling
- Heart shower animations (Yes click, final page)
- CSS animations & transitions
- CSS custom properties

### 8. Accessibility (`accessibility.spec.ts`)
- Document structure (lang, title, headings)
- ARIA labels
- Button accessibility
- Keyboard navigation
- Focus visibility
- Image alt text
- Hidden elements (aria-hidden)
- Form accessibility
- Semantic HTML
- Color contrast
- Reduced motion support

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests headed (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/page-navigation.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests only
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Configuration

Tests are configured in `playwright.config.ts`:
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12, iPad
- **Base URL**: `http://localhost:3000/KuttyStory/`
- **Screenshots**: On failure only
- **Video**: Retained on failure
- **Tracing**: On first retry

## Test Structure

```
tests/
├── fixtures.ts           # Shared utilities & helpers
├── page-navigation.spec.ts
├── audio-music.spec.ts
├── video-popups.spec.ts
├── story-cards.spec.ts
├── textarea-form.spec.ts
├── responsive.spec.ts
├── visual-elements.spec.ts
└── accessibility.spec.ts
```

## Test Helpers

Import from `fixtures.ts`:

```typescript
import { 
  navigateToPage,    // Navigate to specific page
  enableMusic,       // Enable music
  disableMusic,      // Disable music
  setVolume,         // Set volume level
  openYesPopup,      // Open Yes popup
  openNoPopup,       // Open No popup
  closeAllPopups,    // Close all popups
  goToStoryCard,     // Navigate to story card
  waitForPageTurn,   // Wait for animation
  getCurrentPageNumber // Get current page
} from './fixtures';
```

## Writing New Tests

```typescript
import { test, expect } from '@playwright/test';
import { navigateToPage } from './fixtures';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should do something', async ({ page }) => {
    await navigateToPage(page, 5);
    // ... test assertions
  });
});
```

## CI/CD Integration

For CI environments, set `CI=true` environment variable:

```bash
CI=true npm test
```

This enables:
- New server start (doesn't reuse existing)
- 2 retries on failure
- Single worker

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```
