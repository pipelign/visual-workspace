# First working slice: discover, compose, review, and export

Status: ready-for-agent
Blocked by: None

This specifies studio development demonstrated through a neutral owner workspace.
It synthesizes the accepted architecture and the agreed first example. It does
not claim that the studio, application toolchain, or example is implemented.

## Problem Statement

The owner has established how visual work should be authored, reused, discovered,
and preserved, but cannot yet complete that workflow in this repository. There is
no executable studio to preview a composition, diagnose a broken reference, or
deliver a portable export. The first implementation must show that these contracts
work together and that the editable source remains useful for the next piece.

The critical risks are whether one rendering approach can deliver both complete
compositions and their configured parts, and whether reuse can preserve authored
definitions and dependencies while allowing live brand values. Discovery and
validation must make those capabilities practical for an agent from the outset.

## Solution

Deliver a local studio and documented public authoring operations, exercised by a
two-page document and one slide sharing a named figure. The figure contains at
least two locally identified, differently configured uses of one reusable
component. A neutral brand supplies two variations; every authored example can
be inspected and exported in either variation from the same source.

The owner and agent can find existing work and guidance, author compositions in
code, edit document prose in companion Markdown, inspect the actual result, and
export complete compositions or selected nested parts. The exported HTML carries
its required resources and works independently of the studio and workspace.
Exports retain their source and rendering context.

The example also demonstrates safe reuse: composition use protects the figure
and its visual dependencies; a derivative can serve one consumer while another
keeps the original. Brand-value changes reach both live versions. Local parts
remain addressable without becoming separate catalog entries, and promotion
preserves their original owner and origin.

The slice is complete only when the authoring loop, its failure cases, and the
delivered files have been exercised. A successful preview alone is insufficient.

## User Stories

### Starting and finding useful work

1. As an owner, I want reproducible installation and a documented local start
   command, so that I can open the neutral workspace from a clean checkout.
2. As an owner, I want a saved brief describing audience, purpose, message,
   destination, dimensions, and sources, so that subsequent sessions can continue
   the same work.
3. As an agent, I want compact workspace and scope summaries, so that I can
   orient myself without reading every source file.
4. As an agent, I want to search by purpose, category, tags, and scope, so that
   I can find relevant work without knowing its source path.
5. As an agent, I want discovery information available with the gallery stopped,
   so that authoring does not depend on an active browser session.
6. As an agent, I want to inspect stable identity, source location, ownership,
   inputs, dependencies, capabilities, lifecycle, and lineage, so that I can
   judge how an item can be reused.
7. As an agent, I want access to applicable brand, project, collection, and brief
   guidance, so that I can follow the owner's intended visual direction.
8. As an agent, I want approved examples, inspiration, source claims, and retained
   feedback distinguished, so that I can assess their authority.
9. As an agent, I want actual usage history distinguished from intended
   applicability, so that I do not mistake a suggestion for demonstrated reuse.
10. As an owner, I want references to remain valid after a source file moves,
    so that ordinary workspace organization preserves existing work.

### Composing and organizing

11. As an owner, I want a two-page document and a slide to share one named figure,
    so that the same visual work serves both destinations.
12. As an agent, I want layouts authored in code through documented studio
    interfaces, so that I can create useful compositions using owner files.
13. As an agent, I want a reusable component with declared inputs and an example,
    so that its intended use is understandable and inspectable.
14. As an owner, I want two uses of that component to have different content and
    local identities, so that each configured result can be selected accurately.
15. As an agent, I want to traverse a slide into its figure and nested parts,
    so that I can inspect the relevant visual units in their owning context.
16. As an owner, I want a local part promoted to an independent item with its
    configured content and origin retained, so that I can reuse it without
    changing the original composition.
17. As an owner, I want overlapping collections that can span projects, so that
    related work can be grouped without copying or moving its members.
18. As an agent, I want a brief to select relevant collection guidance while
    preserving workspace-wide discovery, so that focused context does not hide
    useful material elsewhere.
19. As an owner, I want collection membership to leave identity, brand, rendered
    appearance, and lifecycle unchanged, so that organization is independent of
    composition use.

### Brand and destination behavior

