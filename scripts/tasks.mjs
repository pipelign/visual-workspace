import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
process.chdir(root);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: root });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
function tool(name, args) {
  const manifestPath = require.resolve(name + '/package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const bin =
    typeof manifest.bin === 'string'
      ? manifest.bin
      : Object.values(manifest.bin)[0];
  if (typeof bin !== 'string') throw new Error('Cannot locate CLI for ' + name);
  run(process.execPath, [resolve(dirname(manifestPath), bin), ...args]);
}
function agents() {
  run(process.execPath, ['scripts/check-agent-setup.ts']);
}
function typecheck() {
  tool('typescript', ['--noEmit']);
  tool('typescript', ['--project', 'scripts/tsconfig.json']);
}
function generate() {
  tool('tsx', ['tools/quality-lab/generate.ts']);
}
function build() {
  generate();
  tool('vite', ['build']);
}
function browserTests(project, args = []) {
  process.env.QUALITY_REPORT_NAME = project === 'visual' ? 'visual' : 'browser';
  tool('@playwright/test', ['test', '--project=' + project, ...args]);
}
const task = process.argv[2];
switch (task) {
  case 'typecheck':
    typecheck();
    break;
  case 'agents':
    agents();
    break;
  case 'env': {
    const expected = readFileSync('.node-version', 'utf8').trim();
    if (process.versions.node !== expected)
      throw new Error(
        'Use Node ' + expected + '; found ' + process.versions.node,
      );
    agents();
    const { chromium } = await import('@playwright/test');
    if (!existsSync(chromium.executablePath()))
      throw new Error(
        'Install the pinned browser with pnpm exec playwright install chromium.',
      );
    try {
      const browser = await chromium.launch();
      await browser.close();
    } catch (cause) {
      throw new Error(
        'Chromium could not start. On Linux/WSL, run pnpm exec playwright install --with-deps chromium. See docs/development.md for platform prerequisites.',
        { cause },
      );
    }
    console.log(
      'Development prerequisites OK on ' +
        process.platform +
        '/' +
        process.arch,
    );
    break;
  }
  case 'dev':
    generate();
    tool('vite', []);
    break;
  case 'build':
    build();
    break;
  case 'preview':
    build();
    tool('vite', ['preview']);
    break;
  case 'visual':
    if (process.platform !== 'linux')
      throw new Error(
        'Canonical visual baselines run on Linux. Use the Linux CI job; browser behavior tests run on every supported OS.',
      );
    browserTests('visual', process.argv.slice(3));
    break;
  case 'check':
    agents();
    typecheck();
    tool('eslint', ['.', '--max-warnings=0']);
    tool('prettier', ['--check', '.']);
    tool('vitest', ['run']);
    browserTests('chromium');
    if (process.platform === 'linux') browserTests('visual');
    break;
  default:
    throw new Error('Unknown task: ' + String(task));
}
