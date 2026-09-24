# Use agent-led adaptations for different destinations

Status: accepted direction, September 24, 2026, from the owner's preference for
agents to adapt compositions from their constituent parts.

Treat a composition as identifiable visual parts with content, meaningful
relationships, and an authored arrangement. An agent can reuse those parts to
create arrangements suited to different destinations. Preserve enough structure
and context to understand what the parts communicate and how they relate; a list
of drawing coordinates alone does not express that intent.

Adapting a protected composition's authored layout creates a derivative under
[ADR 0002](0002-protected-items-and-derivatives.md). Unchanged referenced definitions
can be reused, and local parts keep traceable origins. Existing consumers retain
the original. Selecting a brand variation remains a rendering choice under
[ADR 0001](0001-injected-brand-variations.md); it does not create an adaptation.
Ordinary scaling and any explicitly supported layout inputs also remain uses of
the existing definition rather than source changes.

This puts responsibility for destination-specific design in the authoring loop.
The studio must render, inspect, and export the result and its parts; it need not
invent suitable rearrangements for arbitrary figures in the initial slice. Normal
text flow and intentionally authored responsive behavior remain compatible with
this direction. A universal node language or a particular layout engine is not
selected by this decision.

The owner also accepted editorial adaptation within the brief: the agent may
shorten labels, condense copy, and omit secondary detail to suit the destination
or audience. Preserve factual meaning and required points, including qualifications
or relationships needed to keep a claim accurate. Report substantive omissions
and editorial changes with the resulting draft and retain that explanation with
the derivative. An explicit layout-only request preserves the content. Routine
editorial choices within this scope do not require a separate approval step.

The composition interface, representation of relationships, default canvas sizing,
and validation of layout quality remain to be worked through.