20. As an owner, I want every authored example rendered in both brand variations,
    so that I can choose an appearance without maintaining duplicate sources.
21. As an agent, I want described semantic token roles, including owner-defined
    roles, so that visual choices retain their meaning across variations.
22. As an owner, I want token-value changes to reach nested parts and protected
    live artifacts, so that brand updates remain consistent across my workspace.
23. As an owner, I want to add a variation without rewriting existing artifacts,
    so that my brand can evolve independently of their content and structure.
24. As an owner, I want variations previewed side by side without style leakage,
    so that I can compare their typography, legibility, and layout reliably.
25. As an owner, I want fixed assets to retain their appearance, so that brand
    changes do not silently recolor or regenerate imported material.
26. As an owner, I want the agent to derive a destination-specific arrangement
    from an existing figure, so that a narrow placement remains legible while the
    original wide arrangement stays available.
27. As an owner, I want layout-only adaptation to preserve content and broader
    editorial adaptation to retain required facts and explain substantive changes,
    so that a new destination does not silently change the message.

### Preserving established work

28. As an owner, I want direct revision of drafts and explicit protection of
    standalone work, so that I can decide when an authored definition is settled.
29. As an owner, I want a saved composition use to protect the included definition
    while allowing the parent to remain a draft, so that reuse is reliable without
    prematurely freezing the entire composition.
30. As an owner, I want protected content, assets, and transitive visual
    dependencies preserved, so that editing a child cannot alter established work.
31. As an owner, I want changes to protected definitions to create separately
    identified derivatives, so that existing consumers keep their original
    references until deliberately changed.
32. As an owner, I want a draft parent to respect a protected figure's local
    parts, so that containment cannot bypass the figure's protection.
33. As an agent, I want to supply different supported component inputs inside a
    draft composition, so that configuration does not require modifying the
    protected reusable definition.
34. As an owner, I want to improve discovery-only metadata on protected items,
    so that catalog information can evolve without creating derivatives.
35. As an owner, I want failed saves and conflicting supported writes reported
    without partial lifecycle changes or silent overwrites, so that my source
    remains coherent during agent and studio work.

### Editing and reviewing documents

36. As an owner, I want editable document Markdown with explicit page divisions,
    headings, lists, and preformatted text, so that ordinary prose changes remain
    understandable outside the studio.
37. As an owner, I want saved draft prose edits reflected in the preview and
    export, so that both use my current authoritative content.
38. As an owner, I want the agent to repair overflow or collisions while
    preserving my edited copy during a layout-only repair, so that the document
    remains readable and editable after a substantial prose change.
39. As an owner, I want revisions to protected document copy made in a derivative,
    so that the original content remains available to existing consumers.
40. As an owner, I want feedback retained with the artifact, variation, and source
    state, so that later sessions can understand what was reviewed and why.

### Exporting and diagnosing

41. As an owner, I want portable static HTML for the document and slide, so that
    recipients can view them independently of my studio and workspace.
42. As an owner, I want a complete rendered slide and independently exportable
    figures, used assets, and nested visual parts, so that I can deliver the slide
    or assemble its visual work in another presentation tool.
43. As an owner, I want a selected part exported with its effective content,
    dimensions, variation, and layout context, so that the result matches that
    configured use rather than a generic component example.
44. As an owner, I want supported formats stated per artifact and part, so that
    I can choose an appropriate export without assuming every source supports SVG.
45. As an owner, I want source asset download distinguished from export of its
    configured use, so that crops, annotations, and placement-dependent appearance
    are preserved when requested.
46. As an owner, I want exports to record source state and rendering settings and
    retain their resolved appearance, so that delivered files stay attributable
    after the live workspace changes.
47. As an owner, I want export to leave source identity and lifecycle unchanged,
    so that downloading a part does not implicitly promote or derive it.
48. As an agent, I want structural failures to identify the affected item, source,
    rule, and repair action, so that I can fix broken work efficiently.
49. As an owner, I want advisory visual findings to remain advisory and explicitly
    mandatory, mechanically checkable export rules to be enforced, so that export
    gates follow my declared requirements.
50. As an owner, I want broken drafts to remain inspectable with useful diagnostics,
    so that a render failure does not prevent investigation and repair.
