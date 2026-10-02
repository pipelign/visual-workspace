import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { version } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  fail,
  findArtifact,
  readBrand,
  resourcePath,
  tokenDiagnostic,
  loadCatalog,
  selectArtifact,
  loadBrand,
} from './catalog';
import { StudioError } from './contracts';
import { validateHtmlDelivery } from './html-export';
import type {
  Artifact,
  Composition,
  ExportRequest,
  Inspection,
  RenderedArtifact,
  RenderRequest,
  SourceState,
} from './contracts';

export interface RenderEnvironment {
  /** Vite supplies its watched SSR loader; CLI calls use a fresh TSX process. */
  loadModule?: (path: string) => Promise<unknown>;
}
function sha256(bytes: string | Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}
async function bytes(
  root: string,
  path: string,
  item: string,
): Promise<Buffer> {
  try {
    return await readFile(await resourcePath(root, path, item));
  } catch (cause) {
    if (cause instanceof StudioError) throw cause;
    fail(
      'missing-resource',
      item,
      path,
      'resource',
      `Cannot read ${path} for ${item}.`,
      'Restore a readable resource file.',
      cause,
    );
  }
}
async function sourceState(
  root: string,
  paths: string[],
  item: string,
): Promise<SourceState> {
  const files = await Promise.all(
    [...new Set(paths)].sort().map(async (path) => ({
      path,
      sha256: sha256(await bytes(root, path, item)),
    })),
  );
  let revision: string | null = null;
  let dirty: boolean | null = null;
  try {
    revision = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    dirty =
      execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim().length > 0;
  } catch {
    /* A copied workspace has file digests even without Git metadata. */
  }
  return { revision, dirty, files, digest: sha256(JSON.stringify(files)) };
}
export async function inspect(root: string, id: string): Promise<Inspection> {
  const artifact = await findArtifact(root, id);
  const diagnostics: Inspection['diagnostics'] = [];
  let variations: string[] = [];
  const paths = [
    artifact.source,
    artifact.brief,
    artifact.project,
    ...Object.values(artifact.assets),
  ];
  try {
    const brand = await readBrand(root, artifact);
    variations = Object.keys(brand.variations);
    for (const variation of variations) {
      const diagnostic = tokenDiagnostic(artifact, brand, variation);
      if (diagnostic) diagnostics.push(diagnostic);
    }
    for (const font of Object.values(brand.fonts))
      paths.push(font.source, font.license);
  } catch (cause) {
    if (!(cause instanceof StudioError)) throw cause;
    diagnostics.push(cause.diagnostic);
  }
  for (const path of paths) {
    try {
      await bytes(root, path, id);
    } catch (cause) {
      if (!(cause instanceof StudioError)) throw cause;
      diagnostics.push(cause.diagnostic);
    }
  }
  return { ...artifact, variations, diagnostics };
}
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
function isComposition(value: unknown): value is Composition {
  return typeof value === 'function';
}
export async function render(
  root: string,
  request: RenderRequest,
  environment: RenderEnvironment = {},
): Promise<RenderedArtifact> {
  const catalog = await loadCatalog(root);
  const artifact = selectArtifact(catalog.artifacts, request.id);
  const loadedBrand = await loadBrand(root, artifact);
  const brand = loadedBrand.brand;
  const diagnostic = tokenDiagnostic(artifact, brand, request.variation);
  if (diagnostic) throw new StudioError(diagnostic);
  const values = brand.variations[request.variation];
  if (!values)
    fail(
      'unknown-variation',
      request.id,
      artifact.brand,
      request.variation,
      'Variation is unavailable.',
      'Choose a declared variation.',
    );
  const paths = [
    'catalog.json',
    artifact.brand,
    artifact.source,
    artifact.brief,
    artifact.project,
    ...Object.values(artifact.assets),
    ...Object.values(brand.fonts).flatMap((font) => [
      font.source,
      font.license,
    ]),
  ];
  const before = await sourceState(root, paths, artifact.id);
  for (const [path, parsedSource] of [
    ['catalog.json', catalog.source],
    [artifact.brand, loadedBrand.source],
  ] as const) {
    if (
      before.files.find((file) => file.path === path)?.sha256 !==
      sha256(parsedSource)
    )
      fail(
        'source-changed',
        artifact.id,
        path,
        'source',
        'Metadata changed during source resolution.',
        'Retry using the latest saved source.',
      );
  }
  const tokens: Record<string, string> = {};
  const styles: string[] = [];
  const licenses: string[] = [];
  const fontNames = new Map<string, string>();
  for (const role of artifact.tokens) {
    const value = values[role];
    const definition = brand.roles[role];
    if (!value || !definition)
      fail(
        'missing-token',
        artifact.id,
        artifact.brand,
        role,
        `Missing token ${role}.`,
        'Supply this role in the brand.',
      );
    if (definition.kind === 'color') {
      tokens[role] = value;
      continue;
    }
    let name = fontNames.get(value);
    if (!name) {
      const font = brand.fonts[value];
      if (!font)
        fail(
          'missing-resource',
          artifact.id,
          artifact.brand,
          role,
          `Unknown font ${value}.`,
          'Declare this font in the brand.',
        );
      const data = await bytes(root, font.source, artifact.id);
      if (data.subarray(0, 4).toString() !== 'wOF2')
        fail(
          'invalid-resource',
          artifact.id,
          font.source,
          role,
          `Required font ${value} is not WOFF2.`,
          'Replace it with a valid licensed WOFF2 font.',
        );
      name = 'StudioFont' + String(fontNames.size);
      fontNames.set(value, name);
      styles.push(
        `@font-face{font-family:'${name}';src:url('data:font/woff2;base64,${data.toString('base64')}') format('woff2');font-style:normal;font-weight:400;font-display:block}`,
      );
      licenses.push((await bytes(root, font.license, artifact.id)).toString());
    }
    tokens[role] = name;
  }
  const assets: Record<string, string> = {};
  for (const [name, path] of Object.entries(artifact.assets)) {
    const mime = path.endsWith('.svg')
      ? 'image/svg+xml'
      : path.endsWith('.png')
        ? 'image/png'
        : path.endsWith('.jpg') || path.endsWith('.jpeg')
          ? 'image/jpeg'
          : undefined;
    if (!mime)
      fail(
        'invalid-resource',
        artifact.id,
        path,
        name,
        'Unsupported image resource.',
        'Use SVG, PNG, or JPEG.',
      );
    assets[name] =
      `data:${mime};base64,${(await bytes(root, path, artifact.id)).toString('base64')}`;
  }
  const path = await resourcePath(root, artifact.source, artifact.id);
  let markup: string;
  try {
    const module: unknown = await (environment.loadModule
      ? environment.loadModule(path)
      : import(
          /* @vite-ignore */ pathToFileURL(path).href +
            '?source=' +
            before.digest
        ));
    if (
      !module ||
      typeof module !== 'object' ||
      !('compose' in module) ||
      !isComposition(module.compose)
    )
      fail(
        'invalid-composition',
        artifact.id,
        artifact.source,
        'compose',
        'Composition must export a compose function.',
        'Use the documented Composition interface.',
      );
    // The code entry is an authored TypeScript contract; validate the entrypoint,
    // then invoke it with resolved inputs. React validates its returned elements.
    const compose: Composition = module.compose;
    markup = renderToStaticMarkup(
      compose({ dimensions: artifact.dimensions, tokens, assets }),
    );
  } catch (cause) {
    if (cause instanceof StudioError) throw cause;
    fail(
      'render-failed',
      artifact.id,
      artifact.source,
      'compose',
      `Could not render ${artifact.id}.`,
      'Repair the composition source and retry; inspection remains available.',
      cause,
    );
  }
  const after = await sourceState(root, paths, artifact.id);
  if (before.digest !== after.digest)
    fail(
      'source-changed',
      artifact.id,
      artifact.source,
      'source',
      'Source changed during rendering.',
      'Retry using the latest saved source.',
    );
  const record: RenderedArtifact['record'] = {
    id: artifact.id,
    brand: brand.id,
    variation: request.variation,
    format: 'html',
    dimensions: artifact.dimensions,
    source: after,
    renderer: {
      name: 'react-static',
      react: version,
      node: process.versions.node,
      packaging: 'single-file',
    },
  };
  styles.push(
    `@page{size:${String(artifact.dimensions.width)}px ${String(artifact.dimensions.height)}px;margin:0}html,body{margin:0;padding:0}.artifact{width:${String(artifact.dimensions.width)}px;height:${String(artifact.dimensions.height)}px;font-family:'${tokens.bodyFont ?? 'sans-serif'}'}.artifact,.artifact *{box-sizing:border-box}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}`,
  );
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(artifact.title)}</title><meta name="studio-export" content="${escapeHtml(JSON.stringify(record))}"><style>${styles.join('\n')}</style></head><body><div class="artifact">${markup}</div></body></html>\n<!-- Font licenses:\n${licenses.join('\n').replaceAll('--', '—')}\n-->\n`;
  const delivery = { html, record };
  await validateHtmlDelivery(delivery);
  return delivery;
}
export async function exportArtifact(
  root: string,
  request: ExportRequest,
  environment: RenderEnvironment = {},
): Promise<{ directory: string; record: RenderedArtifact['record'] }> {
  const artifact: Artifact = await findArtifact(root, request.id);
  if (request.format !== 'html')
    fail(
      'unsupported-format',
      artifact.id,
      artifact.source,
      'format',
      `${request.format} export is unavailable for ${artifact.id}.`,
      'Use its declared HTML capability.',
    );
  const rendered = await createHtmlExport(root, request, environment);
  const output = resolve(request.output);
  const workspace = await resourcePath(root, 'catalog.json', artifact.id);
  if (
    output === resolve(root) ||
    workspace.startsWith(output + (process.platform === 'win32' ? '\\' : '/'))
  )
    fail(
      'invalid-output',
      artifact.id,
      output,
      'output',
      'Export output cannot contain workspace source.',
      'Choose a separate exports directory.',
    );
  const identity = randomUUID();
  const staging = join(output, '.' + identity);
  const directory = join(output, artifact.id + '-' + identity);
  try {
    await mkdir(output, { recursive: true });
    await mkdir(staging);
    await writeFile(join(staging, 'artifact.html'), rendered.html);
    await writeFile(
      join(staging, 'record.json'),
      JSON.stringify(rendered.record, null, 2) + '\n',
    );
    await rename(staging, directory);
  } catch (cause) {
    await rm(staging, { recursive: true, force: true }).catch(() => undefined);
    fail(
      'export-failed',
      artifact.id,
      output,
      'output',
      'Could not save the HTML delivery.',
      'Choose a writable export directory; prior deliveries and source are preserved.',
      cause,
    );
  }
  return { directory, record: rendered.record };
}

export async function createHtmlExport(
  root: string,
  request: RenderRequest & { format: string },
  environment: RenderEnvironment = {},
): Promise<RenderedArtifact> {
  const artifact = await findArtifact(root, request.id);
  if (request.format !== 'html')
    fail(
      'unsupported-format',
      artifact.id,
      artifact.source,
      'format',
      `${request.format} export is unavailable for ${artifact.id}.`,
      'Use its declared HTML capability.',
    );
  const delivery = await render(root, request, environment);
  return delivery;
}
