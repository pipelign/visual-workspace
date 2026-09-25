# Authoring, collections, and discovery

Status: design proposal, September 24, 2026. The requirements below capture the
owner's intended experience; the model and implementation directions are open
for discussion, except the accepted decisions for
[injected brand variations](adr/0001-injected-brand-variations.md),
[protected items and derivatives](adr/0002-protected-items-and-derivatives.md),
[complete compositions and visual-part exports](adr/0003-compositions-and-part-exports.md),
[composition-owned parts](adr/0004-composition-owned-parts.md),
[agent-led composition adaptation](adr/0005-agent-led-composition-adaptation.md),
[code-authored compositions](adr/0006-code-authored-compositions.md),
[paged Markdown documents](adr/0007-paged-markdown-documents.md),
[agent authoring support](adr/0008-agent-authoring-support.md), and
[overlapping collections](adr/0009-overlapping-collections.md).
No application implementation or stack selection is implied.

## Required experience

The agreed first example is a two-page document and one slide sharing a figure,
with two brand variations and independent part exports. Initial deliverables are
static, and portable HTML delivery is a priority in that first slice. Exact visual
brief, dimensions, and HTML packaging remain to be selected.

- An owner can start a standalone figure and establish a collection when a
  presentation or another body of work needs several visually consistent pieces.
- Before authoring, the agent finds relevant existing work, explains its fit,
  and offers reuse, adaptation, collection membership, or a standalone piece.
  The owner can reject a reference without abandoning the task.
- A document can start from an outline and combine adapted figures with prose,
  with HTML and PDF among the intended delivery formats.
- A slide request can produce a complete deck or just its accompanying figure
  collection. Those are distinct deliverables.
- When building a slide, the owner receives the full rendered slide and can also
  directly export all of its used figures, assets, and visual subcomponents,
  including nested parts. The slide can serve purely as an ideation reference
  while the exported parts are assembled in another tool such as Google Slides.
- Native editable presentation export is deferred to the [roadmap](roadmap.md).
  Independent part export belongs to the current scope.
- Uploaded and generated PNG assets, SVG figures, reusable visual components,
  and composed slides/pages can be stored, discovered, rendered, and reused.
- Document and slide copy has a companion Markdown source that is efficient to
  edit. Draft source edits refresh the preview; changes to protected content are
  made in a derivative.
- Documents have agent-authored page divisions expressed through clear Markdown
  conventions. Owners edit prose and Markdown formatting, inspect the saved
  result, and ask the agent to repair overflow or collisions when needed.
- Drafts allow direct iteration. The owner can take an item out of draft even if
  it has not been composed into anything. Established items preserve their
  authored definition, and changes clone or extend them as identified derivatives.
- Including an item in a composition automatically protects the included item.
  The containing composition can remain a draft. This transition was explicitly
  clarified by the owner; composition use does not put the child into draft.
- Brand is an explicit dependency of every authored visual composition. Colors,
  fonts, and other brand-controlled choices reference named semantic tokens, so
  brand edits update all dependent live figures without individual source edits.
- Every authored artifact can be viewed in every variation of its selected brand.
  Adding a variation adds views of existing artifacts in the studio. Fixed assets
  retain their appearance unless explicitly replaced.
- Brands provide useful default roles and allow owner-defined tokens with
  descriptions of intended use. Agents use those descriptions to choose token
  references when creating or adapting visual work.
- Every discoverable item has textual metadata including stable identity,
  purpose, and context. Hierarchical discovery helps an agent find relevant
  prior work without reading the entire workspace into context.
- Reusable definitions and named figures have independent catalog identities.
  Configured parts remain under their owning composition by default, with local
  IDs and metadata, independent export, and explicit promotion when useful.
- Agents can adapt compositions for different destinations by reusing their
  identifiable parts and authoring a suitable arrangement. Adapting protected
  work produces derivatives, with unchanged parts reused and their origins kept.
- The studio supplies common capabilities and focused UI controls. The agent
  authors layouts in code, using structured metadata and references, companion
  Markdown for narrative content, and injected brand tokens. A general canvas
  editor is outside the product direction. Interactive onboarding and other guided
  UI flows remain possibilities to explore.

