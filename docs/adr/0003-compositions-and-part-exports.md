# Deliver complete compositions and their visual parts

Status: accepted, September 24, 2026, from the owner's slide-delivery requirement.

A slide must be available as a complete rendered piece and must expose its used
figures, assets, and visual subcomponents for separate export, including nested
parts. The owner may use the slide as a finished deliverable or as an ideation
reference, then carry the independently exported parts into another tool such as
Google Slides. Native editable presentation export is deferred to the
[roadmap](../roadmap.md).

The composition interface must retain identifiable visual parts and enough of
their effective content, brand variation, and rendering inputs to export their
configured uses. A generic component example or an original asset alone cannot
represent every configured use in a slide. Source identity and configured use
must be distinguishable, including repeated uses with different inputs.

This requires authoring and rendering support for independently addressable visual
parts, in exchange for preserving the value of work even when the final assembly
moves to another tool. Export capabilities remain specific to each part; SVG is
available where supported by its source. Exact discovery, isolation, export
controls, and batch packaging remain implementation choices. Exporting an existing
use produces a snapshot and does not itself create a derivative of the source.
