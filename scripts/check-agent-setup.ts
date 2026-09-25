import { createHash } from 'node:crypto';
import {
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(label + ' must be an object');
  }
  return Object.fromEntries(Object.entries(value));
}
function text(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new Error(label + ' must be a string');
  return value;
}
function isFile(path: string): boolean {
  return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
}
function isDirectory(path: string): boolean {
  return statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
}
function isSymlink(path: string): boolean {
  return lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink() ?? false;
}
function digest(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
function filesIn(folder: string, prefix = ''): string[] {
  if (!isDirectory(folder)) return [];
  const files: string[] = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink() || entry.isFile()) files.push(relative);
    else if (entry.isDirectory())
      files.push(...filesIn(join(folder, entry.name), relative + '/'));
  }
  return files.sort();
}

/** Validate an installed skill snapshot and its repository adapters, offline. */
export function checkAgentSetup(root: string): string[] {
  const errors: string[] = [];
  const data: unknown = JSON.parse(
    readFileSync(join(root, '.agents/matt-pocock-skills.lock.json'), 'utf8'),
  );
  const lock = record(data, 'Skill lock');
  if (lock.version !== 1) return ['Unsupported skill lock version'];
  if (!/^[0-9a-f]{40}$/.test(text(lock.revision, 'Lock revision')))
    errors.push('Lock revision must be a full commit SHA');
  if (!Array.isArray(lock.skills))
    throw new Error('Lock skills must be an array');
  if (lock.skills.length === 0)
    errors.push('The vendored skill selection is empty');
  const skillsRoot = join(root, '.agents/skills');
  const names = new Set<string>();
  for (const item of lock.skills) {
    const skill = record(item, 'Locked skill');
    const name = text(skill.name, 'Skill name');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push('Invalid skill name: ' + name);
      continue;
    }
    if (names.has(name)) errors.push('Duplicate skill in lock: ' + name);
    names.add(name);
    const folder = join(skillsRoot, name);
    const expected = record(skill.files, name + ': locked files');
    if (!Object.hasOwn(expected, 'SKILL.md'))
      errors.push(name + ': lock is missing SKILL.md');
    const actual = new Set(filesIn(folder));
    for (const relative of Object.keys(expected).sort()) {
      if (!actual.has(relative)) errors.push(name + ': missing ' + relative);
    }
    for (const relative of actual) {
      const path = join(folder, relative);
      if (!Object.hasOwn(expected, relative))
        errors.push(name + ': unexpected file ' + relative);
      else if (isSymlink(path))
        errors.push(name + ': vendored file is a symlink: ' + relative);
      else if (digest(path) !== text(expected[relative], name + ': file hash'))
        errors.push(name + ': modified ' + relative);
    }
  }
  const license = record(lock.license, 'Locked license');
  const licensePath = join(root, text(license.path, 'License path'));
  if (!isFile(licensePath)) errors.push('Missing upstream license');
  else if (digest(licensePath) !== text(license.sha256, 'License hash'))
    errors.push('Upstream license differs from the recorded snapshot');
  const canonical = readdirSync(skillsRoot)
    .sort()
    .filter((name) => isDirectory(join(skillsRoot, name)));
  for (const name of canonical) {
    const folder = join(skillsRoot, name);
    const entrypoint = join(folder, 'SKILL.md');
    if (!isFile(entrypoint)) {
      errors.push(name + ': missing SKILL.md entrypoint');
      continue;
    }
    const content = readFileSync(entrypoint, 'utf8').replace(/\r\n?/g, '\n');
    const header = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(content)?.[1];
    if (header === undefined) {
      errors.push(name + ': missing YAML frontmatter');
      continue;
    }
    const declaredName = /^name:[ \t]*(.+)$/m
      .exec(header)?.[1]
      ?.trim()
      .replace(/^['"]+|['"]+$/g, '');
    if (declaredName !== name)
      errors.push(name + ': frontmatter name must match its directory');
    if (!/^description:[ \t]*\S/m.test(header))
      errors.push(name + ': missing description');
    if (/^disable-model-invocation:[ \t]*true[ \t]*$/m.test(header)) {
      const policy = join(folder, 'agents/openai.yaml');
      if (
        !isFile(policy) ||
        !/^\s+allow_implicit_invocation:[ \t]*false[ \t]*$/m.test(
          readFileSync(policy, 'utf8').replace(/\r\n?/g, '\n'),
        )
      ) {
        errors.push(name + ': missing matching explicit-only Codex policy');
      }
    }
    const alias = join(root, '.claude/skills', name);
    if (
      !isSymlink(alias) ||
      !isDirectory(alias) ||
      realpathSync(alias) !== realpathSync(folder)
    ) {
      errors.push(
        name + ': Claude adapter must symlink to .agents/skills/' + name,
      );
    }
  }
  const adapters = join(root, '.claude/skills');
  if (isDirectory(adapters)) {
    for (const name of readdirSync(adapters).sort()) {
      if (!canonical.includes(name))
        errors.push('Claude adapter has no canonical skill: ' + name);
    }
  }
  if (readFileSync(join(root, 'CLAUDE.md'), 'utf8').trim() !== '@AGENTS.md') {
    errors.push('CLAUDE.md must import the canonical AGENTS.md');
  }
  for (const relative of [
    'AGENTS.md',
    'CONTEXT.md',
    'Project-Charter.md',
    'docs/architecture.md',
    'docs/engineering.md',
    'docs/agents/skills.md',
    'docs/agents/domain.md',
    'docs/agents/issue-tracker.md',
    'docs/agents/triage-labels.md',
  ]) {
    if (!isFile(join(root, relative)))
      errors.push('Missing referenced guidance: ' + relative);
  }
  return errors;
}

if (import.meta.main) {
  try {
    const errors = checkAgentSetup(resolve(import.meta.dirname, '..'));
    if (errors.length) {
      for (const error of errors) console.error('ERROR: ' + error);
      process.exitCode = 1;
    } else
      console.log(
        'Agent setup OK: pinned skill files, license, metadata, and adapters match.',
      );
  } catch (error) {
    console.error(
      'Agent setup check failed: ' +
        (error instanceof Error ? error.message : String(error)),
    );
    process.exitCode = 1;
  }
}
