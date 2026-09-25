import { expect, test } from '@playwright/test';
import { requireFixtureReady } from './readiness';

for (const fixture of ['light', 'dark', 'delivery']) {
  test('reviewed ' + fixture + ' appearance', async ({ page }) => {
    await page.goto('/fixtures/' + fixture + '.html');
    await requireFixtureReady(page);
    await expect(page.locator('.fixture')).toHaveScreenshot(fixture + '.png', {
      animations: 'disabled',
      maxDiffPixels: 0,
    });
  });
}
