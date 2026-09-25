import { mkdir, writeFile } from 'node:fs/promises';
import { renderFixture } from './render';

const directory = new URL('./public/fixtures/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const variation of ['light', 'dark'] as const) {
  const result = await renderFixture({ variation });
  await writeFile(new URL(variation + '.html', directory), result.html);
}
const part = await renderFixture({ variation: 'dark', target: 'delivery' });
await writeFile(new URL('delivery.html', directory), part.html);
console.log('Rendered neutral fixtures in tools/quality-lab/public/fixtures.');
