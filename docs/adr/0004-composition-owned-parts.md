# Keep configured parts within their owning composition

Status: accepted, September 24, 2026. The owner agreed to hierarchical organization
with local configured parts and explicit promotion to independent items.

Reusable component definitions and named figures have independent catalog
identities. Configured uses of their parts live under the owning composition by
default, with local identifiers and textual metadata. Agents and the studio can
traverse, inspect, and export those parts independently. A local part can be
promoted to a standalone item with its origin retained. This keeps the main
catalog focused while preserving access to the details of composed work.

A component owns reusable behavior and supported inputs; a named figure owns its
particular content and arrangement; a placement owns position and displayed size
inside its containing composition. Local configuration belongs to that composition's
definition and follows its lifecycle. Referenced reusable definitions are protected
on use, while supplying supported inputs does not mutate those definitions.
A protected figure's local parts remain protected even when the slide using that
figure is still a draft. Promotion preserves the original composition.

Ownership supplies hierarchy; references connect reusable items across that
hierarchy. Local identifiers must be qualified by their owner. Folder labels or
file moves must not become the sole basis of identity. Exact filesystem layout,
reference encoding, and promotion mechanics remain implementation decisions.
