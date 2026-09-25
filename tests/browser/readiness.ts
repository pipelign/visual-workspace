import type { Page } from '@playwright/test';

export async function requireFixtureReady(page: Page) {
  await page.evaluate(async () => {
    try {
      await document.fonts.load('16px "Fixture Inter"');
      await document.fonts.ready;
    } catch {
      throw new Error('Required Fixture Inter font did not load');
    }
    const faces = [...document.fonts].filter((font) =>
      font.family.includes('Fixture Inter'),
    );
    if (faces.length !== 1 || faces.some((font) => font.status !== 'loaded')) {
      throw new Error('Required Fixture Inter font did not load');
    }
    await Promise.all([...document.images].map((image) => image.decode()));
  });
}
