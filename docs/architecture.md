# Studio, workspace, and starter

Status: working design direction. The charter establishes the authoring loop;
distribution as an app, library, or separate starter remains an open decision.
This document establishes responsibilities to guide the first implementation,
not a package layout or a commitment to a plugin system.

The [authoring model proposal](authoring-model.md) develops the requested
collection, composition, editable-content, and agent-discovery workflows. Its
open choices are not accepted architecture decisions.

[Injected brand variations](adr/0001-injected-brand-variations.md) is an accepted
design decision. It establishes live brand dependencies and variation coverage;
the rendering and token-schema implementation remains open.
[Protect established items and derive changes](adr/0002-protected-items-and-derivatives.md)
is also accepted: drafts allow direct revision, and composition use protects the
included item while the containing composition can remain a draft.
[Complete compositions and visual-part exports](adr/0003-compositions-and-part-exports.md)
establishes full-slide delivery plus independently exportable used parts. Native
editable presentation export is deferred to the [roadmap](roadmap.md).
[Composition-owned parts](adr/0004-composition-owned-parts.md) establishes local
configured uses, hierarchical discovery, and explicit promotion to independent
catalog items.
[Agent-led composition adaptation](adr/0005-agent-led-composition-adaptation.md)
sets the direction for reusing visual parts in destination-specific layouts.
[Code-authored compositions](adr/0006-code-authored-compositions.md) establishes
agent-authored layouts and focused studio controls. A general canvas editor is
outside the product direction.
[Paged Markdown documents](adr/0007-paged-markdown-documents.md) establishes
owner-editable document prose with authored page boundaries and agent-led layout
repair when saved edits no longer fit.
[Agent authoring support](adr/0008-agent-authoring-support.md) makes efficient
navigation, discoverable owner rules, and studio validation part of the authoring
contract from the first slice.
[Overlapping collections](adr/0009-overlapping-collections.md) establishes
reference-based grouping across projects while preserving each member's identity,
ownership, and lifecycle.

The [architecture questions](architecture-questions.md) organize remaining
choices by when they affect implementation and what evidence will resolve them.

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

## Collections and item ownership

Collections group references to existing items. An item can belong to several
collections, and a collection can span projects. Each item retains one owning
scope and a stable identity; membership does not copy, move, or modify its source.
A collection can exist without a deck, and standalone work need not join one.

Adding or removing membership does not protect an item, return it to draft,
create a derivative, or change its rendered appearance. Actual composition use
continues to protect included definitions under the accepted lifecycle. An item
can therefore appear in several discovery contexts while existing consumers keep
using the same definition. Cross-project grouping does not imply automatic
adaptation between brands.

Collections may carry context and visual direction. The current brief selects
relevant collection guidance for creating or adapting work. All collections and
their items, guidance, and usage history remain accessible across the workspace.
Selection prioritizes context; global search, inspection, and reference traversal
remain available. Reading other guidance does not automatically make it applicable.
Membership alone must not silently rewrite a member's definition or brand.
Conflict resolution among applicable rules, collection storage, reference encoding,
and indexes remain implementation choices. See
[ADR 0009](adr/0009-overlapping-collections.md).

## Source model and focused controls

Layouts are authored in code. Structured metadata and references describe named
parts, identity, meaningful relationships, dependencies, and export capabilities.
Companion Markdown supplies editable narrative content, and semantic brand tokens
are injected during rendering. Exact file formats, implementation language,
framework, and Markdown binding syntax remain open.

For a document, the agent creates companion Markdown with clear page boundaries
and ordinary Markdown formatting, including headings, lists, and preformatted
text. Saving owner edits refreshes the authored layout. If the result overflows
or collides with a figure, the owner asks the agent to repair the layout, for
example by resizing or replacing imagery or dividing prose into explicit text
areas. The copy remains editable in Markdown after those repairs. Ordinary text
flow is supported; automatic repagination or layout repair after every edit is
not required. Page-marker syntax, text-area bindings, and the Markdown contract
for slides and figures remain open.

Compositions expose their parts through documented studio interfaces so discovery,
preview, and part export can work from explicit authoring information. Derive
mechanical indexes and render metadata from authoritative declarations where
possible, keeping the actual rendered parts and inspectable structure consistent.
The studio does not need to infer the owner's intent by parsing arbitrary layout
code or inspecting a final image.