The requested SVG/HTML/PNG outputs for compositions require a rendering decision:
we have not established that every composition can support every format.

## Proposed relationships

Keep the existing Project concept: a body of work with briefs, source material,
artifacts, and exports. Under [ADR 0009](adr/0009-overlapping-collections.md),
collections group references to related items and can carry shared context and
visual direction. One item can belong to several collections, and a collection
can span projects. Each item retains one owning scope and stable identity.
Membership does not copy, move, modify, or protect the item. Actual composition
use follows the existing lifecycle rules.

A deck or document is itself an artifact whose composition specifies order,
placement, and layout. A collection can exist without a deck. Collection
membership is independent of the ownership hierarchy; do not make a collection
folder the sole owner or identity of its members.

Examples of useful relationships:

| Relationship | Meaning |
| --- | --- |
| Member of collection | Is grouped by reference for discovery and shared context; membership does not change the item's definition or lifecycle |
| Uses | A composition references a visual item's protected definition or owned content |
| Derived from | Retains the lineage of a separately identified clone or extension |
| Related to | Useful precedent or inspiration, without a rendering dependency |
| Export of | A delivered snapshot associated with source and render settings |

A related figure need not join the same collection. Reuse can reference the
original protected item; adaptation creates a new identified derivative and
preserves the original. Existing uses do not automatically switch to a derivative.
Brand updates propagate through injected tokens in both originals and derivatives.
One-off work should not require the owner to invent a collection; its storage
location can follow a workspace convention.

Separate an item's role from its source/rendering form. Figure, slide, document,
and reusable component describe different uses; SVG, raster image, and HTML-based
composition describe representations. A reusable component needs an example or
configured instance to preview and export; it may require content and dimensions.
Small internal helper functions do not each need their own catalog record.

## Ownership and local parts

The owner accepted hierarchical organization of configured parts, with explicit
promotion to independent catalog items. A component defines reusable behavior and
inputs. A named figure defines particular content and structure. A configured use
supplies inputs in an owning composition; its placement sets position and displayed
size there. Local parts have IDs and metadata without appearing as standalone
items in the main library by default.

An illustrative navigation view, not a prescribed filesystem layout:

```text
architecture figure                         [catalog item]
  ingestion node                            [local configured use]
  processing node                           [local configured use]
  storage node                              [local configured use]

node component                              [catalog item referenced by nodes]
slide                                       [catalog item]
  architecture figure placement             [reference to the figure]
```

The same figure can appear in multiple slides through references. Its internal
parts stay owned by the figure. Agents can find a local node through the figure's
summary or a search result that includes its owner. Local identifiers are qualified
by owner and, where needed, nesting; display paths and storage paths are not the
only identity information.

A local use's inputs and placement follow its owner's lifecycle. Using a protected
node component with a different label does not edit the component's implementation.
Changing a node's configured label inside a protected figure does change that
figure's definition and therefore requires a derivative of the figure. Viewing
that figure within a draft slide does not make its internal parts editable.

Promotion creates an independent item with origin and configured content retained.
The existing owner's source and references remain intact. A promoted item can
begin as a draft and become protected when composed elsewhere. Direct export of
a local part remains possible without promotion. Mechanisms for extraction,
source-state capture, and reuse of the original dependencies are open.

## Draft lifecycle and safe reuse

Accepted behavior:

| Event | Included or existing item | Containing or new item |
| --- | --- | --- |
| Edit a draft | May change directly | No new identity required |
| Owner marks an item out of draft | Becomes protected, even without consumers | No consumer required |
| Reference a reusable definition or named item in a composition | Referenced definition becomes protected | Composition and its locally owned inputs may remain draft |
| Change a protected item | Original definition is preserved | New derivative starts as a draft |
| Reuse a protected item unchanged | Remains protected | Consumer references the original |
| Update brand token values | Authored definition remains protected | All dependent live views resolve updated values |

