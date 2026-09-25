# Quality tooling before the first studio slice

Researched: 2026-09-24. Status: recommendation for implementation planning; no
application tools were installed or exercised for this note. External claims
below come from first-party documentation inspected on that date. Unversioned
documentation moves; verify the selected releases together before writing the
lockfile. Repository-state observations describe the pre-implementation baseline
inspected for this research; subsequent development-environment work may supersede
them without establishing the full studio acceptance criteria.

Subsequent implementation and actual results are recorded in
[development setup](../development.md) and the
[foundation record](../../.scratch/development-foundation/status.md).

## Recommendation and scope

For the current React/HTML/SVG direction, start with **Node LTS and pnpm,
TypeScript, typed ESLint plus Prettier, Vitest in Node, and Playwright Test**.
Add `@axe-core/playwright` to the browser suite. This is one proposed setup, not
an accepted stack decision. React, Tailwind CSS, and shadcn/ui remain candidates;
the quality boundary should survive reasonable framework changes.

The useful standard is independently observable behavior and inspectable output.
For this studio, a passing type check, a plausible screenshot, and an existing
export file are three different pieces of evidence; none establishes the whole
authoring loop. The first implementation should supply a small number of
documented commands that produce clear failures and retained evidence. It should
not introduce a collection of competing test runners or a coverage percentage as
a substitute for the accepted scenarios.

This recommendation applies the existing [engineering guide](../engineering.md),
[architecture](../architecture.md), [vocabulary](../../CONTEXT.md), and the
[first-slice spec](../../.scratch/first-working-slice/spec.md). In particular,
owner extensions use public studio operations; rendering and export exercise the
actual filesystem, fonts, assets, and browser; source preservation includes owned
Markdown and transitive visual dependencies. The spec remains the authority for
acceptance, including manual visual and external-destination evidence.

## What the tools establish

