import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
  cp,
  readdir,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { vi } from 'vitest';
import * as filesystem from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { discover, inspect, render, exportArtifact } from './index';

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof filesystem>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});

const root = resolve('workspace');
const directories: string[] = [];
afterEach(async () => {
  await Promise.all(
    directories.map((path) => rm(path, { recursive: true, force: true })),
  );
  directories.length = 0;
});
async function temporary() {
  const directory = await mkdtemp(join(tmpdir(), 'studio-'));
  directories.push(directory);
  return directory;
}
it('finds and inspects the draft without rendering or starting the gallery', async () => {
  const items = await discover(root);
  expect(items.map((item) => item.id)).toEqual(['source-to-delivery']);
  const item = await inspect(root, 'source-to-delivery');
  expect(item.lifecycle).toBe('draft');
  expect(item.capabilities).toEqual(['html']);
  expect(item.dimensions).toEqual({ width: 640, height: 360 });
  expect(item.diagnostics).toEqual([]);
});
it('resolves isolated variations into static HTML with actual resources', async () => {
  const light = await render(root, {
    id: 'source-to-delivery',
    variation: 'light',
  });
  const dark = await render(root, {
    id: 'source-to-delivery',
    variation: 'dark',
  });
  expect(light.html).toContain('#f8fafc');
  expect(dark.html).toContain('#101827');
  expect(light.html).toContain('data:font/woff2;base64,');
  expect(light.html).toContain('data:image/svg+xml;base64,');
  expect(light.html).not.toMatch(/<script\b|(?:src|href)="https?:/);
  expect(light.record.source.files.length).toBeGreaterThan(4);
});
it('preserves prior deliveries and records dirty source and the selected settings', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  execFileSync('git', ['init', '--quiet'], { cwd: copy });
  execFileSync('git', ['add', '.'], { cwd: copy });
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Studio test',
      '-c',
      'user.email=studio@example.invalid',
      'commit',
      '--quiet',
      '-m',
      'Fixture',
    ],
    { cwd: copy },
  );
  const brief = join(copy, 'projects/source-to-delivery/brief.md');
  await writeFile(
    brief,
    (await readFile(brief, 'utf8')) + '\nSaved owner feedback.\n',
  );
  const output = await temporary();
  const first = await exportArtifact(copy, {
    id: 'source-to-delivery',
    variation: 'dark',
    format: 'html',
    output,
  });
  const original = await readFile(
    join(first.directory, 'artifact.html'),
    'utf8',
  );
  const brandPath = join(copy, 'brands/neutral/brand.json');
  await writeFile(
    brandPath,
    (await readFile(brandPath, 'utf8')).replace('#101827', '#333333'),
  );
  const second = await exportArtifact(copy, {
    id: 'source-to-delivery',
    variation: 'light',
    format: 'html',
    output,
  });
  expect(first.directory).not.toBe(second.directory);
  expect(await readFile(join(first.directory, 'artifact.html'), 'utf8')).toBe(
    original,
  );
  expect(original).toContain('#101827');
  expect(first.record).toMatchObject({
    id: 'source-to-delivery',
    variation: 'dark',
    format: 'html',
    dimensions: { width: 640, height: 360 },
    source: { dirty: true },
  });
  await expect(
    exportArtifact(root, {
      id: 'source-to-delivery',
      variation: 'light',
      format: 'png',
      output,
    }),
  ).rejects.toMatchObject({
    diagnostic: { code: 'unsupported-format', item: 'source-to-delivery' },
  });
});

