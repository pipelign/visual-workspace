# Roadmap

This records explicitly deferred product capabilities. It does not set delivery
dates or imply that the current studio has been implemented.

## Native editable presentation export

Status: deferred by the owner, September 24, 2026.

Eventually allow a deck or slide authored in the workspace to be delivered with
native editable elements in a presentation tool, such as PowerPoint or Google
Slides. Supported targets, fidelity, element coverage, and integration approach
remain to be investigated. Round-trip editing is a separate scope decision.

The current requirement is a complete rendered slide plus directly exportable
figures, assets, and visual subcomponents, so the owner can assemble a presentation
in another tool. See [ADR 0003](adr/0003-compositions-and-part-exports.md).

Preserve source structure, text, identity, configured uses, and component
relationships while implementing that current requirement. These are useful inputs
for future native export; they do not guarantee a lossless conversion of arbitrary
compositions or require choosing a presentation-specific source model now.

Revisit after the rendered-slide and separate-part workflow has been exercised
with real presentations. Evaluate a bounded example containing text, a reusable
figure, and a raster asset, and make unsupported native elements explicit.
