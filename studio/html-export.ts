import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { fail } from './catalog';
import type { RenderedArtifact } from './contracts';

/** Verify actual embedded resources before a supported HTML delivery succeeds. */
export async function validateHtmlDelivery(
  delivery: RenderedArtifact,
): Promise<void> {
  let browser: Browser | undefined;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({
      offline: true,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('request', (request) => {
      if (/^https?:/.test(request.url()))
        errors.push('External resource: ' + request.url());
    });
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setContent(delivery.html);
    await page.evaluate(async () => {
      if (document.querySelector('script, iframe, object, embed'))
        throw new Error(
          'A static composition cannot include scripts or embedded documents.',
        );
      for (const element of document.querySelectorAll('*')) {
        for (const attribute of element.attributes) {
          if (
            /^on/i.test(attribute.name) ||
            /^javascript:/i.test(attribute.value.trim())
          )
            throw new Error(
              'A static composition cannot include executable attributes.',
            );
        }
      }
      const fonts = [...document.fonts];
      if (!fonts.length)
        throw new Error('No required local font was declared.');
      await Promise.all(fonts.map((font) => font.load()));
      if (fonts.some((font) => font.status !== 'loaded'))
        throw new Error('Required local font did not load.');
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    if (errors.length) throw new Error(errors.join('\n'));
  } catch (cause) {
    fail(
      'resource-failed',
      delivery.record.id,
      'rendered HTML',
      'resources',
      'A required font or image failed to load for this delivery.',
      'Repair the declared resources and retry; no delivery was saved.',
      cause,
    );
  } finally {
    await browser?.close();
  }
}
