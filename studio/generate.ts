import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { discover, inspect, exportArtifact } from './index';

const root = resolve('workspace');
const output = resolve('studio/public/figures');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of await discover(root)) {
  for (const variation of (await inspect(root, item.id)).variations) {
    const delivery = await exportArtifact(root, {
      id: item.id,
      variation,
      format: 'html',
      output: 'artifacts/generated-exports',
    });
    await writeFile(
      join(output, item.id + '-' + variation + '.html'),
      await readFile(join(delivery.directory, 'artifact.html')),
    );
  }
}
console.log('Rendered public studio HTML deliveries.');
