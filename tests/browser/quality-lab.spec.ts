import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { requireFixtureReady } from './readiness';

test('lab controls work by keyboard and the rendered UI has no detected accessibility violations', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Hide dark variation' });
  await page.keyboard.press('Tab');
  await expect(control).toBeFocused();
  await control.press('Space');
  await expect(page.getByTitle('Dark figure')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Show dark variation' })
    .press('Enter');
  await expect(page.getByTitle('Dark figure')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  const screenshot = testInfo.outputPath('lab.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  await testInfo.attach('Lab controls and previews', {
    path: screenshot,
    contentType: 'image/png',
  });
});

for (const fixture of [
  { variation: 'light', target: 'figure', width: 640, height: 360 },
  { variation: 'dark', target: 'figure', width: 640, height: 360 },
  { variation: 'dark', target: 'delivery', width: 264, height: 128 },
] as const) {
  test(
    'offline ' +
      fixture.variation +
      ' ' +
      fixture.target +
      ' retains resources and export geometry',
    async ({ browser, browserName }, testInfo) => {
      const directory = await mkdtemp(join(tmpdir(), 'visual workspace é # '));
      const context = await browser.newContext({
        offline: true,
        javaScriptEnabled: false,
        deviceScaleFactor: 1,
      });
      try {
        const file =
          fixture.target === 'delivery' ? 'delivery' : fixture.variation;
        const html = await readFile(
          new URL(
            '../../tools/quality-lab/public/fixtures/' + file + '.html',
            import.meta.url,
          ),
          'utf8',
        );
        const localFile = join(directory, 'fixture #100%.html');
        await writeFile(localFile, html);
        const page = await context.newPage();
        const networkRequests: string[] = [];
        const browserErrors: string[] = [];
        page.on('request', (request) => {
          if (/^https?:/.test(request.url()))
            networkRequests.push(request.url());
        });
        page.on('pageerror', (error) => browserErrors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error') browserErrors.push(message.text());
        });
        await page.goto(pathToFileURL(localFile).href);
        await requireFixtureReady(page);
        await expect(
          page.getByRole('heading', { name: 'Delivery', exact: true }),
        ).toBeVisible();
        if (fixture.target === 'delivery')
          await expect(
            page.getByRole('heading', { name: 'Source', exact: true }),
          ).toHaveCount(0);
        else await expect(page.getByAltText('Fixed blue circle')).toBeVisible();
        expect(
          await page.locator('.fixture').evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return { width: bounds.width, height: bounds.height };
          }),
        ).toEqual({ width: fixture.width, height: fixture.height });
        const image = testInfo.outputPath('export.png');
        const png = await page
          .locator('.fixture')
          .screenshot({ path: image, animations: 'disabled' });
        expect(png.subarray(1, 4).toString()).toBe('PNG');
        expect(png.readUInt32BE(16)).toBe(fixture.width);
        expect(png.readUInt32BE(20)).toBe(fixture.height);
        await testInfo.attach('Portable PNG', {
          path: image,
          contentType: 'image/png',
        });
        if (browserName === 'chromium') {
          const path = testInfo.outputPath('export.pdf');
          const pdfBytes = await page.pdf({
            path,
            preferCSSPageSize: true,
            printBackground: true,
          });
          const pdf = await PDFDocument.load(pdfBytes);
          expect(pdf.getPageCount()).toBe(1);
          expect(pdf.getPage(0).getWidth()).toBeCloseTo(
            fixture.width * 0.75,
            0,
          );
          expect(pdf.getPage(0).getHeight()).toBeCloseTo(
            fixture.height * 0.75,
            0,
          );
          await testInfo.attach('PDF geometry probe', {
            path,
            contentType: 'application/pdf',
          });
        }
        expect(networkRequests).toEqual([]);
        expect(browserErrors).toEqual([]);
      } finally {
        await context.close();
        await rm(directory, { recursive: true, force: true });
      }
    },
  );
}

test('readiness rejects a corrupt font rather than approving fallback text', async ({
  page,
}) => {
  const html = await readFile(
    new URL(
      '../../tools/quality-lab/public/fixtures/light.html',
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
  await expect(requireFixtureReady(page)).rejects.toThrow(
    /Required Fixture Inter font did not load/,
  );
});
