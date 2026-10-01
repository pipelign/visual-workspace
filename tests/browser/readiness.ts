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

export async function requireArtifactReady(page: Page) {
  await page.evaluate(async () => {
    const faces = [...document.fonts].filter((font) =>
      font.family.includes('StudioFont'),
    );
    if (!faces.length)
      throw new Error('Required Studio Font was not declared.');
    for (const face of faces) {
      try {
        await face.load();
      } catch {
        throw new Error('Required Studio Font did not load.');
      }
      if (face.status !== 'loaded')
        throw new Error('Required Studio Font did not load.');
    }
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
}