For example, figure A starts as a draft. Adding A to draft deck D protects A.
A requested change to A creates draft figure B, derived from A. D may explicitly
switch to B, protecting B on inclusion; another document using A keeps using A.
D's own layout and copy remain editable until D is taken out of draft or included
in another composition. Both A and B continue to receive live brand values.

Derivation can reuse the protected base through supported inputs or composition;
it need not duplicate every source file. The resulting item has its own identity,
metadata, and lineage. Copying is available when independent source is needed.
Changing a protected parent to reference a different child derives the parent too.

The protection invariant includes owned text, asset contents, and transitive
reusable visual definitions; mutable children cannot silently change a protected
parent. How those definitions are captured and enforced is an implementation
question. The injected brand values are intentionally excluded from that capture.
Source protection does not freeze the studio renderer or guarantee unchanged
pixels after a toolchain upgrade. Delivered exports retain their snapshots.

Discovery-only categories, tags, descriptions, and usage notes can be updated
after protection without a derivative. Stable identity remains unchanged. Any
metadata consumed directly by rendering is part of the protected definition,
alongside owned copy, assets, layout, and component behavior.

Proposed operational details to validate in the first working slice:

- Establish the child's protection when a valid composition reference is saved.
  A gallery preview, a search result, or collection membership alone is not that
  reference. Failed saves must not leave a half-applied lifecycle change.
- Removing a use does not automatically return its former child to draft.
- Show draft/protected state and derivation lineage in discovery and the studio.
  Protection is independent of visual approval status.
- Distinguish discovery-only metadata edits from definition changes, including
  edits through companion Markdown or metadata consumed directly by rendering.
  The accepted metadata policy must hold through the supported write operations.
- Diagnose edits to protected source through the studio's supported checks, while
  agent guidance directs authoring toward derivatives. Enforcement is not yet built.

## Visual direction and generation

A brand supplies identity, tokens, typography, assets, and guidance. A collection
can add a more specific visual direction: density, illustration treatment, line
weight, recurring motifs, or framing for a particular presentation. An artifact
retains its own purpose, copy, and layout. All brand-controlled choices resolve
through injected semantic tokens, including choices introduced by collections.
Collection-specific colors or fonts must be named roles in the brand, with values
available in every variation. The current brief selects relevant collection
guidance for creating or adapting work, while all collection guidance remains
accessible for inspection. Reading guidance or adding membership does not change
an item's rendered appearance, select a different brand, or automatically make
that guidance applicable. Conflict resolution, inheritance, and override rules
among applicable guidance remain open.

Token definitions describe meaning and intended use; variations provide values
for those shared identities. Illustrative roles include canvas, surface, primary
text, muted text, accent, text-on-accent, heading font, and body font. Primary,
secondary, accent, and neutral palette defaults can support these roles. Owners
can add domain-specific roles such as a color for an ingestion stage. The token
names and schema are examples to refine, not a finalized standard.

Every supported variation must resolve required tokens through explicit values
or defined defaults. Source references stable token IDs; resolved values are
injected for rendering. A new dark variation therefore adds another view of each
artifact, not another authored copy. The studio must support viewing multiple
variations together. Layout and typography still need review after token changes.
Selecting a different brand with unrelated custom roles is a separate adaptation.

For AI-generated assets, assemble a generation brief from the artifact's needs,
brand guidance, collection direction, and approved reference images. Retain the
resulting file and provenance, including the effective prompt, references, and
available generator settings. Prompt guidance expresses intent; review determines
whether the result follows the visual direction. Regeneration is an authoring
operation, not a side effect of rendering or opening a preview. Raster output
remains fixed after generation even when brand values change. A brand can
explicitly map different existing assets to variations if that becomes useful.

## Discovery without excessive context

