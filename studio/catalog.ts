import { readFile, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import type { Artifact, Brand, Diagnostic } from './contracts';
import { StudioError } from './contracts';

export function fail(
  code: string,
  item: string,
  source: string,
  field: string,
  message: string,
  repair: string,
  cause?: unknown,
): never {
  throw new StudioError({ code, item, source, field, message, repair }, cause);
}
export function object(
  value: unknown,
  source: string,
  field = 'root',
): Record<string, unknown> {
  if (!isObject(value))
    fail(
      'invalid-metadata',
      'catalog',
      source,
      field,
      `Expected an object at ${field} in ${source}.`,
      'Use the documented metadata format.',
    );
  return value;
}
function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function string(value: unknown, source: string, field: string): string {
  if (typeof value !== 'string' || !value.trim())
    fail(
      'invalid-metadata',
      'catalog',
      source,
      field,
      `Expected a nonempty string at ${field} in ${source}.`,
      'Supply this required metadata field.',
    );
  return value;
}
function strings(value: unknown, source: string, field: string): string[] {
  if (!Array.isArray(value))
    fail(
      'invalid-metadata',
      'catalog',
      source,
      field,
      `Expected a list at ${field}.`,
      'Supply a list of strings.',
    );
  return value.map((entry: unknown) => string(entry, source, field));
}
function stringMap(
  value: unknown,
  source: string,
  field: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object(value, source, field)).map(([key, entry]) => [
      key,
      string(entry, source, field + '.' + key),
    ]),
  );
}
export async function resourcePath(
  root: string,
  path: string,
  item: string,
): Promise<string> {
  let base: string;
  try {
    base = await realpath(root);
  } catch (cause) {
    fail(
      'missing-workspace',
      item,
      root,
      'workspace',
      `Cannot open workspace ${root}.`,
      'Create the workspace directory or correct STUDIO_WORKSPACE.',
      cause,
    );
  }
  const resolved = resolve(base, path);
  function within(candidate: string) {
    const remainder = relative(base, candidate);
    return (
      remainder !== '..' &&
      !remainder.startsWith(
        '..' + (process.platform === 'win32' ? '\\' : '/'),
      ) &&
      !isAbsolute(remainder)
    );
  }
  if (!within(resolved))
    fail(
      'invalid-path',
      item,
      path,
      'path',
      `Resource ${path} leaves the workspace.`,
      'Move the resource into the workspace and use a relative path.',
    );
  try {
    const actual = await realpath(resolved);
    if (!within(actual))
      fail(
        'invalid-path',
        item,
        path,
        'path',
        `Resource ${path} links outside the workspace.`,
        'Use a resource owned by this workspace.',
      );
    return actual;
  } catch (cause) {
    if (cause instanceof StudioError) throw cause;
    fail(
      'missing-resource',
      item,
      path,
      'path',
      `Cannot read required resource ${path} for ${item}.`,
      'Restore the file or correct its declared relative path.',
      cause,
    );
  }
}
async function json(
  root: string,
  path: string,
): Promise<{ data: unknown; source: Buffer }> {
  const file = await resourcePath(root, path, 'catalog');
  try {
    const source = await readFile(file);
    const data: unknown = JSON.parse(source.toString());
    return { data, source };
  } catch (cause) {
    fail(
      'invalid-metadata',
      'catalog',
      path,
      'json',
      `Cannot parse ${path}.`,
      'Repair the JSON syntax.',
      cause,
    );
  }
}
export async function discover(root: string): Promise<Artifact[]> {
  return (await loadCatalog(root)).artifacts;
}
export async function loadCatalog(
  root: string,
): Promise<{ artifacts: Artifact[]; source: Buffer }> {
  const parsed = await json(root, 'catalog.json');
  const catalog = object(parsed.data, 'catalog.json');
  if (!Array.isArray(catalog.artifacts))
    fail(
      'invalid-metadata',
      'catalog',
      'catalog.json',
      'artifacts',
      'Catalog artifacts must be a list.',
      'Add an artifacts array.',
    );
  const artifacts = catalog.artifacts.map((entry: unknown) => {
    const item = object(entry, 'catalog.json', 'artifact');
    const text = (field: string) => string(item[field], 'catalog.json', field);
    const id = text('id');
    if (!/^[a-z][a-z0-9-]*$/.test(id))
      fail(
        'invalid-identity',
        id,
        'catalog.json',
        'id',
        `Invalid artifact identity ${id}.`,
        'Use a stable lowercase ID with letters, digits, and hyphens.',
      );
    const size = object(item.dimensions, 'catalog.json', 'dimensions');
    const dimension = (field: string): number => {
      const value = size[field];
      if (
        typeof value !== 'number' ||
        !Number.isSafeInteger(value) ||
        value < 1 ||
        value > 16384
      )
        fail(
          'invalid-metadata',
          id,
          'catalog.json',
          'dimensions.' + field,
          'Dimensions must be integers from 1 to 16384 pixels.',
          'Set the intended destination dimensions.',
        );
      return value;
    };
    if (
      item.lifecycle !== 'draft' ||
      JSON.stringify(item.capabilities) !== '["html"]'
    )
      fail(
        'invalid-metadata',
        id,
        'catalog.json',
        'lifecycle/capabilities',
        'This entry supports standalone drafts with HTML capability.',
        'Declare lifecycle draft and capabilities ["html"].',
      );
    const artifact: Artifact = {
      id,
      title: text('title'),
      description: text('description'),
      category: text('category'),
      tags: strings(item.tags, 'catalog.json', 'tags'),
      usage: text('usage'),
      lifecycle: 'draft',
      project: text('project'),
      brief: text('brief'),
      brand: text('brand'),
      source: text('source'),
      dimensions: { width: dimension('width'), height: dimension('height') },
      capabilities: ['html'],
      tokens: strings(item.tokens, 'catalog.json', 'tokens'),
      assets: stringMap(item.assets, 'catalog.json', 'assets'),
    };
    return artifact;
  });
  const ids = new Set<string>();
  for (const artifact of artifacts) {
    if (ids.has(artifact.id))
      fail(
        'duplicate-identity',
        artifact.id,
        'catalog.json',
        'id',
        `Duplicate identity ${artifact.id}.`,
        'Assign a unique stable ID to each artifact.',
      );
    ids.add(artifact.id);
  }
  return { artifacts, source: parsed.source };
}
export async function findArtifact(
  root: string,
  id: string,
): Promise<Artifact> {
  return selectArtifact(await discover(root), id);
}
export function selectArtifact(artifacts: Artifact[], id: string): Artifact {
  const artifact = artifacts.find((item) => item.id === id);
  if (!artifact)
    fail(
      'unknown-artifact',
      id,
      'catalog.json',
      'id',
      `No artifact named ${id}.`,
      'Use discovery to select an existing ID.',
    );
  return artifact;
}
export async function readBrand(
  root: string,
  artifact: Artifact,
): Promise<Brand> {
  return (await loadBrand(root, artifact)).brand;
}
export async function loadBrand(
  root: string,
  artifact: Artifact,
): Promise<{ brand: Brand; source: Buffer }> {
  const source = artifact.brand;
  const parsed = await json(root, source);
  const data = object(parsed.data, source);
  const roles = Object.fromEntries(
    Object.entries(object(data.roles, source, 'roles')).map(
      ([name, value]): [string, Brand['roles'][string]] => {
        const role = object(value, source, 'roles.' + name);
        if (role.kind !== 'color' && role.kind !== 'font')
          fail(
            'invalid-metadata',
            artifact.id,
            source,
            name,
            `Unknown token kind for ${name}.`,
            'Choose color or font.',
          );
        return [
          name,
          {
            kind: role.kind,
            description: string(
              role.description,
              source,
              'roles.' + name + '.description',
            ),
          },
        ];
      },
    ),
  );
  const variations = Object.fromEntries(
    Object.entries(object(data.variations, source, 'variations')).map(
      ([name, value]) => [name, stringMap(value, source, 'variations.' + name)],
    ),
  );
  if (!Object.keys(variations).length)
    fail(
      'missing-variation',
      artifact.id,
      source,
      'variations',
      'A brand needs at least one variation.',
      'Add a complete variation.',
    );
  const fonts = Object.fromEntries(
    Object.entries(object(data.fonts, source, 'fonts')).map(([name, value]) => {
      const font = object(value, source, 'fonts.' + name);
      return [
        name,
        {
          source: string(font.source, source, 'fonts.' + name + '.source'),
          license: string(font.license, source, 'fonts.' + name + '.license'),
        },
      ];
    }),
  );
  return {
    brand: { id: string(data.id, source, 'id'), roles, variations, fonts },
    source: parsed.source,
  };
}
export function tokenDiagnostic(
  artifact: Artifact,
  brand: Brand,
  variation: string,
): Diagnostic | undefined {
  const values = brand.variations[variation];
  if (!values)
    return {
      code: 'unknown-variation',
      item: artifact.id,
      source: artifact.brand,
      field: variation,
      message: `Unknown variation ${variation}.`,
      repair: 'Choose a declared brand variation.',
    };
  for (const role of artifact.tokens) {
    const definition = brand.roles[role];
    const value = values[role];
    if (!definition || !value)
      return {
        code: 'missing-token',
        item: artifact.id,
        source: artifact.brand,
        field: role,
        message: `Missing ${role} token in ${variation} for ${artifact.id}.`,
        repair:
          'Describe the semantic role and supply its value in every variation.',
      };
    if (
      definition.kind === 'color'
        ? !/^#[0-9a-f]{6}$/i.test(value)
        : !brand.fonts[value]
    )
      return {
        code: 'invalid-token',
        item: artifact.id,
        source: artifact.brand,
        field: role,
        message: `Invalid ${role} value in ${variation}.`,
        repair:
          'Use a six-digit hex color or a declared local font ID for this role.',
      };
  }
  return undefined;
}