51. As an owner, I want accessible preview and export controls with clear loading
    and failure states, so that I can operate the studio and understand its result.

## Implementation Decisions

These constraints come from the accepted decisions and existing project guidance.
Exact schemas, APIs, storage mechanisms, and application tools remain engineering
choices to resolve against them. The proposals in Further Notes are not additional
accepted architecture decisions.

1. **Responsibility boundary.** The studio owns discovery, validation, lifecycle
   operations, preview, rendering, export, and diagnostics. Owner files contain
   brands, project material, compositions, components, guidance, and feedback.
   Workspace extensions use documented public interfaces. A neutral owner example
   demonstrates each extension point without importing studio internals.
2. **Authoring contract.** Code defines layouts. Structured declarations expose
   stable identity, named parts, relationships, inputs, dependencies, dimensions,
   and capabilities. Companion Markdown holds editable narrative content. The
   studio operates on explicit authoring information rather than inferring
   composition semantics from arbitrary code or final pixels.
3. **Common operation boundary.** Agents and focused controls use supported
   operations over authoritative workspace source for discovery, inspection,
   validation, lifecycle changes, rendering, and export. File-readable discovery
   works without the gallery. Derived indexes remain replaceable derived data.
   The implementation may expose several cohesive operations; this does not
   require one monolithic module, a particular transport, or an agent runtime.
4. **Identity and local ownership.** Independent definitions and named artifacts
   have stable catalog identities. Configured uses and placements belong to their
   containing composition, with owner-qualified local identities and inspection
   metadata. File moves preserve identity. Promotion creates an independent item
   with origin retained and leaves the original source and references intact.
5. **Brand injection.** Every authored example uses described semantic token IDs
   and receives the selected variation as a rendering dependency, including nested
   parts. Required values resolve in every variation, with explicit defaults
   allowed. Preview and export use the same resolved values. Fixed assets remain
   fixed; delivered snapshots retain the appearance selected at export time.
6. **Protection and derivation.** Explicitly ending draft or successfully saving
   an actual composition use protects the relevant definition. Preservation
   includes owned content, assets, local configuration, and transitive visual
   definitions, with injected brand values remaining live. The parent may remain
   draft. Changing a protected definition creates a separately identified draft
   derivative; existing consumers retain their references. Removing a use does not
   automatically return its former child to draft.
7. **Metadata and writes.** Discovery-only metadata can change on protected items
   without changing identity or rendering. Metadata consumed by rendering belongs
   to the protected definition. Supported writes diagnose stale or conflicting
   edits and avoid partially applied use/protection changes. Checks also diagnose
   edits made directly to protected source. These are authoring guarantees for
   trusted owner code, not filesystem access controls or a frozen renderer version.
8. **Collections and guidance.** Collections group references and can overlap and
   span projects without modifying membership targets. A brief selects relevant
   collection guidance while global search and inspection remain available.
   Membership and reading guidance do not apply a brand, change appearance, or
   trigger protection. Applicable guidance and its origin must be inspectable;
   precedence and conflict handling need an explicit, exercised implementation.
9. **Paged Markdown.** Documents have authored page boundaries and ordinary
   Markdown formatting. Saving refreshes the authored layout with normal text
   flow. Agent repairs can change imagery, page divisions, and explicit text-area
   bindings while retaining editable Markdown. Layout-only repair preserves copy;
   editorial adaptation follows the brief and retains an explanation of substantive
   changes. Protected copy is revised through a derivative.
10. **Shared rendering and delivery.** Preview and export consume the same saved
    content and composition. Portable static HTML is required in the first slice,
    carrying required styles, fonts, imagery, and resolved brand values. Complete
    slide and selected-part exports are required. PNG is the initial image handoff;
    native SVG and document PDF depend on exercised source capabilities and are
    never inferred solely from the enclosing artifact's format.
11. **Part rendering context.** Export resolves the selected configured use,
    including repeated uses and nested ownership, with effective inputs, variation,
    dimensions, inherited styles, resource readiness, and intentional fills.
    Bounds, padding, clipping, and background handling must be explicit. Unrelated
    neighbors are excluded. Source asset downloads remain a separate operation.
    Unsupported formats and failed parts produce actionable errors.
