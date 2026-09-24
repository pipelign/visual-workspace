# Protect established items and derive changes

Status: accepted, September 24, 2026, from the owner's explicit requirement and
clarification of the composition-use transition.

Draft visual items allow direct revision. The owner can explicitly take an item
out of draft; including it in another composition also automatically protects it,
while the containing composition can remain a draft. Once protected, changes
create a separately identified derivative by cloning or extending the original.
Existing consumers retain their references until explicitly changed. This keeps
identified work reliable for reuse, including standalone work with no consumers.

Protection preserves the authored definition, including its content and the visual
definitions it depends on; mutable children must not provide an indirect way to
change established work. Injected brand token values remain live under
[ADR 0001](0001-injected-brand-variations.md). Protection neither implies visual
approval nor freezes the studio toolchain, and delivered exports remain snapshots.

The tradeoff is additional identities and deliberate consumer updates when work
changes, rather than propagating content or layout edits through existing uses.
Derivation can reuse a protected base through composition or supported inputs.
Storage, dependency capture, and enforcement mechanisms remain open
implementation decisions.

Discovery-only metadata remains directly editable after protection: category,
tags, descriptions, and usage notes can improve without a derivative, while the
stable identity remains unchanged. Metadata used directly in rendering is part
of the protected authored definition. This allows the catalog to accumulate useful
context without changing established visuals or their consumers; changes to owned
copy, assets, layout, and component behavior still require a derivative.

[ADR 0004](0004-composition-owned-parts.md) clarifies ownership granularity:
referenced reusable definitions are protected on use, while local configuration
and placements belong to the containing composition and follow its lifecycle.
Discovery or export of a local part does not make it a standalone item.
