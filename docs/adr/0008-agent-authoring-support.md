# Support agent authoring with navigable guidance and studio checks

Status: accepted direction, September 24, 2026, from the owner's requirement for
efficient agent navigation and clear rules partly enforced by the studio.

The studio must help an agent find and follow the owner's existing visual system.
Efficient discovery, clear authoring guidance, and checks of objective contracts
are core capabilities from the first working slice. They reduce avoidable drift,
unnecessary reinvention, and repeated reconstruction of context during authoring.

Workspace material remains authoritative: brands and semantic token descriptions,
project and collection context, briefs, reusable parts, approved examples, source
provenance, and retained feedback. Agents need compact discovery information and
access to selected details, parts, and dependencies without reading the entire
workspace. Generated indexes do not become a second editable source of truth.

The owner selected category, stable identifier, tags, and semantic context about
how an item has been used as core discovery information. Context must help an
agent understand relevance beyond keyword matching. Actual recorded uses and
intended uses remain distinguishable; a new item need not have a usage history.
Category vocabulary, tag conventions, record format, and how usage evidence is
linked remain open implementation choices.

The studio reinforces mechanically checkable contracts through supported
interfaces usable by agents and focused controls. Relevant contracts include
identity and references, required brand values, resource availability, lifecycle
protection, and export capabilities. Findings must identify the affected work and
provide a useful repair path. The owner accepted this enforcement policy:

- Structural violations, such as broken references, missing required resources or
  tokens, and changes to protected definitions, block the affected supported
  operation and explain the required repair.
- Visual and editorial guidance is advisory by default. Detectable overflow or
  crowding can be reported without automatically blocking export.
- Owners can explicitly designate a mechanically checkable rule as mandatory for
  export. A failed applicable mandatory rule blocks that export; an advisory
  preference does not become mandatory merely because an agent can describe it.

Drafts remain inspectable for diagnosis and repair. When rendering cannot finish,
the studio must expose the failure rather than promise a complete preview.
Exact rule declarations, supported checks, scope and precedence, diagnostic
formats, and operation-specific enforcement mechanisms remain to be designed.

Visual and editorial rules also need clear owner guidance and approved examples.
Agents and owners inspect actual previews and exports for composition, legibility,
and fidelity to the brief. Passing checks does not confer visual approval or
prove that arbitrary authored code follows every rule. Trusted source can be
edited directly; studio validation is an authoring aid, not an access-control
boundary around the owner's files.

This commits the first slice to testing the quality and efficiency of the agent's
authoring path alongside the delivered visual. The tradeoff is early investment
in discovery and validation interfaces, with detailed mechanisms driven by the
shared-figure document and slide example. It does not select a framework, agent
runtime, or universal policy engine.
