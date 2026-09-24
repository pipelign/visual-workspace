# Engineering quality

The repository currently contains project and agent setup only. These standards
guide executable code as it is introduced; application checks do not yet exist.

## Implement a behavior at a time

Describe the observable result and identify the public interface that will
demonstrate it. For substantive features and bug fixes, use a failing behavioral
test, the smallest implementation that passes it, and a review for clarity and
design. A regression test should fail on the broken behavior before the fix.
Use already agreed acceptance criteria and test interfaces; ask when a new
interface or product decision is actually unresolved.

Test through interfaces callers use. Choose expectations from the requirement,
worked examples, or independently verified fixtures. Mock external boundaries
when needed, while exercising our own collaborating code together. Avoid tests
that merely reproduce implementation formulas, inspect private helpers, or
approve generated snapshots without reviewing them.

Documentation and simple styling edits need proportionate verification. Do not
add tests that assert prose wording or duplicate what a compiler already checks.

## Keep changes easy to understand

Prefer a small interface that hides meaningful complexity. Keep rendering,
discovery, and export responsibilities understandable; separate deterministic
logic from filesystem, browser, process, and network effects. Reuse stable parts
after demonstrated need, and remove obsolete paths within the affected scope.

When choosing the application stack, document why it fits the authoring loop,
pin dependencies with a lockfile, and enable strict static checking. Use a single
documented formatting and linting setup. Avoid adding dependencies for trivial
helpers or carrying suppressions and type escapes without a specific reason.

Validate data where it crosses a contract. Errors should identify the artifact,
field, file, or export step that failed and give the owner a useful next action.
Handle missing assets, unsupported formats, and render failures explicitly.
Keep generated files inside the intended output location and preserve source
files and unrelated exports on failure.

## Evidence for studio changes

Use the smallest set of checks that covers the changed behavior:

- Contract tests for discovery, metadata validation, and owner extensions.
- Integration tests for real rendering and export paths, including relevant
  failure cases such as missing fonts or assets and unsupported output formats.
- An end-to-end check of a neutral workspace through preview and export for
  changes to the core authoring loop.
- Visual inspection at intended dimensions for changes to layout, typography,
  clipping, page breaks, or export fidelity. Inspect the exported artifact too.

Stabilize fonts, assets, dimensions, and time-dependent inputs before relying on
image comparisons. Review any changed baseline. A successful command alone does
not prove that an export is readable or correctly laid out.

For brand rendering changes, exercise token updates through nested visual parts,
side-by-side variation isolation, and missing-token diagnostics. Adding a variation
must expose existing artifacts without copying their source. Check preview and
export with the same variation, including typography changes and fixed assets.

For lifecycle changes, exercise direct draft editing, explicit protection,
protection on composition use, and derivation without changing existing consumers.
Include owned Markdown and nested visual dependencies in preservation checks,
while verifying that injected brand changes still reach protected artifacts.
Verify that discovery-only metadata edits preserve identity and existing renders
without a derivative, while metadata used directly in rendering stays protected.

For ownership and discovery changes, exercise locally identified configured uses
under their owner, repeated uses with different inputs, and promotion without
altering the original. Verify that draft-owned configuration can change without
mutating a protected component, and that a protected figure's local parts cannot
be changed through a draft parent. Check lookup and export by owner-qualified ID.
For collection changes, exercise overlapping membership across projects. Adding
or removing a membership must preserve item identity, owning scope, source, and
lifecycle; actual composition use still triggers protection.

For composition and part-export changes, inspect both the complete slide and
independent exports of its used figures, assets, and nested visual subcomponents.
Exercise repeated component uses with different inputs, brand variations, inherited
styles, fonts, bounds, and transparency. Check that exporting a part preserves its
source lifecycle and excludes unrelated neighbors. Verify destination import before
claiming that a handoff workflow works in an external presentation tool.

For adaptation behavior, use a wide composition and a derivative for a narrow
destination. Check that the original and its consumers remain intact, expected
content and relationships are retained according to the brief, and local origins
are traceable. Inspect both layouts and their part exports at intended dimensions
with representative brand variations; source reuse alone does not prove legibility.

For studio UI changes, check keyboard access, visible focus, understandable
labels, loading and failure states, and representative viewport sizes. Apply
brand and destination requirements to the artifact itself. Record the source
revision, dimensions, selected brand, format, and relevant renderer settings for
exports; dirty source needs an explicit record rather than a clean-commit claim.

For portable HTML changes, inspect a copied export independently of the studio
and workspace, checking fonts, assets, styles, saved content, and resolved brand
values. Exercise the proposed offline/local-file opening contract before claiming
that it works; a successful in-app preview or hosted build is insufficient.

For agent discovery and validation changes, exercise compact lookup, inspection
of applicable guidance and approved examples, and traversal to configured parts.
Check useful error reports through the public interface. Use a representative
agent authoring task to assess whether relevant reuse was found without reading
the whole workspace; deterministic contract tests do not establish visual quality
or efficient agent behavior by themselves. For enforcement changes, verify that
structural violations block the affected operation, advisory visual findings
allow export, and failed applicable mandatory owner rules block export. Preserve
draft inspection and useful diagnostics when a complete render cannot be produced.

## Completion and CI

The first executable slice must include reproducible installation, development,
test, type-check, lint, and build commands, plus CI that runs the relevant checks
from a clean checkout. Choose the tools with that slice. Do not create a passing
placeholder test suite in the meantime.

For now, run `python3 scripts/check_agent_setup.py` and `git diff --check`.
The setup checker verifies the vendored snapshot and agent adapters without
network access or third-party Python dependencies. CI runs the same checker.

Before finishing a change, review the complete diff, including new files, against
both the requested behavior and these standards. Check that a workspace extension
has not introduced dependencies on studio internals. Update the affected public
examples and docs, and state exactly which checks ran and which remain unverified.

For a pause or handoff, leave enough durable context to resume: outcome sought,
files changed, decisions, checks and results, open questions, and the next step.
Keep speculative plans separate from implemented behavior.