12. **Export records.** Each delivery records the source item, containing
    composition and selected use when applicable, source revision/state, brand
    variation, dimensions, format, and relevant rendering settings. Dirty source
    is recorded explicitly. Export produces a snapshot without changing the source
    lifecycle, and failures preserve source and unrelated exports.
13. **Validation policy.** Structural violations block affected supported
    operations. Visual and editorial findings are advisory by default, including
    detectable overflow. An applicable rule blocks export only when the owner
    explicitly makes it mandatory and it is mechanically checkable. Drafts remain
    inspectable with diagnostics even when a complete render is unavailable.
    Passing checks and lifecycle protection are distinct from visual approval.
14. **Engineering baseline.** Choose the stack against the example and export
    evidence, document its rationale, lock dependencies, and enable strict static
    checking and one formatting/linting setup. The first executable slice includes
    documented installation, development, test, type-check, lint, and build commands
    and CI running the applicable checks from a clean checkout.

## Testing Decisions

### Test boundary and prior art

Carry forward the engineering guide's public-contract and real-output boundaries.
The main test boundary is a neutral filesystem workspace exercised through the
supported studio operations used by agents and the gallery. Test observable
behavior, saved source, diagnostics, and delivered files rather than private
helpers, implementation formulas, or exact internal schemas.

The repository currently has an agent-setup checker and documentation checks;
there are no executable studio interfaces, application tests, or approved visual
baselines to reuse. The first implementation establishes the smallest integration
harness needed for this boundary. Narrow deterministic contract cases can use
the same public operations; rendering and export tests use the real browser,
filesystem, fonts, and assets. Mock external boundaries only when necessary.

The covered capabilities are discovery/inspection, identity and lifecycle,
content/brand validation, composition rendering, and export. Browser controls
receive a focused end-to-end smoke test through those same operations. Choose
assertions from the accepted behavior and independently reviewed examples. For
substantive behavior, establish a failing behavioral test before implementation.

### Acceptance scenarios

Each scenario needs recorded evidence before the slice is considered complete.
Automated checks establish mechanics; visual and agent authoring exercises supply
the evidence that those checks cannot establish.

