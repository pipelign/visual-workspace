# Architecture questions

Status: discussion agenda, September 24, 2026. This is a map of unresolved choices,
not an implementation spec or a set of accepted decisions. Use concrete scenarios
to resolve product choices, then research and prototypes to test technical options.

## What is already established

- Agent-led authoring with editable repository source and a local studio for
  discovery, preview, and export is the charter's starting direction.
- Owner material and studio implementation have distinct responsibilities.
- Brand is injected through described semantic tokens. All authored artifacts
  support every variation of their selected brand; fixed assets are exceptions.
  See [ADR 0001](adr/0001-injected-brand-variations.md).
- Drafts allow direct revision. Explicitly ending draft or composing an item
  protects its definition; a containing composition can remain draft. Changes
  derive new identified work, while brand values remain live.
  See [ADR 0002](adr/0002-protected-items-and-derivatives.md). Discovery-only
  category, tags, description, and usage notes remain editable after protection;
  metadata used directly in rendering belongs to the protected definition.
- Textual metadata, efficient hierarchical discovery, companion Markdown for
  document/slide copy, and retained derivation lineage are requirements.
- A complete rendered slide and independent exports of its used figures, assets,
  and visual subcomponents are both required. Native editable presentation export
  is deferred to the [roadmap](roadmap.md). See
  [ADR 0003](adr/0003-compositions-and-part-exports.md).
- Reusable definitions and named figures have independent catalog identities;
  configured parts live within their owning composition by default, with local
  IDs, metadata, traversal, and export. Promotion creates an independent item.
  See [ADR 0004](adr/0004-composition-owned-parts.md).
- Agents adapt compositions by reusing named parts and authoring arrangements
  suited to their destinations. General automatic rearrangement is not required
  for the initial slice. See
  [ADR 0005](adr/0005-agent-led-composition-adaptation.md). Editorial adaptation
  within the brief is allowed: preserve factual meaning and required points,
  report substantive omissions and changes, and retain the explanation with the
  derivative. Explicit layout-only requests preserve content.
- Layouts are authored in code, with structured metadata/references, companion
  Markdown, and injected brand tokens. Studio controls are focused; a general
  canvas editor is outside the product direction. See
  [ADR 0006](adr/0006-code-authored-compositions.md).
- Documents use agent-created Markdown with explicit page divisions and ordinary
  Markdown formatting. Owners edit, save, inspect, and ask the agent to repair
  overflow or collisions. Automatic layout repair is not required. See
  [ADR 0007](adr/0007-paged-markdown-documents.md).

- The first example is a two-page document and one slide sharing a figure, with
  two brand variations and independently exportable parts. Deliverables initially
  are static; portable HTML is a first-slice priority, not an optional later export.
- Efficient agent navigation, clear owner rules, and studio checks supporting
  those rules are core requirements. See
  [ADR 0008](adr/0008-agent-authoring-support.md). Structural violations block
  affected operations; visual/editorial guidance is advisory by default. Owners
  can explicitly make mechanically checkable rules mandatory for export. Drafts
  remain inspectable for repair.
- Core discovery information includes category, stable identifier, tags, and
  semantic context about how an item has been used. Exact vocabularies and record
  formats remain open; these fields do not replace the rendering/parts interface.
- Collections may overlap and span projects through references. Each member keeps
  one owning scope and stable identity; membership alone does not modify or protect
  it. The brief selects relevant collection guidance, while all collections,
  items, guidance, and usage history remain accessible across the workspace.
  Selection prioritizes context without restricting discovery. See
  [ADR 0009](adr/0009-overlapping-collections.md).

These constrain the design. The questions below refine their implementation and
remaining product scope; they do not reopen the agreed behavior.

## Build readiness and broad implementation choices

The agreed product direction is sufficient to begin the first working slice.
Remaining questions are engineering design obligations to resolve through a small
implementation proposal and real output; they are not a sequence of required user
approvals for every field or convention. Ask again when a choice changes the
agreed experience or exposes a consequential product tradeoff.

Proposed starting choices, not additional accepted packaging or stack decisions:

- Run a local browser studio against a filesystem workspace. Keep studio code and
  owner material separate through public contracts within this repository; validate
  that separation before choosing an independent distribution or upgrade format.
- Give agents file-readable discovery information and a small set of supported
  operations for discovery, validation, lifecycle, rendering, and export. Share
  those operations with the studio so the authoring rules have one implementation.
  Direct integration that launches an agent from the studio is not a prerequisite.