Studio controls are focused on discovery, inspection, declared content or supported
properties, brand variation selection, review, lifecycle, and export. The first
slice need not implement every permitted control. Onboarding and guided workflows
can use the same contracts. General dragging, resizing, and arbitrary visual layout
editing are outside the product direction; the agent handles layout changes and
adaptations in source.

Any focused editor writes the declared source data and follows the draft/protected
lifecycle. Keep one authoritative content source for both agent and studio edits;
report stale or conflicting edits rather than silently overwriting another writer.
The exact write interface remains to be designed. The source model does not require
a universal canvas schema or round-trip rewriting of arbitrary composition code.
Native editable presentation export remains a separate roadmap item.

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

- Brand identity, described semantic tokens, and values for each brand variation.
- Artifact identity, draft/protected state, derivation lineage, selected brand,
  dimensions, dependencies, and render entry.
- Discoverable capabilities, including which export formats an artifact supports.
- Composition ownership with locally identified configured uses, their effective
  inputs, placement, source references, and per-part export capabilities.
- Export inputs and a result that identifies the source and rendering settings.

The implementation will determine their exact fields. React/HTML compositions
cannot be assumed to support native SVG export. Preview and export should share
the same composition source and make format-specific differences explicit.

Local workspace source executes with the local toolchain's privileges. The
initial design is for trusted owner code; accepting untrusted plugins, remote
code, or arbitrary uploads would require a separate security design.

## Portable static delivery

The initial deliverables are static, and portable HTML is a first-slice priority.
The agreed example is a two-page document and a slide sharing a figure, rendered
in two brand variations, with independently exportable parts. HTML export should
reuse the composition rendering path, saved content, and resolved brand values.
The delivered snapshot must work independently of the studio and workspace.
Required styles, fonts, and visual assets must travel with it; it must not depend
on development-server URLs or later resolution of live workspace content.

Single-file versus bundled HTML remains an implementation choice to test.
Proposed acceptance: copy the export outside the workspace and open it with the
studio stopped and networking unavailable, then inspect text, imagery, fonts,
page structure, and the selected variation. A hosted preview alone cannot prove
this behavior. Local-file resource loading can differ from server-hosted loading;
see MDN's [local-file restrictions](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server).
Framework and export-tool selection must account for this portability test.
Static delivery does not require interactive artifact behavior; normal links and
scrolling remain compatible with it. Studio controls are a separate concern.

## Injected brands and variations

Brand is an explicit rendering dependency. Authored figures, components, slides,
and documents refer to semantic token IDs; the selected brand variation supplies
their concrete values. Nested visual parts receive the same resolved brand
dependency. Source must not capture a particular variation's colors or fonts
when authored. Changing brand values updates all dependent live views and future
renders without editing each artifact, including independently adapted figures.

Each artifact must support every variation of its selected brand. A new variation
adds another studio view of the existing artifact, preserving its identity and
source. Several variations must be renderable side by side without influencing
one another. UI layout, eager versus lazy rendering, and the injection mechanism
are implementation choices; a global active theme alone cannot express this
contract.

The brand contract includes sensible starter roles for colors and typography,
plus owner-defined tokens with semantic descriptions. Token identities and
meanings are shared across variations. Each variation must resolve every required
token, either directly or through explicit defaults. The studio validates missing
or incompatible values and identifies the affected token, variation, and artifact.
Adding a token includes giving it a usable value in every variation. The agent
reads the descriptions before selecting tokens and preserves named references in
source. Collections may refine visual direction and select semantic roles;
brand-controlled choices must continue to resolve through the injected brand.

Fixed assets, including raster images and opaque imported artwork, retain their
original appearance. Their placement and surrounding composition still use the
injected brand. Optional variation-specific asset mappings can be added through
the brand when needed; recoloring or regeneration is not implied. Source-authored
SVG figures follow the same token contract as other compositions.

Preview and export resolve the same brand variation. Exports retain the resolved
appearance and record brand, variation, and source settings; previously delivered
snapshots stay fixed. Brand and font changes must invalidate affected live renders
and be checked for layout and legibility across variations. Supporting every
variation of one brand does not imply automatic compatibility with an unrelated
brand's custom token vocabulary.

## Hierarchical ownership and configured uses

Reusable component definitions and named artifacts have independent catalog IDs.
A composition owns the configured uses and placements within it; those local
parts have IDs and textual metadata scoped to that owner. Agents and the studio
can traverse the hierarchy, inspect a specific part, and export its configured
appearance without registering every use as a standalone library item.

