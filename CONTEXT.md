# Visual workspace

A repository where a coding agent and its owner build technical visual material,
retain its source, and improve a reusable visual system and authoring practice.
These terms describe the intended product; they do not imply implemented code.

## Language

**Studio**: The maintained software that discovers, previews, renders, and
exports workspace artifacts. It may eventually be distributed independently.

**Workspace**: An owner's brands, projects, reusable visual parts, and authoring
practice, consumed by the studio and worked on by a coding agent.

**Starter**: The forkable distribution that brings together a studio, neutral
examples, initial guidance, and a place to grow an owner's workspace.
_Avoid_: Template, when referring to the whole repository.

**Owner**: The person or team whose visual identity, content, and working
conventions a workspace contains. Owners can also contribute studio improvements.

**Brand**: A visual and editorial identity, including semantic tokens, type,
marks, assets, usage guidance, and approved precedents.

**Semantic token**: A named role in a brand, such as a text color or heading
typeface, with a description of when it should be used. Its meaning and identity
remain stable across brand variations while its value can change.

**Brand variation**: An alternative expression of a brand, such as light or dark,
that supplies values for the same semantic tokens. Each artifact can be viewed
in every variation of its selected brand.

**Project**: A body of work selecting a brand and collecting its source material,
briefs, artifacts, and exports. A Git branch is not a project container.

**Collection**: A named grouping of related artifacts through references,
supplying shared context and intended visual direction. Collections may overlap
and span projects while members retain their own identity and ownership.

**Brief**: A durable request specifying audience, purpose, message, destination,
dimensions, and sources, with subsequent feedback retained alongside it. A
delivered visual brief is a document artifact.

**Artifact**: The editable source for one figure, diagram, page, or document,
together with the metadata needed to discover and render it.

**Document**: A composition centered on flowing prose, arranged into authored
pages that can combine text with figures and other visual parts.

**Asset**: A stored resource used in visual work, such as an uploaded or generated
image, a mark, or a font, with metadata describing its purpose and origin.

**Composition**: Named visual parts, their content and meaningful relationships,
and the arrangement that combines them into an artifact. Its parts can include
text, assets, configured components, figures, and nested compositions.

**Component**: A reusable visual part with a defined interface and an example.
It may be brand-neutral, brand-specific, or project-local.

**Configured use**: An application of a component or figure with particular
inputs, identified within its owning composition. It can be inspected and exported
independently without being a standalone catalog item.

**Placement**: Where and at what displayed size a configured use appears within
a composition. It belongs to the containing composition.

**Promotion**: Giving an existing local part an independent catalog identity for
reuse, retaining its origin and leaving the original composition intact.

**Composition template**: A reusable starting composition that makes clear what
changes between instances. It is distinct from the repository starter.

**Draft**: An artifact, component, or asset whose authored definition remains open
to direct revision. A draft can have an identity and be discoverable.

**Protected**: The state of a visual item whose authored definition is preserved
for reuse, either independently or through its owning composition. Its injected
brand values remain live.

**Derivative**: A separately identified visual item created by cloning or extending
an existing item, retaining its lineage while allowing independent changes.

**Export**: A delivered snapshot of an artifact in a supported format, associated
with its source revision and rendering settings.

**Authoring practice**: The owner's skills, briefing habits, review criteria,
and conventions for producing work and promoting reusable parts.

**Extension contract**: The documented interface through which owner material
is discovered and used by the studio without importing studio internals.