Efficient navigation and clear rules partly enforced by the studio are accepted
requirements under [ADR 0008](adr/0008-agent-authoring-support.md). The agent must
find relevant owner guidance, approved examples, reusable parts, and retained
feedback without loading the entire workspace. Studio checks reinforce objective
contracts; structural violations block affected operations while drafts remain
inspectable for repair. Visual and editorial guidance is advisory by default.
Owners can explicitly make mechanically checkable rules mandatory for export;
failed applicable rules then block export. Visual judgment still requires
inspection. See the [agent interface direction](architecture.md#agent-navigation-and-authoring-rules).

Proposed discovery path:

1. Read a compact workspace summary of brands, projects, collections, and shared
   libraries, including what each is useful for.
2. Narrow through relevant scope summaries and compact item records containing
   category, stable ID, tags, and semantic usage context.
3. Inspect a candidate's preview and detailed metadata to judge whether it fits.
4. Traverse a selected composition's locally identified parts when the useful
   precedent is nested, keeping its owner and source reference in view.
5. Read selected source, content, and dependencies only when needed for reuse.

All collections and their items, guidance, and usage history remain accessible
through cross-scope search and inspection, including outside the active brief's
selected context. Load details as needed; selection prioritizes relevance without
restricting discovery. Hierarchy provides orientation, and explicit links preserve
reuse across that hierarchy. A figure's identity should
survive a file move. The exact ID scheme and metadata format are still open.

The owner selected these core discovery fields:

| Field | Purpose |
| --- | --- |
| Category | Classify the item for browsing; the category vocabulary remains open. |
| Stable identifier | Refer to the item independently of file moves; local parts use owner-qualified IDs. |
| Tags | Supply compact descriptors for searching and narrowing candidates. |
| Semantic usage context | Explain how the item has been used and why it is relevant to another task. |

Proposed usage-context detail: communication purpose, audience, destination,
relevant constraints, and lessons from actual uses, with links to those uses and
retained feedback. Keep intended applicability distinct from recorded use; a new
item can have no usage history. Derive current consumer links from composition
references where possible so discovery can reflect new uses without editing a
protected item's authored definition. Historical use evidence and its source-state
references still need a concrete representation.

Additional metadata remains to be specified: source location, ownership scope,
lifecycle state, derivation lineage, brand/collection, render entry, dimensions,
content source, approved/reference status, required semantic tokens, capabilities,
and provenance. Existing lifecycle, ownership, and rendering requirements still
apply; the four discovery fields do not replace the full composition interface.
Brand discovery includes compact token descriptions and the available variations.
Source assets and exports have different roles even when both are PNG files.

Keep one authoritative record per item. Derive mechanical facts and indexes where
possible; retain human-authored intent alongside source. Agents must be able to
read discovery information without a running gallery. The studio should validate
missing references, duplicate identities, and unsupported capabilities. The schema
and refresh mechanism need a working example before being fixed.

## Adapting arrangements to destinations

Agent-led adaptation is the accepted direction. A composition is more than its
parts: its content, relationships, grouping, order, and arrangement express the
message. Generic composition parts may be text, images, figures, components, or
nested compositions; a diagram node is one particular kind of visual part.

For example, a composition explaining sources flowing through ingestion and
processing into storage can be arranged horizontally for a slide or vertically
for a narrow article. The parts and flow remain understandable in either layout.
The vertical arrangement derives from the protected original, and the two can
reuse the same unchanged component definitions. Brand variations apply to both.
Creating a simplified executive view can change content as well as arrangement.
The owner accepted editorial adaptation within the brief: shorten labels, condense
copy, and omit secondary detail as appropriate to the destination or audience.
Preserve factual meaning and required points. Explain substantive omissions and
editorial changes in the resulting draft and retain the explanation with the
derivative. This does not require a separate approval for routine choices within
scope. An explicit layout-only request preserves the content.

Proposed starting layout defaults remain to be exercised:

- Designed figures preserve their arrangement when scaled. An agent creates an
  adaptation when the target needs a different arrangement or when scaling would
  make the content illegible.
- Slides use an intended canvas size and aspect ratio. Documents have authored
  page divisions under ADR 0007; exact text-flow and page-rendering mechanics
  remain to be exercised.
- Explicitly authored layout modes can be supported inputs to a definition.
  Selecting such a mode is different from changing protected layout source.
- Apply the accepted editorial scope: preserve content for a layout-only request,
  and allow condensation within a broader adaptation brief while preserving
  factual meaning and required points and reporting substantive changes.

The studio makes an adaptation inspectable at its destination dimensions and
exports the whole result and its parts. The agent authors new layouts through
source. This avoids making a universal automatic layout system a prerequisite,
while allowing useful layout algorithms and ordinary responsive behavior. The
composition interface must carry enough meaning for agents to make these changes;
layouts are code-authored, with structured metadata and references exposed
through public studio interfaces. Exact schemas and content bindings remain open.

## Editable content and composition

Accepted document workflow under [ADR 0007](adr/0007-paged-markdown-documents.md):
the agent creates a companion Markdown file with clear page divisions for a
composition centered on flowing prose. The owner edits prose and Markdown
formatting, including headings, lists, and preformatted text. Saving refreshes
the document in its authored page structure and layout.

If an edit overflows a page or collides with a figure, the owner asks the agent
to repair the layout. Repairs may resize or replace imagery, adjust page divisions,
or split prose into explicit text areas. The resulting copy stays editable in
Markdown. Normal text flow within the authored layout is expected; saving is
not a request for automatic repagination, layout repair, or copy condensation.
A layout-only repair preserves the owner's edited copy. Editorial changes follow
the scope of the request and ADR 0005.

Page divisions may use comments; exact syntax remains open. The binding contract
must connect pages and any explicit text areas to their Markdown content without
requiring layout-code edits for ordinary prose changes. Stable bindings, figure
references, captions, and the supported Markdown syntax need a real example.
Slide and standalone-figure content bindings, slide boundaries, and optional
speaker notes remain separate open questions; named content slots are a proposal.

Both preview and export consume the same saved content and composition. Editing
protected copy starts a derivative and preserves the original content source.
Inspect the rendered result after prose edits: a refresh alone does not establish
that the layout still fits. Automated overflow and collision diagnostics remain
an implementation question, not a prerequisite for the owner to request repair.

## Rendering and export implications

Candidate rendering paths are SVG-based compositions for figures and HTML-based
compositions for documents, slides, and other layouts. This is a hypothesis to
exercise, not a commitment that all figures must be SVG or that arbitrary HTML
can be converted to editable vector graphics.

| Source or rendered form | Intended outputs to investigate |
| --- | --- |
| PNG asset | Original PNG; explicit derived images when resized or edited |
| SVG figure or SVG-based component instance | SVG, PNG, HTML embedding |
| HTML-based component instance or figure | HTML, PNG; PDF when appropriate |
| Slide deck or document | HTML, PDF, individual slide/page PNGs where useful |

SVG can embed raster images through an image element and HTML through a
foreignObject. These preserve embedded content types; they do not establish that
an export consists entirely of editable vector shapes. SVG used as an image also
has restrictions on scripts and external resources. Destination compatibility,
fonts, and asset packaging need explicit tests. See MDN's documentation for
[SVG image elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/image),
[foreignObject](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/foreignObject),
and [SVG as an image](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image).

Expose supported output formats per artifact and validate the actual composition
and dependencies. A reusable part's rendering requirements can constrain its
parent's output formats. A single SVG-export flag cannot make an unsupported
composition portable.

Variation is a render input to both preview and export. The studio resolves the
same token values for each, and delivered files retain that resolved appearance.
Export records include the selected brand variation and the source settings used
to resolve it. Brand updates affect live views and newly requested exports;
already delivered snapshots retain their recorded appearance.

A slide's full rendered output and its separately exportable used parts are both
required. Native editable presentation formats are deferred to the roadmap.
Documents have authored page divisions. Their PDF page geometry and HTML page
presentation still need an inspected example. Portable static HTML is a priority:
the delivered snapshot must include its required resources and work independently
of the studio and workspace. Single-file versus bundled delivery remains open;
a hosted studio preview alone does not satisfy portability. Exercise the proposed
[offline portability check](architecture.md#portable-static-delivery) in the first
slice. Any additional tall-page PDF output remains a separate option to evaluate.

## Exporting a slide's visual parts

The studio must make the visual parts used by a slide discoverable and directly
exportable, including nested figures and subcomponents. Export targets include
configured uses: if the same reusable component appears twice with different
labels or dimensions, the owner must be able to export either configured result.
Downloading the reusable component's default example would not satisfy this need.

Proposed export controls:

- Export the full slide as the finished visual or a reference image.
- Inspect the slide's parts and export a selected figure, visual subcomponent,
  group, or used asset in its supported formats. Provide usable bounds and padding.
- Use PNG as the baseline image handoff, with selectable output dimensions and
  transparency where appropriate. Preserve intentional fills belonging to the
  selected part; removing the parent slide background is a separate choice.
- Offer SVG for parts with a supported SVG rendering path, independent of whether
  their enclosing slide supports SVG. Retain original asset downloads as well.
- Offer batch selection or a slide-and-parts bundle with distinct names for
  different configured uses and variations. Exact packaging remains open.

Google Slides supports inserting images from a local computer, and its image API
accepts PNG, JPEG, and GIF. This supports investigating PNG as the baseline handoff;
actual export and import fidelity must be exercised. See Google's
[image insertion help](https://support.google.com/docs/answer/97447?hl=en&co=GENIE.Platform%3DDesktop)
and [CreateImageRequest documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateImageRequest).

A part's export should use the selected slide rendering context: source state,
resolved content, brand variation, and relevant layout inputs. It must not include
unrelated overlapping parts or depend on an unavailable parent stylesheet. Bounds,
inherited backgrounds, clipping, and shadows need explicit behavior. Original
asset download and export-as-used have different purposes; for example, a cropped
or annotated image on a slide differs from its uploaded source.

Export records identify the containing composition and selected use as well as the
source item, brand variation, and rendering settings. Exporting creates a snapshot
without deriving or modifying the item. The parent slide may remain a draft.
If a part cannot be exported, report the failure rather than silently omitting it
from a requested set. Mechanisms for declaring parts and exposing their configured
rendering inputs remain an open composition-interface decision.

## Studio and workspace responsibilities

The studio owns discovery contracts, validation, preview lifecycle, refresh,
export, diagnostics, and any common guided UI. The owner's workspace holds visual
direction, content, reusable parts, examples, feedback, and authoring practice.
Guided UI and agent actions should use the same supported operations and source
files. Onboarding may establish an initial brand and visual system through those
operations. The owner chose agent-authored layouts with focused controls for
inspection, declared content or properties, brand selection, review, and export.
General dragging/resizing and arbitrary visual layout editing are outside the
product direction. The first set of focused editing controls and their write-back
behavior remain unselected; edits must target authoritative source data and obey
the same protection and derivation rules as agent edits.

This points toward a browser-based rendering environment with filesystem-backed
source and a discovery interface usable by both the gallery and agents. The
[development foundation](development.md) establishes an evaluated toolchain and
neutral rendering lab. Content bindings, public authoring/export interfaces, and
distribution still need to be resolved through the first product slice.

## Decisions to resolve next

See the [architecture questions](architecture-questions.md) for the broader
decision agenda and a proposed order. The concerns specific to this model are:

1. Lifecycle implementation: preserve protected definitions and their dependency
   chain, create derivatives with lineage, and make composition-use transitions
   reliable. Implement the accepted distinction between editable discovery
   metadata and protected render inputs. Brand values remain live dependencies.
2. Collection guidance and storage: overlapping, cross-project membership and
   brief-selected guidance with full workspace access are accepted. Resolve where
   collection records live and how conflicts among applicable guidance are handled,
   within the accepted brand-token and rule-enforcement contracts.
3. Export expectations: portable SVG versus fully vector content, document page
   geometry, HTML packaging, and independent part-export bounds and configuration.
   Native editable presentation export is deferred to the roadmap.
4. Content authoring: the paged Markdown document workflow is accepted. Resolve
   page conventions, text-area bindings, figure references, and slide/figure copy
   bindings, plus how durable adaptation notes appear through the composition
   interface.
5. A first working slice that demonstrates discovery, reuse, editable copy,
   multiple brand variations, full-slide and separate-part exports, and delivered
   fidelity before selecting the full application stack.
