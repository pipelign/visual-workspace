import { describe, expect, it } from 'vitest';
import { renderFixture } from './render';

describe('portable rendering evaluation', () => {
  it('resolves brand values into a self-contained static delivery', async () => {
    const light = await renderFixture({ variation: 'light' });
    const dark = await renderFixture({ variation: 'dark' });
    expect(light.html).toContain('data:font/woff2;base64,');
    expect(light.html).toContain('data:image/svg+xml;base64,');
    expect(light.html).toContain('Source');
    expect(light.html).toContain('Delivery');
    expect(light.html).not.toMatch(/<script\b|(?:src|href)="https?:/);
    expect(light.html).toContain('#f8fafc');
    expect(dark.html).toContain('#101827');
    expect(light.dimensions).toEqual({ width: 640, height: 360 });
  });
  it('renders the configured selection without its unrelated neighbor', async () => {
    const selected = await renderFixture({
      variation: 'dark',
      target: 'delivery',
    });
    expect(selected.html).toContain('Delivery');
    expect(selected.html).not.toContain('Source');
    expect(selected.dimensions).toEqual({ width: 264, height: 128 });
  });
  it('reports a missing required font rather than silently substituting it', async () => {
    await expect(
      renderFixture({
        variation: 'light',
        fontPath: new URL('./missing-fixture-font.woff2', import.meta.url),
      }),
    ).rejects.toThrow(/fixture font.*missing-fixture-font/i);
  });
});
