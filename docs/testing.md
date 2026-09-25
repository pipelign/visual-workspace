# Testing and evaluation for agent contributions

Use this with the [engineering guide](engineering.md). Commands and platform
setup live in [development](development.md); the runnable examples live in the
quality lab. The standard is an observable result with retained evidence.

## Definition of done

For a change, identify the requirement and the observation that would fail if it
were broken. Exercise the smallest public interface that captures that behavior.
Keep implementation tests and visual judgment distinct. A contribution is ready
when the selected local checks pass, applicable changed outputs have been
inspected, and remaining CI/platform verification is stated precisely.

A completion report contains: the behavior changed; the commands actually run
and their results; inspected output paths and relevant dimensions/variation;
remaining limits; and any public-contract or migration consequence. A saved
artifact or test log without inspection does not establish visual quality.

## Select local checks

Choose checks by the behavior and likely impact of the diff. CI runs the full
suite; agents do not routinely duplicate it locally.

- Start with the smallest useful check: an affected test file or named scenario,
  targeted lint/type checking, one changed command, or inspection of its output.
  Reuse existing coverage before adding tests. A test must protect a meaningful
  failure mode and justify its maintenance cost.
- Routine scripts and task wrappers need no dedicated test suites. Use inspection
  and a focused command smoke check when useful. Prose or simple configuration
  edits generally need diff/link review or parsing, not application/browser tests.
- Broaden only when the affected behavior crosses modules, a focused failure
  suggests wider impact, or a runtime/dependency/test-configuration change creates
  concrete uncertainty about other suites. A full local run is appropriate for
  that uncertainty, reproducing a broad CI failure, or an explicit user request.
  State the reason before running it; editing configuration alone is not a reason.
- Stop when the selected checks pass. Repeat them only after a relevant change,
  failure, or unresolved concern. A final reassurance run, documentation update,
  handoff, or independent review does not by itself warrant another test run.
- Report what ran and what remains for CI. Reviewers inspect the existing evidence
  and run additional checks only to answer a specific question. Fix observed
  failures; handing broad coverage to CI does not mean ignoring known failures.

For example, a renderer change can use
`pnpm exec vitest run tools/quality-lab/render.test.ts`; a browser behavior can
use a relevant file or test-name filter. A documentation edit needs neither.
`pnpm check` remains the complete CI gate, available locally when justified.

## Choose evidence for the affected behavior

These are relevant evidence types, not a checklist to run for every change.

| Change | Gate and evidence |
| --- | --- |
| Domain operations, identity, references, lifecycle | Vitest through supported operations, using temporary filesystem workspaces for real collaboration. Cover successful and failed writes, transitive preservation, and observable diagnostics. |
| Public authoring/extension contract | A neutral owner example using only public entries, runtime input validation, and behavioral tests. Add focused type tests only when the contract has meaningful compile-time behavior. |
| Rendering, resources, brand values | Real browser output using actual fonts/images, both variations, isolated rendering, and an explicit readiness check. Inspect actual exported files. |
| Export or packaging | Copy only the delivery outside the workspace; open a local-file URL offline; verify resource completeness, dimensions, content, and capabilities. Production portability acceptance additionally stops the studio. |
| Studio controls | Real interaction using roles/labels, keyboard/focus behavior, loading/failure states, representative viewports, and automated accessibility findings. |
| Visual layout | Reviewed image comparisons in the reference environment plus inspection for hierarchy, density, typography, clipping, and fidelity to the brief at destination size. |
| Agent discovery or guidance | An actual authoring/resumption task without supplied source paths, recording missing context, irrelevant reads, and whether established work was found and reused. |
| Routine scripts or task wrappers | Inspect the change; run the affected command when useful. No dedicated script regression suite. |
| Prose or simple styling | Diff/link review and applicable visual inspection. No automatic setup check or application suite. |

The lab supplies working examples of several mechanisms. It does not yet
establish product lifecycle preservation, authoring efficiency, collection
guidance, Markdown repair, or the external presentation handoff.

## Static checks that carry meaning

Type-check maintained TypeScript and tests separately from transpilation.
Enable strict checking, absent indexed values, exact optional properties,
unchecked side-effect imports, consistent file-name casing, and useful control-flow
checks. Use `unknown` plus validation where data crosses a real input contract.

Typed ESLint rejects explicit/unsafe `any`, unsafe narrowing assertions,
non-null assertions, floating/misused promises, and incomplete domain-union
switches. Use the stable recommended typed preset with explicit project rules.
`@ts-ignore` and `@ts-nocheck` are errors. A narrowly justified
`@ts-expect-error` needs a specific description; negative public type tests are
one legitimate use. Avoid changing compiler options or adding suppressions merely
to make a contribution pass.

Keep formatting in Prettier and semantic checks in ESLint. Check commands do not
auto-fix source. Import rules currently keep the fixture's browser compositions
away from Node effects. When real studio/owner entry points exist, extend scoped
rules and add an owner example; a static import rule is not a sandbox or a proof
about arbitrary dynamic imports.

