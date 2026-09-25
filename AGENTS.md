# Working in visual-workspace

Build a visual workspace in which an owner can create a useful piece and leave a
better starting point for the next one. Quality includes the delivered visual,
editable source, reliable exports, and the ease of the next change.

## Orient before changing things

- Read [CONTEXT.md](CONTEXT.md) for the project vocabulary.
- For product scope, read [Project-Charter.md](Project-Charter.md). Its directory
  tree is a proposal; inspect the repository for what actually exists.
- For ownership, extension interfaces, or packaging, read
  [docs/architecture.md](docs/architecture.md).
- For code, tests, dependencies, or CI, read
  [docs/engineering.md](docs/engineering.md) before implementing.
- Read relevant local instructions, examples, and accepted decisions before
  editing a subsystem. Preserve unrelated work already in the working tree.

## Identify the kind of work

| Work | Responsibility | Default approach |
| --- | --- | --- |
| Studio development | Preview, discovery, rendering, export, and the contracts they expose | Solve a general capability; demonstrate it through an owner workspace. |
| Workspace extension | Owner brands, reusable parts, composition templates, and authoring skills | Extend through public contracts; keep owner choices in owner files. |
| Artifact production | One brief, composition, review, and export | Start project-local; reuse existing parts and inspect the delivered form. |

Infer the kind from the request and state it when it affects scope. If a task
crosses these responsibilities, make each change explicit. A request for a new
figure is not by itself a reason to redesign the studio.

Treat the studio and an owner's workspace as distinct responsibilities even
while they share a repository. The eventual app/library/starter packaging is
open. Keep extension contracts small and driven by working examples; record
proposals as proposals until a decision is made.

## Working loop

1. Establish the observable outcome and the evidence that will demonstrate it.
   Resolve consequential ambiguity; make routine, reversible choices directly.
2. Search for relevant components, templates, examples, skills, and commands.
   Reuse or adapt what fits before adding another abstraction or dependency.
3. Deliver a small end-to-end slice. Keep domain logic behind a small interface
   and keep environment effects at the edges. Add tests when they protect
   meaningful behavior or a concrete regression; routine scripts need no test suite.
4. Inspect the real result. For visuals, render at the destination dimensions;
   for export changes, inspect the exported file as well as the preview.
5. Review correctness against the request and maintainability. Substantive code
   changes also require independent spec and standards reviews under the
   [review policy](docs/engineering.md#review-and-compatibility-policy). Run the
   applicable checks, resolve review findings, and report results and limits.

## Owner material and reuse

- Read the selected brand, project, brief, and approved examples before making
  an artifact. Distinguish approved guidance from inspiration and unverified
  source claims. Save durable feedback with the work.
- Shared visual parts receive semantic brand tokens. Keep brand marks, private
  source material, and project copy with their owner; use neutral public fixtures.
- Promote a project-local part after a second use reveals a stable interface,
  or when the user explicitly requests a reusable part. Include an example.
- Owner extensions use documented studio interfaces. When an interface is
  missing, describe the gap and make a deliberate studio change with coverage.

## Agent skills

Skills live in `.agents/skills/`; Claude adapters point to the same files.
Read only the skills relevant to the task. See
[docs/agents/skills.md](docs/agents/skills.md) for selection, invocation, provenance,
updates, and project-specific interpretation of upstream workflows.

### Issue tracker

Portable local Markdown is the bootstrap default. Read
[docs/agents/issue-tracker.md](docs/agents/issue-tracker.md) when creating or working
from specs or tickets. Small changes can be completed directly from the request.

### Triage labels

Use the vocabulary in [docs/agents/triage-labels.md](docs/agents/triage-labels.md)
when triaging work.

### Domain docs

One root context, with decisions recorded when needed. Read
[docs/agents/domain.md](docs/agents/domain.md) when updating terms or decisions.

## Current verification

The executable quality lab establishes the development toolchain; the product
studio remains to be built. Follow [setup and commands](docs/development.md) and
[testing and evidence requirements](docs/testing.md). Select the smallest useful
local checks for the change. CI owns the full `pnpm check` gate; a full local run
needs a concrete reason, not a routine end-of-task habit. Once relevant checks
pass, stop unless new changes or failures invalidate that evidence. Use
`pnpm check:env` for environment setup or troubleshooting, not after every edit.
Documentation normally needs diff/link review, not application tests.

Extend the gate with each product capability. Inspect changed visual output and
actual exports; review baseline changes explicitly. Do not weaken checks to make
a change pass. Report exactly what ran, what was inspected, and any unverified
platform or destination.
