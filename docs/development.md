# Development environment

The executable code currently provides a **development quality lab**, not the
studio. It exercises the candidate stack with a neutral React composition,
isolated light/dark previews, portable HTML, PNG/PDF probes, and test reports.
The product contracts in the [first-slice spec](../.scratch/first-working-slice/spec.md)
still need implementation. Use [engineering standards](engineering.md) for
contribution decisions and [testing guidance](testing.md) for evidence.

## Supported development targets

Target native Windows 11+, macOS 14+, and Ubuntu 24.04, including Ubuntu under
WSL2. The CI matrix uses Windows Server 2022, macOS 14, and Ubuntu 24.04.
WSL evidence does not verify native Windows. The matrix is configured; results
from a real remote CI run are still required before claiming those jobs pass.
These targets fit the current [Playwright requirements](https://playwright.dev/docs/intro#system-requirements).

Use the Node patch in [.node-version](../.node-version) and the package manager in
[package.json](../package.json). All deterministic repository tooling uses Node.
The skill checker uses only Node built-ins and runs before dependency installation
with `node scripts/check-agent-setup.ts`; Python is not a prerequisite.

A checkout must preserve the Claude adapter symlinks. On native Windows, enable
Windows Developer Mode or equivalent symlink privileges and Git symlink support
before cloning. A fresh checkout can use `git -c core.symlinks=true clone ...`.
The environment check reports flattened/broken adapters through the existing checker; it
does not rewrite owner files. CI enables symlink support before checkout.

## Install and run

Install the pinned Node version with your normal OS installer/version manager.
Node 24.19.0 includes npm 11.17.0; `package.json` records the tested npm version and
`devEngines` checks it before installation or script execution. At this revision,
use Node 24.19.0 and npm 11.17.0. If your npm version differs, install that version
with `npm install --global npm@11.17.0`. See the
[Node release record](https://nodejs.org/en/blog/release/v24.19.0).

```sh
npm ci
npm exec -- playwright install chromium
npm run check:env
npm run dev
```

On Linux/WSL, Chromium also needs system libraries. Use
`npm exec -- playwright install --with-deps chromium` when those libraries are
absent; the system-package step can require administrator privileges.
`npm run check:env` checks Node, the skill adapters, and actual Chromium startup.

When updating a checkout that previously used pnpm, run `npm ci` once. It
replaces the old dependency tree using `package-lock.json`; there is no need to
uninstall a globally installed package manager.

The lab runs on the loopback address printed by Vite. It generates neutral
artifact documents before starting, and displays them in separate frames. Changes
to the interactive shell refresh through Vite. After changing the Node-rendered
fixture, rerun `npm run probe:render` and refresh the frame, or restart `npm run dev`.
A production authoring watcher is still first-slice work.

## Commands and outputs

Choose local commands using the [selective verification policy](testing.md#select-local-checks).
The availability of a full gate does not make it a required local finishing step.

| Command | Result |
| --- | --- |
| `npm run check` | Full CI gate: skill check, types, lint, formatting, Vitest, production build, Chromium, and Linux visual comparisons. Run locally only for a concrete broader verification need. |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Independent static gates; diagnostics identify their files and rules. |
| `npm test` / `npm run test:watch` | Node behavior tests, once or in watch mode; pass arguments after `--`, for example `npm test -- tools/quality-lab/render.test.ts`. |
| `npm run test:browser` | Real Chromium behavior, accessibility, offline delivery, resource readiness, and export geometry. |
| `npm run test:visual` | Reviewed Linux reference images, with updates disabled. |
| `npm run test:report` | Opens the browser HTML report. Visual reports are separate under `artifacts/visual/report`. |
| `npm run test:coverage` | Diagnostic coverage report; a percentage is not the acceptance gate. |
| `npm run build` | Production Vite lab plus generated static artifacts in `dist/quality-lab`. |
| `npm run preview` | Builds and serves that production output locally; browser suites use this path. |
| `npm run probe:render` | Regenerates the portable HTML fixtures through the actual Node/TSX rendering entry point. |
| `npm run check:agents` | Verifies the pinned skill snapshot, license, metadata, adapters, and guidance using Node built-ins. |
| `npm run format` | Explicitly formats maintained code/configuration. It excludes vendored skills, generated output, and prose. |

A focused browser investigation can use
`npm exec -- playwright test --project=chromium --grep "offline"`.
Firefox/WebKit checks are available with `npm run test:cross-browser` after
`npm exec -- playwright install firefox webkit`; Linux may also need their system
dependencies. These extra browser engines are not installed by the basic setup
and are not part of the initial verified baseline.

Keep reports and generated delivery files under ignored output directories.
Playwright retains HTML/JSON reports, screenshots, traces on failure, and PNG/PDF
attachments. CI uploads actual outputs and reports even when checks fail.
Source image baselines live with the visual tests and receive deliberate review.

## Reproducibility and portable commands

- One lockfile and exact direct package pins define the tested dependency set.
  CI uses frozen installation. Update related tools together and rerun the lab.
  A build/transpilation success does not replace the separate TypeScript check.
- The evaluation chose TypeScript 6.0.3 because the installed typed-lint package
  supports TypeScript below 6.1; the registry's newer 7.x release did not fit that
  peer contract. Recheck the actual peers on upgrades rather than treating this
  as a permanent preference for an older compiler.
- npm settings live in `.npmrc`: exact dependency saves, strict engine and peer
  checks, and a one-day release-age window when resolving versions. Vite is
  exempt from that window for the evaluated exact pin; npm's exception matches
  the package name, so review it on upgrades. `package.json#allowScripts` permits
  esbuild's installation script and explicitly skips the optional macOS
  fsevents build, as in the earlier esbuild-only policy. Strict script approval
  rejects unreviewed dependency scripts. Review these settings with lockfile changes.
- `npm ci` installs the committed lockfile without rewriting it and rejects a
  mismatch with `package.json`. Use `npm install` when deliberately changing
  dependencies and commit the resulting lockfile. `npm run` executes installed
  tools without an implicit installation; use `--` to forward script options.
- Tasks invoke Node CLI entry points with argument arrays. They do not require
  Bash, POSIX environment assignment, or launching Windows `.cmd` files from
  Node. File tests include spaces, Unicode, `#`, and `%` in real local paths.
- The root TypeScript configuration describes the bundled/TSX-loaded lab.
  `scripts/tsconfig.json` checks native Node TypeScript with NodeNext resolution
  and erasable syntax; `npm run typecheck` checks both. The checker executes directly
  on the pinned Node without a loader or build. For a checker change, invoke its
  command directly when a smoke check is useful. Node strips types without
  checking them, so CI retains the separate static gate. See
  [Node TypeScript support](https://nodejs.org/docs/latest-v24.x/api/typescript.html).
  A future compiled operation layer must also test its compiled CLI output.
- Tailwind styles the lab shell. Artifact CSS, semantic values, and fonts are
  resolved into isolated documents. Future shadcn controls belong in the studio
  shell and are added individually when used; no unused component catalog or
  shadcn CLI dependency is installed now.
- Run WSL tooling and editors against the Linux filesystem where practical.
  Native Windows and WSL share a product target but have different file watching
  and path behavior. The real authoring watcher still needs atomic-save,
  rename/delete, and Windows-editor/WSL tests.

## Why this stack

The [rendering comparison](research/rendering-stack-evaluation.md) examines
React/Vite/Node, Next.js, Bun, static React rendering, Markdown, schema validation,
and browser export. The [quality-tool comparison](research/quality-tooling-evaluation.md)
examines test runners, typed ESLint/Prettier versus Biome, accessibility,
reproducibility, and CI evidence.

The installed baseline is Node LTS + npm + TypeScript/React/Vite/Tailwind, typed
ESLint/Prettier, Vitest, Playwright, and axe. Playwright also supplies the browser
used by the export probes, avoiding another browser automation family.
unified/remark and Zod are recommendations for later content/contract work, not
installed dependencies. Exact React/Vite/export public interfaces remain subject
to the first working slice; the lab is not a library for owner artifacts.

The initial evidence and its limits are retained in
[the foundation record](../.scratch/development-foundation/status.md).