it('rejects invalid and duplicate identities with a specific repair action', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  const path = join(copy, 'catalog.json');
  const source = await readFile(path, 'utf8');
  await writeFile(
    path,
    source.replace('"id": "source-to-delivery"', '"id": "INVALID ID"'),
  );
  await expect(discover(copy)).rejects.toMatchObject({
    diagnostic: { code: 'invalid-identity', field: 'id' },
  });
  const data: unknown = JSON.parse(source);
  if (
    !data ||
    typeof data !== 'object' ||
    !('artifacts' in data) ||
    !Array.isArray(data.artifacts)
  )
    throw new Error('Invalid fixture');
  const entries: unknown[] = data.artifacts;
  await writeFile(
    path,
    JSON.stringify({ artifacts: [...entries, ...entries] }),
  );
  await expect(discover(copy)).rejects.toMatchObject({
    diagnostic: { code: 'duplicate-identity' },
  });
});
it('rejects corrupt required images before delivering or saving output', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  const output = await temporary();
  await writeFile(
    join(copy, 'projects/source-to-delivery/assets/mark.svg'),
    '<svg>broken',
  );
  await expect(
    exportArtifact(copy, {
      id: 'source-to-delivery',
      variation: 'light',
      format: 'html',
      output,
    }),
  ).rejects.toMatchObject({ diagnostic: { code: 'resource-failed' } });
  expect(await readdir(output)).toEqual([]);
});
it('reports an unusable output location while preserving the existing file', async () => {
  const directory = await temporary();
  const output = join(directory, 'existing.txt');
  await writeFile(output, 'Keep this owner file.');
  await expect(
    exportArtifact(root, {
      id: 'source-to-delivery',
      variation: 'light',
      format: 'html',
      output,
    }),
  ).rejects.toMatchObject({
    diagnostic: { code: 'export-failed', field: 'output' },
  });
  expect(await readFile(output, 'utf8')).toBe('Keep this owner file.');
});
it('reports a missing workspace through the documented diagnostic contract', async () => {
  await expect(
    discover(join(await temporary(), 'absent')),
  ).rejects.toMatchObject({
    diagnostic: { code: 'missing-workspace', field: 'workspace' },
  });
});
it('rejects a saved brand edit between parsing and source capture', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  const path = join(copy, 'brands/neutral/brand.json');
  const actualRead = (
    await vi.importActual<typeof filesystem>('node:fs/promises')
  ).readFile;
  let changed = false;
  const spy = vi
    .mocked(filesystem.readFile)
    .mockImplementation(
      async (...args: Parameters<typeof filesystem.readFile>) => {
        const result = await actualRead(...args);
        if (!changed && args[0] === path) {
          changed = true;
          await writeFile(
            path,
            result.toString().replace('#f8fafc', '#333333'),
          );
        }
        return result;
      },
    );
  try {
    await expect(
      render(copy, { id: 'source-to-delivery', variation: 'light' }),
    ).rejects.toMatchObject({ diagnostic: { code: 'source-changed' } });
  } finally {
    spy.mockImplementation(actualRead);
  }
});
it('keeps a broken draft inspectable and reports repair guidance', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  await rm(join(copy, 'projects/source-to-delivery/assets/mark.svg'));
  const item = await inspect(copy, 'source-to-delivery');
  expect(item.id).toBe('source-to-delivery');
  expect(
    item.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === 'missing-resource' && diagnostic.repair.length > 0,
    ),
  ).toBe(true);
  await expect(
    render(copy, { id: item.id, variation: 'light' }),
  ).rejects.toMatchObject({ diagnostic: { code: 'missing-resource' } });
});
it('changes brand values and adds a variation without copying figure source', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  const path = join(copy, 'brands/neutral/brand.json');
  const brand: unknown = JSON.parse(await readFile(path, 'utf8'));
  if (!brand || typeof brand !== 'object' || !('variations' in brand))
    throw new Error('Invalid fixture');
  await writeFile(
    path,
    JSON.stringify({
      ...brand,
      variations: {
        light: {
          canvas: '#fff000',
          surface: '#ffffff',
          text: '#172338',
          muted: '#475569',
          border: '#b7c9db',
          workflowAccent: '#2160a8',
          bodyFont: 'inter',
          headingFont: 'inter',
        },
        sepia: {
          canvas: '#fff000',
          surface: '#ffffff',
          text: '#172338',
          muted: '#475569',
          border: '#b7c9db',
          workflowAccent: '#2160a8',
          bodyFont: 'inter',
          headingFont: 'inter',
        },
      },
    }),
  );
  const changed = await render(copy, {
    id: 'source-to-delivery',
    variation: 'sepia',
  });
  expect(changed.html).toContain('#fff000');
  expect((await inspect(copy, 'source-to-delivery')).variations).toEqual([
    'light',
    'sepia',
  ]);
  await writeFile(
    path,
    JSON.stringify({ ...brand, variations: { light: {} } }),
  );
  await expect(
    render(copy, { id: 'source-to-delivery', variation: 'light' }),
  ).rejects.toMatchObject({
    diagnostic: { code: 'missing-token', field: 'canvas' },
  });
});
it('applies a separately resolved heading font in the actual browser output', async () => {
  const copy = await temporary();
  await cp(root, copy, { recursive: true });
  const path = join(copy, 'brands/neutral/brand.json');
  const source = await readFile(path, 'utf8');
  await writeFile(
    path,
    source
      .replaceAll('"headingFont": "inter"', '"headingFont": "heading"')
      .replace(
        '"fonts": {',
        '"fonts": { "heading": { "source": "brands/neutral/inter.woff2", "license": "brands/neutral/FONT-LICENSE.txt" },',
      ),
  );
  const output = await render(copy, {
    id: 'source-to-delivery',
    variation: 'light',
  });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(output.html);
    const resolved = await page.evaluate(() => ({
      heading: getComputedStyle(document.querySelector('h1') ?? document.body)
        .fontFamily,
      body: getComputedStyle(
        document.querySelector('.artifact') ?? document.body,
      ).fontFamily,
    }));
    expect(resolved.heading).not.toBe(resolved.body);
  } finally {
    await browser.close();
  }
});
