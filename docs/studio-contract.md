# Standalone draft studio contract

Ticket 01 implements standalone draft figures. Reuse, protection, derivation,
documents, collections, and PNG/PDF/SVG delivery remain later ticket work.
The owner workspace is `workspace/`; maintained operations and UI are `studio/`.

## Public operations

Import from `studio/index.ts`, or use `npm run studio --` with the gallery stopped:

```sh
npm run studio -- list
npm run studio -- inspect source-to-delivery
npm run studio -- export source-to-delivery dark artifacts/exports
```

- `discover(root)` returns validated catalog entries without loading authored code.
- `inspect(root, id)` adds variation names and structural diagnostics. Missing
  resources and broken brand data leave valid draft metadata inspectable.
- `render(root, { id, variation })` resolves local resources and semantic tokens,
  invokes the composition, checks actual browser resource loading, and returns
  `{ html, record }`. Preview and export share this saved-source path.
- `createHtmlExport(root, { id, variation, format })` checks capability and returns
  that same portable delivery. The studio download uses this operation.
- `exportArtifact(root, { id, variation, format, output })` saves `artifact.html`
  and `record.json` together in a fresh uniquely named delivery directory. Staged
  files are renamed into place after both writes; failures preserve source and
  prior deliveries. Only HTML is supported for standalone drafts in this ticket.

Operations return explicit types and throw `StudioError` with a diagnostic:
`code`, `item`, `source`, `field`, `message`, and `repair`. Callers use `code` for
identity. Invalid identities or duplicate IDs block catalog lookup; malformed
brand data, missing tokens/resources, stale source during rendering, and failed
renders identify the affected operation. Inspection does not execute composition
code and cannot diagnose arbitrary authored-code errors.

The CLI accepts `STUDIO_WORKSPACE` as an alternative workspace root. The first
studio UI opens the bundled neutral workspace. Rendering/export requires the
pinned Chromium installation and system libraries; discovery/inspection does not.

## Owner files

`workspace/catalog.json` has an `artifacts` array. Each entry declares stable
lowercase `id`, `title`, `description`, `category`, `tags`, intended `usage`,
`lifecycle: "draft"`, project/brief/brand/source paths, integer pixel `dimensions`,
`capabilities: ["html"]`, required semantic `tokens`, and named `assets` paths.
Paths are relative to the workspace root. Required files and symlink targets
must remain within that root. The neutral entry demonstrates the full schema.
Discovery-only text explains intent; it is distinct from recorded consumer use.

A brand JSON file declares `id`, described `roles` of kind `color` or `font`,
`variations` supplying values, and `fonts` with local `source` and `license` paths.
Colors are six-digit hex values. Font values name declared regular WOFF2 fonts.
The example's `bodyFont` supplies the document typeface; `headingFont` and the
owner-defined `workflowAccent` are consumed by the authored figure. Required
roles must have a description and a value in every variation. Add a variation by
adding values; no figure source needs copying. Separate isolated documents prevent
one variation's CSS/font values from leaking into another.

An authored TSX entry exports `compose: Composition`, importing its type through
the public entrypoint. It receives resolved `dimensions`, read-only `tokens`,
and named `assets` as data URLs, and returns static React content. Keep its
authored visual definition in that entry and its declared local resources for
this standalone slice. Runtime workspace-module dependencies are not yet a
supported definition contract; ticket 02 establishes captured dependencies.
Filesystem/browser effects belong in studio operations. Scripts, executable
attributes, embedded documents, and network resources cannot form a portable
static delivery. Preview frames disable artifact JavaScript.

Adapt [the neutral figure](../workspace/projects/source-to-delivery/figure.tsx)
and its [brief](../workspace/projects/source-to-delivery/brief.md) for a new
standalone entry. Owner copy, imagery, fonts, brand roles, and composition choices
remain owner files; adding another entry does not require editing the studio.

## Source and delivered snapshots

Single-file HTML embeds actual font bytes, font licensing, fixed imagery, styles,
and resolved brand values. The `studio-export` meta field contains the record;
filesystem delivery also includes readable `record.json`. Record fields include
artifact/brand/variation, dimensions, format, React/Node renderer versions, and
single-file packaging. Source state includes Git HEAD and dirty status (or null
outside Git), sorted SHA-256 file digests, and a combined digest of the declared
catalog, composition, brand, brief, project, fonts/licenses, and assets. Dirty
source remains explicitly recorded, rather than attributed to a clean commit.
Later source or brand edits do not rewrite an existing delivery. A supported
render rejects changes to declared files during source resolution/composition.

`npm run dev` watches workspace changes and refreshes inspection and previews.
The refresh control requests the latest saved source explicitly. Draft errors
show repair guidance and leave inspection available; an incomplete preview cannot
be downloaded. The production preview serves the built shell against the same
public operations. It remains a local development application, not a hosted app
distribution decision.

## Lab migration

The lab shell and complete-figure implementation were retired in ticket 01.
Studio tests now own variation, preview, accessibility, missing-resource, static
HTML, and offline-file evidence. The private Delivery-part fixture remains solely
for PNG/selected-part checks until ticket 04 and PDF geometry until ticket 06.
It is exposed at `/probes/delivery.html` for test inspection, never as a supported
workspace artifact or an offered export capability. Public HTML does not imply
support for PNG, PDF, SVG, or external presentation import.