- Use one composition rendering path for preview and portable static HTML, with
  formats supported according to each part's capabilities. Resolve fonts, assets,
  isolation, readiness, and packaging against the exported example.
- Preserve protected definitions and their transitive visual dependencies while
  keeping brand values live and discovery-only metadata editable. Compare storage
  mechanisms through the shared-figure lifecycle exercise before expanding the UI.

The rendering/export path and dependency-preservation mechanism are the highest
risk implementation choices to test early. Discovery and validation must accompany
that work so the example demonstrates efficient agent authoring as well as a useful
visual. Exact ID encoding, page-marker syntax, record shapes, and folder conventions
can begin as small, reversible choices. They need evidence from use rather than
another broad product interview.

## Resolve through the first rendering probe

| Area | Question to resolve | Consequence and useful evidence |
| --- | --- | --- |
| Delivery contract | Static deliverables, priority portable HTML, full-slide delivery, and independently exportable parts are settled. What HTML packaging works without the studio or workspace? What are the part-export bounds, background controls, dimensions, and document PDF page geometry? | Inspect a copied HTML export independently of the app, including the proposed offline/local-file test. Inspect slide and part exports in their destinations and authored document pages in PDF. |
| Configured-use interface | Independent definitions and locally owned uses/placements are settled. How are their IDs, supported inputs, references, and export context represented? How does promotion preserve the original? | Implements hierarchical reuse and lifecycle granularity. Exercise two locally identified uses of a protected component and promote one without changing its owner. |
| Composition interface | Code-authored layouts with structured metadata/content are settled. How do SVG figures and document/page compositions expose named parts, share components, accept inputs, and declare export capabilities? | Defines the public authoring interface and renderer responsibilities. Prototype nested reuse through preview and export. |
| Layout and adaptation | Agent-led adaptation, editorial freedom within the brief, and agent repair of document layouts are settled. Which dimensions and layout inputs are declared? How does text flow within authored pages and text areas, and how are adaptation notes retained? | Defines the source contract and destination behavior. Adapt a wide figure to a narrow destination across brand variations, and repair a document after a prose edit without losing the owner's copy. |
| Markdown contract | Documents have authored page divisions and editable Markdown prose. What are the page-marker conventions, text-area bindings, supported formatting, captions, and figure references? How should slide/figure copy, slide boundaries, and optional speaker notes work? | Determines the content parser and binding interface. Exercise headings, lists, and preformatted text; preserve editable Markdown when the agent repairs a page by splitting text into areas. |

Accepted distinction: preserve referenced reusable definitions while allowing
values through their declared inputs. A named figure owns its configured content
and structure; a placement belongs to its containing composition. Local parts
remain inspectable and exportable within that hierarchy and can be promoted into
independent items. Exact schemas and layout inputs remain open.

## Decide before the first complete authoring loop

| Area | Question to resolve | Consequence and useful evidence |
| --- | --- | --- |
| Identity and protected dependencies | How do references survive moves, how are definitions and owned content preserved, and how does derivation reuse a protected base? How are editable discovery metadata and protected render inputs stored and checked? | Show that editing a derivative, moving a file, or improving discovery metadata leaves existing consumers intact. Check that metadata used in rendering remains protected. |
| Editing and write ownership | Focused controls are selected. Which declared content/property edits ship first, how do they write source, and what happens when the agent and studio edit the same draft? | Determines shared write interfaces and recovery behavior. Exercise creation, first composition use, derivation, Markdown edits, and a conflicting write. |
| Organization and discovery | Core discovery fields, overlapping collections, and brief-selected guidance with full workspace access are settled. What vocabularies, record formats, storage, and usage evidence support them? How are applicable guidance conflicts resolved, and how does inspection expose rules, precedents, and lineage? | Find and inspect relevant work outside the active collection without a supplied path or reading the entire workspace. Exercise overlapping membership without copying items or changing ownership/lifecycle, and distinguish recorded use from intended applicability. |
| Authoring rules and validation | Enforcement policy is settled: structural violations block affected operations; visual guidance is advisory unless explicitly declared mandatory and mechanically checkable for export. How are rules declared, scoped, resolved, and checked? | Exercise structural failures, an advisory visual finding, and a failed mandatory export rule. Keep drafts inspectable and visual approval distinct from passing checks; inspect whether diagnostics support repair. |
| Brand vocabulary evolution | What is the starter token vocabulary, how do custom roles resolve across variations, and what happens when a role is renamed or removed while protected figures still reference it? | Determines brand compatibility and useful diagnostics. A value edit is already live; a token-identity change needs separate treatment. |
| Assets and generation | Which fonts/images/references must be local and portable? Where are large sources and exports retained? What is the minimum import and generation workflow? | Determines packaging, provenance, and asset resolution. Move a workspace and export with its required fonts/assets available; inspect what is recorded for generated material. |
| Rendering lifecycle | How do the studio, multiple variation previews, and export runs isolate styles and state, await fonts/assets, report failures, and refresh affected views? | Determines renderer interfaces and readiness signals. Compare a composition alone, beside another variation, and in its delivered export. |
| Review and feedback | How is feedback attached to an artifact, variation, and source state, and how does the owner finish a draft? What must be inspected before delivery? | Determines durable feedback and lifecycle controls. Keep automatic protection on reuse distinct from visual approval. |

