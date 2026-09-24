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

For studio UI changes, check keyboard access, visible focus, understandable
labels, loading and failure states, and representative viewport sizes. Apply
brand and destination requirements to the artifact itself. Record the source
revision, dimensions, selected brand, format, and relevant renderer settings for
exports; dirty source needs an explicit record rather than a clean-commit claim.

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
