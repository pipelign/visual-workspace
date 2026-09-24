# Studio, workspace, and starter

Status: working design direction. The charter establishes the authoring loop;
distribution as an app, library, or separate starter remains an open decision.
This document establishes responsibilities to guide the first implementation,
not a package layout or a commitment to a plugin system.

## Ownership

| Responsibility | Examples | What an extension can rely on |
| --- | --- | --- |
| Studio | Gallery behavior, artifact discovery, rendering lifecycle, export pipeline, diagnostics | Documented contracts and supported commands |
| Workspace | Brands, assets, shared visual parts, composition templates, agent skills | Owner-controlled files using those contracts |
| Project | Briefs, sources, specific compositions, feedback, delivered snapshots | Selected brand and declared reusable dependencies |
| Starter distribution | Neutral examples, onboarding, initial workspace layout, development guidance | A working first authoring and export loop |

The studio owns common application behavior: navigation, preview controls,
discovery, export status, and error presentation. Owners control artifact design,
brand identity, content, and authoring practice. A workspace can add a layout or
review workflow without changing gallery internals.

Changing the studio's general display or workflow rules is studio development.
Changing the appearance of a deliverable is workspace or project work. Actual
owner demand may later justify a supported studio customization point.

## Dependency direction

The studio consumes owner material through explicit contracts. Workspace
extensions use those contracts and public visual primitives. The studio's core
implementation must not depend on a particular owner's brand or project.
An application composition root may wire a concrete workspace into the studio.

Start with files, ordinary source modules, and the smallest useful metadata.
Introduce interfaces for observed variation, not a universal extension registry.
Each supported extension point needs a working owner example, validation with an
actionable error, and a behavioral test through its public interface.

Candidate contracts for the first working slice are:

- Brand identity and semantic visual tokens.
- Artifact identity, selected brand, dimensions, dependencies, and render entry.
- Discoverable capabilities, including which export formats an artifact supports.
- Export inputs and a result that identifies the source and rendering settings.

The implementation will determine their exact fields. React/HTML compositions
cannot be assumed to support native SVG export. Preview and export should share
the same composition source and make format-specific differences explicit.

Local workspace source executes with the local toolchain's privileges. The
initial design is for trusted owner code; accepting untrusted plugins, remote
code, or arbitrary uploads would require a separate security design.

## Extending with an agent

An owner should be able to ask an agent to add a brand, author an artifact, or
improve a reusable composition using only the workspace files and public studio
interfaces. That is a product requirement, not just a documentation convention.

For example, a launch diagram starts as a project-local composition using its
brand's tokens. A second diagram can justify a neutral node component. A renderer
bug found during export belongs in the studio, with a neutral regression fixture.
The launch copy and private architecture remain with the project.

When a task exposes a missing capability, identify the minimum studio change and
demonstrate it with an extension. This makes the boundary testable before there
are separate packages. Compatibility changes must account for existing owner
examples and explain any migration; a public contract cannot change silently.

Root agent guidance applies to both maintainers and owners. Put focused owner
rules near the brand or project, and reusable authoring workflows in their own
skills. Keep engineering skills separate in purpose from visual authoring skills:
producing a figure should not require the full software planning workflow.

## Packaging to investigate

The strongest initial hypothesis is a maintained studio used by a forkable
workspace. Under that model the studio can eventually ship unchanged to many
owners, while their workspace accumulates identity, content, and practice. A
starter would assemble them; it would not define every studio implementation.

Start in one repository and validate the responsibility boundary before creating
multiple packages or repositories. Use the first real deliverables to answer:

1. Can a second brand and project be added without editing studio internals?
2. Can a studio improvement be applied while preserving owner customizations?
3. Can a clean checkout complete brief → preview → review → export in one session?
4. Does the third deliverable reuse useful parts and remain easy to revise?

If these hold, extracting a versioned studio package or app becomes a concrete
distribution choice. If owners repeatedly need to change its internals, learn
which contracts are missing before promising upgrade compatibility.

Decide separately whether the studio is a library embedded in another app, an
app pointed at a workspace, or code vendored by the starter. Record the choice
and tradeoffs when evidence supports it. The charter's proposed directories are
useful sketches, not a requirement to scaffold empty layers now.