## Behavioral test discipline

- Assert consequences callers can observe: saved content, returned results,
  unchanged consumers, error identity/repair guidance, or actual delivery.
  Avoid private-helper assertions and expectations computed using the same
  implementation being tested.
- When a behavioral test is warranted, begin with a failing case. A bug regression should fail
  for the reported behavior before the fix. Assert failure identity, not merely
  that some exception occurred.
- Exercise our own collaborating code together. Mock a real external boundary
  only when necessary; use actual local files and the real browser for their
  contracts. Make dependencies such as clock or IDs explicit when determinism
  requires it.
- Use independently chosen fixtures and expected values. Test missing resources,
  stale writes, unsupported capabilities, and preservation on failure alongside
  successful output. Lifecycle work should include meaningful event sequences.
- Keep Vitest and Playwright discovery separate. An empty suite or focused
  `only` test must fail the CI gate. Run affected tests locally; expanding to the
  full suite requires the reason described above.
- Retries are disabled in the baseline. Investigate nondeterminism from readiness,
  shared state, clocks, assets, or test isolation. Repeated retries and arbitrary
  sleeps do not repair the underlying contract.
- Coverage is a map of unexercised branches. Prioritize requirements and damaging
  failures; do not optimize a blanket percentage, test count, or snapshot count.
  Introduce property-based testing for concrete lifecycle/reference invariants,
  or mutation testing for a critical algorithm, when that question warrants the
  extra tool. Neither is an installed prerequisite.

## Browser and export evidence

Browser suites build the lab and serve the production output, exercising bundled
assets as well as interaction. The Node renderer runs in its real TSX-aware process. Browser tests inspect its
generated delivery rather than recompiling server TSX inside the test runner.
This matters with the pinned Playwright release: its JSX runtime produces mounting
descriptors, which React's server renderer cannot consume. The probe encountered
that failure; using the real Node output preserves the correct execution boundary.

Wait for the resources needed by the composition. Font readiness includes a
declared face reaching its loaded state, not only `document.fonts.check()`
or `document.fonts.ready`. Decode required images, settle layout, and fail a
required-resource error explicitly. A negative corrupt-font case demonstrates
that the harness rejects fallback text. Network-idle and elapsed time are not
resource-completeness contracts.

Use a fresh offline context for portable files, with artifact JavaScript disabled
for the static contract. Record unexpected network requests, console/page errors,
and actual file geometry. Test URL conversion with spaces, Unicode, and reserved
characters. The lab's file opening succeeds independently of HTTP; its test web
server remains available for separate UI tests. The production acceptance still
requires an explicit studio-stopped exercise.

A PNG header/dimensions check proves geometry only. Inspect the resulting image
and compare reviewed representative output. A parsed PDF page count/media box
proves geometry only; PDF typography, clipping, and authored multipage fidelity
require inspecting rasterized pages or the PDF itself. Native SVG and external
presentation import need their own capability/destination evidence.

## Visual references and accessibility

The canonical image comparison target is the pinned Chromium release on Ubuntu
24.04 with the fixture's embedded Inter font, fixed dimensions, locale, timezone,
device scale, and disabled animation. Windows/macOS run behavioral/export checks;
their different text rasterization is not compared against the Linux images.
A browser/tool/font upgrade includes reviewing changed output and baseline
environment metadata.

The initial baselines are reviewed neutral fixtures, not owner-approved artwork.
A missing or changed baseline fails. To intentionally propose a new baseline on
the reference platform:

```sh
pnpm test:visual --update-snapshots
```

Inspect every changed expected image, explain the visual reason, retain the
relevant diff/evidence, then run the ordinary check without update mode. Never
update snapshots simply because a test failed. Canonical remote CI results remain
necessary to verify the reference environment after the initial local evaluation.

Target WCAG 2.2 AA for studio interactions. The axe scan covers detectable issues;
it does not establish accessibility conformance. Review keyboard operation,
visible focus, labels, reading order, zoom/viewport behavior, and relevant manual
screen-reader tasks when controls or navigation change. shadcn source and its
underlying primitives still need tests in their actual composition.

## Reports and verification limits

The browser and visual suites retain separate reports under `artifacts/`, so one
suite does not overwrite the other. Failures include traces, screenshots, and
error context. Successful export tests attach the actual PNG and PDF probe.
CI retains these artifacts with an OS-qualified name.

The CI gate runs Chromium on Linux, native Windows, and macOS; the Linux job
also checks the visual references. Additional Firefox/WebKit checks are opt-in
until exercised and added to a deliberate required job. Build success, a configured
job, and a passing remote job are separate facts.

Document an unavailable environment or destination as unverified. Do not silently
skip a required scenario, weaken an assertion, broaden a tolerance, or relabel a
broken capability as unsupported. Resolve the capability or explicitly revisit its
scope with the owner. The [research comparison](research/quality-tooling-evaluation.md)
contains the primary-source basis and deferred tooling options.
