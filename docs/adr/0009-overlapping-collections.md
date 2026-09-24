# Allow overlapping collections across projects

Status: accepted, September 24, 2026, from the owner's agreement to reference-based
collections that can overlap and span projects.

A collection groups references to related items. The same item can belong to
multiple collections, and one collection can include items from different
projects. Each item retains one owning scope and stable identity. Membership
neither copies nor moves the item and does not modify its authored definition.
This separates useful discovery groupings from source ownership.

For example, one figure can appear in Customer onboarding, Architecture explainers,
and a presentation's figure collection while remaining a single identified item.
A collection can exist without a deck, and standalone work need not join one.
Adding or removing membership does not protect an item, return it to draft, or
create a derivative. Actual composition use follows
[ADR 0002](0002-protected-items-and-derivatives.md); local-part ownership continues
to follow [ADR 0004](0004-composition-owned-parts.md).

Collections may supply context and intended visual direction. The current brief
selects relevant collection guidance for creating or adapting work. All collections
and their items, guidance, and usage history remain accessible to the agent and
owner across the workspace. Selection prioritizes the current context; global
search, inspection, and reference traversal remain available. Efficient discovery
loads relevant detail as needed without hiding other material or requiring all
of it to be read for every task.

Membership alone does not change a member's rendered appearance or selected
brand, and reading another collection does not automatically apply its rules to
the current work. Conflict resolution among applicable guidance remains open,
along with collection storage, reference encoding, and indexing. Cross-project
grouping does not imply automatic adaptation between unrelated brands.

The tradeoff is explicit membership and guidance resolution rather than a single
mandatory containment tree, in exchange for flexible navigation without duplicated
artifacts or ambiguous source ownership.
