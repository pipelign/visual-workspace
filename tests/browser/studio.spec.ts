import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { requireArtifactReady } from './readiness';

test('studio discovers a draft, compares isolated variations, and delivers by keyboard', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1480, height: 900 });
  await page.goto('/');
  const figure = page.getByLabel('Figure', { exact: true });
  await page.keyboard.press('Tab');
  await expect(figure).toBeFocused();
  await expect(figure).toHaveValue('source-to-delivery');
  await expect(page.getByTitle('light figure')).toBeVisible();
  await expect(page.getByTitle('dark figure')).toBeVisible();
  const lightBounds = await page.getByTitle('light figure').boundingBox();
  const darkBounds = await page.getByTitle('dark figure').boundingBox();
  expect(lightBounds?.y).toBe(darkBounds?.y);
  expect(darkBounds?.x).toBeGreaterThan(lightBounds?.x ?? 0);
  await page.getByRole('button', { name: 'Hide comparison' }).press('Enter');
  await expect(page.getByTitle('dark figure')).toHaveCount(0);
  await page.getByRole('button', { name: 'Compare variations' }).press('Space');
  await expect(page.getByTitle('dark figure')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download dark HTML' }).press('Enter');
  const delivery = await download;
  const path = testInfo.outputPath('download-dark.html');
  await delivery.saveAs(path);
  expect(await readFile(path, 'utf8')).toContain('studio-export');
  const results = await new AxeBuilder({ page })
    // Axe's frame messaging requires script execution. Scan the shell here and
    // each static delivery directly below; preview frames disable scripts.
    .setLegacyMode()
    .options({ iframes: false })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('studio.png'),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('studio-narrow.png'),
    fullPage: true,
  });
  for (const variation of ['light', 'dark']) {
    await page.goto('/figures/source-to-delivery-' + variation + '.html');
    await requireArtifactReady(page);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
});

for (const variation of ['light', 'dark']) {
  test(
    'offline ' +
      variation +
      ' studio delivery retains its resources and geometry',
    async ({ browser }, testInfo) => {
      const directory = await mkdtemp(join(tmpdir(), 'visual workspace é # '));
      const context = await browser.newContext({
        offline: true,
        javaScriptEnabled: false,
        deviceScaleFactor: 1,
      });
      try {
        const html = await readFile(
          new URL(
            '../../studio/public/figures/source-to-delivery-' +
              variation +
              '.html',
            import.meta.url,
          ),
          'utf8',
        );
        const localFile = join(directory, 'figure #100%.html');
        await writeFile(localFile, html);
        const page = await context.newPage();
        const requests: string[] = [];
        const errors: string[] = [];
        page.on('request', (request) => {
          if (/^https?:/.test(request.url())) requests.push(request.url());
        });
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        await page.goto(pathToFileURL(localFile).href);
        await requireArtifactReady(page);
        await expect(
          page.getByRole('heading', { name: 'Delivery', exact: true }),
        ).toBeVisible();
        await expect(page.getByAltText('Fixed blue circle')).toBeVisible();
        expect(
          await page.locator('.artifact').evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          }),
        ).toEqual({ width: 640, height: 360 });
        const path = testInfo.outputPath(variation + '.png');
        await page
          .locator('.artifact')
          .screenshot({ path, animations: 'disabled' });
        await testInfo.attach('Portable HTML appearance', {
          path,
          contentType: 'image/png',
        });
        expect(requests).toEqual([]);
        expect(errors).toEqual([]);
      } finally {
        await context.close();
        await rm(directory, { recursive: true, force: true });
      }
    },
  );
}
test('readiness rejects corrupt studio fonts instead of approving fallback typography', async ({
  page,
}) => {
  const html = await readFile(
    new URL(
      '../../studio/public/figures/source-to-delivery-light.html',
      import.meta.url,
    ),
    'utf8',
  );
  await page.setContent(
    html.replace(
      /data:font\/woff2;base64,[A-Za-z0-9+/=]+/,
      'data:font/woff2;base64,AAAA',
    ),
  );
  await expect(requireArtifactReady(page)).rejects.toThrow(
    /Required Studio Font/,
  );
});
test('render failure stays actionable and the draft stays inspectable', async ({
  page,
}) => {
  await page.route('**/api/render?*', (route) =>
    route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        diagnostic: {
          message: 'Required mark is missing.',
          repair: 'Restore mark.svg.',
        },
      }),
    }),
  );
  await page.goto('/');
  await expect(
    page.getByText('Draft · 640 × 360 px', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('alert').first()).toContainText(
    'Restore mark.svg.',
  );
  await expect(
    page.getByRole('button', { name: 'Download light HTML' }),
  ).toBeDisabled();
});
