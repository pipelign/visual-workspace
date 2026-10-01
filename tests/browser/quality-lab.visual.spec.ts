import { expect, test } from '@playwright/test';
import { requireFixtureReady } from './readiness';

for (const fixture of ['delivery']) {
  test('reviewed ' + fixture + ' appearance', async ({ page }) => {
    await page.goto('/probes/' + fixture + '.html');
    await requireFixtureReady(page);
    await expect(page.locator('.fixture')).toHaveScreenshot(fixture + '.png', {
      animations: 'disabled',
      maxDiffPixels: 0,
    });
  });
}
