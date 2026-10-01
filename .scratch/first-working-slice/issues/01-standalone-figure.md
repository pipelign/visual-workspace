# 01: Find, preview, and export a standalone draft figure

**What to build:** Start a local studio, find one neutral draft figure, compare
its two brand variations, and deliver portable static HTML from the same saved
source. This establishes an executable public authoring example before reuse.

Status: in-progress
Blocked by: None — foundation implemented and independently reviewed.
Starting commit: `890d52a229cf6de069087e619b12f18aba3806db`
Branch: `feature/standalone-figure-studio`

Scope accepted through the owner’s request to start ticket 01. Remote platform
verification remains a CI responsibility.

Spec: [first working slice](../spec.md).

**Spec coverage:** Stories 1, 2, 12, 20, 21, 23-25, 41, 44, 46, 48, 50-51;
acceptance A1-A4, A12, A15-A16 for the standalone case.

- [x] Reuse the evaluated Node/npm toolchain, locked dependencies, static checks,
  and clean-checkout CI from the development foundation. Update setup and commands
  for the actual studio; change the evaluated stack only for a demonstrated need.
- [x] Make `npm run dev` open the studio. Adapt useful lab compositions into the
  neutral example workspace through public contracts. Move preview, variation,
  accessibility, resource-failure, and portable-HTML checks onto studio behavior;
  retire the replaced lab paths and assign any remaining probe to its ticket.
- [x] Save a neutral brief with audience, purpose, message, destinations,
  dimensions, and source provenance. Author one standalone draft with stable
  identity, descriptive discovery metadata, declared dimensions, capabilities,
  and a documented render contract. It has no independently identified reused
  visual definitions yet; its resources are owned by the draft.
- [x] Provide minimal supported lookup and inspection usable without a running
  gallery. The studio uses that contract to list, inspect, and preview the figure
  with clear loading/failure states and keyboard-accessible controls.
- [x] Inject described semantic color and typography roles, including an
  owner-defined role, into two variations. Compare isolated side-by-side renders,
  change values, and add a variation without copying artifact source. Fixed
  imagery keeps its appearance.
- [x] Export static HTML with required styles, actual local fonts, and assets.
  Decide single-file versus bundled packaging using a copied delivery opened
  locally outside the workspace with the studio stopped and networking disabled.
  Inspect both variations at the declared dimensions.
- [x] Record actual source state, including dirty source, variation, dimensions,
  format, and render settings with delivery. Later source/brand changes leave
  prior exports fixed. Expose supported formats and reject unsupported requests.
- [x] Missing tokens/resources and invalid identity produce actionable diagnostics
  through the public contract. A broken draft remains inspectable, and an
  incomplete render is clearly identified.
- [x] Add failing-then-passing behavioral coverage through public operations,
  a real render/export integration check, and a minimal browser smoke test.
  Record visual inspection and the browser/packaging actually exercised.


## Implementation record

Standalone behavior is implemented and independently reviewed. See the
[evidence](../ticket-01-evidence.md) and [two-axis review](../ticket-01-review.md).
Execution status remains in-progress until PR/CI and integration into main.
The next product ticket remains blocked until that completion.
