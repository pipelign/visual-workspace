import { expect, test } from '@playwright/test';
import { requireArtifactReady } from './readiness';

for (const variation of ['light', 'dark']) {
  test('reviewed ' + variation + ' figure', async ({ page }) => {
    await page.goto('/figures/source-to-delivery-' + variation + '.html');
    await requireArtifactReady(page);
    await expect(page.locator('.artifact')).toHaveScreenshot(
      variation + '.png',
      { animations: 'disabled', maxDiffPixels: 0 },
    );
  });
}