The repository remains the intended home of source. A generated catalog, cache,
or search index need not become a second authoritative copy of owner content.
Its exact implementation should follow the discovery and editing requirements.

## Scope decisions that can add separate capabilities

- **Native editable presentation export:** explicitly deferred to the
  [roadmap](roadmap.md). The current workflow delivers full slides and separately
  exportable parts for external assembly.

- **Interactive outputs:** initial deliverables are static. Interactive artifact
  behavior is outside the initial slice; studio onboarding and authoring controls
  remain separate. Revisit only with a concrete use case.
- **Distribution and upgrades:** the existing hypothesis is a maintained studio
  used by an owner workspace. Decide how it is invoked, which environments the
  first release supports, and how owner files survive an upgrade. Validate the
  responsibility split in one repository before extracting packages.
- **Onboarding and extension:** determine the smallest usable neutral starter,
  how an owner establishes a brand, and which new visual capabilities can be
  added entirely in workspace source through the public interfaces.

Hosted collaboration, untrusted extensions, external publishing integrations,
and generalized plugin machinery are future scope questions if requested. They
are not prerequisites for the current local, trusted-owner workflow.

## Working order and evidence

The delivery direction is now full rendered slides plus independently exportable
used parts, with native editing deferred. Definition and local ownership are
settled, and agents will author destination-specific adaptations with editorial
freedom within the brief. Code-authored layouts and focused studio controls are
also settled. Documents use paged Markdown with agent-led repair after edits that
no longer fit. Next, specify the page conventions and content bindings, including
the still-open slide/figure contract, then the small public authoring interface.
Resolve remaining layout inputs and portable HTML packaging, and evaluate
rendering tools against those contracts and the agreed example. Design compact
agent discovery and studio validation alongside the composition interface.

The owner accepted a two-page document and one slide sharing a figure, with two
brand variations and independently exportable parts. Portable static HTML is a
priority output. The concrete topic, dimensions, and packaging remain open.

Proposed exercises within that example:

- Include two configured uses of a reusable component in the shared figure.
  Change a brand value, derive the protected figure for one consumer, and confirm
  that the other retains the original. Export the full slide and its parts and
  inspect a part in the intended external presentation tool.
- Edit formatted document Markdown until it no longer fits; have the agent repair
  the layout through imagery or explicit text areas. Preserve the edited copy
  in Markdown and inspect the repaired preview and export.
- Copy the HTML export outside the workspace and inspect it with the studio
  stopped and networking unavailable. Verify required fonts/assets, page
  structure, and selected brand values; settle packaging from this result.
- Have the agent find the shared figure and applicable owner guidance through
  discovery without being given its path. Inspect a deliberate asset/token error
  and the resulting repair guidance. Evaluate both the delivered visual and the
  efficiency of finding and following the owner's existing system.

The [development foundation](development.md) now supplies the initial toolchain,
rendering probes, installation, and quality checks. Reuse it for the first slice
and validate the remaining Markdown, public-contract, lifecycle, and export
questions through the agreed example. The lab alone does not establish those
product capabilities. Follow [the engineering guide](engineering.md) as each
capability is introduced. Exact caching strategies, search ranking,
and package extraction can follow observed needs; working IDs, lifecycle rules,
and owner/studio interfaces must exist in the initial slice.
