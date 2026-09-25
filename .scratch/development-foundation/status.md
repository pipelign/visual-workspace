# Development foundation before the first studio slice

Status: implemented; local verification and independent review complete; remote CI pending

The owner accepted the twelve-ticket product breakdown as a starting point and
requested quality standards, testing/tooling, and stack evaluation before
proceeding. Native Windows is required alongside Linux/WSL and macOS; modern
React, Tailwind, and shadcn are preferred candidates rather than fixed constraints.

## Delivered scope

- Primary-source comparisons of rendering/application and quality-tooling options.
- Contribution standards, a testing/evidence policy, and portable setup commands.
- An exact, compatible development toolchain and lockfile.
- A neutral executable quality lab with genuine rendering, resource-failure,
  keyboard/accessibility, offline-file, PNG/PDF-geometry, and visual checks.
- Native Windows, macOS, and Linux CI jobs with retained output and reports.

This is an engineering foundation, not the product studio or its first artifact
delivery. Product implementation and individual ticket publication remain deferred.

## Evidence

Local evaluation uses Ubuntu 24.04 under WSL2, Node 24.19.0, and the pinned
Playwright 1.63.0 Chromium 153.0.8010.12 (revision 1243). The source state is
an uncommitted working tree based on `90c49f02f454fa881e170793ee63dd65aa6f3e10`,
not a clean release commit. Browser binaries and three absent Linux libraries were
downloaded to temporary caches for verification; system packages were not changed.
Normal setup uses Playwright's documented browser/system-dependency installation.

Observed during implementation:

- The newest TypeScript release did not satisfy the typed-lint package's peer
  range; the evaluated pin is TypeScript 6.0.3.
- Strict checks caught optional-property configuration errors and lint violations.
- Chromium initially could not start because libnspr4, libnss3, and libasound2
  were absent. The environment check now attempts a real browser launch.
- Importing server TSX into Playwright applied its mounting JSX runtime and broke
  React static rendering. Browser checks now consume output from the real Node
  rendering process.
- pnpm 12 has its own built-in `doctor`; the repository check is named
  `check:env` to avoid that command collision.
- Browser suites now build and serve production output, covering bundled asset
  loading as well as generated artifact documents.

Initial foundation checks on September 24, 2026:

| Check | Result |
| --- | --- |
| Pinned pnpm install with `--frozen-lockfile` | Passed; lockfile unchanged. |
| `pnpm check:env` | Passed, including skill adapters and real Chromium launch. |
| `pnpm check` | Passed: skill integrity, TypeScript, typed ESLint, Prettier, 3 Node tests, production build, 5 Chromium tests, and 3 normal visual comparisons. No skipped tests, retries, or snapshot updates. |
| `pnpm test:coverage` | Passed and produced HTML/JSON diagnostic reports. The Node report identifies the unexercised malformed-font-header branch; browser coverage is separate. No percentage acceptance claim. |
| Documentation links and `git diff --check` | Passed. |

The pinned pnpm CLI was invoked through `npm exec --package=pnpm@12.6.0` using a
cache in `/tmp/visual-workspace-npm-cache`; no global pnpm installation is claimed.
Local browser execution used `PLAYWRIGHT_BROWSERS_PATH=/tmp/visual-workspace-browsers`
and `LD_LIBRARY_PATH=/tmp/visual-workspace-browser-libs/extracted/usr/lib/x86_64-linux-gnu`.
These are evaluation-only paths, not portable setup instructions. Use
[the development guide](../../docs/development.md) for normal installation.

Inspected the three reference images and the actual exported PNGs: light and dark
640 × 360 figures, and the selected dark 264 × 128 Delivery part. Text wrapping,
spacing, contrast, borders, and bounds were readable; the selected output excluded
the Source neighbor. The final offline PNGs are byte-identical to the reviewed
references. Inspected the retained production lab screenshot, including visible
keyboard focus and both isolated variations. Baseline environment details are in
[the image record](../../tests/browser/quality-lab.visual.spec.ts-snapshots/README.md).

Browser evidence is retained in `artifacts/browser/report` and
`artifacts/browser/results`, including PNGs, PDFs, and the lab screenshot.
Visual evidence is separate in `artifacts/visual/report` and
`artifacts/visual/results`; structured summaries are each suite's `results.json`.
The production lab is in `dist/quality-lab`. These reproducible generated outputs
are ignored by Git and retained as CI artifacts when that workflow runs.

## Coding-standard decisions

The owner confirmed on September 24, 2026:

- Every substantive code change receives independent spec and standards reviews
  after implementation checks and self-review.
- Bootstrap interfaces may change with documented migrations. Existing owner
  work and protected definitions must remain preserved and usable.

The [engineering guide](../../docs/engineering.md) now specifies naming/module
conventions, public interface types, state modeling, errors and async ownership,
React responsibilities, maintainability review, and these two policies. Root
agent guidance routes substantive code changes to the review requirement.
The follow-up changed documentation only; the skill-integrity, local-link, and
whitespace checks passed. Two independent agents then reviewed the full existing
foundation, including untracked files, against the request and the standards.
[Both review axes](review.md) reported no material findings; no executable fixes
were needed. Remote platform verification remains pending below.

## Node tooling follow-up

The owner subsequently requested Node for all deterministic tooling. The
[completed migration and independent reviews](node-tooling.md) remove the Python
checker/runtime requirement. At that point the full gate passed 31 Node tests,
5 Chromium checks, and 3 visual comparisons. Native platform
verification remains outstanding.

## Selective testing follow-up

The owner subsequently removed dedicated script tests and chose targeted local
verification, with CI responsible for the full suite. The 28 tooling cases and
their discovery entry were removed; the Node checker and CI execution remain.
Current guidance is [the testing policy](../../docs/testing.md#select-local-checks).
Historical test counts above describe earlier runs, not the current test inventory.
This follow-up checked the edited Vitest configuration, test-file discovery,
documentation links, and whitespace. No tests were executed. Independent standards
and spec reviews found no material issues and did not repeat checks.

## Remaining limits

Native Windows/macOS and remote CI have not run in this session. Firefox/WebKit
are optional configurations and unverified here. The PDF probe checks one-page
geometry; PDF pages were not visually inspected in this environment, and authored two-page PDF fidelity and external presentation import remain
product acceptance work. The full lifecycle, Markdown bindings, watcher,
collections, and agent-authoring exercises remain in the original spec.

The next product ticket should reuse this toolchain and quality gate; its core
outcome remains a discoverable draft figure and portable export using the actual
public studio contract. Review exact ticket criteria against this completed
foundation before publishing the approved breakdown.