| ID | Exercise | Required evidence |
| --- | --- | --- |
| A1 | Start from a clean checkout and open the neutral workspace. | Reproducible install; documented development and quality commands; CI executes applicable checks; the example is reachable in the studio. |
| A2 | Find the shared figure and its guidance without a supplied source path, including with the gallery stopped. | Compact lookup and inspection return identity, relevance, lifecycle, source, applicable guidance, and approved/reference status; nested parts are traversable. Record irrelevant reads or missing context during an actual agent authoring task. |
| A3 | Render the document, slide, shared figure, and repeated configured uses in both variations. | Inspection at declared destination dimensions confirms content, hierarchy, typography, page boundaries, and legibility; side-by-side previews are isolated and match separate renders. |
| A4 | Change a brand color and typography value, add a variation, and remove a required token value. | Original and derived live artifacts receive valid changes without source duplication; fixed imagery and old exports stay unchanged; missing values identify the token, variation, and affected item with a repair action. |
| A5 | Save a composition use, explicitly protect a standalone item, remove a use, and simulate a failed save. | The included definition and relevant dependencies become protected, the parent can remain draft, removal does not undo protection, and a failed save leaves no half-applied lifecycle change. |
| A6 | Change protected work through a derivative for one consumer and attempt indirect changes through nested content or assets. | The other consumer retains the original definition; owned Markdown, local configuration, assets, and transitive visual dependencies cannot silently mutate protected work; live brand updates still reach both. A protected consumer also requires derivation to change its reference. |
| A7 | Edit supported inputs in a draft parent, update discovery metadata on a protected item, and attempt to edit metadata used in rendering. | Local configuration changes preserve the referenced component definition; discovery edits preserve identity and renders; protected render metadata follows derivation rules. Direct protected-source violations receive useful diagnostics. |
| A8 | Move an item's source and promote one configured nested part. | Existing references still resolve; promotion retains configured content and origin under a new identity without rewriting the original; exporting the original local use requires no promotion. |
| A9 | Add and remove overlapping collection memberships across two project scopes, then search outside the brief's selected context. | Ownership, identity, lifecycle, brand, and appearance remain unchanged; global search and guidance inspection remain available; selected guidance is distinguishable from merely inspected guidance. Exercise the chosen guidance-conflict policy. |
| A10 | Edit headings, lists, preformatted text, and prose until the draft document no longer fits; repair only its layout. | Saving refreshes the authored pages; the agent repairs the layout without losing or condensing the edited copy; prose stays editable in Markdown; preview and export share that saved copy. Exercise protected-copy derivation separately. |
| A11 | Derive a narrow arrangement from the wide figure and make an editorial adaptation within a brief. | Originals and their consumers remain intact, unchanged definitions are reused, and origins are traceable. Layout-only adaptation preserves content; editorial changes retain required meaning and have durable explanations. Inspect both variations and relevant part exports. |
| A12 | Copy each HTML delivery outside the workspace, stop the studio, disable networking, and open the copied delivery locally. | Document and slide retain saved content, page structure, selected brand values, actual fonts, styles, and assets. Record browser and packaging tested; a hosted preview or fallback font is insufficient. |
| A13 | Export the full slide, the shared figure, both differently configured component uses, and a used asset. | Inspect full-slide and part PNGs at declared dimensions; selected parts retain effective inputs, fills, bounds, clipping, and typography without unrelated neighbors. Compare original asset download with export-as-used. Exercise native SVG where supported and authored PDF page geometry before claiming PDF support. |
| A14 | Import an exported part into the intended external presentation tool. | Record the actual destination and inspect scale, transparency, typography, and clipping. If that tool is unavailable, report the handoff as unverified; export success alone does not establish destination compatibility. |
| A15 | Break an asset/reference, request an unsupported format, trigger an advisory finding, and fail an explicit mandatory export rule. | Structural failures block affected operations with repair guidance; advisory findings allow export; the applicable mandatory failure blocks export. Broken drafts remain inspectable, incomplete previews are identified, and unrelated exports survive failures. |
| A16 | Attempt stale supported writes and inspect controls and export records. | Conflicting edits are reported without silent overwrite. Controls have keyboard access, visible focus, labels, loading and failure states at representative viewports. Exports identify their actual source state, including dirty source, and rendering settings without changing lifecycle. |
| A17 | Resume from saved brief and feedback, and extend owner material through the public contract. | Another session can locate the work, its reviewed source/variation, and next action. A minimal additional brand/project fixture is added without changing studio internals; no extra polished deliverable is required. |

Stabilize fonts, assets, dimensions, and time-dependent inputs before using image
comparisons, and inspect any baseline changes. Inspect the exported artifact as
well as the preview. Record performed checks and limitations; mechanical passing
results do not assert visual approval, efficient discovery, or external import
fidelity without the corresponding exercise.

## Out of Scope

- A general canvas editor, arbitrary dragging/resizing, or round-trip rewriting
  of layout source from visual edits.
- Universal automatic rearrangement, automatic document repagination or collision
  repair, and automatic editorial rewriting on save.
- Native editable PowerPoint or Google Slides delivery and presentation round-trip
  editing; these remain separate roadmap work.
- Interactive behavior inside delivered artifacts. The studio itself may have
  focused interactive controls; static deliveries can include links and scrolling.
- Hosted collaboration, multi-user synchronization, untrusted extensions, remote
  publishing, and external service integrations.
- Launching a coding agent from the studio, generalized plugin infrastructure,
  a universal policy engine, or a universal composition language.
- Separate package distribution, an upgrade/migration platform, sophisticated
  search ranking, and optimization without evidence from the first example.
- A full asset-generation/import pipeline, broad component/template catalog,
  polished onboarding, or a comprehensive suite of visual authoring skills.
- Automatic adaptation across unrelated brands, automatic asset recoloring,
  guaranteed native SVG for arbitrary HTML, or historical pixel identity across
  renderer/toolchain changes.
- Batch exports, combined slide-and-parts bundles, slide speaker notes, and a
  browser prose editor as required first-slice features. Individual export and
  companion Markdown editing remain required.

## Further Notes

### Starting proposals to validate

These are bounded engineering starting points. Resolve them in the implementation
proposal and early rendering/lifecycle work, recording evidence and updating this
spec when scope changes. Routine reversible conventions do not need a new product
interview; a conflict with accepted behavior or a consequential product tradeoff
does need to be surfaced.