For example, a node component owns drawing behavior and supported inputs. An
architecture figure owns six configured node uses and their connections. A slide
owns the architecture figure's placement. The figure's source remains owned by
the figure when a second slide references it; browsing into that figure follows
its reference rather than transferring or duplicating ownership.

Local lookup identifies the owning item and local part, with nesting where needed.
Search may return local parts with their containing context, while catalog browsing
can present standalone items first. File moves and display-label changes must not
silently break those identities. Physical folder layout and reference encoding
remain open; the accepted behavior is a traversable hierarchy with explicit reuse
references across it.

Promotion gives a local part an independent identity, preserving its configured
content and origin. It must not rewrite a protected original composition or detach
its part. Source and dependency reuse should follow existing interfaces. A newly
promoted item can start as a draft and becomes protected when used elsewhere.
Exact extraction mechanics and how to reference the origin's source state remain
implementation details to validate.

## Drafts, protected items, and derivatives

An owner can revise a draft directly and explicitly mark it out of draft even
when it has no consumers. Using an item in another composition automatically
protects the included item; the containing composition can remain a draft.
Identity and lifecycle are separate: drafts still need IDs for discovery.
Protection preserves an authored definition; it does not assert that someone has
reviewed or approved its visual quality.

The rule protects a referenced component or figure definition. Supplying values
through a component's supported inputs creates a local configured use owned by
the containing composition; those inputs can change while that owner is a draft.
Protection of the owner also preserves its local content and placements. If a
protected figure appears in a draft slide, editing a node inside that figure
still derives the figure; the slide's draft state does not bypass its protection.
Merely discovering or exporting a local part does not independently change its
lifecycle or promote it.

Reuse references an existing protected definition. Changing that definition
creates a new identified draft derived from the original, preferably by extending
its supported inputs or composing around it, with copying available when needed.
Existing consumers keep their original references. A draft consumer may explicitly
switch to the derivative; changing a protected consumer creates a derivative of
that consumer as well. Independent standalone items receive the same protection
once their owner takes them out of draft.

Protection must account for owned content, assets, and reusable visual definitions
reached through dependencies. Protecting only a top-level source file would allow
an edited child or companion Markdown file to mutate the established work. The
implementation must preserve those authored definitions when establishing a
protected reference. Dependency capture and enforcement mechanisms remain open;
this requirement does not select a version registry or a particular storage model.
Studio renderer maintenance continues through its normal compatibility and test
contracts; source protection is not a promise to reproduce historical pixels
across arbitrary toolchain changes.

Brand token values remain explicitly live under the brand-injection decision.
Protecting a figure preserves which token roles it uses, while brand edits still
change how those roles resolve. Existing exports remain delivered snapshots.

The studio's editing operations and agent authoring practice must respect the same
lifecycle and diagnose changes to protected definitions made directly in source.
The companion Markdown editing flow applies directly to drafts; revising protected
copy starts a derivative with independently editable content. Catalog metadata
exposes lifecycle, lineage, and uses so the agent can explain the scope of a change.
Discovery-only categories, tags, descriptions, and usage notes remain directly
editable after protection without changing identity or creating a derivative.
Metadata consumed directly by rendering belongs to the protected definition.
Catalog improvements therefore need a separate write path from definition edits;
exact storage and validation remain implementation choices.

## Agent-led composition adaptation

A composition exposes named parts, their content and meaningful relationships,
and an arrangement for its destination. Agents can inspect and reuse those parts
in a different arrangement, such as a horizontal diagram on a slide and a vertical
one in an article. Parts may be text, images, figures, configured components, or
nested compositions. Containment is distinct from relationships such as flow,
sequence, or grouping; changing arrangement must account for the intended message.

The source representation should keep content, relationships, and layout
understandable enough for an agent to adapt them without reconstructing intent
from pixels. This does not choose a universal scene-graph schema, require every
artifact to be a node-edge diagram, or replace ordinary authoring source with a
new language. The minimum discoverable composition contract needs working examples.

Changing a protected composition's authored arrangement creates a derivative.
Reuse unchanged definitions and retain lineage for local parts; preserve existing
consumers of the original. Selecting a supported layout input or scaling a
placement does not itself mutate that definition. The selected brand variation
continues to be injected into every arrangement. Within the brief, the agent may
shorten copy and omit secondary detail to suit the destination or audience, while
preserving factual meaning and required points. Report substantive omissions and
editorial changes with the resulting draft and retain the explanation with its
source. Layout-only requests preserve content; routine editorial choices within
the agreed scope do not require a separate approval step.