| Area | Verified tool facts | Recommendation for this repository |
| --- | --- | --- |
| Type checking | TypeScript `strict` enables its strict-checking family. `noUncheckedIndexedAccess` adds possible absence to unchecked indexed values; `exactOptionalPropertyTypes` distinguishes an omitted property from an explicitly assigned `undefined`. These are useful separate settings, not reasons to rely on `strict` alone. [Strict](https://www.typescriptlang.org/tsconfig/strict.html), [indexed access](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html), [optional properties](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html). | Enable all three and run a dedicated compiler check over studio code, tests, and neutral owner examples. They directly help token maps, catalog lookups, capability records, and partial edit requests. Validate external data at runtime as well. |
| Node contract tests | Vitest uses Vite configuration and plugins and has a non-watch `vitest run` command. Its current getting-started page requires Node >=22.12 and Vite >=6.4. [Vitest setup](https://vitest.dev/guide/). | Prefer Vitest if the first slice uses Vite/React. Exercise cohesive public operations against isolated temporary workspaces; reserve rendering assertions for the browser. Keep explicit imports and separate Vitest/Playwright file patterns so each test runs once. |
| Built-in alternative | `node:test` is stable. Node 24's built-in TypeScript stripping does not type-check, ignores `tsconfig.json`, and does not accept `.tsx`. A separate transform or build can supply those features. [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [Node TypeScript](https://nodejs.org/docs/latest-v24.x/api/typescript.html). | A credible smaller alternative if the chosen operation layer is ordinary Node modules and the existing build produces runnable tests. Do not add it alongside Vitest merely to avoid one dependency; choose one. Native TS execution does not eliminate the compiler gate. |
| Bun alternative | `bun test` supports TypeScript/JSX, mocks, snapshots, and watch mode, but executes in Bun's runtime; its docs describe Jest compatibility as incomplete. [Bun test](https://bun.sh/docs/test). | Use only if Bun is selected for the actual studio runtime and its needed browser/export integrations are verified. For a Node-based local studio, introducing another runtime solely for test speed weakens the correspondence between tests and production execution. No speed comparison was measured here. |
| Browser behavior | Playwright Test has browser projects, visual comparisons, traces, and structured/HTML reporters. Browser versions are coupled to the installed Playwright release. [Browser installation](https://playwright.dev/docs/browsers), [visual comparisons](https://playwright.dev/docs/test-snapshots), [traces](https://playwright.dev/docs/trace-viewer), [reporters](https://playwright.dev/docs/test-reporters). | Use it for the running studio, actual render/export operation, exported files, keyboard behavior, and representative visual regressions. Share the selected browser toolchain with export where practical, but test the delivered output independently of the export implementation. |

A transpiling test runner is not a compiler gate. Vitest's type-testing workflow
is separate from ordinary runtime assertions. Keep an explicit `typecheck`
command even if a bundler or test runner accepts TypeScript. Use type-level tests
only for meaningful public extension contracts, such as an invalid component
input being rejected; do not duplicate routine compiler work throughout the
suite. [Vitest type testing](https://vitest.dev/guide/testing-types.html).

Choose module resolution for the actual execution environment. A browser bundler
and a Node operation layer need not have identical module settings. Avoid one
permissive configuration that makes browser imports look valid in Node while the
real process cannot load them. The appropriate boundaries must be demonstrated by
the first build and CLI smoke test, rather than prescribed before the application
layout exists.

## Typed linting and formatting

**Recommend ESLint flat configuration with typescript-eslint's
`recommendedTypeChecked` preset, `projectService: true`, and a small explicit
addition of rules important to this studio.** Typed linting uses TypeScript's
type information and has an extra analysis cost. The recommended preset has
stable major-version change semantics; `strictTypeChecked` can change its rule
set outside major releases. Starting from the stable preset with explicit policy
is easier to review than enabling every available rule. Lock and review tool
upgrades in either case. [Typed linting](https://typescript-eslint.io/getting-started/typed-linting/),
[preset policy](https://typescript-eslint.io/users/configs/).

The concrete policy should cover these failure mechanisms:

- Reject explicit `any` and unsafe propagation of `any` through assignment,
  calls, access, and returns. Prefer `unknown` followed by validation at a data
  boundary. The compiler's implicit-any check does not forbid an explicit type
  escape. [Explicit any](https://typescript-eslint.io/rules/no-explicit-any/),
  [unsafe assignment](https://typescript-eslint.io/rules/no-unsafe-assignment/).
- Reject narrowing type assertions that bypass validation, unhandled promises,
  and non-exhaustive switches over domain unions. Missing awaits are particularly
  harmful in lifecycle writes and Playwright assertions. Verify the preset's
  actual rules and explicitly enable missing policies, including
  `no-unsafe-type-assertion` and `switch-exhaustiveness-check`.
  [Unsafe assertions](https://typescript-eslint.io/rules/no-unsafe-type-assertion/),
  [floating promises](https://typescript-eslint.io/rules/no-floating-promises/),
  [exhaustiveness](https://typescript-eslint.io/rules/switch-exhaustiveness-check/).
- Disallow `@ts-ignore`/`@ts-nocheck`; require a specific explanation for a narrowly
  scoped `@ts-expect-error` when a negative type test or an unavoidable upstream
  mismatch warrants it. Apply the same standard to lint suppressions. An agent
  should repair a failure, not widen the allowed type or disable its detector.
  [TypeScript comment rule](https://typescript-eslint.io/rules/ban-ts-comment/).
- Restrict owner-to-studio imports to the documented public entry points using
  importer-scoped import rules. Include relative and aliased deep imports in the
  policy. ESLint's `no-restricted-imports` checks static imports; it is not a
  general dependency-graph or runtime sandbox. Prove the extension example works
  with only the public contract, and assess dynamic loading separately where it
  actually exists. [Restricted imports](https://eslint.org/docs/latest/rules/no-restricted-imports).

Use Prettier for formatting and ESLint for semantic checks, with
`eslint-config-prettier` to disable conflicting formatting rules. Keep the CI
commands read-only; use separate local fix commands. This is a single defined
formatting/linting setup, not a requirement to make the formatter an ESLint rule.
[Prettier integration guidance](https://prettier.io/docs/integrating-with-linters).

**Biome is a viable alternative to evaluate, but is not the recommended default
for these particular gates.** Current Biome supports multi-file analysis and
type-aware rules; the old claim that it has no type information is incorrect.
It also supports explicit-any checks and restricted-import patterns. However,
the inspected types-domain page still lists important rules such as
`noFloatingPromises` and `noMisusedPromises` as nursery rules. This makes a
rule-by-rule check against the required unsafe-flow policies more useful than a
general claim of equivalence or maturity. [Biome v2](https://biomejs.dev/blog/biome-v2/),
[types domain](https://biomejs.dev/linter/domains/#types),
[explicit any](https://biomejs.dev/linter/rules/no-explicit-any/),
[import patterns](https://biomejs.dev/linter/rules/no-restricted-imports/).

No comparative lint benchmark or deliberately invalid fixture suite was run.
Reconsider Biome if a pinned release demonstrates the desired checks on realistic
files and materially improves the working loop. Avoid adopting Biome and typed
ESLint together initially: overlapping policies would add another configuration
surface without solving an identified gap.

## One real-browser boundary

Vitest Browser Mode executes tests in a browser and supports a Playwright
provider. It is useful for focused components, but uses a Vite-served test
environment. It does not by itself prove that a delivered file opens independently
of that server. [Browser Mode](https://vitest.dev/guide/browser/).

The currently inspected Playwright documentation uses ordinary `@playwright/test`
against an application-owned story gallery for component testing; it says the old
experimental component packages were removed after the 1.62 line. Verify the API
against the pinned version before using newer examples. The underlying approach
fits the studio: render a real neutral example or narrowly scoped component state
through the application's own pipeline, then observe its behavior in the browser.
[Current component-testing approach](https://playwright.dev/docs/test-components).

Initially use Playwright Test for these cases instead of adding a second browser
test configuration, DOM emulator, or component workbench. Add Vitest Browser Mode
only if a specific component suite becomes awkward to express through the real
application and the additional harness earns its maintenance cost. This is a
scope recommendation, not a claim that either approach cannot test components.

Recommended browser evidence for the first slice:

| Contract | Evidence the suite should produce |
| --- | --- |
| Shared composition and brand rendering | Render the document, slide, shared figure, and two differently configured nested uses in both variations at declared dimensions. Change a nested token and a font; assert propagation and side-by-side isolation. Check fixed assets remain fixed. |
| Portable HTML | Export through the supported operation; copy only the delivery into an unrelated temporary directory; stop the studio; open a `file:` URL in a fresh browser context with networking disabled. Check saved copy, page count/geometry, images, font faces, selected variation, and absence of remote/development-server dependencies. Record browser and packaging. |
| Part PNG delivery | Decode the actual exported image and check dimensions, transparency/bounds where specified, effective content, and absence of neighboring parts. Inspect the image itself at its destination size. A screenshot of the preview or a nonempty file is insufficient. |
| Authored document pages | Assert explicit page count and geometry, edited text presence, and content preservation after layout-only repair. Inspect each page and exported result. Exercise headings, lists, preformatted text, long content, and the typography difference between variations. |
| Supported failures | Break a required asset/token, request an unsupported format, and exercise a failed export. Check actionable diagnostics, draft inspectability, preserved source/lifecycle, and survival of unrelated outputs. Test advisory overflow and mandatory export rules separately. |
| Studio controls | Discover an item, inspect it, choose a variation, export, and repair a failure using accessible controls. Include keyboard focus, loading, failure feedback, and representative viewport sizes. |

These assertions derive from the local spec, not from what a chosen tool happens
to make easy. Use public identities and user-facing roles; use an explicit test
identifier only when a visual part has no appropriate semantic locator. Await
observable readiness and retrying assertions instead of arbitrary sleeps.
[Playwright testing guidance](https://playwright.dev/docs/best-practices).

Playwright exposes browser-context offline emulation. Use it together with a fresh
context and a stopped server; it is a mechanism to test the offline contract, not
proof that the contract passed. Keep failed requests and console errors as
evidence, and check bundled resource references as well as visible output.
[Offline API](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-offline).

Font readiness deserves an explicit regression. `document.fonts.ready` resolves
after loading and associated layout complete, but `document.fonts.check()` may
return true even for a nonexistent font. Therefore do not equate a resolved ready
promise, CSS family name, or a lone successful `check()` with correct typography.
Verify expected bundled face declarations and their loaded state, exercise a
deliberately missing font, and inspect representative glyphs against a reviewed
render. [Font readiness](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready),
[font-check caveat](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check#nonexistent_fonts).

PDF and native SVG remain capability-dependent. If introduced, inspect PDF page
geometry and rendered pages or the actual SVG independently; the HTML/PNG path
cannot establish their correctness. External presentation-tool import and visual
approval retain the manual evidence required by the spec.

## Accessibility with React and shadcn candidates

Run axe scans inside the existing Playwright suite for the populated gallery,
open menus/dialogs, export controls, and useful failure states. The integration
can attach full scan results, including inconclusive findings. A scan only covers
the current state, and automated testing cannot establish full accessibility.
[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

shadcn distributes editable component code, so changes to imported components
become part of this repository's maintained code. Where the selected components
use Radix primitives, Radix supplies substantial semantics, keyboard, and focus
behavior, but explicitly leaves appropriate labeling to the application. Verify
the chosen component implementation rather than assuming all shadcn variants use
the same primitives. [shadcn model](https://ui.shadcn.com/docs),
[Radix accessibility responsibilities](https://www.radix-ui.com/primitives/docs/overview/accessibility).

Recommend no unexplained automated violations in the neutral studio fixture and
explicit keyboard checks for focus entry/return, visible focus, Escape, and error
feedback. Human review still covers reading order, useful descriptions, meaningful
labels, zoom, and representative assistive-technology operation. Tailwind classes
or an accessible primitive do not establish the composed interface's behavior.
Keep studio accessibility gates distinct from artifact owner guidance; do not
silently convert advisory artifact findings into mandatory export blockers.

## Minimal gates and agent-consumable results

The following command names are proposed interfaces, not verified implementations.
Keep install, development, and targeted diagnostic commands documented alongside
them. A single aggregate `check` command may sequence the fast gates and contract
suite, while browser checks remain directly runnable by file or test name.

| Gate | Proposed command and useful result |
| --- | --- |
| Existing agent setup | Preserve skill-checker behavior and `git diff --check`; report vendored-file/adaptor failures without adding application placeholders. The subsequent Node migration removes the Python prerequisite. |
| Static correctness | `typecheck`, `lint`, `format:check`: nonzero on errors; file, line, rule, and concise explanation. Include tests so missing awaits and test type escapes are caught. |
| Contract behavior | `test` using non-watch Vitest: public-operation tests over temporary workspaces, stable test names, ordinary text failures plus a machine-readable report. |
| Build | `build`: produce the real application/CLI output. Start that output in a focused smoke test; a compiler-only test does not prove asset bundling or module loading. |
| Browser/export | `test:browser`: real preview/export, offline copied HTML, selected visual comparisons, and accessibility checks. Retain the actual outputs and diagnostics. |
| Review evidence | Render/export affected visuals at their destination dimensions, inspect them, and record the relevant source state, variation, findings, and remaining limits. This is an acceptance practice, not a fabricated automated pass. |

For operation tests, prioritize discovery/inspection and identity; source
protection and derivation; stale/failed writes; owner extension contracts; token
validation; and export capability/error behavior. For failed writes, compare
preserved source and consumer behavior, not only a returned error. Where a rare
filesystem failure is hard to provoke portably, a narrow fault-injection seam at
the environment boundary is reasonable, while the actual collaborating domain
logic and ordinary filesystem path remain exercised.

Vitest and Playwright both offer structured reporters. Use their existing JSON or
JUnit output rather than inventing a test-report service. Keep a short textual
summary with the command, exit status, failing test names, report paths, and exact
rerun command. [Vitest reporters](https://vitest.dev/guide/reporters.html),
[Playwright reporters](https://playwright.dev/docs/test-reporters).

For browser failures, retain expected/actual/diff images, the exported file,
source/variation/dimension metadata, page errors, failed resource requests, and a
trace. `trace: 'retain-on-failure'` captures first failures even without retries;
`on-first-retry` is cheaper when retries are intentional but omits the original
attempt. Start with the former for the small acceptance suite. Traces expose
actions, DOM snapshots, console, and network evidence; a readable summary and
PNG files also let agents investigate without an interactive trace viewer.
[Trace options and contents](https://playwright.dev/docs/trace-viewer).

Product diagnostics should expose a stable rule/code, severity, affected item or
owner-qualified part, source location, blocked operation if any, explanation,
and next action. This is a proposed application contract from the architecture;
neither ESLint nor a test reporter supplies it automatically. Test the diagnostic
fields that callers rely on, avoiding snapshots of entire internal error objects.

## Reproducibility and native operating systems

Node 24 is an LTS line in the inspected release table. Prefer a supported LTS
version, pinned to an exact tested patch, rather than an unbounded `latest`.
Pin the pnpm version in `packageManager`, commit its lockfile, and use an explicit
`pnpm install --frozen-lockfile` in verification. The flag rejects missing or
out-of-date lockfiles. Exact release numbers for all tools should be recorded
together after the first installation/build/browser proof.
[Node releases](https://nodejs.org/en/about/previous-releases),
[pnpm installation/version pin](https://pnpm.io/installation),
[frozen installation](https://pnpm.io/cli/install#--frozen-lockfile).

For pnpm 12, place non-authentication configuration in `pnpm-workspace.yaml`;
old `package.json#pnpm` settings are not read and `.npmrc` is for registry/auth
configuration. Use `allowBuilds` entries for the actual dependency scripts that
need a decision; the older `onlyBuiltDependencies` family was removed. Keep
unreviewed builds failing. Recommend `verifyDepsBeforeRun: error` so a check does
not trigger an implicit install, and `pmOnFail: error` when the documented bootstrap
already provisions the exact package-manager pin. Those replace assumptions from
older pnpm examples; verify them with the chosen release and clean CI installation.
[Configuration migration](https://pnpm.io/migration),
[build settings](https://pnpm.io/settings/build),
[package-manager version behavior](https://pnpm.io/settings/cli#pmonfail).

Do not assume pnpm or a browser binary is already installed on an owner's machine.
Document prerequisites and one tested bootstrap route per supported platform;
the current pnpm documentation specifically recommends its npm route on Windows.
The initial recommendation retained the existing Python checker. The owner
subsequently chose Node for all deterministic repository tooling; the migrated
checker and both workflows now use Node, with no Python prerequisite. See
[the current development guide](../development.md) for commands.
[pnpm Windows setup](https://pnpm.io/installation#on-windows).

Cross-platform scripts should invoke tools directly or small Node scripts. Use
Node filesystem/path/URL APIs and argument arrays for subprocesses; avoid
`rm -rf`, Bash-only syntax, inline `NAME=value` assignments, shell glob expansion,
and hand-built `file:` URLs. npm documents different default shells on POSIX and
Windows; pnpm also documents that inline environment assignments fail on
non-POSIX systems unless its optional shell emulator is used. Prefer avoiding
that dependency on shell emulation initially.
[npm script execution](https://docs.npmjs.com/cli/v11/using-npm/scripts/#exiting),
[pnpm shell behavior](https://pnpm.io/cli/run#shellemulator).

The current checker compares vendored file bytes and requires real symlinks for
Claude adapters. Git can check symlinks out as text files when `core.symlinks` is
false, and line-ending conversion can also change checked-out bytes. Native
Windows setup therefore needs a tested Git/symlink and line-ending contract; a
passing Linux job does not resolve this. Preserve checksum verification and
adapter correctness rather than silently skipping them. Assess clone-time
configuration and repository attributes during setup work.
[Git symlink and line-ending settings](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks).

Recommended initial CI shape:

- Keep the complete static/contract/build/browser acceptance job on
  `ubuntu-24.04`. Run a smaller native Windows/macOS matrix covering clean
  installation, the setup checker, public filesystem/lifecycle contracts, build,
  studio startup/shutdown, and a real copied-HTML/PNG smoke test. A WSL run does
  not establish native Windows support. Record a separate WSL startup/export
  exercise when making the WSL support claim.
- Use a canonical Linux browser environment for committed pixel baselines. Pin
  Playwright and its matching browsers, ship test fonts/assets, and fix viewport,
  pixel scale, locale, time zone, animation, and nondeterministic content. A pinned
  Playwright container/digest can further stabilize Linux visual runs if runner
  image drift causes failures; it need not be the developer environment.
- Run semantic/resource/dimension checks and retain diagnostic screenshots on
  Windows/macOS. Do not compare those pixels to Linux baselines. Playwright
  documents browser/platform differences in screenshots; use separate reviewed
  baselines only where cross-platform pixel comparison adds value.
  [Platform snapshots](https://playwright.dev/docs/test-snapshots).
- Cache the package store through setup-node, keyed by the lockfile and platform;
  still perform frozen installation. Its cache is not `node_modules`. Install
  only browsers used by that job. Playwright does not generally recommend caching
  browser binaries, and OS dependencies still need provisioning. If later
  caching browsers, include the Playwright version in the key.
  [setup-node caching](https://github.com/actions/setup-node#caching-global-packages-data),
  [Playwright CI](https://playwright.dev/docs/ci#caching-browsers).
- Upload reports and failed outputs even when tests fail, with names identifying
  the OS/browser and an explicit retention period. Use only neutral fixtures in
  these artifacts. Continue the repository's existing full-SHA pinning practice
  for workflow actions. [Workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data).

Native host support and recipient browser support are separate promises. Start
with Chromium as the declared rendering browser; exercise Firefox/WebKit on the
portable-output path before promising recipient compatibility there. Do not
multiply every test across every OS and browser by default.

## Tests that can disprove the implementation

Recommendations for agent contributions, derived from the local engineering
standard:

1. Name the observable behavior and its requirement before choosing assertions.
   For substantive behavior, establish a failing case before implementing; for a
   regression, demonstrate failure on the broken behavior.
2. Use fixtures with independently specified expected content and outcomes.
   A real export should contain the edited prose and selected configured use;
   deriving expected values with the same helper as the implementation does not
   provide independent evidence.
3. Avoid mocking the studio's own discovery, lifecycle, and export collaborators
   into a predetermined success. Mock only the boundary needed by the case, and
   keep an integration path that crosses the real boundary.
4. Pair visual comparisons with explicit content/resource/dimension assertions.
   A stable empty render can match a snapshot; a correct-looking image can hide
   source mutation, fallback fonts, or a wrong export record.
5. Do not make a failing check pass by skipping it, increasing tolerances, adding
   retries, suppressing errors, or updating baselines without a behavioral reason
   and reviewed evidence. A flaky pass is an unresolved diagnosis, not proof of
   reliability. Keep failure evidence when retrying.

Baseline creation and updates should be explicit review events: generate in the
canonical environment, inspect every changed expected image alongside actual and
diff, inspect the delivered export, and explain the intended visual change or
toolchain change. Never update reference images as a side effect of normal CI or
accept generated images solely because the comparison now passes. Mask only
irrelevant dynamic regions; do not mask the content whose fidelity is under test.
Playwright supplies update and tolerance mechanisms; whether a change is correct
remains a review judgment. [Snapshot mechanics](https://playwright.dev/docs/test-snapshots).

## Selective tools, not additional initial gates

| Tool | Verified capability | When it earns a place here |
| --- | --- | --- |
| Coverage | Vitest supports V8 and Istanbul coverage providers and configurable reports. [Vitest coverage](https://vitest.dev/guide/coverage.html). | Use a report to locate missed lifecycle branches, diagnostic paths, or write failures. No blanket percentage target initially. Executed lines do not prove useful assertions or export fidelity. |
| Property-based tests | fast-check generates inputs, reports counterexamples, and shrinks failures. [Getting started](https://fast-check.dev/docs/introduction/getting-started/). | Add when identity/path handling or sequences of public lifecycle operations have a clear invariant and examples miss important combinations. Record seed/replay information with failures; keep a discovered regression as a named example. Avoid copying the production algorithm into the property. |
| Mutation testing | Stryker reports mutations that tests detect, survive, or do not cover. [Mutant states](https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/). | Run a bounded experiment on source-preservation and validation logic if assertions seem weak despite green tests. Investigate surviving mutations; do not impose a repository-wide mutation score or run browser image suites under mutation by default. |

These are diagnostics to answer a specific uncertainty. None was installed, timed,
or evaluated against executable studio code in this research.

## Remaining verification

At the start of this research, the repository had no application manifest,
implementation, browser suite, or approved visual baselines. This note selects no
exact application versions and proves no export or operating-system support. The
then-existing CI only ran the offline Python agent-setup check on Ubuntu
(the current workflow has since migrated to Node). An executable development-quality lab can
establish tool compatibility and useful checks before the studio; label its
evidence as such. The first studio slice must add its real application acceptance
gates.

Before adopting the proposal, demonstrate a clean install and build with compatible
pins; a public-operation test that fails on a meaningful defect; a deliberately
missing-font failure; independent local-file HTML in the declared browsers;
real part exports; actionable retained failure evidence; and native Windows/macOS
startup, paths, subprocess cleanup, symlinks, and file writes. Reassess any tooling
choice that fails that small proof. Record the exact browser/tool versions with
the evidence so later upgrades are deliberate changes to the rendering environment.
