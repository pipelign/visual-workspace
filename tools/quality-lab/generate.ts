import { mkdir, writeFile } from 'node:fs/promises';
import { renderFixture } from './render';
// PNG/selected-part (04) and PDF geometry (06) still need a development probe.
const directory = new URL('../../studio/public/probes/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL('delivery.html', directory),
  (await renderFixture({ variation: 'dark' })).html,
);
console.log('Rendered retained part/PDF development probe.');
