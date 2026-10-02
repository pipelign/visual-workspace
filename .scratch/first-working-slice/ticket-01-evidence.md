# Ticket 01 implementation and evidence

Status: implemented, independently reviewed, locally verified; PR/CI pending.
Branch: `feature/standalone-figure-studio`.
Base: `890d52a229cf6de069087e619b12f18aba3806db`.
Local verification: October 1, 2026, Ubuntu 24.04.1 under WSL2, Linux x64,
Node 24.19.0, npm 11.17.0, Playwright 1.63.0 Chromium 153.0.8010.12/revision 1243.

## Delivered behavior

The default development entry is a studio with a discovered standalone draft,
inspection, isolated brand previews, saved-source refresh, repair diagnostics,
keyboard controls, and HTML downloads. `studio/index.ts` and the CLI provide the
same public operations without the gallery. The neutral workspace owns its
catalog, brand roles/variations, licensed local font, fixed SVG, brief, project,
and one authored composition. See the [contract](../../docs/studio-contract.md).

Single-file HTML embeds styles, actual font/image bytes and licensing, resolved
brand values, and source/render settings. Filesystem delivery stages HTML and its
record together in a new directory. Declared source file hashes and Git dirty
state distinguish the actual source from a clean commit. Existing deliveries
remain fixed after source/brand edits. Supported formats are explicit: HTML only.

The old lab shell and complete-figure implementation are removed. A private
264 × 128 Delivery-part fixture remains for ticket 04's PNG/selected-part path
and ticket 06's PDF feasibility decision; it is not an offered studio capability.

## Verification actually run

- `npm run typecheck`: passed for application/owner/tests and native Node scripts.
- Targeted ESLint on `studio`, `workspace`, retained lab, browser tests, Vite/Vitest
  configuration and task runner: passed with zero warnings.
- `npm run format:check` and `git diff --check`: passed.
- `npm test -- studio/operations.test.ts tools/quality-lab/render.test.ts`:
  12 tests passed. Public contracts cover lookup, inspection, isolated resources,
  source records and prior deliveries, invalid/duplicate identity, missing assets,
  corrupt images, unusable output preservation, missing workspace diagnostics,
  metadata save races, new variation/token changes, and actual heading typography.
- `npm run test:browser -- tests/browser/studio.spec.ts tests/browser/quality-lab.spec.ts`:
  6 Chromium tests passed. Keyboard comparison/download, 1480 px side-by-side and
  390 px shell width, axe scans, copied offline HTML with artifact JavaScript
  disabled, font rejection, incomplete-render controls, and retained PNG/PDF
  geometry all passed. Shell scanning uses axe's legacy mode without nested frame
  execution; both static figures receive direct scans because preview frames
  disable scripts needed by axe messaging.
- Proposed studio baselines were generated with `npm run test:visual -- --update-snapshots`,
  inspected, then ordinary `npm run test:visual` passed all 3 comparisons with
  updates disabled. The retained Delivery-part baseline is unchanged; new
  complete-figure baselines replace the lab ones. The intentional visual change
  is the context label from QUALITY FIXTURE to AUTHORING LOOP.
- Actual `npm run dev` smoke: a saved color edit refreshed automatically, a
  missing canvas token stayed inspectable and blocked the incomplete preview,
  and repair restored the original preview. Owner bytes were restored exactly.
  Waiting for file writes to settle repaired missed rapid-save recovery.
- A separate real-operation/browser exercise confirmed port 4173 refused
  connections before and after delivery inspection. Both exported HTML files
  were copied into a temporary directory outside the workspace with spaces,
  Unicode, `#`, and `%`; offline, script-disabled Chromium loaded their fonts and
  images at 640 × 360 without HTTP requests. Stopped-gallery tag lookup found the
  figure without its source path.
- An isolated workspace copy added a paper variation and a declared heading face
  using local Inter 700 bytes. Through the actual studio SSR loader, the public
  delivery used a distinct heading family while retaining body typography and
  fixed imagery. Figure source remained identical. The resulting 640 × 360
  paper output was inspected alongside light/dark deliveries.

Rendering/export verification needed real process/socket permissions in this
sandbox. The pinned browser was installed into the ordinary Playwright cache.
Missing libnspr4, libnss3, and libasound2t64 were downloaded/extracted into `/tmp`;
no system package installation is claimed. Browser commands used
`LD_LIBRARY_PATH=/tmp/visual-workspace-browser-libs/extracted/usr/lib/x86_64-linux-gnu`.
Normal setup remains the documented browser/system-library installation.

## Inspected outputs and durable feedback

Inspected light/dark studio references and actual copied HTML screenshots at
640 × 360. Text, wrapping, card bounds, spacing, borders, fixed blue imagery,
and variation contrast are readable. The paper exercise visibly changes heading
weight while body copy stays regular. Inspected the development studio with both
variations side-by-side, the final browser studio screenshot, and the narrow shell.
These are reviewed neutral drafts, not owner approval or lifecycle protection.

Reproducible local outputs are ignored by Git: `artifacts/browser`,
`artifacts/visual`, `artifacts/ticket-01-evidence`, `artifacts/generated-exports`,
and `dist/studio`. The explicit stopped-studio exercise retains `inspection.json`,
light/dark/paper PNGs, HTML deliveries, and records under `artifacts/ticket-01-evidence`.
Delivery records identify the dirty source actually captured from the base commit;
they are not attributed to the final clean feature commit.

## Limits and next step

[Independent Standards and Spec reviews](ticket-01-review.md) have no open findings.
No dependency/version changes, full local CI gate, remote CI run, native Windows,
macOS, Firefox/WebKit, or external presentation import is claimed. The configured
PR CI owns clean-checkout and cross-platform verification. Native editor/WSL
watching still needs platform evidence. Lifecycle capture and runtime workspace
module dependencies remain ticket 02; this contract supports a standalone source
entry with declared owned resources.

Commit/push the feature branch, open its PR targeting main, wait for latest CI,
then integrate through the documented workflow. The parent spec remains unchanged.
