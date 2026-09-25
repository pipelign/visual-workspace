# Engineering quality

These standards guide studio development, workspace extensions, and agent
contributions. The executable quality lab establishes the toolchain before the
first product slice. See [development setup](development.md) for the chosen stack
and commands, and [testing and evaluation](testing.md) for required evidence,
reviewed image baselines, diagnostics, and verification limits.

## Implement a behavior at a time

Describe the observable result and identify the public interface that will
demonstrate it. Add a test when it protects meaningful domain behavior, a public
contract, or a concrete regression worth maintaining. When test coverage is
warranted, start with a failing behavioral case, implement the behavior, and
review for clarity and design. A regression test should fail before the fix.
Use already agreed acceptance criteria and test interfaces; ask when a new
interface or product decision is actually unresolved.

Test through interfaces callers use. Choose expectations from the requirement,
worked examples, or independently verified fixtures. Mock external boundaries
when needed, while exercising our own collaborating code together. Avoid tests
that merely reproduce implementation formulas, inspect private helpers, or
approve generated snapshots without reviewing them.

Routine scripts, task wrappers, configuration, prose, and simple styling do not
need dedicated test suites. Inspect them and exercise a changed command when
that answers a concrete uncertainty. Substantive domain behavior belongs in a
testable module regardless of which entry point calls it. Use the
[selective verification policy](testing.md#select-local-checks) to decide what
to run; avoid wording assertions and compiler-duplicate tests.

## Keep changes easy to understand

Prefer a small interface that hides meaningful complexity. Keep rendering,
discovery, and export responsibilities understandable; separate deterministic
logic from filesystem, browser, process, and network effects. Reuse stable parts
after demonstrated need, and remove obsolete paths within the affected scope.

Use the evaluated stack and documented commands unless the behavior exposes a
concrete limitation. Explain dependency changes against the authoring loop, retain
exact direct pins and the lockfile, and preserve strict static checking. Keep one
formatting and linting setup. Avoid dependencies for trivial helpers and
suppressions or type escapes without a specific reason. Extend the working lab
or a real public-contract example when a tool choice needs further evidence.

Validate data where it crosses a contract. Errors should identify the artifact,
field, file, or export step that failed and give the owner a useful next action.
Handle missing assets, unsupported formats, and render failures explicitly.
Keep generated files inside the intended output location and preserve source
files and unrelated exports on failure.

Deterministic repository tooling uses Node: validation, generators, migrations,
fixtures, and task orchestration. Use portable Node APIs and argument arrays,
and wire maintained tools into the documented commands and applicable checks.
Bootstrap checks use built-ins so they can run before dependency installation.

## Coding conventions

Use the vocabulary in `CONTEXT.md` in names and types. Name modules for the
capability they own; keep related logic, private helpers, and focused tests
nearby. Prefer named exports for maintained source, with default exports where a
tool requires them. Use camelCase for functions and values, PascalCase for types
and React components, and descriptive kebab-case filenames. Follow an existing
local convention when extending a subsystem. Formatting belongs to the formatter.

Prefer ordinary functions and explicit data. Use a class when it makes resource
ownership or stateful behavior clearer. Choose structure by the work a caller
needs to do; there is no required class hierarchy, functional-programming library,
file-length limit, or function-length quota. Comments explain an invariant,
constraint, or non-obvious reason. Public examples demonstrate how to use the
interface; comments that repeat the implementation add little.

A module's interface includes its inputs, results, errors, ordering requirements,
and resource ownership. Keep those obligations small and explicit. The
[codebase-design skill](../.agents/skills/codebase-design/SKILL.md) supplies the
shared vocabulary. Add an abstraction when a caller becomes simpler or a real
variation needs a seam. A wrapper that only passes arguments onward needs a
concrete reason to exist. Share a stable domain rule; leave coincidental
similarities local until their common meaning is established.

Document public studio entry points and give their inputs and results explicit
types. Keep private implementation details private. Owner examples import those
public entries, and the UI calls the same operations agents can use. A lifecycle
rule must not exist only in a button handler. Local type inference is encouraged
when the value's meaning is clear; type annotations must carry useful information.

## State, failures, and effects

Represent meaningful mutually exclusive states with tagged unions rather than
independent booleans that admit contradictory combinations. For example, a render
operation can be `loading`, `ready` with its output, or `failed` with a diagnostic.
Keep genuinely independent options independent. Validate outside data once as it
enters a supported operation, then pass the validated representation internally.
TypeScript can narrow tagged unions and check exhaustive handling, but types do
not validate file contents at runtime. See the
[TypeScript narrowing guide](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

Keep transformations deterministic where practical. Pass varying environmental
inputs at the operation's seam: filesystem access, clock, identity allocation,
and browser execution as needed by the behavior. Keep ordinary local calculations
ordinary; dependency injection is for a real effect or variation. Avoid mutable
global state that makes one operation or test depend on another's execution order.

Define how callers distinguish expected failures they can act on, such as invalid
input, a stale revision, or an unsupported format. Use a documented tagged result
or identifiable error as appropriate to that operation; do not wrap every
function in a generic result abstraction. Preserve the cause when translating an
unexpected error. Report useful context at the operation/UI entry and keep
exception text out of identity checks. An empty result or fallback must represent
an intentional contract, never hide a failed read, write, or required resource.

An async operation owns its completion, cancellation behavior, and cleanup.
Await work needed for success; close files, watchers, and browser contexts on
failure as well as success. Preview work for an older revision must not replace a
newer result. Validate a write before changing source, check for stale input, and
preserve the last valid source on failure. The storage mechanism must demonstrate
these guarantees with real failure cases; naming a helper "atomic" is insufficient.

## React and visual code

Keep React responsible for rendering and interaction. Domain operations own
identity, protection, derivation, validation, and writes. Keep transient selection
or panel state local to the UI that owns it. Derive values from existing inputs
when possible; use an Effect to synchronize with an external system, with cleanup
where needed. Handle a user action in its event handler. These conventions follow
React's guidance on [state structure](https://react.dev/learn/choosing-the-state-structure)
and [Effects](https://react.dev/learn/you-might-not-need-an-effect).

Author visual composition modules from resolved content, resources, dimensions,
and semantic brand inputs. Keep filesystem and browser orchestration in their
operations. Share the composition between preview and export. Tailwind and shadcn
belong to the studio shell; an artifact must carry its required styles and
resources without depending on shell globals. Fixed owner imagery retains its
appearance; reusable visual parts receive semantic brand values.

Start controls with semantic HTML, accessible names, keyboard behavior, and
visible focus. Define applicable loading, empty, failure, and success states
alongside the normal path. Treat copied shadcn code as maintained project source;
inspect and test the actual composed control. The accessibility evidence and
artifact review requirements remain in [testing](testing.md).

## Maintainability review

Static gates cover mechanical mistakes. Review must also explain whether the
change implements the request, whether the interface hides useful complexity,
and whether a future change stays local. Check failure behavior and owner-file
preservation, not just the successful example. A reviewer should cite a concrete
rule or maintenance consequence; a code-smell label alone is not a defect.

Performance work starts with a reproducible scenario and measurement. Record the
workspace size, artifact dimensions, environment, and operation being measured.
Set budgets from the intended workflow and retain evidence for regressions. Add
caches, memoization, and extra parallelism to address an observed need, including
how invalidation and resource use remain correct.

## Review and compatibility policy

The owner chose these policies on September 24, 2026.

Every substantive code change requires the implementer's checks and self-review,
followed by independent agent review against both the request/spec and these
standards. This includes meaningful changes to behavior, public interfaces,
dependencies, and tooling or CI that affects execution or verification. Prose and
simple styling retain proportionate verification as described above. Reviewers
use recorded verification evidence and rerun checks only for a specific concern.

Use the [code-review workflow](../.agents/skills/code-review/SKILL.md) with the
[repository interpretation](agents/skills.md#repository-interpretation). Capture
the task's starting commit and acceptance criteria before implementation. Review
the final changed files, including staged, unstaged, and new files. Keep standards
and spec findings separate. Resolve substantiated violations before declaring the
change ready; record the reasoning when a finding does not apply. Material fixes
need review of the affected areas. Independent review does not grant permission
to merge, publish, or change the task's scope.

During bootstrap, studio and extension interfaces may change with a documented
migration. Before declaring a breaking change ready, identify affected consumers,
show the before/after usage, and demonstrate the migration with a working owner
example. When saved material is affected, test that existing owner work and
protected definitions remain preserved and usable, including their dependencies
and authored behavior. Update the public examples and diagnostics together.
Choose a stable compatibility commitment explicitly when the public contract
matures; none is implied merely by the first implementation.

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

Choose local checks from the changed behavior and likely impact. A relevant test
file or scenario, targeted static check, command smoke check, or output inspection
is normally sufficient. The [testing policy](testing.md#select-local-checks)
defines when to broaden that selection and when to stop. State what ran and what
is left to CI; a local full-suite run is not required to finish an ordinary change.

CI runs `npm run check`: skill integrity, types, lint, formatting, Node tests, build,
Chromium checks, and Linux visual comparisons. Keep that full gate available for
cross-cutting changes, reproducing broad CI failures, or an explicit request.
Documentation normally needs diff/whitespace and affected-link review. Run the
skill checker when skill files, adapters, their manifest, or wiring change.

CI is configured for Linux, native Windows, and macOS with retained reports and
actual probe exports. A configured job is not evidence of a successful remote run.
Add behavior-specific checks with each capability; the lab does not satisfy the
product's full acceptance criteria. Do not add passing placeholder tests or
silently weaken gates, assertions, or baseline tolerances.

Before finishing a change, review the complete diff, including new files, against
both the requested behavior and these standards. Check that a workspace extension
has not introduced dependencies on studio internals. Update the affected public
examples and docs, and state exactly which checks ran and which remain unverified.

For a pause or handoff, leave enough durable context to resume: outcome sought,
files changed, decisions, checks and results, open questions, and the next step.
Keep speculative plans separate from implemented behavior.