The studio supplies preview, diagnosis, export, and inspection at the intended
dimensions and across brand variations. General automatic rearrangement is not a
prerequisite for the initial implementation. Authored responsive behavior, text
flow, and useful layout tools can support the agent's work. Destinations, canvas
sizes, and quality checks still require concrete examples and validation.

## Complete slides and independently exportable parts

The studio exposes a slide as both a complete rendered composition and a source
of separately exportable figures, assets, and visual subcomponents, including
nested parts. The same composition interface should serve this need for other
composed artifacts. An owner can use a slide only as an ideation reference and
still retain the visual work for assembly elsewhere.

A part export must be able to reproduce the selected use's effective content,
brand variation, dimensions, and layout without unrelated slide content. A reused
component with different inputs can have several distinct exportable uses within
one slide. Identify the source item and its owner-qualified configured use
separately; the encoding and placement schema remain open. Inspectable parts are
visual authoring units, not every internal helper function or layout wrapper.

The renderer needs explicit access to these used parts and their rendering
context. Resolve dependencies, font readiness, clipping, and bounds for an
individual part as well as for the full slide. The mechanism may involve declared
render entries or tracked component uses; it is not selected. Per-part export
capabilities remain independent of the enclosing slide's capabilities.

Source asset download and export of its configured use are distinct operations.
Exporting an existing use records a snapshot and preserves its source lifecycle.
The containing slide may remain a draft while its included visual items are
protected. Lifecycle rules still apply if the owner changes a protected item.

Full-slide and selected-part export are required; batch selection and a combined
slide-and-parts download are proposed controls. Native editable deck export is a
roadmap capability. Preserve useful composition structure without assuming that
all layouts can be translated to a presentation tool's native objects.

## Agent navigation and authoring rules

Efficiently following the owner's visual system is a core studio responsibility
under [ADR 0008](adr/0008-agent-authoring-support.md). The agent needs a small
interface for finding relevant material, understanding its constraints, and
checking its work. Owner rules, approved examples, source claims, and retained
feedback remain authoritative workspace material. The studio supplies discovery
and validation, with the same contracts available to agents and focused controls.

The accepted discovery information is category, stable identifier, tags, and
semantic context describing how the item has been used. This gives an agent
classification, referenceable identity, search descriptors, and an explanation
of relevance. Exact category/tag vocabularies and record formats remain open.
Local parts retain owner-qualified identities under the existing ownership model;
discovery metadata does not require promotion into standalone catalog items.

Accepted enforcement policy: structural violations block the affected supported
operation with an explanation and repair path. Visual and editorial guidance is
advisory by default, including detectable overflow. Owners may explicitly mark a
mechanically checkable rule as mandatory for export; failure then blocks the
applicable export. Drafts remain inspectable for repair, with diagnostics when a
complete render is unavailable. Advisory findings do not become export gates
without an explicit mandatory rule.

Proposed design to exercise in the first slice:

- Start with compact workspace and scope summaries; search by purpose and scope,
  then inspect selected items and traverse their parts and dependencies. Bound
  search results and read detailed source only when needed. The active context
  must preserve access to workspace-wide search and inspection. Discovery must be
  usable without a running gallery, and generated indexes remain derived data.
- Make each candidate's purpose, applicable guidance, approval/reference status,
  lifecycle, supported inputs, and source location easy to inspect. Surface the
  relevant brand, project, collection, and brief context rather than merging
  every rule and example into one large prompt. Rule precedence and conflict
  handling still need a concrete design.
- Check identities and references, required brand tokens across variations, asset
  availability, protected definitions, and declared export capabilities through
  the supported contracts. A check cannot establish that arbitrary code obeys
  every visual or editorial rule; inspection remains necessary.
- Return concise findings usable by both agent and owner: severity, affected item
  or local part, source location, violated rule, and a useful next action. Apply
  the accepted enforcement policy above; exact rule declarations, scope,
  precedence, supported checks, and operation-specific mechanisms remain open.
- Retain specific review feedback with its artifact and source state. Agents use
  approved precedents and inspect actual renders for hierarchy, density,
  legibility, and fidelity to the brief. Passing mechanical checks is distinct
  from visual approval.

Exercise discovery as an authoring task: have the agent locate the shared figure
and its guidance without a supplied source path, reuse it, and derive a protected
item when needed. Record irrelevant reads or missing context that caused drift.
Deliberately break an asset or token reference to inspect the repair guidance.
The first slice should demonstrate useful discovery and checks alongside its
visual output; neither capability is postponed until the gallery is complete.

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