- **Neutral brief:** use an explicitly fictional data-flow explainer, with a
  shared figure reused in the two-page document and slide. Use a wide arrangement
  and a derived narrow arrangement to exercise adaptation. Keep copy, marks,
  imagery, fonts, and source claims suitable for a public example.
- **Dimensions:** begin with a 1600 by 900 slide and two US Letter document pages.
  These are proposed test destinations, not accepted product defaults. Record
  actual dimensions in the brief and exports before rendering comparisons.
- **Brand:** begin with light and dark variations, described semantic roles, an
  owner-defined role, and portable local fonts/assets. Use minimal secondary scope
  fixtures for collection and extension checks rather than another polished demo.
- **Application:** a local browser studio backed by filesystem source, with shared
  operations for agent and UI use. Evaluate code-authored SVG figures and HTML
  page/slide compositions first. Runtime, framework, bundler, package manager,
  Markdown parser, and browser/export tooling remain unselected.
- **Content bindings:** choose explicit page markers and stable page/text-area
  bindings that survive ordinary prose edits and layout repair. Exercise headings,
  lists, preformatted text, captions, and figure references. Specify the minimum
  slide/figure content binding separately rather than assuming document pagination
  answers it.
- **Preservation:** compare the smallest viable dependency-preservation mechanism
  against A5-A7 early. Preserve authored definitions and owned resources while
  treating brand values as live. A source hash by itself is not evidence that
  existing consumers can still resolve the preserved definition.
- **Delivery:** test single-file versus bundled static HTML against A12. Establish
  per-source PNG/SVG support and evaluate document PDF against authored page
  geometry. Record PDF capability and any limitation explicitly before promising
  it; portable HTML and independent image handoff remain first-slice requirements.
- **Rules and operations:** choose minimal identity encoding, record shapes,
  discovery vocabulary, guidance precedence, mandatory-rule declaration, and stale
  write handling. Exercise useful diagnostics through public operations. Limit
  browser editing controls to those supported by that write contract.

### Working order

1. Specify the small composition/parts interface and Markdown bindings needed by
   the example, together with agent discovery and validation. Select a candidate
   stack through targeted primary-source research where facts are unresolved.
2. Prove rendering/export and dependency preservation early with the neutral
   figure, repeated configured uses, and two variations. Inspect actual portable
   output, useful discovery/diagnostics, and preserved consumers. Establish the
   executable toolchain and CI with the first executable slice.
3. Complete the shared document and slide, authored Markdown repair, derivation,
   promotion, collection/guidance behavior, and the focused studio controls.
4. Run the full acceptance exercises, retain feedback and evidence, and document
   the demonstrated authoring loop. Extract reusable authoring guidance from this
   experience before expanding the skill or component library.

This order is guidance for a later ticket breakdown. This spec creates no
implementation tickets and makes no claim that the technical choices have passed
their probes. Resolve a failing capability explicitly rather than silently
weakening its acceptance scenario.

### Decision sources

Use the [project vocabulary](../../CONTEXT.md),
[charter](../../Project-Charter.md), [architecture](../../docs/architecture.md),
[build-readiness and evidence agenda](../../docs/architecture-questions.md), and
[engineering guide](../../docs/engineering.md) to interpret this spec. The
[authoring model](../../docs/authoring-model.md) includes proposals; its open
mechanisms are not additional accepted decisions.

The accepted constraints are recorded in
[brand injection](../../docs/adr/0001-injected-brand-variations.md),
[protection and derivation](../../docs/adr/0002-protected-items-and-derivatives.md),
[composition and part delivery](../../docs/adr/0003-compositions-and-part-exports.md),
[local part ownership](../../docs/adr/0004-composition-owned-parts.md),
[agent-led adaptation](../../docs/adr/0005-agent-led-composition-adaptation.md),
[code-authored layouts](../../docs/adr/0006-code-authored-compositions.md),
[paged Markdown](../../docs/adr/0007-paged-markdown-documents.md),
[authoring support](../../docs/adr/0008-agent-authoring-support.md), and
[overlapping collections](../../docs/adr/0009-overlapping-collections.md).
