import { expect, it } from 'vitest';
import { renderFixture } from './render';
it('retains the selected-part probe until product exports replace it', async () => {
  const selected = await renderFixture({ variation: 'dark' });
  expect(selected.html).toContain('Delivery');
  expect(selected.html).not.toContain('Source');
  expect(selected.dimensions).toEqual({ width: 264, height: 128 });
});
